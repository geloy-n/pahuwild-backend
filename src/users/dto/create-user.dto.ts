import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  Validate,
} from 'class-validator';
import { Match } from './password-matcher';

export class SignUpDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsString()
  @MinLength(8, { message: 'Confirm password must be at least 8 characters' })
  @Match('password', { message: "Passwords don't match" })
  confirmPassword: string;
}
