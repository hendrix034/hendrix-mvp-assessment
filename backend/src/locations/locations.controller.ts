import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Location } from './location.entity';

@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(@InjectRepository(Location) private locations: Repository<Location>) {}
  @Get() list() { return this.locations.find({ order: { name: 'ASC' } }); }
}
