import { Injectable } from '@nestjs/common';
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

  async update(id: string, updateMovieDto: any, file?: Express.Multer.File) {
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

  async remove(id: string) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
