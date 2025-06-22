import { Transform } from 'class-transformer';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  bookingId: string;

  @IsString()
  cabinId: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  rating: number;

  @IsString()
  comment: string;
}
