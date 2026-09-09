import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
export declare class ShowtimesController {
    private readonly showtimesService;
    constructor(showtimesService: ShowtimesService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
        id: number;
        startTime: Date;
        movieId: number;
        studioId: number;
        price: number;
    }>;
    getSeats(id: number): Promise<{
        isAvailable: boolean;
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
