import { PrismaService } from "../../prisma/prisma.service";
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(movieId: number, userId: number, createReviewDto: CreateReviewDto): Promise<{
        user: {
            id: number;
            name: string | null;
            image: string | null;
        };
    } & {
        id: number;
        movieId: number;
        userId: number;
        createdAt: Date;
        rating: number;
        comment: string | null;
    }>;
    findByMovie(movieId: number): Promise<{
        movieId: number;
        movieTitle: string;
        totalReviews: number;
        averageRating: number;
        reviews: ({
            user: {
                id: number;
                name: string | null;
                image: string | null;
            };
        } & {
            id: number;
            movieId: number;
            userId: number;
            createdAt: Date;
            rating: number;
            comment: string | null;
        })[];
    }>;
    remove(id: number, userId: number, role: string): Promise<{
        id: number;
        movieId: number;
        userId: number;
        createdAt: Date;
        rating: number;
        comment: string | null;
    }>;
}
