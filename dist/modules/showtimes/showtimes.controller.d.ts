import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { HoldSeatsDto } from './dto/hold-seats.dto';
export declare class ShowtimesController {
    private readonly showtimesService;
    constructor(showtimesService: ShowtimesService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
        movie: {
            title: string;
            description: string | null;
            duration: number;
            posterUrl: string | null;
            trailerUrl: string | null;
            category: string | null;
            ageRating: string | null;
            id: number;
        };
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
    }>;
    holdSeats(id: number, holdSeatsDto: HoldSeatsDto, req: any): Promise<{
        message: string;
        showtimeId: number;
        heldSeatIds: number[];
        expiresAt: Date;
    }>;
    findAll(movieId?: number, cinemaId?: number, studioId?: number): Promise<({
        movie: {
            title: string;
            description: string | null;
            duration: number;
            posterUrl: string | null;
            trailerUrl: string | null;
            category: string | null;
            ageRating: string | null;
            id: number;
        };
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
    })[]>;
    findOne(id: number): Promise<{
        movie: {
            title: string;
            description: string | null;
            duration: number;
            posterUrl: string | null;
            trailerUrl: string | null;
            category: string | null;
            ageRating: string | null;
            id: number;
        };
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
    }>;
    getSeats(id: number): Promise<{
        isAvailable: boolean;
        status: "AVAILABLE" | "BOOKED" | "LOCKED" | "HELD_BY_YOU";
        number: number;
        id: number;
        studioId: number;
        row: string;
    }[]>;
    update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<{
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
