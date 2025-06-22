import { Transform } from 'class-transformer';
import {
  IsString,
  IsDateString,
  IsInt,
  Min,
  IsNumber,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  cabinId: string;

  @IsDateString()
  checkInDate: string;

  @IsString()
  checkInTime: string;

  @IsDateString()
  checkOutDate: string;

  @IsString()
  checkOutTime: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  nights: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  total: number;

  @IsString()
  @IsNotEmpty({ message: 'First Name should not be empty' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last Name should not be empty' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  phoneNumber: string;

  @IsString()
  requests: string;
}
