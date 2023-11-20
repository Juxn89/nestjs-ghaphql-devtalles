import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Soul stone', done: false },
    { id: 2, description: 'Time stone', done: false },
    { id: 3, description: 'Space stone', done: true }
  ];

  create(createTodoDto: CreateTodoDto): Todo {
    const todo = new Todo();
    todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    todo.description = createTodoDto.description;

    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);

    if(!todo)
      throw new NotFoundException(`ToDo with ID "${id}" not found`)

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const { done, description } = updateTodoDto
    const todo = this.findOne(id);
    
    if(done !== undefined)
      todo.done = done

    if(description)
      todo.description = description

    this.todos = this.todos.map(todoDB => {
      if(todo.id === id)
        return todo;

      return todoDB;
    })
    
    return todo;
  }

  remove(id: number) {
    this.findOne(id);

    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
