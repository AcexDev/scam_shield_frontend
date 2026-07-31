"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "@/components/ui/Shield";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Suspense } from "react";

function OAuthHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (!access || !refresh) {
      setError("Missing tokens in callback URL. Please try signing in again.");
      setStatus("error");
      return;
    }

    // Save tokens using the same keys as AuthProvider
    localStorage.setItem("ss_access", access);
    localStorage.setItem("ss_refresh", refresh);
    window.dispatchEvent(new Event("storage"));

    setStatus("success");

    // Brief success flash, then redirect home
    const t = setTimeout(() => router.replace("/"), 1200);
    return () => clearTimeout(t);
  }, [params, router]);

  return (
    <div className="fixed inset-0 dark:bg-[#0A0E1A] bg-[#EEF2FF] flex items-center justify-center p-4">
      <div
        className="glass rounded-3xl p-10 flex flex-col items-center gap-5 text-center border border-white/10 max-w-sm w-full"
        style={{ boxShadow: "0 0 80px rgba(0,212,255,0.08)" }}
      >
        <Shield
          size={72}
          pulse={status === "loading"}
          scanning={status === "loading"}
        />

        {status === "loading" && (
          <>
            <p
              className="text-base font-semibold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Completing sign-in…
            </p>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] dot1" />
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] dot2" />
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] dot3" />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={32} className="text-emerald-400" />
            <div>
              <p
                className="text-base font-semibold text-emerald-400"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Signed in with Google
              </p>
              <p className="text-xs opacity-40 mt-1">Redirecting you now…</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle size={32} className="text-red-400" />
            <div>
              <p
                className="text-base font-semibold text-red-400"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Sign-in failed
              </p>
              <p className="text-xs opacity-50 mt-1 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => router.replace("/login")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/15 hover:bg-white/5 transition-colors"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// useSearchParams requires Suspense in Next.js App Router
export default function OAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 dark:bg-[#0A0E1A] bg-[#EEF2FF] flex items-center justify-center">
          <Shield size={72} pulse scanning />
        </div>
      }
    >
      <OAuthHandler />
    </Suspense>
  );
}
