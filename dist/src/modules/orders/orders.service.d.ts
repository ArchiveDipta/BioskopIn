import { PrismaService } from "../../prisma/prisma.service";
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateBookingCode;
    checkout(userId: string, checkoutDto: CheckoutDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string | null;
            email: string | null;
        };
        tickets: ({
            showtime: {
                movie: {
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                };
            } & {
                id: string;
                startTime: Date;
                movieId: string;
                studioId: string;
                price: number;
            };
        } & {
            id: string;
            price: number;
            orderId: string;
            showtimeId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    })[]>;
    findMyOrders(userId: string): Promise<({
        tickets: ({
            showtime: {
                movie: {
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                };
            } & {
                id: string;
                startTime: Date;
                movieId: string;
                studioId: string;
                price: number;
            };
        } & {
            id: string;
            price: number;
            orderId: string;
            showtimeId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    })[]>;
    findOne(id: string, user: any): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string | null;
        };
        tickets: ({
            seat: {
                number: number;
                id: string;
                studioId: string;
                row: string;
            };
            showtime: {
                movie: {
                    id: string;
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                };
                studio: {
                    id: string;
                    name: string;
                    cinemaId: string;
                    totalCapacity: number;
                };
            } & {
                id: string;
                startTime: Date;
                movieId: string;
                studioId: string;
                price: number;
            };
        } & {
            id: string;
            price: number;
            orderId: string;
            showtimeId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
}
