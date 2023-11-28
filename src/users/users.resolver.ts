import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string
	): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string
	): Promise<User> {
    return this.usersService.block(id);
  }
}
