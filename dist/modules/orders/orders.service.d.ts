import { PrismaService } from "../../prisma/prisma.service";
import { CheckoutDto } from './dto/checkout-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateBookingCode;
    checkout(userId: number, checkoutDto: CheckoutDto): Promise<({
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
        foodItems: ({
            foodItem: {
                description: string | null;
                category: string;
                id: number;
                name: string;
                price: number;
                createdAt: Date;
                imageUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            foodItemId: number;
            quantity: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    }) | null>;
    generateQrCode(orderId: number, user: any): Promise<{
        orderId: number;
        bookingCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        qrCodeDataUrl: string;
        ticketsCount: number;
        movieTitle: string;
    }>;
    verifyTicket(bookingCode: string): Promise<{
        message: string;
        checkedInAt: Date | null;
        order: {
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
            foodItems: ({
                foodItem: {
                    description: string | null;
                    category: string;
                    id: number;
                    name: string;
                    price: number;
                    createdAt: Date;
                    imageUrl: string | null;
                    isAvailable: boolean;
                };
            } & {
                id: number;
                price: number;
                orderId: number;
                foodItemId: number;
                quantity: number;
            })[];
        } & {
            id: number;
            userId: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            totalPrice: number;
            bookingCode: string;
            isCheckedIn: boolean;
            checkedInAt: Date | null;
        };
    }>;
    findAll(): Promise<({
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
        foodItems: ({
            foodItem: {
                description: string | null;
                category: string;
                id: number;
                name: string;
                price: number;
                createdAt: Date;
                imageUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            foodItemId: number;
            quantity: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    })[]>;
    findMyOrders(userId: number): Promise<({
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
        foodItems: ({
            foodItem: {
                description: string | null;
                category: string;
                id: number;
                name: string;
                price: number;
                createdAt: Date;
                imageUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            foodItemId: number;
            quantity: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    })[]>;
    findOne(id: number, user: any): Promise<{
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
        foodItems: ({
            foodItem: {
                description: string | null;
                category: string;
                id: number;
                name: string;
                price: number;
                createdAt: Date;
                imageUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: number;
            price: number;
            orderId: number;
            foodItemId: number;
            quantity: number;
        })[];
    } & {
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    }>;
    updateStatus(id: number, updateDto: UpdateOrderStatusDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalPrice: number;
        bookingCode: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
    }>;
}
