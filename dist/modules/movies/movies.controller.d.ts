import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto, file?: Express.Multer.File): Promise<{
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
        category: string | null;
        ageRating: string | null;
        id: number;
    }>;
    findAll(): Promise<({
        showtimes: {
            id: number;
            startTime: Date;
            movieId: number;
            studioId: number;
            price: number;
        }[];
    } & {
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
        category: string | null;
        ageRating: string | null;
        id: number;
    })[]>;
    findOne(id: number): Promise<{
        showtimes: ({
            studio: {
                cinema: {
                    id: number;
                    name: string;
                    city: string;
                    address: string | null;
                };
            } & {
                id: number;
                name: string;
                cinemaId: number;
                totalCapacity: number;
            };
        } & {
            id: number;
            startTime: Date;
            movieId: number;
            studioId: number;
            price: number;
        })[];
    } & {
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
        category: string | null;
        ageRating: string | null;
        id: number;
    }>;
    update(id: number, updateMovieDto: UpdateMovieDto, file?: Express.Multer.File): Promise<{
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
        category: string | null;
        ageRating: string | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        title: string;
        description: string | null;
        duration: number;
        posterUrl: string | null;
        trailerUrl: string | null;
        category: string | null;
        ageRating: string | null;
        id: number;
    }>;
}
