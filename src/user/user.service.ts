import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/user.interface';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<UserDocument>,
  ) {}

  _getUserDetails(user: UserDocument): UserInterface {
    return {
      id: user._id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<UserInterface | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) return null;

    return this._getUserDetails(user);
  }

  async createUser(
    user_name: string,
    email: string,
    hashedPassword: string,
    role: string,
    created_at: string,
  ): Promise<UserDocument> {
    //This returns the password for a reason, do not delete
    //The user that will be found later by validation will need said password
    //This gets back the user document which does have the password on it
    const newUser = new this.userModel({
      user_name,
      email,
      password: hashedPassword,
      role,
      created_at,
    });
    return newUser.save();
  }
}
