import cron from 'node-cron';

type CronJob = {
  name: string;
  schedule: string;
  task: () => Promise<void>;
};

export const registerCronJob = ({ name, schedule, task }: CronJob) => {
  cron.schedule(schedule, async () => {
    console.log(`Running job: ${name}`);

    try {
      await task();
      console.log(`Job completed: ${name}`);
    } catch (err) {
      console.error(`Job failed: ${name}`, err);
    }
  });

  console.log(`Cron registered: ${name}`);
};
