import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { loginDestination } from "../../../utils/workspace";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Scale,
  HardHat,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/common/Button";

export default function LoginPage({ portal = "BUYER" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    user: currentUser,
    loading: sessionLoading,
    logout,
  } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  const autofillDemo = (eMail, pWord) => {
    setEmail(eMail);
    setPassword(pWord);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email.trim(), password, portal);
      if (!response.success || !response.user || !response.token) {
        throw new Error(
          response.message || "Unable to sign in. Please try again.",
        );
      }
      navigate(loginDestination(response.user.role, from), { replace: true });
    } catch (err) {
      if (err.status === 401 && portal === "BUYER") {
        navigate("/register", {
          state: { email: email.trim(), from, loginFailed: true },
        });
        return;
      }
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid login credentials. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-mono">
          <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying active session...</span>
        </div>
      </div>
    );
  }

  if (currentUser && currentUser.role !== portal) {
    return (
      <div className="max-w-lg mx-auto p-8 my-12 rounded-2xl glass-panel space-y-5">
        <h1 className="text-2xl font-bold">{portal.toLowerCase()} login</h1>
        <p>
          You are signed in as {currentUser.role.toLowerCase()}. Sign out to use
          a different account for this portal.
        </p>
        <button className="btn-primary rounded-xl px-4 py-3" onClick={logout}>
          Sign out and switch account
        </button>
        <Link
          className="block text-cyan-300"
          to={loginDestination(currentUser.role)}
        >
          Return to your workspace
        </Link>
      </div>
    );
  }
  if (currentUser) {
    return <Navigate to={loginDestination(currentUser.role, from)} replace />;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Intro */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border-t border-white/40 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Bank<span className="text-accent-cyan">Auctions</span>
              <span className="text-xs text-accent-cyan font-mono ml-1">
                .ai
              </span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {portal.charAt(0) + portal.slice(1).toLowerCase()} login
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Sign in with your assigned {portal.toLowerCase()} account.
          </p>
        </div>

        {/* Card Form */}
        <GlassCard className="p-7 sm:p-8 border-white/[0.1] shadow-2xl">
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs sm:text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form
            aria-busy={loading}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="login-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2"
              >
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  name="email"
                  autoComplete="username"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-[11px] font-mono uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick Buyer Demo Access
            </p>
            <button
              type="button"
              onClick={() => autofillDemo("buyer@bankauctions.ai", "Buyer@123")}
              className="w-full px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 text-left transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Fill Verified Buyer Account
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">Autofill Credentials →</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                buyer@bankauctions.ai / Buyer@123
              </div>
            </button>
          </div>

          {/* Operational & Staff Logins Directory */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Staff &amp; Authority Portals
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Dedicated Ports</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Staff panels run on isolated standalone ports with role-specific authentication:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="http://localhost:5174/admin/login"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-purple-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                    Admin
                  </span>
                  <span className="text-[9px] font-mono text-purple-400">:5174</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@bankauctions.ai</div>
              </a>

              <a
                href="http://localhost:5175/checker/login"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/30 hover:border-teal-400 hover:bg-teal-500/10 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-teal-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    Checker
                  </span>
                  <span className="text-[9px] font-mono text-teal-400">:5175</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">checker@bankauctions.ai</div>
              </a>

              <a
                href="http://localhost:5176/advocate/login"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    Advocate
                  </span>
                  <span className="text-[9px] font-mono text-amber-400">:5176</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">advocate@bankauctions.ai</div>
              </a>

              <a
                href="http://localhost:5177/engineer/login"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-orange-300 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-orange-400" />
                    Engineer
                  </span>
                  <span className="text-[9px] font-mono text-orange-400">:5177</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">engineer@bankauctions.ai</div>
              </a>
            </div>
          </div>

          {portal === "BUYER" && (
            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-slate-400">
              Don't have an investor account?{" "}
              <Link
                to="/register"
                state={{ email: email.trim(), from }}
                className="text-accent-cyan font-semibold hover:underline"
              >
                Create an account
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
