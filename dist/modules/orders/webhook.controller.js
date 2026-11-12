"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const swagger_1 = require("@nestjs/swagger");
let PaymentWebhookController = class PaymentWebhookController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    handleWebhook(body) {
        return this.ordersService.handleMidtransWebhook(body);
    }
};
exports.PaymentWebhookController = PaymentWebhookController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook notifikasi status pembayaran dari Midtrans (Publik)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentWebhookController.prototype, "handleWebhook", null);
exports.PaymentWebhookController = PaymentWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Payments & Webhooks'),
    (0, common_1.Controller)('orders/payment-webhook'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], PaymentWebhookController);
//# sourceMappingURL=webhook.controller.js.map