import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { UpdateUserInput } from './dto';
import { ValidRolesArgs } from './dto/args/roles.args';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enums';
import { User } from './entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { PaginationArgs, SearchArgs } from '../common/dto/args/';

@Resolver(() => User)
@UseGuards( JwtAuthGuards )
export class UsersResolver {
  constructor(
		private readonly usersService: UsersService,
		private readonly itemsService: ItemsService
	) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
		@Args() validRoles: ValidRolesArgs,
		@CurrentUser([ValidRoles.superAdmin, ValidRoles.user]) user: User
	): Promise<User[]> {
		console.log(user)
		
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
	): Promise<User> {
    return this.usersService.findOne(id);
  }

	@Mutation( () => User, { name: 'updateUser' } )
	async updateUser(
		@Args('updateItemInput', { type: () => UpdateUserInput }) updateItemInput: UpdateUserInput,
		@CurrentUser() user: User
	): Promise<User> {
		return this.usersService.update(updateItemInput.id, updateItemInput, user)
	}

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
		@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
		@CurrentUser([ValidRoles.superAdmin, ValidRoles.admin]) user: User
	): Promise<User> {
    return this.usersService.block(id, user);
  }

	@ResolveField( () => Int, { name: 'itemCount' } )
	async itemCount(
		@Parent() user: User
	): Promise<number> {
		return this.itemsService.itemCountByUser(user)
	}

	@ResolveField( () => [Item], { name: 'items' } )
	async getItemsByUser(
		@CurrentUser([ValidRoles.admin]) adminUser: User,
		@Parent() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs,
	): Promise<Item[]> {
		return this.itemsService.findAll(user, paginationArgs, searchArgs)
	}
}
