import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
	private todos: Todo[] = [
		{ id: 1, description: 'Soul stone', done: false },
		{ id: 2, description: 'Power stone', done: true },
		{ id: 3, description: 'Space stone', done: false },
	]

	findAll(): Todo[] {
		return this.todos;
	}

	findOne(id: number): Todo {
		const todo = this.todos.find(todo => todo.id === id)

		if(!todo)
			throw new NotFoundException(`ToDo with id ${ id } not found.`)

		return todo
	}
}
