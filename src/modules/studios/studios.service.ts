import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudioDto } from './dto/create-studio.dto';

@Injectable()
export class StudiosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudioDto: CreateStudioDto) {
    const { cinemaId, name, rows, seatsPerRow } = createStudioDto;
    const totalCapacity = rows * seatsPerRow;

    return this.prisma.$transaction(async (tx) => {
      const studio = await tx.studio.create({
        data: {
          cinemaId,
          name,
          totalCapacity,
        },
      });

      const seatsData: { studioId: string; row: string; number: number; }[] = [];
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      for (let i = 0; i < rows; i++) {
        const rowLetter = alphabet[i];
        for (let j = 1; j <= seatsPerRow; j++) {
          seatsData.push({
            studioId: studio.id,
            row: rowLetter,
            number: j,
          });
        }
      }

      await tx.seat.createMany({
        data: seatsData,
      });

      return studio;
    });
  }

  async findAll(cinemaId?: string) {
    return this.prisma.studio.findMany({
      where: cinemaId ? { cinemaId } : undefined,
      include: {
        _count: {
          select: { seats: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const studio = await this.prisma.studio.findUnique({
      where: { id },
      include: { seats: true },
    });

    if (!studio) throw new NotFoundException('Studio tidak ditemukan');
    return studio;
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({ where: { studioId: id } });
      return tx.studio.delete({ where: { id } });
    });
  }
}
