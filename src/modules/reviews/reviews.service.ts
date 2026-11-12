import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(movieId: number, userId: number, createReviewDto: CreateReviewDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Film tidak ditemukan');
    }

    // 1. Cek apakah user sudah pernah mengulas film ini
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Anda sudah memberikan ulasan untuk film ini');
    }

    // 2. Verified Viewer Check: Pastikan user benar-benar pernah membeli tiket film ini
    const verifiedTicket = await this.prisma.orderTicket.findFirst({
      where: {
        order: {
          userId,
          status: 'SUCCESS',
        },
        showtime: {
          movieId,
        },
      },
    });

    if (!verifiedTicket) {
      throw new ForbiddenException('Hanya penonton yang telah membeli tiket film ini yang dapat memberikan ulasan');
    }

    // 3. Simpan Ulasan
    return this.prisma.review.create({
      data: {
        movieId,
        userId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async findByMovie(movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Film tidak ditemukan');
    }

    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    return {
      movieId,
      movieTitle: movie.title,
      totalReviews,
      averageRating,
      reviews,
    };
  }

  async remove(id: number, userId: number, role: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Ulasan tidak ditemukan');
    }

    if (role !== 'ADMIN' && review.userId !== userId) {
      throw new ForbiddenException('Anda tidak berhak menghapus ulasan ini');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }
}
