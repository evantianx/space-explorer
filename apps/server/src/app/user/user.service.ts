import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { UserModel } from '../../../../../libs/types/src';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService
  ) {}

  createToken({ id, email }: UserEntity) {
    const payload: UserModel = { id, email };
    const secret = this.configService.get('jwtSecret');
    return jwt.sign(payload, secret);
  }

  createUser(email: string) {
    return this.userRepo.create({ email }).save();
  }

  getUserByEmail(email: string) {
    return this.userRepo.findOne({ email });
  }
}
