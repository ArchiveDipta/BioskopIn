import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    create(createCinemaDto: CreateCinemaDto): Promise<{
        name: string;
        city: string;
        address: string | null;
        id: string;
    }>;
    findAll(city?: string): Promise<({
        studios: {
            name: string;
            id: string;
            cinemaId: string;
            totalCapacity: number;
        }[];
    } & {
        name: string;
        city: string;
        address: string | null;
        id: string;
    })[]>;
    findOne(id: string): Promise<({
        studios: {
            name: string;
            id: string;
            cinemaId: string;
            totalCapacity: number;
        }[];
    } & {
        name: string;
        city: string;
        address: string | null;
        id: string;
    }) | null>;
    remove(id: string): Promise<{
        name: string;
        city: string;
        address: string | null;
        id: string;
    }>;
}
