import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';

export enum InspectionStatus {
  YetToStart = 'Yet to Start',
  Completed = 'Completed',
}

export enum InspectionResult {
  Pass = 'Pass',
  Fail = 'Fail',
}

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  // Short description so a Manager can tell inspections apart before they are completed.
  @Column({ length: 200 })
  title: string;

  @Column({ type: 'enum', enum: InspectionStatus, default: InspectionStatus.YetToStart })
  status: InspectionStatus;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  createdBy: User;

  // At most one Inspector at a time (ISSUE-37 note).
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  assignedInspector: User | null;

  // ---- Completion data, recorded by the assigned Inspector ----

  @ManyToOne(() => Location, { nullable: true, onDelete: 'RESTRICT' })
  location: Location | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date | null;

  // Assumption: duration is stored in whole minutes.
  @Column({ type: 'int', nullable: true })
  durationMinutes: number | null;

  @Column({ type: 'enum', enum: InspectionResult, nullable: true })
  result: InspectionResult | null;

  @Column({ type: 'text', nullable: true })
  comments: string | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
