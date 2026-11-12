import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, ParseIntPipe } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { HoldSeatsDto } from './dto/hold-seats.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Membuat jadwal tayang baru (Khusus Admin)' })
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Post(':id/hold-seats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengunci kursi sementara selama 10 menit (Seat Hold)' })
  holdSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body() holdSeatsDto: HoldSeatsDto,
    @Req() req: any,
  ) {
    return this.showtimesService.holdSeats(id, req.user.id, holdSeatsDto.seatIds);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat semua jadwal tayang dengan filter (Publik)' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filter berdasarkan ID Film' })
  @ApiQuery({ name: 'cinemaId', required: false, description: 'Filter berdasarkan ID Bioskop' })
  @ApiQuery({ name: 'studioId', required: false, description: 'Filter berdasarkan ID Studio' })
  findAll(
    @Query('movieId', new ParseIntPipe({ optional: true })) movieId?: number,
    @Query('cinemaId', new ParseIntPipe({ optional: true })) cinemaId?: number,
    @Query('studioId', new ParseIntPipe({ optional: true })) studioId?: number,
  ) {
    return this.showtimesService.findAll(movieId, studioId, cinemaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Melihat detail satu jadwal tayang (Publik)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.findOne(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Melihat ketersediaan kursi secara real-time (Publik)' })
  getSeats(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.getSeatsAvailability(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mengubah jadwal tayang (Khusus Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShowtimeDto: UpdateShowtimeDto) {
    return this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Menghapus jadwal tayang (Khusus Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.remove(id);
  }
}
