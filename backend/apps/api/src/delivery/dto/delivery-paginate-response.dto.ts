import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';
import { Pagination } from '../../paginate/entity/pagination';

export class DeliveryPaginate {
  @ApiProperty({
    description: 'Código único da entrega',
    example: 'JT-VJ2k',
  })
  code: string;

  @ApiProperty({
    description: 'Altura do pacote em cm',
    nullable: true,
    example: 15.5,
  })
  height?: number;

  @ApiProperty({
    description: 'Largura do pacote em cm',
    nullable: true,
    example: 20.0,
  })
  width?: number;

  @ApiProperty({
    description: 'Comprimento do pacote em cm',
    nullable: true,
    example: 30.0,
  })
  length?: number;

  @ApiProperty({
    description: 'Peso do pacote em kg',
    nullable: true,
    example: 2.5,
  })
  weight?: number;

  @ApiProperty({
    description: 'Informações adicionais sobre a entrega',
    example: 'Entregar no portão principal',
  })
  information: string;

  @ApiProperty({
    description: 'Indica se o item é frágil',
    example: false,
  })
  isFragile: boolean;

  @ApiProperty({
    description: 'Preço da entrega em reais',
    example: '92.45',
  })
  price: string;

  @ApiProperty({
    description: 'Email do destinatário',
    example: 'cliente@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Telefone do destinatário',
    example: '(16) 98853-2885',
  })
  telefone: string;

  @ApiProperty({
    description: 'Status atual da entrega',
    enum: DeliveryStatus,
    example: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @ApiProperty({
    description: 'Data e hora de conclusão da entrega',
    nullable: true,
    example: '2024-01-15T14:30:00Z',
  })
  completedAt?: Date;

  @ApiProperty({
    description: 'Tipo de veículo utilizado na entrega',
    example: 'Carro',
  })
  vehicleType: string;
}

export class DeliveryPaginateResponse extends Pagination<DeliveryPaginate> {
  @ApiProperty({
    description: 'Lista de entregas',
    type: Array<DeliveryPaginate>,
  })
  data: DeliveryPaginate[];
}
