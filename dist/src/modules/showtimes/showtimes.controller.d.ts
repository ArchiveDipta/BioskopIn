import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
export declare class ShowtimesController {
    private readonly showtimesService;
    constructor(showtimesService: ShowtimesService);
    create(createShowtimeDto: CreateShowtimeDto): Promise<{
        id: string;
        startTime: Date;
        movieId: string;
        studioId: string;
        price: number;
    }>;
    getSeats(id: string): Promise<{
        isAvailable: boolean;
        number: number;
        id: string;
        studioId: string;
        row: string;
    }[]>;
    update(id: string, updateShowtimeDto: UpdateShowtimeDto): Promise<{
        id: string;
        startTime: Date;
        movieId: string;
        studioId: string;
        price: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        startTime: Date;
        movieId: string;
        studioId: string;
        price: number;
    }>;
}
