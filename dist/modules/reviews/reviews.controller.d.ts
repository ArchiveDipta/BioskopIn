import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(movieId: number, createReviewDto: CreateReviewDto, req: any): Promise<{
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
    remove(id: number, req: any): Promise<{
        id: number;
        movieId: number;
        userId: number;
        createdAt: Date;
        rating: number;
        comment: string | null;
    }>;
}
