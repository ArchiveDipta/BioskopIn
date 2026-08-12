import { PrismaService } from "../../prisma/prisma.service";
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateBookingCode;
    checkout(userId: string, checkoutDto: CheckoutDto): Promise<{
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
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
                studio: {
                    cinema: {
                        id: string;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: string;
                    name: string;
                    cinemaId: string;
                    totalCapacity: number;
                };
            } & {
                id: string;
                movieId: string;
                studioId: string;
                startTime: Date;
                price: number;
            };
        } & {
            id: string;
            price: number;
            showtimeId: string;
            orderId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
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
                studio: {
                    cinema: {
                        id: string;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: string;
                    name: string;
                    cinemaId: string;
                    totalCapacity: number;
                };
            } & {
                id: string;
                movieId: string;
                studioId: string;
                startTime: Date;
                price: number;
            };
        } & {
            id: string;
            price: number;
            showtimeId: string;
            orderId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
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
                    cinema: {
                        id: string;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: string;
                    name: string;
                    cinemaId: string;
                    totalCapacity: number;
                };
            } & {
                id: string;
                movieId: string;
                studioId: string;
                startTime: Date;
                price: number;
            };
        } & {
            id: string;
            price: number;
            showtimeId: string;
            orderId: string;
            seatId: string;
        })[];
    } & {
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<{
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        bookingCode: string;
        createdAt: Date;
        userId: string;
    }>;
}
