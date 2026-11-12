import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto) {
    return this.prisma.foodItem.create({
      data: createFoodDto,
    });
  }

  async findAll(category?: string) {
    return this.prisma.foodItem.findMany({
      where: {
        isAvailable: true,
        ...(category ? { category } : {}),
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.foodItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Menu makanan/minuman tidak ditemukan');
    }
    return item;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    await this.findOne(id);
    return this.prisma.foodItem.update({
      where: { id },
      data: updateFoodDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.foodItem.delete({
      where: { id },
    });
  }
}
