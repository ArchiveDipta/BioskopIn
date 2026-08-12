import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCinemaDto: CreateCinemaDto) {
    return this.prisma.cinema.create({
      data: createCinemaDto,
    });
  }

  async findAll(city?: string) {
    return this.prisma.cinema.findMany({
      where: city ? { city } : undefined,
      include: {
        studios: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.cinema.findUnique({
      where: { id },
      include: {
        studios: true,
      }
    });
  }

  async remove(id: string) {
    return this.prisma.cinema.delete({
      where: { id },
    });
  }
}
