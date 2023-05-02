import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TokenInfoWithRelations} from '../models';
import {TokenInfoRepository} from '../repositories';
import {BaserowProvider, BaserowService, ResultsEntity, TokenInfo} from './baserow.service';

// Baserow service, which will pull data using provider and push into database.
export class TokenPullService {
  constructor(
    @repository(TokenInfoRepository)
    private readonly tokenInfoRepository: TokenInfoRepository,
    @service(BaserowProvider)
    private readonly baserowProviderService: BaserowService,
  ) { }

  // Pull token info from Baserow datasource
  async pullTokenInfo(): Promise<TokenInfo | undefined> {
    try {
      // Pull token info from Baserow
      const tokenInfo = await this.baserowProviderService.getTokenInfo();
      await this.pushTokenInfo(tokenInfo);
      return tokenInfo;
    } catch (error) {
      console.error('Pull Token Info Error: ', error);
      return undefined;
    }
  }

  // Push token info into database
  private async pushTokenInfo(tokenInfo: TokenInfo): Promise<void> {
    const tokensToUpdate: TokenInfoWithRelations[] = [];
    tokenInfo?.results?.forEach((token: ResultsEntity) => {
      // Check for empty fields in token
      if (token?.Token_ID && token?.Token_Supply && token?.Token_Price_Per_USD) {
        tokensToUpdate.push({
          tokenId: token.Token_ID,
          tokenName: token.Token_Name,
          tokenSymbol: token.Token_Symbol,
          tokenSupply: token.Token_Supply,
          tokenType: token.Token_Type,
          tokenPricePerUSD: parseFloat(token.Token_Price_Per_USD),
          updatedOn: new Date(),
        } as TokenInfoWithRelations);
      }
    });
    await Promise.all(
      tokensToUpdate.map(async (token) => {
        try {
          const tokenInfoExists = await this.tokenInfoRepository.findOne({
            where: {tokenId: token.tokenId},
          });
          if (tokenInfoExists) {
            await this.tokenInfoRepository.updateById(tokenInfoExists.id, token);
          } else {
            await this.tokenInfoRepository.create(token);
          }
        } catch (error) {
          console.error('Push Token Info Error: ', error);
        }
      })
    );
  }
}
