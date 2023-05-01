import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreCryptoEconomicsApiDataSource} from '../datasources';
import {CryptoPrices, CryptoPricesRelations} from '../models';

export class CryptoPricesRepository extends DefaultCrudRepository<
  CryptoPrices,
  typeof CryptoPrices.prototype.id,
  CryptoPricesRelations
> {
  constructor(
    @inject('datasources.Store_Crypto_Economics_API') dataSource: StoreCryptoEconomicsApiDataSource,
  ) {
    super(CryptoPrices, dataSource);
  }
}
