import { PrismaService } from "../../prisma/prisma.service";
import { CreateShowtimeDto } from './dto/create-showtime.dto';
export declare class ShowtimesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
        id: number;
        startTime: Date;
        movieId: number;
        studioId: number;
        price: number;
    }>;
    getSeatsAvailability(showtimeId: number): Promise<{
        isAvailable: boolean;
        number: number;
        id: number;
        studioId: number;
        row: string;
    }[]>;
    update(id: number, updateShowtimeDto: any): Promise<{
        id: number;
        startTime: Date;
        movieId: number;
        studioId: number;
        price: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        startTime: Date;
        movieId: number;
        studioId: number;
        price: number;
    }>;
}
