import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserTokenPayload } from '../auth/token-payload';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from './booking.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { updatedStatusDto } from './dto/updated-status.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBookings(@CurrentUser() user: UserTokenPayload) {
    return this.bookingService.getBookings(user);
  }

  @Get('all-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllBookings(@CurrentUser() user: UserTokenPayload) {
    return this.bookingService.getAllBookings(user);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Body() body: CreateBookingDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    const newBooking = await this.bookingService.createBooking(
      body,
      user.userId,
    );

    return {
      message: 'Booking Added Successfully',
      bookingItem: newBooking,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateBookingStatus(
    @CurrentUser() user: UserTokenPayload,
    @Param('id') id: string,
    @Body() updatedStatus: updatedStatusDto,
  ) {
    return this.bookingService.updateBookingStatus(id, updatedStatus, user);
  }

  @Patch(':id/status/cancel')
  @UseGuards(JwtAuthGuard)
  async updateBookingStatusCancel(
    @CurrentUser() user: UserTokenPayload,
    @Param('id') id: string,
    @Body() updatedStatus: updatedStatusDto,
  ) {
    return this.bookingService.updateBookingStatusCancel(
      id,
      updatedStatus,
      user,
    );
  }
}
