import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput, UpdateTodoInput, StatusArgs } from './dto/';

@Resolver()
export class TodoResolver {
	constructor(
		private readonly todoService: TodoService
	) {}

	@Query( () => [Todo], { name: 'todos' } )
	findAll(
		@Args() status: StatusArgs
	): Todo[] {
		return this.todoService.findAll(status)
	}

	@Query( () => Todo, { name: 'todo' } )
	findOne(
		@Args( 'id', { type: () => Int } ) id: number
	): Todo {
		return this.todoService.findOne(id);
	}

	@Mutation( () => Todo, { name: 'CreateToDo' } )
	createToDo(
		@Args( 'createTodoInput' ) createTodoInput: CreateTodoInput
	) {
		return this.todoService.create(createTodoInput);
	}

	@Mutation( () => Todo, { name: 'UpdateToDo' } )
	updateToDo(
		@Args('updateToDoInput') updateToDoInput: UpdateTodoInput
	) {
		return this.todoService.update(updateToDoInput);
	}

	@Mutation( () => Boolean )
	removeToDo(
		@Args('id', { type: () => Int }) id: number
	) {
		return this.todoService.remove(id);
	}
}
