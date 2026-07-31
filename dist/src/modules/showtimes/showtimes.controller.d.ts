import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
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
}
