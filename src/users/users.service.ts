import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
    
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto:CreateUserDto ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto?.password, 10);
      const {email, name, password } = createUserDto;
      const newUser = new this.userModel({ email, name, password: hashedPassword });
      return await newUser.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.findOneByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      return undefined;
    } catch (error) {
      throw new Error(`Failed to validate user: ${error.message}`);
    }
  }
}
