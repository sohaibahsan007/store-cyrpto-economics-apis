/* eslint-disable @typescript-eslint/no-explicit-any */
import { service } from '@loopback/core';
import {
  get,
  param,
  response
} from '@loopback/rest';
import { environment } from '../environments';
import { ITokenInfo, TokenInfoService } from '../services';
import { CurrencyUnit } from '../enum';

export class TokenInfoController {
  constructor(
    @service(TokenInfoService)
    public tokenInfoService : TokenInfoService,
  ) {}

  @get('/token/$store/info')
  @response(200, {
    description: 'Get $STORE Token Info',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: '$STORE Token Info',
          properties: {
            supply: {type: 'number'},
            marketCap: {
              type: 'object',
              properties: {
                usd: {type: 'number'},
                btc: {type: 'number'},
                eth: {type: 'number'},
              },
            },
            price: {
              type: 'object',
              properties: {
                usd: {type: 'number'},
                btc: {type: 'number'},
                eth: {type: 'number'},
              },
            },
          },
        }
      },
    },
  })
  async getTokenInfo(): Promise<ITokenInfo> {
    return this.tokenInfoService.getTokenInfo(environment.DEFAULT_TOKEN_SYMBOL);
  }

  @get('/token/$store/supply')
  @response(200, {
    description: 'Get $STORE Token Supply',
    content: {
      'application/json': {
        schema: {
          type: 'number',
          title: '$STORE Token Info',
        }
      },
    },
  })
  async getTokenSupply(): Promise<number> {
    return this.tokenInfoService.getTokenSupply(environment.DEFAULT_TOKEN_SYMBOL);
  }

  @get('/token/$store/price/{unit}',{
    description: 'Pass unit as usd, bitcoin or ethereum to get $STORE token market cap in that unit',
    responses: {},
  })
  @response(200, {
    description: 'Get $STORE Token Price',
    content: {
      'application/json': {
        schema: {
          type: 'number',
          title: '$STORE Token Info',
        }
      },
    },
  })
  async getTokenPrice(
    @param.path.string('unit') unit: CurrencyUnit,
  ): Promise<number> {
    return this.tokenInfoService.getTokenPrice(environment.DEFAULT_TOKEN_SYMBOL,unit);
  }

  @get('/token/$store/market_cap/{unit}',{
    description: 'Pass unit as usd, bitcoin or ethereum to get $STORE token market cap in that unit',
    responses: {},
  })
  @response(200, {
    description: 'Get $STORE Token Market Cap',
    content: {
      'application/json': {
        schema: {
          type: 'number',
          title: '$STORE Token Info',
        }
      },
    },
  })
  async getTokenMarketCap(
    @param.path.string('unit') unit: CurrencyUnit,
  ): Promise<number> {
    return this.tokenInfoService.getTokenMarketCap(environment.DEFAULT_TOKEN_SYMBOL,unit);
  }

}
