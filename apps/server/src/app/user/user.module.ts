import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchModule } from '../launch/launch.module';
import { HasTripsResolver } from './hasTrips.resolver';
import { TripUpdateResponseResolver } from './tripUpdateResponse.resolver';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [LaunchModule, HttpModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    UserResolver,
    TripUpdateResponseResolver,
    HasTripsResolver,
  ],
})
export class UserModule {}
