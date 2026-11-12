import { StudiosService } from './studios.service';
import { CreateStudioDto } from './dto/create-studio.dto';
export declare class StudiosController {
    private readonly studiosService;
    constructor(studiosService: StudiosService);
    create(createStudioDto: CreateStudioDto): Promise<{
        id: number;
        name: string;
        cinemaId: number;
        totalCapacity: number;
    }>;
    findAll(cinemaId?: number): Promise<({
        _count: {
            seats: number;
        };
    } & {
        id: number;
        name: string;
        cinemaId: number;
        totalCapacity: number;
    })[]>;
    findOne(id: number): Promise<{
        seats: {
            number: number;
            id: number;
            studioId: number;
            row: string;
        }[];
    } & {
        id: number;
        name: string;
        cinemaId: number;
        totalCapacity: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        cinemaId: number;
        totalCapacity: number;
    }>;
}
