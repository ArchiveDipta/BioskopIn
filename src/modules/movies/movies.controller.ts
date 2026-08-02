import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Menambahkan film baru & upload poster (Khusus Admin)' })
  create(@Body() createMovieDto: CreateMovieDto, @UploadedFile() file?: Express.Multer.File) {
    return this.moviesService.create(createMovieDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat semua film aktif (Publik)' })
  findAll() {
    return this.moviesService.findAllActive();
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Mengubah data film & update poster (Khusus Admin)' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto, @UploadedFile() file?: Express.Multer.File) {
    return this.moviesService.update(id, updateMovieDto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus film (Khusus Admin)' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
