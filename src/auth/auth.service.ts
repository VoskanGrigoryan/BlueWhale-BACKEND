import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/dto/new-user.dto';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async registerUser(user: Readonly<NewUserDTO>): Promise<UserInterface | any> {
    const { user_name, email, password, role, created_at } = user;

    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) return 'Email taken';

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.createUser(
      user_name,
      email,
      hashedPassword,
      role,
      created_at,
    );
    return this.userService._getUserDetails(newUser);
  }

  async passwordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  //Method for validating user
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserInterface | null> {
    const user = await this.userService.findUserByEmail(email);
    //User returns object that includes password as well, it's intended to work like that
    const userExists = !!user;
    if (!userExists) return null;

    const passwordMatch = await this.passwordMatch(password, user.password);

    if (!passwordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async loginUser(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  // async getTokens(userId: string, email: string) {
  //   const [at, rt] = await Promise.all([
  //     this.jwtService.signAsync({
  //       userId: userId,
  //       email,
  //     }),
  //   ]);
  // }
}
