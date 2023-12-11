import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { CreateListInput, UpdateListInput } from './dto/inputs/';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';
import { List } from './entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { ListsService } from './lists.service';
import { PaginationArgs, SearchArgs } from '../common/dto/args/';
import { User } from '../users/entities/user.entity';

@Resolver(() => List)
@UseGuards( JwtAuthGuards )
export class ListsResolver {
  constructor(
		private readonly listsService: ListsService,
		private readonly listItemService: ListItemService
	) {}

  @Mutation(() => List)
  createList(
		@Args('createListInput') createListInput: CreateListInput,
		@CurrentUser() user: User
	): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
		@CurrentUser() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs
	): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(
		@Args('id', { type: () => Int }, ParseUUIDPipe) id: string,
		@CurrentUser() user: User
	): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List)
  updateList(
		@Args('updateListInput') updateListInput: UpdateListInput,
		@CurrentUser() user: User
	): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
		@Args('id', { type: () => Int }, ParseUUIDPipe) id: string,
		@CurrentUser() user: User
	): Promise<List> {
    return this.listsService.remove(id, user);
  }

	@ResolveField( () => [ListItem], { name: 'items' } )
	async getListItems(
		@Parent() list: List,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs
	): Promise<ListItem[]> {
		return this.listItemService.findAll(list, paginationArgs, searchArgs);
	}

	@ResolveField( () => Int, { name: 'totalItems' } )
	async countListItemsByList(
		@Parent() list: List
	): Promise<number> {
		return this.listItemService.getTotalListItemByList(list);
	}
}
