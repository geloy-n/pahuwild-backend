import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CabinService } from './cabin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { UserTokenPayload } from 'src/auth/token-payload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

@Controller('cabin')
export class CabinController {
  constructor(private readonly cabinService: CabinService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async addCabin(
    @Body() body: CreateCabinDto,
    @CurrentUser() user: UserTokenPayload,
  ) {
    return this.cabinService.addCabin(body, user);
  }

  @Post(':cabinId/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('imageFile', {
      storage: memoryStorage(),
    }),
  )
  async uploadCabinImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,

    @Body() body: { slug: string },
  ) {
    if (!body.slug) {
      throw new BadRequestException('Missing slug in request body');
    }

    const filename = `${body.slug}${extname(file.originalname)}`;
    const cabinsDir = join(process.cwd(), 'public', 'cabins');

    // ✅ Ensure 'public/cabins' exists
    if (!existsSync(cabinsDir)) {
      await mkdir(cabinsDir, { recursive: true });
    }

    const filepath = join(cabinsDir, filename);

    // ✅ Write the file
    await writeFile(filepath, file.buffer);

    return { success: true, filename };
  }
  @Get()
  async getAllCabins() {
    return this.cabinService.getAllCabins();
  }

  @Get('featured')
  async getFeaturedCabins() {
    return this.cabinService.getFeaturedCabins();
  }

  @Get('slug/:slug')
  async getCabinBySlug(@Param('slug') slug: string) {
    return this.cabinService.getCabinBySlug(slug);
  }

  @Get('id/:id')
  async getCabinById(@Param('id') id: string) {
    return this.cabinService.getCabinById(id);
  }

  @Patch(':id')
  async updateCabin(
    @Param('id') id: string,
    @Body() updateData: CreateCabinDto,
  ) {
    return this.cabinService.updateCabin(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCabin(@Param('id') id: string) {
    return this.cabinService.deleteCabin(id);
  }
}
