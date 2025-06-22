import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class updatedStatusDto {
  @IsEnum(Status)
  status: Status;

  @IsString()
  @IsOptional()
  isCancelledReason: string;
}
