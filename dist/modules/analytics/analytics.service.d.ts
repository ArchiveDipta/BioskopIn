import { PrismaService } from "../../prisma/prisma.service";
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRevenue(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
    }>;
    getTopMovies(): Promise<any[]>;
}
