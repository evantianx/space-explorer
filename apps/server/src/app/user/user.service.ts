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

  private createTripUpdateError(message: string, launches: number[]) {
    return { success: false, message, launches };
  }

  async addTrips(ids: number[], email: string) {
    try {
      const user = await this.getUserByEmail(email);
      const totalTrips = user.trips ? user.trips.concat(ids) : ids;
      user.trips = Array.from(new Set(totalTrips));

      await user.save();

      return {
        success: true,
        message: `Successfully added trips with ids: ${ids.join(',')}`,
        launches: ids,
      };
    } catch (err) {
      return this.createTripUpdateError(`Error: ${err}`, ids);
    }
  }

  async hasTrip(id: number, email: string) {
    const user = await this.getUserByEmail(email);
    return user.trips.includes(id);
  }

  async removeTrips(id: number, email: string) {
    try {
      const user = await this.getUserByEmail(email);
      console.log(user.trips, id);
      if (!user.trips.includes(id)) {
        return this.createTripUpdateError(
          'Cannot cancel trip that not booked',
          [id]
        );
      }
      user.trips = user.trips.filter((t) => t !== id);
      await user.save();

      return {
        success: true,
        message: `Successfully added trips with ids: ${id}`,
        launches: [id],
      };
    } catch (err) {
      return this.createTripUpdateError(`Err: ${err}`, [id]);
    }
  }
}
