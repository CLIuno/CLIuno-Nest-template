import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Todo } from '../entities/todo.entity'
import { User } from '../entities/user.entity'
import { CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto'

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAll() {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
    return { status: 'success', message: 'Todos fetched successfully', data: { todos } }
  }

  async getById(id: string) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!todo) throw new NotFoundException('Todo not found')
    return { status: 'success', message: 'Todo fetched successfully', data: { todo } }
  }

  async getCurrentUserTodos(userId: string) {
    const todos = await this.todoRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
    return { status: 'success', message: 'Todos fetched successfully', data: { todos } }
  }

  async create(userId: string, dto: CreateTodoDto) {
    if (!dto.title) throw new BadRequestException('Title is required')

    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException('User not found')

    const todo = this.todoRepository.create({
      title: dto.title,
      description: dto.description || '',
      user,
    })
    const result = await this.todoRepository.save(todo)
    return { status: 'success', message: 'Todo created successfully', data: { todo: result } }
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.todoRepository.findOne({ where: { id }, relations: ['user'] })
    if (!todo) throw new NotFoundException('Todo not found')
    if (todo.user.id !== userId) throw new ForbiddenException('You can only update your own todos')

    if (dto.title !== undefined) todo.title = dto.title
    if (dto.description !== undefined) todo.description = dto.description
    if (dto.is_completed !== undefined) todo.is_completed = dto.is_completed

    await this.todoRepository.save(todo)
    return { status: 'success', message: 'Todo updated successfully', data: { todo } }
  }

  async delete(userId: string, id: string) {
    const todo = await this.todoRepository.findOne({ where: { id }, relations: ['user'] })
    if (!todo) throw new NotFoundException('Todo not found')
    if (todo.user.id !== userId) throw new ForbiddenException('You can only delete your own todos')

    await this.todoRepository.remove(todo)
    return { status: 'success', message: 'Todo deleted successfully' }
  }

  async toggleComplete(userId: string, id: string) {
    const todo = await this.todoRepository.findOne({ where: { id }, relations: ['user'] })
    if (!todo) throw new NotFoundException('Todo not found')
    if (todo.user.id !== userId) throw new ForbiddenException('You can only update your own todos')

    todo.is_completed = !todo.is_completed
    await this.todoRepository.save(todo)
    return { status: 'success', message: 'Todo toggled successfully', data: { todo } }
  }
}
