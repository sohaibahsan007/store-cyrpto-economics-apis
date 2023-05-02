import {juggler} from '@loopback/repository';
import {
  Client, createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {StoreCyrptoEconomicsApisApplication} from '../application';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new StoreCyrptoEconomicsApisApplication({
    rest: restConfig,
    disableConsoleLog: true,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: StoreCyrptoEconomicsApisApplication;
  client: Client;
}

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'db',
  connector: 'memory',
});
