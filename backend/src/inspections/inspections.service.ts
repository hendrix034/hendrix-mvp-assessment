import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuthenticatedUser } from '../auth/current-user.decorator';
import { Location } from '../locations/location.entity';
import { User, UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Inspection, InspectionStatus } from './inspection.entity';

// Allow a little clock drift between the Inspector's device and the server.
const FUTURE_START_TOLERANCE_MS = 5 * 60 * 1000;

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection) private inspections: Repository<Inspection>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Location) private locations: Repository<Location>,
  ) {}

  /** Managers see every inspection; Inspectors only see inspections assigned to them. */
  async findAll(user: AuthenticatedUser) {
    const rows = await this.inspections.find({
      where: this.visibleTo(user),
      relations: { createdBy: true, assignedInspector: true, location: true },
      order: { id: 'DESC' },
    });
    return rows.map(toResponse);
  }

  async findOne(id: number, user: AuthenticatedUser) {
    return toResponse(await this.getVisibleOrThrow(id, user));
  }

  async create(dto: CreateInspectionDto, manager: AuthenticatedUser) {
    const saved = await this.inspections.save(
      this.inspections.create({
        title: dto.title,
        status: InspectionStatus.YetToStart,
        createdBy: { id: manager.id },
        assignedInspector: null,
      }),
    );
    return this.findOne(saved.id, manager);
  }

  /** Assign (or reassign) a Yet to Start inspection to exactly one Inspector. */
  async assign(id: number, dto: AssignInspectionDto, manager: AuthenticatedUser) {
    const inspection = await this.getVisibleOrThrow(id, manager);
    if (inspection.status !== InspectionStatus.YetToStart) {
      throw new ConflictException('Only Yet to Start inspections can be assigned');
    }

    const inspector = await this.users.findOneBy({ id: dto.inspectorId, role: UserRole.Inspector });
    if (!inspector) {
      throw new BadRequestException('Inspector not found');
    }

    // Conditional update so a concurrent completion cannot be overwritten.
    const result = await this.inspections
      .createQueryBuilder()
      .update(Inspection)
      .set({ assignedInspector: { id: inspector.id } })
      .where('id = :id AND status = :status', { id, status: InspectionStatus.YetToStart })
      .execute();
    if (!result.affected) {
      throw new ConflictException('Only Yet to Start inspections can be assigned');
    }

    return this.findOne(id, manager);
  }

  /** The assigned Inspector records the completion data. */
  async complete(id: number, dto: CompleteInspectionDto, inspector: AuthenticatedUser) {
    const startedAt = new Date(dto.startedAt);
    if (startedAt.getTime() > Date.now() + FUTURE_START_TOLERANCE_MS) {
      throw new BadRequestException('startedAt cannot be in the future');
    }

    const location = await this.locations.findOneBy({ id: dto.locationId });
    if (!location) {
      throw new BadRequestException('Location not found');
    }

    // One atomic statement: only succeeds if the inspection is still Yet to Start
    // AND assigned to this Inspector. Prevents double completion and ownership races.
    const result = await this.inspections
      .createQueryBuilder()
      .update(Inspection)
      .set({
        status: InspectionStatus.Completed,
        location: { id: location.id },
        startedAt,
        durationMinutes: dto.durationMinutes,
        result: dto.result,
        comments: dto.comments,
        completedAt: new Date(),
      })
      .where('id = :id AND status = :status AND assignedInspectorId = :inspectorId', {
        id,
        status: InspectionStatus.YetToStart,
        inspectorId: inspector.id,
      })
      .execute();

    if (!result.affected) {
      // Throws 404 if it does not exist or belongs to another Inspector.
      const existing = await this.getVisibleOrThrow(id, inspector);
      if (existing.status === InspectionStatus.Completed) {
        throw new ConflictException('Inspection is already completed');
      }
      throw new ConflictException('Inspection cannot be completed');
    }

    return this.findOne(id, inspector);
  }

  /**
   * Loads an inspection the user is allowed to see.
   * Returns 404 (not 403) for other Inspectors' inspections so IDs cannot be probed.
   */
  private async getVisibleOrThrow(id: number, user: AuthenticatedUser) {
    const inspection = await this.inspections.findOne({
      where: { id, ...this.visibleTo(user) },
      relations: { createdBy: true, assignedInspector: true, location: true },
    });
    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }
    return inspection;
  }

  private visibleTo(user: AuthenticatedUser): FindOptionsWhere<Inspection> {
    if (user.role === UserRole.Manager) return {};
    if (user.role === UserRole.Inspector) return { assignedInspector: { id: user.id } };
    // Unknown role: match nothing (deny by default).
    return { id: -1 };
  }
}

/** Explicit response shape: never return User entities (they contain passwordHash). */
function toResponse(i: Inspection) {
  return {
    id: i.id,
    title: i.title,
    status: i.status,
    createdBy: i.createdBy ? { id: i.createdBy.id, name: i.createdBy.name } : null,
    assignedInspector: i.assignedInspector ? { id: i.assignedInspector.id, name: i.assignedInspector.name } : null,
    location: i.location ? { id: i.location.id, name: i.location.name } : null,
    startedAt: i.startedAt,
    durationMinutes: i.durationMinutes,
    result: i.result,
    comments: i.comments,
    completedAt: i.completedAt,
    createdAt: i.createdAt,
  };
}
