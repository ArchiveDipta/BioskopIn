"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShowtimeDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const create_showtime_dto_1 = require("./create-showtime.dto");
class UpdateShowtimeDto extends (0, nestjs_zod_1.createZodDto)(create_showtime_dto_1.ShowtimeSchema.partial()) {
}
exports.UpdateShowtimeDto = UpdateShowtimeDto;
//# sourceMappingURL=update-showtime.dto.js.map