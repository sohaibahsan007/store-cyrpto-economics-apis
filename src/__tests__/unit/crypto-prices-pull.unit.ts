/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from '@loopback/testlab';
import {CryptoPricesDataSource} from '../../datasources';
import {CryptoPricesRepository} from '../../repositories';
import {CryptoPricesProvider, CryptoPricesPullService, CryptoPricesService} from '../../services';
import {testdb} from '../test-helper';

describe('CryptoPricesPullService', function (this: Mocha.Suite) {
  let cryptoPricesPullService: CryptoPricesPullService;
  let cryptoPricesService: CryptoPricesService;
  let cryptoPricesRepository: CryptoPricesRepository;
  let dataSource: CryptoPricesDataSource;

  before('setupApplication', async () => {
    dataSource = new CryptoPricesDataSource();
    cryptoPricesRepository = new CryptoPricesRepository(testdb);
  });

  it('pull data from coingecko', async () => {
    // setup baserow provider service and token pull service
    cryptoPricesService = await new CryptoPricesProvider(dataSource).value();
    (cryptoPricesPullService = new CryptoPricesPullService(
      cryptoPricesRepository,
      cryptoPricesService
    ));

    // check if data is pulled from baserow
    const tokenInfo = await cryptoPricesPullService.pullCryptoPrices();
    expect(tokenInfo).to.not.be.undefined();
  });

  it('pull data from coingecko - error handling', async () => {
    // setup baserow provider service and token pull service
    cryptoPricesService = new CryptoPricesProvider() as any;
    (cryptoPricesPullService = new CryptoPricesPullService(
      cryptoPricesRepository,
      cryptoPricesService,
    ));

    // check if data is pulled from baserow
    const tokenInfo = await cryptoPricesPullService.pullCryptoPrices();
    expect(tokenInfo).to.be.undefined();
  });

  it('push data into database', async () => {
    // setup baserow provider service and token pull service
    cryptoPricesService = await new CryptoPricesProvider(dataSource).value();
    (cryptoPricesPullService = new CryptoPricesPullService(
      cryptoPricesRepository,
      cryptoPricesService,
    ));

    // sample data to check
    const prices = {
      bitcoin: {
        usd: 2000
      },
      ethereum: {
        usd: 3000
      }
    };

    // check if data is pulled from baserow and created
    const result = await (cryptoPricesPullService as any).parseCryptoPrices(prices);
    expect(result).to.be.undefined();


    // check if it's created.
    const ifExist = await cryptoPricesRepository.find();
    expect(ifExist).to.not.be.undefined();

    // check if data is pulled from baserow and updated
    // check if data is pulled from baserow
    const resultUpdate = await (cryptoPricesPullService as any).parseCryptoPrices(prices);
    expect(resultUpdate).to.be.undefined();
  });
});
