export interface Translation {
  id: number;
  job_id: string;
  target_lang: string;
  translated_content: string | null;
  lint_status: string;
  qa_status: string;
  quality_score: number;
  is_fallback: boolean;
  feedback_log: string[];
  attempts: number;
}

export interface Job {
  id: string;
  status: string;
  source_lang: string;
  target_langs: string[];
  source_content: string;
  created_at: string;
  updated_at: string;
  translations: Translation[];
  approved_by?: string | null;
  approval_notes?: string | null;
}

// Vite 개발서버(47080)는 백엔드 포트(47081)를 직접 호출한다. 운영 경로는
// Edge가 `/lingo`를 제거하므로 브라우저 URL에 맞춰 접두를 붙인다.
export function apiBaseFor(pathname: string, port: string): string {
  if (port === "47080") return "http://localhost:47081/api";
  const prefix = pathname === "/lingo" || pathname.startsWith("/lingo/") ? "/lingo" : "";
  return `${prefix}/api`;
}

const API_BASE = apiBaseFor(window.location.pathname, window.location.port);

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error("잡 목록 조회 실패");
  return res.json();
}

export async function getJobDetail(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error("잡 상세 정보 조회 실패");
  return res.json();
}

export async function createJob(sourceContent: string, targetLangs: string[]): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_content: sourceContent, target_langs: targetLangs }),
  });
  if (!res.ok) throw new Error("번역 잡 생성 실패");
  return res.json();
}

export async function approveJob(jobId: string, notes?: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error("번역 승인 처리 실패");
  return res.json();
}

export async function deleteJob(jobId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("잡 삭제 실패");
}
