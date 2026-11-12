import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Movie Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('movies/:id/reviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Memberikan rating & ulasan film (Khusus Verified Viewers yang pernah beli tiket)' })
  create(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    return this.reviewsService.create(movieId, req.user.id, createReviewDto);
  }

  @Get('movies/:id/reviews')
  @ApiOperation({ summary: 'Melihat seluruh ulasan & rata-rata rating film (Publik)' })
  findByMovie(@Param('id', ParseIntPipe) movieId: number) {
    return this.reviewsService.findByMovie(movieId);
  }

  @Delete('reviews/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Menghapus ulasan (Pembuat ulasan atau Admin)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.reviewsService.remove(id, req.user.id, req.user.role);
  }
}
