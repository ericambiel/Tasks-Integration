import 'reflect-metadata';
import { CronJob } from 'cron';
import { randomUUID } from 'crypto';
import {
  ICronSchedulerFacade,
  IDefaults,
  IScheduledJobDetail,
  IScheduleJob,
  IScheduleOptions,
  IScheduleOptions2,
} from '@shared/facades/ICronSchedulerFacede';
import ConsoleLog from '@libs/ConsoleLog';
import api from '../../vendor/config/api';
import AppError from '../../vendor/erros/AppError';

const apiConfig = api();

export default class CronSchedulerFacade implements ICronSchedulerFacade {
  private readonly scheduledJobs: IScheduleJob[] = [];

  /**
   * @description By default, the Jobs will be performed at every minute.
   * @param jobFunc A function passed as a Cron Job
   * @param options If an object of type IScheduleOptions  is not used the standard cron format " * * * * * " for schedules
   * */
  private static jobFactory(
    jobFunc: (...args: never[]) => unknown,
    /** @default * * * * * */
    options?: IScheduleOptions | IScheduleOptions2,
  ): IScheduleJob {
    let validatedOptions = '* * * * *';

    if (typeof options !== 'undefined') {
      if ('minute' in options)
        validatedOptions = [
          options?.minute ?? '*',
          options?.hour ?? '*',
          options?.dayOfMonth ?? '*',
          options?.month ?? '*',
          options?.dayOfWeek ?? '*',
        ].join(' ');
      else if ('cronTime' in options && options.cronTime)
        validatedOptions = options.cronTime;
    }

    const message =
      validatedOptions === '* * * * *'
        ? 'This Job routine is schedule at every minute as default!'
        : `This Job routine is schedule as ${JSON.stringify(options)}`;

    ConsoleLog.print(message, 'info', 'cron', apiConfig.SILENT_MODE);

    const job = new CronJob(
      validatedOptions,
      jobFunc,
      null,
      true,
      'Brazil/West',
    );

    return {
      code: options?.code ?? randomUUID(),
      description: options?.description,
      job,
    };
  }

  /**
   * Make a new Job and scheduling it.
   * @param jobFunc Job function to schedule
   * @param options Options to schedule
   * @author Eric Ambiel
   */
  public jobMaker(
    jobFunc: (...args: never[]) => unknown,
    options?: IScheduleOptions | IScheduleOptions2,
  ): void {
    const newOptions: IScheduleOptions = {
      ...options,
      code: this.validateCode({ code: options?.code }),
    };

    const newJob = CronSchedulerFacade.jobFactory(jobFunc, newOptions);

    newJob.job.start();

    this.scheduledJobs.push(newJob);
  }

  /**
   * Get all scheduler jobs details
   * @param options
   * @author Eric Ambiel
   */
  public getScheduledJobsDetails(options?: IDefaults[]): IScheduledJobDetail[] {
    let { scheduledJobs } = this;
    if (options) scheduledJobs = this.foundScheduledJob(options);

    return scheduledJobs.map(jobScheduled => {
      return <IScheduledJobDetail>{
        code: jobScheduled.code,
        description: jobScheduled.description,
        isRunning: jobScheduled.job.running,
        lastExecutionDate: jobScheduled.job.lastDate(),
        nextExecutionsDate: jobScheduled.job.nextDate(),
      };
    });
  }

  /**
   * Stop scheduled job
   * @param options
   */
  public stopScheduledJobs(options: IDefaults[]): IScheduledJobDetail[] {
    const scheduledJobs = this.foundScheduledJob(options);

    if (scheduledJobs.length === 0)
      throw new AppError([{ message: `No scheduled jobs found` }]);

    scheduledJobs.forEach(scheduledJob => scheduledJob?.job.stop());

    return this.getScheduledJobsDetails(options);
  }

  private readonly foundScheduledJob = (options: IDefaults[]) =>
    this.scheduledJobs.filter(scheduledJob =>
      options.find(option => {
        if (option.code) return option.code === scheduledJob.code;
        return option.description === scheduledJob.description;
      }),
    );

  private validateCode({ code }: IDefaults): string | undefined {
    if (this.foundScheduledJob([{ code }]).length > 0)
      // TODO: Make sure if it is correct, if it to be called directly will presents error on console "Header not set"
      //  from Express
      throw new AppError([
        {
          message:
            'This code already exists, enter another one or do not fill it.',
        },
      ]);
    return code;
  }
}
