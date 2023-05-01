import { model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model()
export class CryptoPrices extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  tokenId: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'double precision',
      dataScale: 6,
    },
  })
  tokenPricePerUSD: number;

  constructor(data?: Partial<CryptoPrices>) {
    super(data);
  }
}

export interface CryptoPricesRelations {
  // describe navigational properties here
}

export type CryptoPricesWithRelations = CryptoPrices & CryptoPricesRelations;
