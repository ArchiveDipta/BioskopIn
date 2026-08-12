import { StudiosService } from './studios.service';
import { CreateStudioDto } from './dto/create-studio.dto';
export declare class StudiosController {
    private readonly studiosService;
    constructor(studiosService: StudiosService);
    create(createStudioDto: CreateStudioDto): Promise<{
        id: string;
        name: string;
        cinemaId: string;
        totalCapacity: number;
    }>;
    findAll(cinemaId?: string): Promise<({
        _count: {
            seats: number;
        };
    } & {
        id: string;
        name: string;
        cinemaId: string;
        totalCapacity: number;
    })[]>;
    findOne(id: string): Promise<{
        seats: {
            number: number;
            id: string;
            studioId: string;
            row: string;
        }[];
    } & {
        id: string;
        name: string;
        cinemaId: string;
        totalCapacity: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        cinemaId: string;
        totalCapacity: number;
    }>;
}
