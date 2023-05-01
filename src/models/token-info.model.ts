import { model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model()
export class TokenInfo extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  tokenId: string;

  @property({
    type: 'string',
  })
  tokenName?: string;

  @property({
    type: 'string',
  })
  tokenSymbol?: string;

  @property({
    type: 'string',
  })
  tokenType?: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'integer',
      nullable: 'NO'
    },
  })
  tokenSupply: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      dataType: 'double precision',
      dataScale: 6,
    },
  })
  tokenPricePerUSD: number;

  constructor(data?: Partial<TokenInfo>) {
    super(data);
  }
}

export interface TokenInfoRelations {
  // describe navigational properties here
}

export type TokenInfoWithRelations = TokenInfo & TokenInfoRelations;
