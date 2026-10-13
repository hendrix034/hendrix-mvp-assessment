import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.entity';
import { AssignInspectionDto } from './dto/assign-inspection.dto';
import { CompleteInspectionDto } from './dto/complete-inspection.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { InspectionsService } from './inspections.service';

@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Manager, UserRole.Inspector)
export class InspectionsController {
  constructor(private inspections: InspectionsService) {}

  // Manager: all inspections. Inspector: only their own (filtered in the service).
  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.inspections.findAll(user);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.inspections.findOne(id, user);
  }

  @Post()
  @Roles(UserRole.Manager)
  create(@Body() dto: CreateInspectionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.inspections.create(dto, user);
  }

  @Patch(':id/assign')
  @Roles(UserRole.Manager)
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignInspectionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.inspections.assign(id, dto, user);
  }

  @Patch(':id/complete')
  @Roles(UserRole.Inspector)
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteInspectionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.inspections.complete(id, dto, user);
  }
}
