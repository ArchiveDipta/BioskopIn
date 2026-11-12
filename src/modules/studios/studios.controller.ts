import {  Controller, Get, Post, Body, Param, Delete, UseGuards, Query , ParseIntPipe } from '@nestjs/common';
import { StudiosService } from './studios.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Studios')
@Controller('studios')
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Membuat studio baru & kursi otomatis (Khusus Admin)' })
  create(@Body() createStudioDto: CreateStudioDto) {
    return this.studiosService.create(createStudioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat semua studio' })
  @ApiQuery({ name: 'cinemaId', required: false, description: 'Filter berdasarkan ID Bioskop' })
  findAll(@Query('cinemaId', new ParseIntPipe({ optional: true })) cinemaId?: number) {
    return this.studiosService.findAll(cinemaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail studio dan kursinya' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studiosService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus studio beserta kursinya (Khusus Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studiosService.remove(id);
  }
}
