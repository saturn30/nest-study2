import * as uuid from 'uuid';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService,
    private authService: AuthService,
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
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login({ email, password }: UserLoginDto) {
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) throw new NotFoundException('유저가 존재하지 않습니다');
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');
    return { id: user.id, name: user.name, email: user.email };
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
