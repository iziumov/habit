import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Cant be empty' })
  @IsEmail({}, { message: 'Must be email' })
  email: string;

  @IsNotEmpty({ message: 'Cant be empty' })
  password: string;
}
