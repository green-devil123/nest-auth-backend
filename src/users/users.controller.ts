// users/users.controller.ts
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';


// DTOs for signup and signin
class CreateUserDto {
    email: string;
    name: string;
    password: string;
}
  
class SignInDto {
    email: string;
    password: string;
}
  

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const { email, name, password } = createUserDto;
      await this.usersService.createUser(email, name, password);
      return res.status(HttpStatus.CREATED).json({ status:200, message: 'User created successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to signup' });
    }
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res) {
    try {
      const { email, password } = signInDto;
      const user = await this.usersService.validateUser(email, password);
      if (!user) throw new Error('User not found or invalid credentials.');
      return res.status(HttpStatus.OK).json({ status:200,message: 'Login successful', data: {email: user.email ,name:user.name } });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }
}

