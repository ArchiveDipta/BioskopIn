import { PrismaService } from "../../prisma/prisma.service";
import { CreateStudioDto } from './dto/create-studio.dto';
export declare class StudiosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
