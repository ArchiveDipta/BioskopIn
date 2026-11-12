import { PrismaService } from "../../prisma/prisma.service";
import { CreateShowtimeDto } from './dto/create-showtime.dto';
export declare class ShowtimesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findAll(movieId?: number, studioId?: number, cinemaId?: number): Promise<({
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
    holdSeats(showtimeId: number, userId: number, seatIds: number[]): Promise<{
        message: string;
        showtimeId: number;
        heldSeatIds: number[];
        expiresAt: Date;
    }>;
    getSeatsAvailability(showtimeId: number, currentUserId?: number): Promise<{
        isAvailable: boolean;
        status: "AVAILABLE" | "BOOKED" | "LOCKED" | "HELD_BY_YOU";
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
