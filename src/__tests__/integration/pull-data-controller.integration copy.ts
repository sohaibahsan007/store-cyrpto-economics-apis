import {Client, expect} from '@loopback/testlab';
import {StoreCyrptoEconomicsApisApplication} from '../../application';
import {setupApplication} from '../test-helper';

describe('PUll Data Controller', () => {
  let app: StoreCyrptoEconomicsApisApplication;
  let client: Client;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes Post Token Info refresh /refresh/token-info', async () => {
    const res = await client.post('/refresh/token-info').expect(200);
    expect(res.body).to.not.be.undefined();
  });

  it('invokes Post Crypto Prices /refresh/crypto-prices', async () => {
    const res = await client.post('/refresh/crypto-prices').expect(200);
    expect(res.body).to.not.be.undefined();
  });
});
