import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStockRequestDTO {
  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Restock from supplier' })
  @IsString()
  reason: string;
}

export class AdjustStockRequestDTO {
  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  newQuantity: number;

  @ApiProperty({ example: 'Manual correction' })
  @IsString()
  reason: string;
}

export class CheckAvailabilityRequestDTO {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  quantity: number;
}
