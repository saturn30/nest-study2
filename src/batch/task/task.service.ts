import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  @Cron('10 * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Task Called');
  }

  @Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('Task Called by interval');
  }

  @Timeout('timeoutTask', 5000)
  handleTimeout() {
    this.logger.log('Task Called by timeout');
  }

  // 동적 태스크 생성 방식
  addCronJob() {
    const name = 'cronSample';
    const job = new CronJob('* * * * * *', () => {
      this.logger.warn('run!', name);
    });
    this.schedulerRegistry.addCronJob(name, job);
    this.logger.warn(`job ${name} added!`);
  }
}
