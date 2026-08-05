import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto, file?: Express.Multer.File): Promise<{
        id: string;
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
    }>;
    findAll(): Promise<({
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
    update(id: string, updateMovieDto: UpdateMovieDto, file?: Express.Multer.File): Promise<{
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
