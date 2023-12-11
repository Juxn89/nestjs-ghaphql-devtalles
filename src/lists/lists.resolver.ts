import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput, UpdateListInput } from './dto/inputs/';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args/';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuards } from '../auth/guards/jwt-auth.guards';

@Resolver(() => List)
@UseGuards( JwtAuthGuards )
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

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
}
