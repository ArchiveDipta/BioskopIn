import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Foods & Beverages')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menambahkan menu makanan / minuman baru (Khusus Admin)' })
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat seluruh katalog makanan & minuman bioskop (Publik)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter berdasarkan kategori (SNACK, BEVERAGE, COMBO)' })
  findAll(@Query('category') category?: string) {
    return this.foodsService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail satu item makanan / minuman (Publik)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mengubah data menu makanan / minuman (Khusus Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus menu makanan / minuman (Khusus Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.remove(id);
  }
}
