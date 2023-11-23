import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {
	private todos: Todo[] = [
		{ id: 1, description: 'Soul stone', done: false },
		{ id: 2, description: 'Power stone', done: true },
		{ id: 3, description: 'Space stone', done: false },
		{ id: 4, description: 'Time stone', done: true },
	]

	get totalToDos() {
		return this.todos.length
	}

	get totalCompletedTodo() {
		return this.findAll({ status: true }).length;
	}

	get totalPendingTodo() {
		return this.findAll({ status: false }).length;
	}

	findAll(statusArgs: StatusArgs): Todo[] {
		const { status } = statusArgs

		if(status !== undefined)
			return this.todos.filter(todo => todo.done === status)

		return this.todos;
	}

	findOne(id: number): Todo {
		const todo = this.todos.find(todo => todo.id === id)

		if(!todo)
			throw new NotFoundException(`ToDo with id ${ id } not found.`)

		return todo
	}

	create(createToDoInput: CreateTodoInput): Todo {
		const todo = new Todo()
		todo.description = createToDoInput.description;
		todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;

		return todo;
	}

	update(updateToDoInput: UpdateTodoInput): Todo {
		const { id, description, done } = updateToDoInput
		const todo = this.findOne(id)

		if(description)
			todo.description = description

		if(done !== undefined)
			todo.done = done;

		this.todos = this.todos.map(task => {
			return task.id === id ? todo : task;
		})

		return todo;
	}

	remove(id: number) {
		this.findOne(id);

		this.todos = this.todos.filter(todo => todo.id !== id);
		return true;
	}
}
