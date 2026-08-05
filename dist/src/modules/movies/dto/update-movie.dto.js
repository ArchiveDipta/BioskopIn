"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMovieDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const create_movie_dto_1 = require("./create-movie.dto");
class UpdateMovieDto extends (0, nestjs_zod_1.createZodDto)(create_movie_dto_1.MovieSchema.partial()) {
}
exports.UpdateMovieDto = UpdateMovieDto;
//# sourceMappingURL=update-movie.dto.js.map