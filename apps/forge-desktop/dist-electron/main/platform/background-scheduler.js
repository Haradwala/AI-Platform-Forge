"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundScheduler = void 0;
class BackgroundScheduler {
    maxConcurrent;
    id = 'BackgroundScheduler';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    queue = [];
    activeJobsCount = 0;
    startTime = Date.now();
    constructor(maxConcurrent = 4) {
        this.maxConcurrent = maxConcurrent;
    }
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            queueLength: this.queue.length,
            activeJobsCount: this.activeJobsCount,
        };
    }
    onStart() { }
    onRunning() { }
    onSuspend() { }
    onShutdown() {
        for (const job of this.queue) {
            job.status = 'cancelled';
        }
        this.queue.length = 0;
    }
    enqueue(job) {
        job.status = 'pending';
        job.progress = 0;
        this.queue.push(job);
        this.sortQueue();
        this.processQueue();
    }
    sortQueue() {
        const priorityWeights = {
            Critical: 4,
            High: 3,
            Normal: 2,
            Low: 1,
            Idle: 0,
        };
        this.queue.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
    }
    async processQueue() {
        if (this.activeJobsCount >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
        const job = this.queue.shift();
        this.activeJobsCount++;
        job.status = 'running';
        try {
            const timeoutPromise = job.timeout
                ? new Promise((_, reject) => setTimeout(() => reject(new Error('Job timeout exceeded')), job.timeout))
                : null;
            const runPromise = job.execute();
            if (timeoutPromise) {
                await Promise.race([runPromise, timeoutPromise]);
            }
            else {
                await runPromise;
            }
            job.status = 'completed';
            job.progress = 100;
        }
        catch (err) {
            job.status = 'failed';
            this.health = 'warning';
        }
        finally {
            this.activeJobsCount--;
            this.processQueue();
        }
    }
}
exports.BackgroundScheduler = BackgroundScheduler;
//# sourceMappingURL=background-scheduler.js.map