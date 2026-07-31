import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    return this.prisma.showtime.create({
      data: {
        ...createShowtimeDto,
        startTime: new Date(createShowtimeDto.startTime),
      },
    });
  }

  async getSeatsAvailability(showtimeId: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        studio: {
          include: {
            seats: true,
          },
        },
        tickets: true,
      },
    });

    if (!showtime) {
      throw new NotFoundException('Jadwal tayang tidak ditemukan');
    }

    const bookedSeatIds = new Set(showtime.tickets.map((t) => t.seatId));

    const seatsWithAvailability = showtime.studio.seats.map((seat) => ({
      ...seat,
      isAvailable: !bookedSeatIds.has(seat.id),
    }));

    return seatsWithAvailability;
  }
}
