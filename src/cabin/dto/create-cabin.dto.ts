import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsNumber,
  IsInt,
  Min,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateCabinDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  guests: number;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  price: number;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAvailable: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  wifi: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  parking: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  kitchen: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hotTub: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  fireplace: boolean;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hiking: boolean;
}
