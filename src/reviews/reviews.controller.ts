import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-reveiw.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserTokenPayload } from 'src/auth/token-payload';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':cabinId')
  async getReviewsByCabinId(@Param('cabinId') cabinId: string) {
    try {
      const reviews = await this.reviewsService.getReviewsByCabinId(cabinId);
      return reviews;
    } catch (error) {
      throw new Error('Unable to fetch reviews');
    }
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addReview(
    @Body() body: CreateReviewDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const review = await this.reviewsService.addReview(body, user.userId);
    return {
      message: 'Review Sdded uccessfully',
      reviewItem: review,
    };
  }
}
