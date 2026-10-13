import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, IsNotEmpty, IsPositive, IsString, Max, MaxLength, Min } from 'class-validator';
import { InspectionResult } from '../inspection.entity';

export class CompleteInspectionDto {
  @IsInt()
  @IsPositive()
  locationId: number;

  // ISO 8601 date-time, e.g. "2026-10-14T09:30:00+08:00". Must include a time zone or "Z".
  @IsISO8601({ strict: true })
  startedAt: string;

  // Whole minutes, between 1 minute and 24 hours.
  @IsInt()
  @Min(1)
  @Max(1440)
  durationMinutes: number;

  @IsEnum(InspectionResult)
  result: InspectionResult;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  comments: string;
}
