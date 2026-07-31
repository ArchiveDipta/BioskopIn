import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getRevenue(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
    }>;
    getTopMovies(): Promise<any[]>;
}
