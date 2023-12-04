import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ValidRolesArgs } from './dto/args/roles.args';
import { JwtAuthGuards } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enums';

@Resolver(() => User)
@UseGuards( JwtAuthGuards )
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
		@Args() validRoles: ValidRolesArgs,
		@CurrentUser([ValidRoles.superAdmin]) user: User
	): Promise<User[]> {
		console.log(user)
		
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser([ValidRoles.admin]) user: User
	): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser([ValidRoles.superAdmin, ValidRoles.admin]) user: User
	): Promise<User> {
    return this.usersService.block(id);
  }
}
