import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;
}
  
export class SignInDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class UserEncryptData {
    @IsNotEmpty()
    data: string;
}