/* eslint-disable @typescript-eslint/no-explicit-any */

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CryptoPricesRepository} from '../repositories';
import {CryptoPricesProvider, CryptoPricesService} from './crypto-prices.service';


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
      return undefined;
    }
  }

  private async parseCryptoPrices(cyrptoPrices: object): Promise<void> {
    try {
      const {bitcoin, ethereum} = cyrptoPrices as any;
      // push bitcoin and ethereum prices into database
      await this.pushCryptoPrices('bitcoin', bitcoin.usd ?? 1);

      await this.pushCryptoPrices('ethereum', ethereum.usd ?? 1);
    } catch (error) {
      console.error('Push CryptoPrices Info Error: ', error);
    }

  }

  private async pushCryptoPrices(tokenId: string, price: number) {
    try {
      // check if tokenInfo exists in database
      let tokenInfoExists = await this.cryptoPricesRepository.findOne({
        where: {tokenId}
      });
      if (tokenInfoExists) {
        await this.cryptoPricesRepository.updateById(tokenInfoExists.id, {
          tokenId,
          tokenPricePerUSD: price,
          updatedOn: new Date()
        });
      } else {
        tokenInfoExists = await this.cryptoPricesRepository.create({
          tokenId,
          tokenPricePerUSD: price,
        });
      }
    } catch (error) {
      console.error('Push CryptoPrices Info Error: ', error);
    }
  }


}
