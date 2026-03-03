import { Injectable } from '@nestjs/common';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../../../domain/interfaces/warehouse-repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Warehouse | null> {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    return warehouse ? this.toDomain(warehouse) : null;
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { code } });
    return warehouse ? this.toDomain(warehouse) : null;
  }

  async findPrimary(): Promise<Warehouse | null> {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: { isPrimary: true },
    });
    return warehouse ? this.toDomain(warehouse) : null;
  }

  async findAll(): Promise<Warehouse[]> {
    const warehouses = await this.prisma.warehouse.findMany();
    return warehouses.map((w) => this.toDomain(w));
  }

  async findActive(): Promise<Warehouse[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { isActive: true },
    });
    return warehouses.map((w) => this.toDomain(w));
  }

  async save(warehouse: Warehouse): Promise<void> {
    await this.prisma.warehouse.create({
      data: {
        id: warehouse.id,
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address,
        city: warehouse.city,
        country: warehouse.country,
        isActive: warehouse.isActive,
        isPrimary: warehouse.isPrimary,
        createdAt: warehouse.createdAt,
        updatedAt: warehouse.updatedAt,
      },
    });
  }

  async update(warehouse: Warehouse): Promise<void> {
    await this.prisma.warehouse.update({
      where: { id: warehouse.id },
      data: {
        isActive: warehouse.isActive,
        isPrimary: warehouse.isPrimary,
        updatedAt: warehouse.updatedAt,
      },
    });
  }

  private toDomain(data: any): Warehouse {
    return new Warehouse(
      data.id,
      data.name,
      data.code,
      data.address,
      data.city,
      data.country,
      data.isActive,
      data.isPrimary,
      data.createdAt,
      data.updatedAt,
    );
  }
}
