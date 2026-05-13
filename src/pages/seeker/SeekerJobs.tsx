import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getMatchedJobs, getJobs, applyForJob } from "../../services/api";
import type { JobMatch, Job } from "../../types";
import JobMatchCard from "../../components/features/JobMatchCard";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";
import { Sparkles, List } from "lucide-react";

type Tab = "matched" | "all";

export default function SeekerJobs() {
  const session = useAuthStore((s) => s.session);
  const [tab, setTab] = useState<Tab>("matched");
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  // Fetch AI-matched jobs
  const fetchMatches = useCallback(async () => {
    if (!session?.id) return;
    setLoadingMatch(true);
    try {
      const res = await getMatchedJobs(session.id);
      const data = res.data;
      setMatches(data.matches ?? []);
    } catch {
      toast.error("Failed to load matched jobs");
    } finally {
      setLoadingMatch(false);
    }
  }, [session?.id]);

  // Fetch all jobs
  const fetchAllJobs = useCallback(async () => {
    setLoadingAll(true);
    try {
      const res = await getJobs();
      setAllJobs(res.data.data ?? []);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (tab === "all" && allJobs.length === 0) {
      fetchAllJobs();
    }
  }, [tab, allJobs.length, fetchAllJobs]);

  const handleApply = async (jobId: string) => {
    if (!session?.id || applying) return;
    setApplying(jobId);
    try {
      await applyForJob(jobId, session.id);
      setApplied((prev) => new Set([...prev, jobId]));
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to apply";
      if (msg.includes("already applied")) {
        setApplied((prev) => new Set([...prev, jobId]));
        toast.error("You have already applied for this job");
      } else {
        toast.error(msg);
      }
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark">Job Board</h2>
        <p className="text-text-sub text-sm mt-1">
          Jobs ranked by how well they match your skills, location, and
          experience
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-light-gray p-1 rounded-xl w-fit">
        {[
          {
            id: "matched" as Tab,
            label: "Matched Jobs",
            icon: <Sparkles size={14} />,
          },
          { id: "all" as Tab, label: "All Jobs", icon: <List size={14} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold
              transition-all duration-200
              ${
                tab === t.id
                  ? "bg-white text-dark shadow-sm"
                  : "text-muted hover:text-dark"
              }
            `}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Matched jobs tab ── */}
      {tab === "matched" && (
        <>
          {loadingMatch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-16 text-center">
              <p className="text-5xl mb-4">🤖</p>
              <p className="font-bold text-dark text-lg">No matches yet</p>
              <p className="text-text-sub text-sm mt-2 max-w-xs mx-auto">
                Complete your profile with more skills and preferences to get
                better AI matches
              </p>
            </div>
          ) : (
            <>
              {/* Match count header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 rounded-full">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {matches.length} AI-matched job
                    {matches.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-text-sub text-sm">
                  Ranked by compatibility with your profile
                </p>
              </div>

              {/* Job cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {matches.map((match) => (
                  <JobMatchCard
                    key={match.job_id}
                    match={match}
                    onApply={handleApply}
                    applying={applying === match.job_id}
                    applied={applied.has(match.job_id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── All jobs tab ── */}
      {tab === "all" && (
        <>
          {loadingAll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : allJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-16 text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="font-bold text-dark text-lg">No jobs available</p>
              <p className="text-text-sub text-sm mt-2">
                Check back soon — traders post new jobs daily
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allJobs.map((job) => {
                // Convert Job to JobMatch shape for the card
                const asMatch: JobMatch = {
                  job_id: job._id,
                  title: job.title,
                  match_score: 0,
                  match_percentage: 0,
                  matched_skills: [],
                  score_breakdown: {
                    skills_score: 0,
                    category_score: 0,
                    location_score: 0,
                    language_score: 0,
                    experience_score: 0,
                  },
                  pay_amount: job.payAmount,
                  pay_frequency: job.payFrequency,
                  state: job.state,
                  market_location: job.marketLocation,
                };
                return (
                  <div key={job._id} className="relative">
                    {/* No match badge for unscored cards */}
                    <JobMatchCard
                      match={asMatch}
                      onApply={handleApply}
                      applying={applying === job._id}
                      applied={applied.has(job._id)}
                    />
                    {/* Category + skills overlay */}
                    <div className="absolute bottom-20 left-6 right-6">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-dark/5 text-text-sub px-2 py-0.5 rounded-full capitalize">
                          {job.category}
                        </span>
                        {job.skillsRequired?.slice(0, 2).map((sk) => (
                          <span
                            key={sk}
                            className="text-xs bg-light-gray text-text-sub px-2 py-0.5 rounded-full"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
