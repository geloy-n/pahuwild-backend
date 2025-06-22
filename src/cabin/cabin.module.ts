import { Module } from '@nestjs/common';
import { CabinService } from './cabin.service';
import { CabinController } from './cabin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CabinService],
  controllers: [CabinController],
  exports: [CabinService],
})
export class CabinModule {}
