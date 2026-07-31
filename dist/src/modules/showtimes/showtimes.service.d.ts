import { PrismaService } from "../../prisma/prisma.service";
import { CreateShowtimeDto } from './dto/create-showtime.dto';
export declare class ShowtimesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
        id: string;
        startTime: Date;
        movieId: string;
        studioId: string;
        price: number;
    }>;
    getSeatsAvailability(showtimeId: string): Promise<{
        isAvailable: boolean;
        number: number;
        id: string;
        studioId: string;
        row: string;
    }[]>;
}
