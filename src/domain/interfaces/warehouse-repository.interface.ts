import { Warehouse } from '../entities/warehouse.entity';

export interface IWarehouseRepository {
  findById(id: string): Promise<Warehouse | null>;
  findByCode(code: string): Promise<Warehouse | null>;
  findPrimary(): Promise<Warehouse | null>;
  findAll(): Promise<Warehouse[]>;
  findActive(): Promise<Warehouse[]>;
  save(warehouse: Warehouse): Promise<void>;
  update(warehouse: Warehouse): Promise<void>;
}
