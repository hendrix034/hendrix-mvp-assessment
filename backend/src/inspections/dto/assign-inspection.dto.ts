import { IsInt, IsPositive } from 'class-validator';

export class AssignInspectionDto {
  @IsInt()
  @IsPositive()
  inspectorId: number;
}
