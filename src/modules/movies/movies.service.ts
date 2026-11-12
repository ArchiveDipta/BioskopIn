import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { StorageService } from 'src/modules/storage/storage.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(createMovieDto: CreateMovieDto, file?: Express.Multer.File) {
    let posterUrl = createMovieDto.posterUrl;
    
    if (file) {
      const filename = `poster-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      posterUrl = await this.storageService.uploadFile('movie-posters', filename, file.buffer, file.mimetype);
    }

    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        posterUrl,
      },
    });
  }

  async findAllActive() {
    return this.prisma.movie.findMany({
      include: {
        showtimes: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          include: {
            studio: {
              include: { cinema: true },
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Film tidak ditemukan');
    }

    return movie;
  }

  async update(id: number, updateMovieDto: any, file?: Express.Multer.File) {
    let posterUrl = updateMovieDto.posterUrl;

    if (file) {
      const filename = `poster-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      posterUrl = await this.storageService.uploadFile('movie-posters', filename, file.buffer, file.mimetype);
    }

    const data = { ...updateMovieDto };
    if (posterUrl) {
      data.posterUrl = posterUrl;
    }

    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
