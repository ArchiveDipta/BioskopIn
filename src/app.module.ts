import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudiosModule } from './modules/studios/studios.module';

@Module({
  imports: [PrismaModule, MoviesModule, ShowtimesModule, OrdersModule, AnalyticsModule, StorageModule, AuthModule, StudiosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
