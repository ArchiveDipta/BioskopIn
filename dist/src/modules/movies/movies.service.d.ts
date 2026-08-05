import { PrismaService } from "../../prisma/prisma.service";
import { CreateMovieDto } from './dto/create-movie.dto';
import { StorageService } from "../storage/storage.service";
export declare class MoviesService {
    private readonly prisma;
    private readonly storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    create(createMovieDto: CreateMovieDto, file?: Express.Multer.File): Promise<{
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
    update(id: string, updateMovieDto: any, file?: Express.Multer.File): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
    }>;
}
