import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { UserTokenPayload } from 'src/auth/token-payload';
import { join } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class CabinService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCabins() {
    return this.prismaService.cabin.findMany();
  }

  async getCabinBySlug(slug: string) {
    try {
      return {
        ...(await this.prismaService.cabin.findFirstOrThrow({
          where: { slug: slug },
        })),
      };
    } catch (error) {
      throw new NotFoundException(`${slug} not found`);
    }
  }

  async getCabinById(id: string) {
    try {
      return {
        ...(await this.prismaService.cabin.findFirstOrThrow({
          where: { id: id },
        })),
      };
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async getFeaturedCabins() {
    return this.prismaService.cabin.findMany({
      where: { isFeatured: true },
    });
  }

  async addCabin(data: CreateCabinDto, user: UserTokenPayload) {
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Not allowed to add cabin');
    }
    const existingCabin = await this.prismaService.cabin.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { name: { equals: data.name, mode: 'insensitive' } }, // case-insensitive
        ],
      },
    });

    if (existingCabin) {
      throw new BadRequestException('A cabin with this name already exists');
    }

    return this.prismaService.cabin.create({
      data: {
        ...data,
      },
    });
  }

  async updateCabin(id: string, updateData: CreateCabinDto) {
    return this.prismaService.cabin.update({
      where: { id },
      data: {
        name: updateData.name,
        slug: updateData.slug,
        price: Number(updateData.price),
        guests: Number(updateData.guests),
        location: updateData.location,
        description: updateData.description,
        isFeatured: updateData.isFeatured,
        isAvailable: updateData.isAvailable,
        wifi: updateData.wifi,
        parking: updateData.parking,
        kitchen: updateData.kitchen,
        hotTub: updateData.hotTub,
        fireplace: updateData.fireplace,
        hiking: updateData.hiking,
      },
    });
  }

  async deleteCabin(id: string) {
    const cabin = await this.prismaService.cabin.findUnique({ where: { id } });

    if (!cabin) {
      throw new NotFoundException('Cabin not found');
    }

    await this.prismaService.reviews.deleteMany({
      where: { cabinId: id },
    });

    const filePath = join(process.cwd(), 'public/cabins', `${cabin.slug}.jpg`);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Image file could not be deleted: ${filePath}`, err.message);
    }

    return this.prismaService.cabin.delete({ where: { id } });
  }
}
