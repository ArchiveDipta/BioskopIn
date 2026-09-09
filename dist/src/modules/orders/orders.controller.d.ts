import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(checkoutDto: CheckoutDto, req: any): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    }>;
    findMyOrders(req: any): Promise<({
        tickets: ({
            showtime: {
                movie: {
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                    id: number;
                };
                studio: {
                    cinema: {
                        id: number;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: number;
                    name: string;
                    cinemaId: number;
                    totalCapacity: number;
                };
            } & {
                id: number;
                startTime: Date;
                movieId: number;
                studioId: number;
                price: number;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            showtimeId: number;
            seatId: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    })[]>;
    findAll(): Promise<({
        user: {
            id: number;
            name: string | null;
            email: string | null;
        };
        tickets: ({
            showtime: {
                movie: {
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                    id: number;
                };
                studio: {
                    cinema: {
                        id: number;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: number;
                    name: string;
                    cinemaId: number;
                    totalCapacity: number;
                };
            } & {
                id: number;
                startTime: Date;
                movieId: number;
                studioId: number;
                price: number;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            showtimeId: number;
            seatId: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    })[]>;
    findOne(id: number, req: any): Promise<{
        user: {
            id: number;
            name: string | null;
            email: string | null;
        };
        tickets: ({
            seat: {
                number: number;
                id: number;
                studioId: number;
                row: string;
            };
            showtime: {
                movie: {
                    title: string;
                    description: string | null;
                    duration: number;
                    posterUrl: string | null;
                    trailerUrl: string | null;
                    category: string | null;
                    ageRating: string | null;
                    id: number;
                };
                studio: {
                    cinema: {
                        id: number;
                        name: string;
                        city: string;
                        address: string | null;
                    };
                } & {
                    id: number;
                    name: string;
                    cinemaId: number;
                    totalCapacity: number;
                };
            } & {
                id: number;
                startTime: Date;
                movieId: number;
                studioId: number;
                price: number;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            showtimeId: number;
            seatId: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    }>;
    updateStatus(id: number, updateDto: UpdateOrderStatusDto): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        createdAt: Date;
        userId: number;
    }>;
}
