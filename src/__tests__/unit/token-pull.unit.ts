/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {expect} from '@loopback/testlab';
import {BaserowDataSource} from '../../datasources';
import {TokenInfoRepository} from '../../repositories';
import {BaserowProvider, TokenPullService} from '../../services';
import {testdb} from '../test-helper';
import {BaserowService, TokenInfo} from './../../services/baserow.service';

describe('TokenPullService', function (this: Mocha.Suite) {
  let tokenPullService: TokenPullService;
  let baserowProviderService: BaserowService;
  let tokenInfoRepository: TokenInfoRepository;
  let dataSource: BaserowDataSource;

  before('setupApplication', async () => {
    dataSource = new BaserowDataSource();
    tokenInfoRepository = new TokenInfoRepository(testdb);

  });

  it('pull data from baserow', async () => {
    // setup baserow provider service and token pull service
    baserowProviderService = await new BaserowProvider(dataSource).value();
    (tokenPullService = new TokenPullService(
      tokenInfoRepository,
      baserowProviderService,
    ));
    // check if data is pulled from baserow
    const tokenInfo = await tokenPullService.pullTokenInfo();
    expect(tokenInfo).to.not.be.undefined();
  });

  it('pull data from baserow - error handling', async () => {
    // setup baserow provider service and token pull service
    baserowProviderService = new BaserowProvider() as any;
    (tokenPullService = new TokenPullService(
      tokenInfoRepository,
      baserowProviderService,
    ));

    // check if data is pulled from baserow
    const tokenInfo = await tokenPullService.pullTokenInfo();
    expect(tokenInfo).to.be.undefined();
  });

  it('push data into database', async () => {
    // setup baserow provider service and token pull service
    baserowProviderService = await new BaserowProvider(dataSource).value();
    (tokenPullService = new TokenPullService(
      tokenInfoRepository,
      baserowProviderService,
    ));

    // sample data to check
    const tokenInfo: TokenInfo = {
      count: 1,
      next: '',
      results: [{
        id: 1,
        order: '1',
        Token_ID: "TST",
        Token_Name: 'Test Token',
        Token_Symbol: 'TT',
        Token_Supply: 100,
        Token_Type: 'ERC20',
        Token_Price_Per_USD: "1000"
      }]
    }
    // check if data is pulled from baserow and created
    const result = await (tokenPullService as any).pushTokenInfo(tokenInfo);
    expect(result).to.be.undefined();


    // check if it's created.
    const ifExist = await tokenInfoRepository.find();
    expect(ifExist).to.not.be.undefined();

    // check if data is pulled from baserow and updated
    // check if data is pulled from baserow
    const resultUpdate = await (tokenPullService as any).pushTokenInfo(tokenInfo);
    expect(resultUpdate).to.be.undefined();
  });
});
