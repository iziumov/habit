import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Cant be empty' })
  @MinLength(4, { message: 'Min length must be 4' })
  @MaxLength(20, { message: 'Max length must be 20' })
  username: string;

  @IsNotEmpty({ message: 'Cant be empty' })
  @IsEmail({}, { message: 'Must be email' })
  email: string;

  @IsNotEmpty({ message: 'Cant be empty' })
  @IsStrongPassword(
    {
      minLength: 4,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    { message: 'Password too weak' },
  )
  password: string;
}
