// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, name: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, name, password: hashedPassword });
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return undefined;
  }
}
