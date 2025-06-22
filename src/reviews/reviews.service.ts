import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-reveiw.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addReview(reviewItem: CreateReviewDto, userId: string) {
    const cabin = await this.prismaService.cabin.findUnique({
      where: { id: reviewItem.cabinId },
      select: { id: true, numReviews: true },
    });

    if (!cabin) {
      throw new Error(`Cabin with ID ${reviewItem.cabinId} not found.`);
    }

    const booking = await this.prismaService.booking.findUnique({
      where: { id: reviewItem.bookingId },
      select: { id: true },
    });

    if (!booking) {
      throw new Error(`Booking with ID ${reviewItem.bookingId} not found.`);
    }

    const review = await this.prismaService.reviews.create({
      data: {
        userId,
        cabinId: cabin.id,
        bookingId: booking.id,
        rating: reviewItem.rating,
        comment: reviewItem.comment,
      },
    });

    // Update the booking to indicate it has a review
    await this.prismaService.booking.update({
      where: { id: booking.id },
      data: { hasReview: true },
    });

    // Increment numReviews on the cabin
    await this.prismaService.cabin.update({
      where: { id: cabin.id },
      data: {
        numReviews: cabin.numReviews + 1,
      },
    });

    // 🔄 Recalculate and update the average rating
    const reviewStats = await this.prismaService.reviews.aggregate({
      where: { cabinId: cabin.id },
      _avg: { rating: true },
    });

    await this.prismaService.cabin.update({
      where: { id: cabin.id },
      data: {
        rating: reviewStats._avg.rating || 0,
      },
    });

    return review;
  }

  async getReviewsByCabinId(cabinId: string) {
    try {
      const reviews = await this.prismaService.reviews.findMany({
        where: {
          cabinId: cabinId,
        },
        include: {
          user: true,
        },
      });
      return reviews;
    } catch (error) {
      throw new Error('Unable to fetch reviews');
    }
  }
}
