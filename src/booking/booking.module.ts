import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CabinModule } from 'src/cabin/cabin.module';

@Module({
  imports: [CabinModule, PrismaModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
