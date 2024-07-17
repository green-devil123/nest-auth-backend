import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SignInDto, UserEncryptData } from './user.dto';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class UsersController {
  private readonly secretKey: string;
  
  constructor(private readonly usersService: UsersService, private readonly configService: ConfigService) {
    this.secretKey = configService.get<string>('SECRET_KEY');
  }

   // You should store this securely

  decryptData(encryptedData: string): CreateUserDto {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  @Post('signup')
  async signUp(@Body() body:UserEncryptData, @Res() res) {
    try {
      if (!body.data) {
        throw new BadRequestException('Invalid payload');
      }
      const decryptedPayload = this.decryptData(body.data);
      const createUserDto = new CreateUserDto();
      createUserDto.email = decryptedPayload.email;
      createUserDto.name = decryptedPayload.name;
      createUserDto.password = decryptedPayload.password;
      await this.usersService.createUser(createUserDto);
      return res.status(HttpStatus.CREATED).json({ status: 200, message: 'User created successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Failed to signup', error: error.message });
    }
  }

  @Post('signin')
  async signIn(@Body() body: any, @Res() res) {
    try {
      if (!body.data) {
        throw new BadRequestException('Invalid payload');
      }
      const decryptedPayload = this.decryptData(body.data);
      const signInUserDto = new SignInDto();
      signInUserDto.email = decryptedPayload.email;
      signInUserDto.password = decryptedPayload.password;
      const { email, password } = signInUserDto;
      const user = await this.usersService.validateUser(email, password);
      if (!user) throw new Error('User not found or invalid credentials.');
      return res.status(HttpStatus.OK).json({ status: 200, message: 'Login successful', data: { email: user.email, name: user.name } });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials', error: error.message });
    }
  }
}
