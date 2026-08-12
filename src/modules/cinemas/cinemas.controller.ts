import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Membuat bioskop/cabang baru (Khusus Admin)' })
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat daftar bioskop (Bisa filter by city)' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter berdasarkan kota' })
  findAll(@Query('city') city?: string) {
    return this.cinemasService.findAll(city);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail bioskop beserta studio di dalamnya' })
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus bioskop (Khusus Admin)' })
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(id);
  }
}
