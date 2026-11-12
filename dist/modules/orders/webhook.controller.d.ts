import { OrdersService } from './orders.service';
export declare class PaymentWebhookController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    handleWebhook(body: any): Promise<{
        message: string;
        status?: undefined;
    } | {
        message: string;
        status: any;
    }>;
}
