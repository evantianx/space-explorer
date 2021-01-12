import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@space-explorer/types';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  @UseGuards(AuthGuard)
  me(@Context('user') user: UserModel) {
    if (!user) {
      return null;
    }
    return this.userService.getUserByEmail(user.email);
  }

  @Mutation()
  async login(@Args('email') email: string) {
    let user = await this.userService.getUserByEmail(email);
    if (!user) {
      user = await this.userService.createUser(email);
    }
    return this.userService.createToken(user);
  }
}
