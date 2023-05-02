import {expect} from '@loopback/testlab';
import {CurrencyUnit} from '../../enum';
import {environment} from '../../environments';
import {CryptoPricesRepository, TokenInfoRepository} from '../../repositories';
import {TokenInfoService} from '../../services';
import {testdb} from '../test-helper';

describe('TokenInfoService', function (this: Mocha.Suite) {
  let tokenInfoRepository: TokenInfoRepository;
  let cryptoPricesRepository: CryptoPricesRepository;
  let tokenInfoService: TokenInfoService;

  before('setupApplication', async () => {
    tokenInfoRepository = new TokenInfoRepository(testdb);
    cryptoPricesRepository = new CryptoPricesRepository(testdb);
    (tokenInfoService = new TokenInfoService(
      cryptoPricesRepository,
      tokenInfoRepository
    ));

    // create dummy token and crypto data.
    await tokenInfoRepository.create({
      tokenId: environment.DEFAULT_TOKEN_SYMBOL,
      tokenName: environment.DEFAULT_TOKEN_SYMBOL,
      tokenSymbol: environment.DEFAULT_TOKEN_SYMBOL,
      tokenType: 'ERC-20',
      tokenSupply: 10000,
      tokenPricePerUSD: 0.39
    });

    await cryptoPricesRepository.create({
      tokenId: 'bitcoin',
      tokenPricePerUSD: 20000
    });

    await cryptoPricesRepository.create({
      tokenId: 'ethereum',
      tokenPricePerUSD: 20000
    })
  });

  it('get token info', async () => {
    // check if data is pulled from baserow
    const tokenInfo = await tokenInfoService.getTokenInfo(environment.DEFAULT_TOKEN_SYMBOL);
    expect(tokenInfo).to.not.be.undefined();
  });

  it('get token supply', async () => {
    // check if data is pulled from baserow
    const result = await tokenInfoService.getTokenSupply(environment.DEFAULT_TOKEN_SYMBOL);
    expect(result).to.not.be.undefined();
  });

  it('get token market cap', async () => {
    // check if data is pulled from baserow
    const result = await tokenInfoService.getTokenMarketCap(environment.DEFAULT_TOKEN_SYMBOL, CurrencyUnit.USD);
    expect(result).to.not.be.undefined();

    // check if data is pulled from baserow
    const result2 = await tokenInfoService.getTokenMarketCap(environment.DEFAULT_TOKEN_SYMBOL, CurrencyUnit.ETHEREUM);
    expect(result2).to.not.be.undefined();
  });

  it('get token price', async () => {
    // check if data is pulled from baserow
    const result = await tokenInfoService.getTokenPrice(environment.DEFAULT_TOKEN_SYMBOL, CurrencyUnit.USD);
    expect(result).to.not.be.undefined();

    // check if data is pulled from baserow
    const result2 = await tokenInfoService.getTokenPrice(environment.DEFAULT_TOKEN_SYMBOL, CurrencyUnit.ETHEREUM);
    expect(result2).to.not.be.undefined();
  });
});
