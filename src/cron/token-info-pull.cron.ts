/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
import { service } from '@loopback/core';
import { cronJob, CronJob } from '@loopback/cron';
import { TokenPullService } from '../services';

@cronJob()
export class TokenInfoPullCronJob extends CronJob {
  constructor(
    @service(TokenPullService)
    private tokenPullService: TokenPullService,
  ) {
    super({
      name: 'token-info-pull-cron',
      onTick: async () => {
        try {
          console.info('Token Info Pull Job started');
          await this.tokenPullService.pullTokenInfo().then();
          console.info('Token Info Pull finished');
        } catch (error) {
          console.error('Token Info Pull Error', error);
        }
      },
      cronTime: '*/10 * * * * *', // Every 20 seconds
      // Starts the cron job as soon as application starts
      start: true,
      // Immediately fires onTick function
      runOnInit: false
    });
  }
}
