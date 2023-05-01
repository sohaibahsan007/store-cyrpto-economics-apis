/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
import { service } from '@loopback/core';
import { cronJob, CronJob } from '@loopback/cron';
import { CryptoPricesPullService, TokenPullService } from '../services';

@cronJob()
export class PullDataCronJob extends CronJob {
  constructor(
    @service(TokenPullService)
    private tokenPullService: TokenPullService,
    @service(CryptoPricesPullService)
    private cryptoPricesPullService: CryptoPricesPullService,
  ) {
    super({
      name: 'pull-data-cron-job',
      onTick: async () => {

        // pull token info from baserow
        try {
          console.info('Token Info Pull Job started');
          await this.tokenPullService.pullTokenInfo().then();
          console.info('Token Info Pull finished');
        } catch (error) {
          console.error('Token Info Pull Error', error);
        }


        // pull crypto prices from coingecko
        try {
          console.info('CryptoPrices Pull Job started');
          await this.cryptoPricesPullService.pullCryptoPrices().then();
          console.info('CryptoPrices Pull finished');
        } catch (error) {
          console.error('CryptoPrices Pull Error', error);
        }
      },
      cronTime: '0 */1 * * * *', // Every minute
      // Starts the cron job as soon as application starts
      start: true,
      // Immediately fires onTick function
      runOnInit: false
    });
  }
}
