import axios from "axios";

export const api = axios.create({
  baseURL: "https://kasuwaconnect-backend.onrender.com",
  timeout: 25000,
  headers: { "Content-Type": "application/json" },
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const checkPhone = (phone: string) =>
  api.get(`/api/auth/check/${phone}`);

export const loginUser = (phone: string, pin: string) =>
  api.post("/api/auth/login", { phone, pin });

// ── Traders ───────────────────────────────────────────────────────────────────
export const registerTrader = (data: Record<string, unknown>) =>
  api.post("/api/traders/register", data);

export const getTrader = (id: string) => api.get(`/api/traders/${id}`);

export const getTraderSummary = (id: string) =>
  api.get(`/api/transactions/summary/${id}`);

export const getTraderTransactions = (id: string, page = 1) =>
  api.get(`/api/transactions/trader/${id}?page=${page}&limit=20`);

// ── Job Seekers ───────────────────────────────────────────────────────────────
export const registerJobSeeker = (data: Record<string, unknown>) =>
  api.post("/api/jobseekers/register", data);

export const getJobSeeker = (id: string) => api.get(`/api/jobseekers/${id}`);

export const getSeekerEarnings = (id: string) =>
  api.get(`/api/transactions/seeker/${id}`);

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const getJobs = (params?: Record<string, string>) =>
  api.get("/api/jobs", { params });

export const getMatchedJobs = (seekerId: string) =>
  api.get(`/api/jobs/matches/${seekerId}`);

export const getJob = (id: string) => api.get(`/api/jobs/${id}`);

export const createJob = (data: Record<string, unknown>) =>
  api.post("/api/jobs", data);

export const applyForJob = (jobId: string, seekerId: string) =>
  api.post(`/api/jobs/${jobId}/apply`, { seekerId });

export const getApplicants = (jobId: string) =>
  api.get(`/api/jobs/${jobId}/applicants`);

export const hireApplicant = (jobId: string, seekerId: string) =>
  api.post(`/api/jobs/${jobId}/hire`, { seekerId });

// ── Payments ──────────────────────────────────────────────────────────────────
export const payWorker = (data: Record<string, unknown>) =>
  api.post("/api/payments/payout", data);

export const getPayoutHistory = (traderId: string) =>
  api.get(`/api/payments/history/${traderId}`);

// ── Transactions ──────────────────────────────────────────────────────────────
export const simulatePayment = (virtualAccountNumber: string, amount: number) =>
  api.get("/api/webhooks/test-fire", {
    params: { virtualAccountNumber, amount },
  });
