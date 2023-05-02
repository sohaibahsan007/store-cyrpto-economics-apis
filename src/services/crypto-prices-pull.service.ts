import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CryptoPricesRepository} from '../repositories';
import {CryptoPricesProvider, CryptoPricesService, ICryptoPrices} from './crypto-prices.service';




// baserow service, which will pull data using provider and push into database.
export class CryptoPricesPullService {

  constructor(
    @repository(CryptoPricesRepository)
    private cryptoPricesRepository: CryptoPricesRepository,
    @service(CryptoPricesProvider)
    private cryptoPricesService: CryptoPricesService,
  ) {

  }

  async pullCryptoPrices(): Promise<object | undefined> {

    try {
      // pull prices from coingecko datasource
      const prices = await this.cryptoPricesService.getCryptoPrices();
      await this.parseCryptoPrices(prices);
      return prices;

    } catch (error) {
      console.error('Pull CryptoPrices Info Error: ', error);
      throw new HttpErrors.InternalServerError('Pull CryptoPrices Info Error: ' + error);
    }
  }

  private async parseCryptoPrices(cyrptoPrices: ICryptoPrices): Promise<void> {
    try {

      const {bitcoin = {usd: 1}, ethereum = {usd: 1}} = cyrptoPrices;

      // push bitcoin and ethereum prices into database
      await this.saveCryptoPricesToDatabase('bitcoin', bitcoin.usd ?? 1);
      await this.saveCryptoPricesToDatabase('ethereum', ethereum.usd ?? 1);
    } catch (error) {
      console.error('Push CryptoPrices Info Error: ', error);
      throw new HttpErrors.InternalServerError('Push CryptoPrices Info Error: ' + error,);
    }

  }

  private async saveCryptoPricesToDatabase(tokenId: string, price: number) {
    try {
      // check if tokenInfo exists in database
      let existingTokenInfo = await this.cryptoPricesRepository.findOne({
        where: {tokenId}
      });
      if (existingTokenInfo) {
        await this.cryptoPricesRepository.updateById(existingTokenInfo.id, {
          tokenId,
          tokenPricePerUSD: price,
          updatedOn: new Date()
        });
      } else {
        existingTokenInfo = await this.cryptoPricesRepository.create({
          tokenId,
          tokenPricePerUSD: price,
        });
      }
    } catch (error) {
      console.error('Push CryptoPrices Info Error: ', error);
    }
  }


}
