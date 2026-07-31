import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenue(startDate?: string, endDate?: string) {
    const whereClause: any = {
      status: 'SUCCESS',
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    const result = await this.prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: whereClause,
    });

    return { totalRevenue: result._sum.totalPrice || 0 };
  }

  async getTopMovies() {
    const topMovies: any[] = await this.prisma.$queryRaw`
      SELECT 
        m.id, 
        m.title, 
        COUNT(ot.id) as ticketsSold
      FROM Movie m
      JOIN Showtime s ON s.movieId = m.id
      JOIN OrderTicket ot ON ot.showtimeId = s.id
      JOIN \`Order\` o ON ot.orderId = o.id
      WHERE o.status = 'SUCCESS'
      GROUP BY m.id, m.title
      ORDER BY ticketsSold DESC
      LIMIT 5
    `;

    return topMovies.map((movie) => ({
      ...movie,
      ticketsSold: Number(movie.ticketsSold),
    }));
  }
}
