import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(params: CreateUserParams) {
    const { name, email, password } = params;
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser({ name, email, password, signupVerifyToken });
    await this.sendMemberJoinEmail({ email, signupVerifyToken });

    return;
  }

  async verifyEmail(signupVerifyToken: string) {
    throw new Error('method not implemented');
  }

  async login({ email, password }: UserLoginDto) {
    throw new Error('method not implemented');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('Method not implemented');
  }

  private checkUserExists(email: string) {
    return false;
  }

  private saveUser(params: SaveUserParams) {
    return;
  }

  private async sendMemberJoinEmail({
    email,
    signupVerifyToken,
  }: SendMemberJoinEmailParams) {
    this.emailService.sendMemberJoinVerification({
      emailAddress: email,
      signupVerifyToken,
    });
  }
}

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

interface SaveUserParams {
  name: string;
  email: string;
  password: string;
  signupVerifyToken: string;
}

interface SendMemberJoinEmailParams {
  email: string;
  signupVerifyToken: string;
}
