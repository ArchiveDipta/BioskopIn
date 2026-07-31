import { PrismaService } from "../../prisma/prisma.service";
import { CreateMovieDto } from './dto/create-movie.dto';
export declare class MoviesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createMovieDto: CreateMovieDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
    }>;
    findAllActive(): Promise<({
        showtimes: {
            id: string;
            startTime: Date;
            movieId: string;
            studioId: string;
            price: number;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
    })[]>;
}
