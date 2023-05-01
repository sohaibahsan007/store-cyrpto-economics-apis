/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { service } from '@loopback/core';
import { repository } from '@loopback/repository';
import { TokenInfoRepository } from '../repositories';
import { BaserowProvider, BaserowService, ResultsEntity, TokenInfo } from './baserow.service';


// baserow service, which will pull data using provider and push into database.
export class TokenPullService {

  constructor(
    @repository(TokenInfoRepository)
    private tokenInfoRepository: TokenInfoRepository,
    @service(BaserowProvider)
    private baserowProviderService: BaserowService,
  ) {

  }

  async pullTokenInfo(): Promise<void> {

    try {
      // pull token info from baserow
      const tokenInfo = await this.baserowProviderService.getTokenInfo();
      await this.pushTokenInfo(tokenInfo);
    } catch (error) {
      console.error('Pull Token Info Error: ', error);
    }
  }

  private async pushTokenInfo(tokenInfo: TokenInfo): Promise<void> {
    try {
      tokenInfo?.results?.forEach(async (token: ResultsEntity) => {
        // check if tokenInfo exists in database
        let tokenInfoExists = await this.tokenInfoRepository.findOne({
          where: { tokenId: token?.Token_ID }
        });
        // check for emtpy fields in token
        if (!token?.Token_ID || !token?.Token_Name || !token?.Token_Symbol || !token?.Token_Supply || !token?.Token_Type || !token?.Token_Price_Per_Bits || !token?.Token_Price_Per_USD) return;

        const _tokenInfo = {
          tokenId: token?.Token_ID,
          tokenName: token?.Token_Name,
          tokenSymbol: token?.Token_Symbol,
          tokenSupply: token?.Token_Supply,
          tokenType: token?.Token_Type,
          tokenPricePerBits: token?.Token_Price_Per_Bits,
          tokenPricePerUSD: parseFloat(token?.Token_Price_Per_USD),
        };
        if (tokenInfoExists) {
          await this.tokenInfoRepository.updateById(tokenInfoExists.id, _tokenInfo);
        } else {
          tokenInfoExists = await this.tokenInfoRepository.create(_tokenInfo);
        }
      });
    } catch (error) {
      console.error('Push Token Info Error: ', error);
    }

  }


}
