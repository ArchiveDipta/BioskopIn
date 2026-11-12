import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
      include: {
        movie: true,
        studio: {
          include: {
            cinema: true,
          },
        },
      },
    });
  }

  async findAll(movieId?: number, studioId?: number, cinemaId?: number) {
    const where: any = {};
    if (movieId) where.movieId = movieId;
    if (studioId) where.studioId = studioId;
    if (cinemaId) {
      where.studio = { cinemaId };
    }

    return this.prisma.showtime.findMany({
      where,
      include: {
        movie: true,
        studio: {
          include: {
            cinema: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        studio: {
          include: {
            cinema: true,
          },
        },
      },
    });

    if (!showtime) {
      throw new NotFoundException('Jadwal tayang tidak ditemukan');
    }

    return showtime;
  }

  async holdSeats(showtimeId: number, userId: number, seatIds: number[]) {
    const now = new Date();

    // 1. Bersihkan kunci kursi yang sudah kedaluwarsa
    await this.prisma.seatHold.deleteMany({
      where: { expiresAt: { lte: now } },
    });

    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });

    if (!showtime) {
      throw new NotFoundException('Jadwal tayang tidak ditemukan');
    }

    // 2. Validasi kursi ada di studio tersebut
    const validSeats = await this.prisma.seat.findMany({
      where: {
        id: { in: seatIds },
        studioId: showtime.studioId,
      },
    });

    if (validSeats.length !== seatIds.length) {
      throw new BadRequestException('Satu atau lebih kursi tidak valid untuk studio pada jadwal ini');
    }

    // 3. Validasi: pastikan kursi belum dibeli secara permanen
    const alreadyBooked = await this.prisma.orderTicket.findMany({
      where: {
        showtimeId,
        seatId: { in: seatIds },
      },
    });

    if (alreadyBooked.length > 0) {
      throw new ConflictException('Satu atau lebih kursi telah dibeli pengguna lain');
    }

    // 4. Validasi: pastikan kursi tidak sedang dikunci user lain
    const activeHolds = await this.prisma.seatHold.findMany({
      where: {
        showtimeId,
        seatId: { in: seatIds },
        userId: { not: userId },
        expiresAt: { gt: now },
      },
    });

    if (activeHolds.length > 0) {
      throw new ConflictException('Satu atau lebih kursi sedang dikunci sementara oleh pengguna lain');
    }

    // 5. Kunci kursi selama 10 menit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      // Hapus kunci lama oleh user ini pada jadwal ini
      await tx.seatHold.deleteMany({
        where: { showtimeId, userId },
      });

      await tx.seatHold.createMany({
        data: seatIds.map((seatId) => ({
          showtimeId,
          userId,
          seatId,
          expiresAt,
        })),
      });

      return {
        message: 'Kursi berhasil dikunci selama 10 menit',
        showtimeId,
        heldSeatIds: seatIds,
        expiresAt,
      };
    });
  }

  async getSeatsAvailability(showtimeId: number, currentUserId?: number) {
    const now = new Date();

    // Hapus hold yang sudah kedaluwarsa secara otomatis
    await this.prisma.seatHold.deleteMany({
      where: { expiresAt: { lte: now } },
    });

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

    // Ambil hold yang masih aktif
    const activeHolds = await this.prisma.seatHold.findMany({
      where: {
        showtimeId,
        expiresAt: { gt: now },
      },
    });

    const heldMap = new Map(activeHolds.map((h) => [h.seatId, h.userId]));

    const seatsWithAvailability = showtime.studio.seats.map((seat) => {
      let status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'HELD_BY_YOU' = 'AVAILABLE';
      let isAvailable = true;

      if (bookedSeatIds.has(seat.id)) {
        status = 'BOOKED';
        isAvailable = false;
      } else if (heldMap.has(seat.id)) {
        const heldUserId = heldMap.get(seat.id);
        if (currentUserId && heldUserId === currentUserId) {
          status = 'HELD_BY_YOU';
          isAvailable = true;
        } else {
          status = 'LOCKED';
          isAvailable = false;
        }
      }

      return {
        ...seat,
        isAvailable,
        status,
      };
    });

    return seatsWithAvailability;
  }

  async update(id: number, updateShowtimeDto: any) {
    const data: any = { ...updateShowtimeDto };
    if (data.startTime) {
      data.startTime = new Date(data.startTime);
    }
    return this.prisma.showtime.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.showtime.delete({
      where: { id },
    });
  }
}
