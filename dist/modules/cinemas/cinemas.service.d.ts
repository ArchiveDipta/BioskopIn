import { PrismaService } from "../../prisma/prisma.service";
import { CreateCinemaDto } from './dto/create-cinema.dto';
export declare class CinemasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCinemaDto: CreateCinemaDto): Promise<{
        id: number;
        name: string;
        city: string;
        address: string | null;
    }>;
    findAll(city?: string): Promise<({
        studios: {
            id: number;
            name: string;
            cinemaId: number;
            totalCapacity: number;
        }[];
    } & {
        id: number;
        name: string;
        city: string;
        address: string | null;
    })[]>;
    findOne(id: number): Promise<({
        studios: {
            id: number;
            name: string;
            cinemaId: number;
            totalCapacity: number;
        }[];
    } & {
        id: number;
        name: string;
        city: string;
        address: string | null;
    }) | null>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        city: string;
        address: string | null;
    }>;
}
