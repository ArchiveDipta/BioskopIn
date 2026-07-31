import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
// StorageModule is global, no need to import

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
