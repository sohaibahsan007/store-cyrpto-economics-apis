import { repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import { TokenInfo } from "../models";
import { CryptoPricesRepository, TokenInfoRepository } from "../repositories";
import { CurrencyUnit } from "../enum";

export interface ITokenInfo{
  supply: number;
  marketCap: ITokenPrice;
  price: ITokenPrice
}

export interface ITokenPrice{
  usd: number;
  bitcoin: number;
  ethereum: number;
}

export class TokenInfoService {

  constructor(
    @repository(CryptoPricesRepository)
    private cryptoPricesRepository: CryptoPricesRepository,
    @repository(TokenInfoRepository)
    private tokenInfoRepository: TokenInfoRepository,
  ) {
  }

  async getTokenInfo(tokenId: string): Promise<ITokenInfo>{

    const {tokenSupply, tokenPricePerUSD} = await this.getTokenById(tokenId);

    const btcPrice = await this.getCryptoTokenPrice(CurrencyUnit.BITCOIN);
    const ethPrice = await this.getCryptoTokenPrice(CurrencyUnit.ETHEREUM);

    return {
      supply: tokenSupply,
      // putting tokenSupply as circulating supply for now
      marketCap: {
        usd: tokenSupply * tokenPricePerUSD,
        bitcoin: tokenSupply * this.convertTokenPrice(tokenPricePerUSD, btcPrice),
        ethereum: tokenSupply * this.convertTokenPrice(tokenPricePerUSD, ethPrice)
      },
      price: {
        usd: tokenPricePerUSD,
        bitcoin: this.convertTokenPrice(tokenPricePerUSD, btcPrice),
        ethereum: this.convertTokenPrice(tokenPricePerUSD, ethPrice),
      }
    }

  }
  async getTokenSupply(tokenId: string): Promise<number>{
    const {tokenSupply} = await this.getTokenById(tokenId);
    return tokenSupply;
  }
  async getTokenMarketCap(tokenId: string,unit: CurrencyUnit): Promise<number>{
    const {tokenSupply,tokenPricePerUSD} = await this.getTokenById(tokenId);
    return this.getPriceByUnit((tokenSupply * tokenPricePerUSD),unit);
  }
  async getTokenPrice(tokenId: string,unit: CurrencyUnit): Promise<number>{
    const {tokenPricePerUSD} = await this.getTokenById(tokenId);
    return this.getPriceByUnit(tokenPricePerUSD,unit);
  }

  // get crypto token price from crypto prices table
  private async getCryptoTokenPrice(tokenId: string): Promise<number>{
    const tokenInfo = await this.cryptoPricesRepository.findOne({
      where: { tokenId }
    });
    return tokenInfo?.tokenPricePerUSD ?? 0;
  }

  private async getPriceByUnit(basePriceUSD: number, unit: CurrencyUnit){
    switch (unit) {
      case CurrencyUnit.USD:
      return basePriceUSD;
      default:
        return this.convertTokenPrice(basePriceUSD, await this.getCryptoTokenPrice(unit));
    }
  }
  // convert token price to other crypto price using base value, which can convert $STORE to eth or btc.
  private convertTokenPrice(basePrice: number, toConvertIntoPrice: number): number{
    return (basePrice / toConvertIntoPrice) || 0;
  }

  // get token info from token info table
  private async getTokenById(tokenId: string): Promise<TokenInfo>{
    const tokenInfo = await this.tokenInfoRepository.findOne({
      where: { tokenId }
    });

    if (!tokenInfo) {
      throw new HttpErrors.NotFound(`Token Info not found for tokenId: ${tokenId}`);
    }
    return tokenInfo;
  }
}
