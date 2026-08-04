export interface Job {
  id: string;
  type: 'deploy' | 'ssl_renew' | 'backup' | 'mail_queue_flush';
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  createdAt: string;
}

const jobQueue: Job[] = [];

export function addJob(type: Job['type'], payload: any): Job {
  const job: Job = {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    payload,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  jobQueue.push(job);
  console.log(`[Worker Queue] Added job ${job.id} (${job.type})`);
  processNextJob();
  return job;
}

async function processNextJob() {
  const pendingJob = jobQueue.find(j => j.status === 'pending');
  if (!pendingJob) return;

  pendingJob.status = 'processing';
  console.log(`[Worker Queue] Processing job ${pendingJob.id} (${pendingJob.type})...`);

  // Simulate background task processing
  setTimeout(() => {
    pendingJob.status = 'completed';
    pendingJob.result = { success: true, processedAt: new Date().toISOString() };
    console.log(`[Worker Queue] Job ${pendingJob.id} finished successfully.`);
  }, 1000);
}

export function getJobStatus(id: string): Job | undefined {
  return jobQueue.find(j => j.id === id);
}
