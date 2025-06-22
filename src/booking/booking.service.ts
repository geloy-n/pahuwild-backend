import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma, Status } from '@prisma/client';
import { UserTokenPayload } from 'src/auth/token-payload';
import { updatedStatusDto } from './dto/updated-status.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(bookingItem: CreateBookingDto, userId: string) {
    const existingBooking = await this.prismaService.booking.findFirst({
      where: {
        userId: userId,
        cabinId: bookingItem.cabinId,
        status: {
          notIn: ['completed', 'cancelled'],
        },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'You already have an existing booking for this cabin.',
      );
    }

    // Check for overlapping bookings
    const checkInDate = new Date(bookingItem.checkInDate);
    const checkOutDate = new Date(bookingItem.checkOutDate);

    const overlappingBooking = await this.prismaService.booking.findFirst({
      where: {
        cabinId: bookingItem.cabinId,
        AND: [
          { checkInDate: { lte: checkOutDate } },
          { checkOutDate: { gte: checkInDate } },
        ],
      },
    });

    if (overlappingBooking) {
      throw new HttpException(
        'The cabin is already booked for the selected dates.',
        HttpStatus.CONFLICT,
      );
    }

    const total = new Prisma.Decimal(bookingItem.total);

    const booking = await this.prismaService.booking.create({
      data: {
        userId,
        cabinId: bookingItem.cabinId,
        checkInDate: checkInDate,
        checkInTime: bookingItem.checkInTime,
        checkOutDate: checkOutDate,
        checkOutTime: bookingItem.checkOutTime,
        nights: bookingItem.nights,
        total: total,
        firstName: bookingItem.firstName,
        lastName: bookingItem.lastName,
        email: bookingItem.email,
        phoneNumber: bookingItem.phoneNumber,
        requests: bookingItem.requests,
      },
    });

    return booking;
  }

  async getBookings(user: UserTokenPayload) {
    try {
      const bookingItems = await this.prismaService.booking.findMany({
        where: {
          userId: user.userId,
        },
        include: {
          cabin: true,
        },
      });
      return bookingItems;
    } catch (error) {
      throw new Error('Error fetching booking items');
    }
  }

  async getAllBookings(user: UserTokenPayload) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to view the booking',
      );
    }
    return this.prismaService.booking.findMany({
      include: {
        cabin: true,
      },
    });
  }

  async updateBookingStatus(
    id: string,
    updatedStatus: updatedStatusDto,
    user: UserTokenPayload,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to update the booking status',
      );
    }

    const status: Status = updatedStatus.status;

    return this.prismaService.booking.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }

  async updateBookingStatusCancel(
    id: string,
    updatedStatus: updatedStatusDto,
    user: UserTokenPayload,
  ) {
    const status: Status = updatedStatus.status;

    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== user.userId && user.role !== 'ADMIN') {
      throw new Error('You are not authorized to update this booking');
    }

    return this.prismaService.booking.update({
      where: { id },
      data: {
        status: status,
        isCancelledReason: updatedStatus.isCancelledReason,
        isCancelledBy: user.role,
      },
      include: { user: true },
    });
  }
}
