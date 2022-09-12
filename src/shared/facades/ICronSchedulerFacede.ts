import { CronJob } from 'cron';
import { Moment } from 'moment';

export interface IDefaults {
  /**
   * @description Assign a code to the Job, makes it easier to find later
   */
  code?: string;

  /**
   * @description Define description to a job.
   */
  description?: string;
}

/*
 * Available Cron patterns:
 * Asterisk. E.g. *
 * Ranges. E.g. 1-3,5
 * Steps. E.g. * /2
 */
export interface IScheduleOptions extends IDefaults {
  /**
   * @description This parameter supports a value between 0-59,
   * but it has '*' as its default value, just as in Crontab structure.
   * */
  minute?: string;

  /**
   * @description This parameter supports a value between 0-23,
   * but it has '*' as its default value, just as in Crontab structure.
   * */
  hour?: string;

  /**
   * @description This parameter supports a value between 1-31,
   * but it has '*' as its default value, just as in Crontab structure.
   * */
  dayOfMonth?: string;

  /**
   * @description This parameter supports a value between 1-12,
   * but it has '*' as its default value, just as in Crontab structure.
   * */
  month?: string;

  /**
   * @description This parameter supports a value between 0-6,
   * but it has '*' as its default value, just as in Crontab structure.
   * */
  dayOfWeek?: string;
}

export interface IScheduleOptions2 extends IDefaults {
  cronTime?: string;
}

export interface IScheduleJob extends IDefaults {
  job: CronJob;
}

export interface IScheduledJobDetail extends IDefaults {
  isRunning?: boolean;
  lastExecutionDate: Date;
  nextExecutionsDate: Moment;
}

export interface ICronSchedulerFacade {
  jobMaker(jobFunc: () => unknown, options?: IScheduleOptions): void;
  getScheduledJobsDetails(options?: IDefaults[]): IScheduledJobDetail[];
  stopScheduledJobs(options: IDefaults[]): IScheduledJobDetail[];
}
