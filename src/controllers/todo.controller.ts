import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import { TodoService } from '../services/todo.service'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto'

@Controller('api/v1/todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('current-user')
  async getCurrentUserTodos(@Request() req) {
    return this.todoService.getCurrentUserTodos(req.user.id)
  }

  @Get()
  async getAll() {
    return this.todoService.getAll()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.todoService.getById(id)
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateTodoDto) {
    return this.todoService.create(req.user.id, dto)
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(req.user.id, id, dto)
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.todoService.delete(req.user.id, id)
  }

  @Patch(':id/toggle')
  async toggleComplete(@Request() req, @Param('id') id: string) {
    return this.todoService.toggleComplete(req.user.id, id)
  }
}
