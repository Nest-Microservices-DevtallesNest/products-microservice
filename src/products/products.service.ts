import { PaginationDto } from './../common/dto/pagination.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(PaginationDto: PaginationDto) {
    const { page, limit } = PaginationDto;

    const totalPages = await this.product.count({ where: { available: true } });

    const lastPage = Math.ceil(totalPages / limit);
    return {
      data: this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        page,
        total: totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      data,
      where: { id },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    /* return this.product.delete({ where: { id } }); */

    const product = await this.product.update({
      data: { available: false },
      where: { id },
    });

    return product;
  }
}
