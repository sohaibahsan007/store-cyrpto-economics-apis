import {Client, expect} from '@loopback/testlab';
import {StoreCyrptoEconomicsApisApplication} from '../../application';
import {CurrencyUnit} from '../../enum';
import {setupApplication} from '../test-helper';

describe('Token Info Controller', () => {
  let app: StoreCyrptoEconomicsApisApplication;
  let client: Client;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes Get $STORE Token Info /token/$store/info', async () => {
    const res = await client.get('/token/$store/info').expect(200);
    expect(res.body).to.not.be.undefined();
  });

  it('invokes Get $STORE Token Supply /token/$store/supply', async () => {
    const res = await client.get('/token/$store/supply').expect(200);
    expect(res.body).to.not.be.undefined();
  });

  it('invokes Get $STORE Token Price /token/$store/price/', async () => {
    const res = await client.get(`/token/$store/price/${CurrencyUnit.USD}`).expect(200);
    expect(res.body).to.not.be.undefined();
  });

  it('invokes Get $STORE Token Market Cap /token/$store/market_cap', async () => {
    const res = await client.get(`/token/$store/market_cap/${CurrencyUnit.USD}`).expect(200);
    expect(res.body).to.not.be.undefined();
  });


});
