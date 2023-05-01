/* eslint-disable @typescript-eslint/no-explicit-any */
import { service } from '@loopback/core';
import {
  HttpErrors,
  post,
  response
} from '@loopback/rest';
import { CryptoPricesPullService, TokenPullService } from '../services';

export class PullDataController {
  constructor(
    @service(TokenPullService)
    private tokenPullService: TokenPullService,
    @service(CryptoPricesPullService)
    private cryptoPricesPullService: CryptoPricesPullService,
  ) {}

  @post('/refresh/token-info')
  @response(200, {
    description: 'Token Info refresh status',
    content: {'application/json': {
      schema: {
        type: 'string',
        description: 'Crypto Prices refresh status',
      }
    }
    },
  })
  async refreshTokenInfo(): Promise<string> {
    try {
      await this.tokenPullService.pullTokenInfo();
      return 'Token Info refresh completed';
    } catch (error) {
      throw new HttpErrors.InternalServerError(error);
    }
  }

  @post('/refresh/crypto-prices')
  @response(200, {
    description: 'Crypto Prices refresh status',
    content: {'application/json': {
      schema: {
        type: 'string',
        description: 'Crypto Prices refresh status',
      }
    }
    },
  })
  async refreshCryptoPrices(): Promise<string> {
    try {
      await this.cryptoPricesPullService.pullCryptoPrices();
      return 'Crypto Prices refresh completed';
    } catch (error) {
      throw new HttpErrors.InternalServerError(error);
    }
  }
}
