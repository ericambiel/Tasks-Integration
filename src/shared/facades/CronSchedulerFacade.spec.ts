import CronSchedulerFacade from '@shared/facades/CronSchedulerFacade';
import { container } from 'tsyringe';
import {
  IDefaults,
  IScheduledJobDetail,
} from '@shared/facades/ICronSchedulerFacede';
import { sleep } from '@shared/helpers/smallHelper';

describe('Unity Test Cron Scheduler Facade', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  let cronScheduler: CronSchedulerFacade;
  const codeGenerator = () => Math.floor(Math.random() * 999999);

  const jobs: IDefaults[] = [
    {
      description: 'First Job',
    },
    {
      description: 'Job with the same description',
    },
    {
      code: `myPersonalCode: ${codeGenerator()}`,
      description: 'Job with the same description',
    },
    { code: `myPersonalCode: ${codeGenerator()}`, description: 'Third Job' },
  ];

  const jobFunction = () =>
    console.log(`This is a message from scheduled Job: ${codeGenerator()}`);

  beforeAll(() => {
    consoleSpy.mockClear();
  });

  beforeEach(() => {
    cronScheduler = container.resolve(CronSchedulerFacade);

    jobs.forEach(job => cronScheduler.jobMaker(jobFunction, job));
  });

  it('Should be possible to schedule a Job', async () => {
    jest.setTimeout(60000);

    const jobFunction2 = () => console.log('Cron Job was scheduled.');

    cronScheduler.jobMaker(jobFunction2);

    await sleep(60000);

    expect(console.log).toBeCalledTimes(jobs.length + 1);
    expect(console.log).toHaveBeenCalledWith('Cron Job was scheduled.');
  });

  it('Should be possible list all Scheduled Jobs', () => {
    const jobsDetails = cronScheduler.getScheduledJobsDetails();
    expect(jobsDetails).toEqual(jobs.map(job => expect.objectContaining(job)));
  });

  it('Should be possible list Scheduled Jobs by filter', () => {
    // Bring all Jobs with 'Job with the same description'.
    const jobsSameDescription = cronScheduler.getScheduledJobsDetails([
      { description: jobs[1].description },
    ]);

    expect(jobsSameDescription).toEqual(
      expect.arrayContaining([
        expect.objectContaining(jobs[1]),
        expect.objectContaining(jobs[2]),
      ]),
    );

    // Bring only one, specific by code.
    const jobsCode = cronScheduler.getScheduledJobsDetails([jobs[2]]);
    expect(jobsCode).toHaveLength(1);
    expect(jobsCode).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: jobs[2].code })]),
    );
  });

  it('Should be possible STOP Scheduled Jobs by code', () => {
    const jobsDetails = cronScheduler.getScheduledJobsDetails();

    cronScheduler.stopScheduledJobs([jobsDetails[0], jobsDetails[3]]);

    const stoppedJob = cronScheduler.getScheduledJobsDetails([
      jobsDetails[0],
      jobsDetails[3],
    ]);

    expect(stoppedJob).toEqual(
      expect.arrayContaining([
        expect.objectContaining(<IScheduledJobDetail>{
          ...jobsDetails[0],
          isRunning: false,
        }),
        expect.objectContaining(<IScheduledJobDetail>{
          ...jobsDetails[3],
          isRunning: false,
        }),
      ]),
    );
  });

  it('Should be possible validade wrong codes', () => {
    const valideCode = jest.spyOn(
      CronSchedulerFacade.prototype as any,
      'valideCode',
    );

    cronScheduler.jobMaker(jobFunction, {
      code: '564asdf564as56f',
    });

    // Try add a new Job with the same code before
    expect(() =>
      cronScheduler.jobMaker(jobFunction, {
        code: '564asdf564as56f',
      }),
    ).toThrow(
      expect.objectContaining({
        errors: [
          {
            message:
              'This code already exists, enter another one or do not fill it.',
          },
        ],
      }),
    );

    expect(valideCode).toHaveBeenCalled(); // Was called in validation code
  });
});
