import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { LocationsController } from './locations.controller';

@Module({ imports: [TypeOrmModule.forFeature([Location])], controllers: [LocationsController] })
export class LocationsModule {}
