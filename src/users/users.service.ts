import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService,
  ) {}

  async createUser(params: CreateUserParams) {
    const { name, email, password } = params;
    if (await this.checkUserExists(email)) {
      throw new UnprocessableEntityException('이미 가입된 이메일입니다.');
    }

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

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return Boolean(user);
  }

  private async saveUser(params: SaveUserParams) {
    this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = uuid.v1();
      user.name = params.name;
      user.email = params.email;
      user.password = params.password;
      user.signupVerifyToken = params.signupVerifyToken;
      await manager.save(user);
    });
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
