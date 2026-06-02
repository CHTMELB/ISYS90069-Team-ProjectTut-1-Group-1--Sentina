import { useState, useEffect } from "react";
import sentinalLogo from "@/imports/Sentina_Logo.png";
import {
  Home, BarChart2, Users, User, Bell, Watch, Heart, Moon,
  Footprints, Shield, Phone, CheckCircle2, AlertTriangle,
  TrendingDown, TrendingUp, ArrowLeft, Search, Flag,
  FileText, Settings, Loader2, Minus, ChevronLeft,
  ChevronRight, Clipboard, Info, Baby, MessageCircle, Send, LogOut,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, ReferenceLine,
  ResponsiveContainer, Tooltip,
} from "recharts";

// ── TYPES ──────────────────────────────────────────────────────────────────
type InterfaceId = "patient" | "clinician" | "mch";
type PatientScreen =
  | "welcome" | "login" | "account" | "consent" | "wearable" | "setup"
  | "home" | "checkin" | "epds" | "timeline" | "crisis" | "family" | "profile" | "messages";
type ClinicianScreen = "launch" | "patients" | "detail" | "alerts" | "careplans" | "reports" | "settings";
type MCHScreen = "launch" | "flags" | "assessment" | "history" | "mchsettings";

// ── DATA ───────────────────────────────────────────────────────────────────
const EPDS_QUESTIONS = [
  { q: "I have been able to laugh and see the funny side of things", rev: true },
  { q: "I have looked forward with enjoyment to things", rev: true },
  { q: "I have blamed myself unnecessarily when things went wrong", rev: false },
  { q: "I have been anxious or worried for no good reason", rev: false },
  { q: "I have felt scared or panicky for no very good reason", rev: false },
  { q: "Things have been getting on top of me", rev: false },
  { q: "I have been so unhappy that I have had difficulty sleeping", rev: false },
  { q: "I have felt sad or miserable", rev: false },
  { q: "I have been so unhappy that I have been crying", rev: false },
  { q: "The thought of harming myself has occurred to me", rev: false },
];
const EPDS_OPTS = ["Yes, most of the time", "Yes, some of the time", "Not very often", "No, never"];

const TL12 = [
  { w: "W1", epds: 8, passive: 10 }, { w: "W2", epds: 8, passive: 11 },
  { w: "W3", epds: 9, passive: 12 }, { w: "W4", epds: 9, passive: 13 },
  { w: "W5", epds: 10, passive: 14 }, { w: "W6", epds: 10, passive: 15 },
  { w: "W7", epds: 11, passive: 16 }, { w: "W8", epds: 11, passive: 17 },
  { w: "W9", epds: 12, passive: 19 }, { w: "W10", epds: 13, passive: 20 },
  { w: "W11", epds: 14, passive: 21 }, { w: "W12", epds: 16, passive: 23 },
];

const TL16 = [
  { w: "W1", epds: 7, passive: 9 }, { w: "W2", epds: 7, passive: 10 },
  { w: "W3", epds: 8, passive: 10 }, { w: "W4", epds: 8, passive: 11 },
  { w: "W5", epds: 8, passive: 12 }, { w: "W6", epds: 9, passive: 12 },
  { w: "W7", epds: 9, passive: 13 }, { w: "W8", epds: 10, passive: 14 },
  { w: "W9", epds: 10, passive: 15 }, { w: "W10", epds: 11, passive: 16 },
  { w: "W11", epds: 11, passive: 17 }, { w: "W12", epds: 12, passive: 19 },
  { w: "W13", epds: 13, passive: 20 }, { w: "W14", epds: 13, passive: 21 },
  { w: "W15", epds: 14, passive: 22 }, { w: "W16", epds: 16, passive: 24 },
];

const SPARK = [
  { w: 1, v: 8 }, { w: 2, v: 9 }, { w: 3, v: 10 }, { w: 4, v: 11 },
  { w: 5, v: 12 }, { w: 6, v: 13 }, { w: 7, v: 14 }, { w: 8, v: 16 },
];

const MOOD_HISTORY = [
  { day: "Mon", mood: 4 },
  { day: "Tue", mood: 5 },
  { day: "Wed", mood: 3 },
  { day: "Thu", mood: 3 },
  { day: "Fri", mood: 2 },
  { day: "Sat", mood: null },
  { day: "Sun", mood: null },
];

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────
const SentinaLogo = ({ className = "" }: { className?: string }) => (
  <img src={sentinalLogo} alt="Sentina" className={className} />
);

function RiskBadge({ level }: { level: "high" | "monitor" | "stable" }) {
  const map = {
    high: { bg: "#D64045", label: "High Risk" },
    monitor: { bg: "#F5A623", label: "Monitor" },
    stable: { bg: "#2ECC71", label: "Stable" },
  };
  return (
    <span className="px-3 py-0.5 rounded-full text-[12px] font-bold text-white"
      style={{ backgroundColor: map[level].bg }}>
      {map[level].label}
    </span>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors shrink-0 overflow-hidden"
      style={{ backgroundColor: on ? "#1F7A8C" : "#D1D5DB" }}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200
        ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

// ── PATIENT APP ────────────────────────────────────────────────────────────
function MobileShell({ children, screen, onNav }: {
  children: React.ReactNode; screen: PatientScreen; onNav: (s: PatientScreen) => void;
}) {
  const showNav = !["welcome", "login", "account", "consent", "wearable", "setup", "crisis"].includes(screen);
  const NAV = [
    { id: "home" as PatientScreen, Icon: Home, label: "Home", badge: 0 },
    { id: "timeline" as PatientScreen, Icon: BarChart2, label: "Timeline", badge: 0 },
    { id: "messages" as PatientScreen, Icon: MessageCircle, label: "Messages", badge: 1 },
    { id: "family" as PatientScreen, Icon: Baby, label: "Infant", badge: 0 },
    { id: "profile" as PatientScreen, Icon: User, label: "Profile", badge: 0 },
  ];
  return (
    <div className="flex items-start justify-center py-4 bg-gray-200 min-h-full">
      <div className="relative w-[390px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
        style={{ height: 844 }}>
        <div className="flex justify-between items-center px-6 pt-3 pb-1 text-[11px] font-semibold">
          <span>9:41</span>
          <div className="flex gap-1">●●● WiFi 🔋</div>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
        {showNav && (
          <div className="flex justify-around items-center px-2 py-2 bg-white border-t border-gray-200 h-[60px] shrink-0">
            {NAV.map(({ id, Icon, label, badge }) => {
              const active = screen === id;
              return (
                <button key={id} onClick={() => onNav(id)} className="flex flex-col items-center gap-0.5 w-[58px] relative">
                  <div className="relative">
                    <Icon size={22} color={active ? "#1F7A8C" : "#9CA3AF"} />
                    {badge > 0 && screen !== id && (
                      <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#D64045] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px]" style={{ color: active ? "#1F7A8C" : "#9CA3AF" }}>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TealHeader({ title, showBack, onBack, right }: {
  title?: string; showBack?: boolean; onBack?: () => void; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center px-4 py-1.5 bg-[#1F7A8C] h-[60px] shrink-0 gap-2">
      {showBack ? (
        <button onClick={onBack} className="text-white shrink-0"><ArrowLeft size={20} /></button>
      ) : (
        <SentinaLogo className="h-11 w-auto object-contain brightness-0 invert shrink-0" />
      )}
      {title && (
        <span className="text-white font-bold text-[17px] flex-1 text-center"
          style={{ marginRight: showBack ? 0 : 28 }}>{title}</span>
      )}
      {!title && <div className="flex-1" />}
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

// Screen 1 — Welcome
function WelcomeScreen({ onNext, onLogin }: { onNext: () => void; onLogin: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <SentinaLogo className="w-[280px] object-contain" />
      </div>
      <div className="w-full flex flex-col gap-3">
        <button onClick={onNext} className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl">
          Get started
        </button>
        <button onClick={onLogin} className="text-[#1F7A8C] text-[14px] font-semibold text-center py-1">
          I already have an account
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Shield size={13} color="#9CA3AF" />
          <span className="text-[12px] text-[#9CA3AF]">Your privacy is protected by design</span>
        </div>
      </div>
    </div>
  );
}

// Login Screen
function LoginScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [biometricState, setBiometricState] = useState<"idle" | "scanning" | "success">("idle");

  function handleBiometric() {
    setBiometricState("scanning");
    setTimeout(() => {
      setBiometricState("success");
      setTimeout(onLogin, 700);
    }, 1400);
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={onBack} className="text-[#1F7A8C]"><ArrowLeft size={22} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-5 pb-8">
        {/* Logo */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <SentinaLogo className="w-[180px] object-contain" />
        </div>

        <div>
          <p className="text-[#1A5C6B] font-bold text-[24px]">Welcome back</p>
          <p className="text-[#6B7280] text-[14px] mt-1">Sign in to your Sentina account</p>
        </div>

        {/* Email / password */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">Email address</p>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#1F7A8C]"
            />
          </div>
          <div>
            <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">Password</p>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#1F7A8C]"
            />
            <button className="text-[#1F7A8C] text-[13px] font-semibold mt-2 text-right w-full">
              Forgot password?
            </button>
          </div>
          <button onClick={onLogin}
            className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl mt-1">
            Sign in
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[#9CA3AF] text-[12px]">or sign in with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Biometric */}
        <div className="flex flex-col items-center gap-3">
          <button onClick={handleBiometric}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md
              ${biometricState === "success" ? "bg-[#2ECC71]"
                : biometricState === "scanning" ? "bg-[#1F7A8C] animate-pulse"
                : "bg-[#E8F4F6] active:scale-95"}`}>
            {biometricState === "success" ? (
              <CheckCircle2 size={40} color="white" />
            ) : (
              <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                {/* Fingerprint SVG */}
                <path d="M24 8C15.16 8 8 15.16 8 24" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 8C32.84 8 40 15.16 40 24" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 24c0-4.42 3.58-8 8-8s8 3.58 8 8c0 5-2 10-8 14" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M32 24c0 3-0.5 6-2 9" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 24c0-2.21 1.79-4 4-4s4 1.79 4 4c0 4-1 8-4 11" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 20c0 0 0 8-2 13" stroke={biometricState === "scanning" ? "white" : "#1F7A8C"} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
          <p className="text-[#1A5C6B] font-semibold text-[14px]">
            {biometricState === "success" ? "Authenticated!" : biometricState === "scanning" ? "Scanning…" : "Use Face ID / Fingerprint"}
          </p>
          <p className="text-[#6B7280] text-[12px] text-center">
            Touch the button to authenticate with your device biometrics
          </p>
        </div>

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <Shield size={13} color="#9CA3AF" />
          <span className="text-[12px] text-[#9CA3AF]">Your privacy is protected by design</span>
        </div>
      </div>
    </div>
  );
}

// Screen 2 — Account Creation
function AccountScreen({ onNext }: { onNext: () => void }) {
  const [status, setStatus] = useState<"pregnant" | "postpartum">("postpartum");
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Create your account" showBack onBack={() => {}} />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB]">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          {[
            { label: "Full name", type: "text", placeholder: "Sarah Mitchell" },
            { label: "Email address", type: "email", placeholder: "sarah@example.com" },
            { label: "Password", type: "password", placeholder: "••••••••" },
            { label: "Date of birth", type: "date", placeholder: "" },
          ].map(({ label, type, placeholder }) => (
            <div key={label}>
              <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">{label}</p>
              <input type={type} placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#1F7A8C]" />
            </div>
          ))}
          <div>
            <p className="text-[#1A5C6B] text-[13px] font-bold mb-2">Are you currently:</p>
            <div className="flex gap-3">
              {(["pregnant", "postpartum"] as const).map(opt => (
                <label key={opt} onClick={() => setStatus(opt)} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${status === opt ? "border-[#1F7A8C]" : "border-gray-300"}`}>
                    {status === opt && <div className="w-2 h-2 rounded-full bg-[#1F7A8C]" />}
                  </div>
                  <span className="text-[14px] capitalize">{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">
                {status === "pregnant" ? "Gestational week" : "Weeks since birth"}
              </p>
              <input type="number" placeholder={status === "pregnant" ? "32" : "8"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#1F7A8C]" />
            </div>
          </div>
        </div>
        <button onClick={onNext} className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl mt-4">
          Continue
        </button>
      </div>
    </div>
  );
}

// Screen 3 — Four-Stream Consent
function ConsentScreen({ onNext }: { onNext: () => void }) {
  const [toggles, setToggles] = useState([true, true, true, false]);
  const [comprehension, setComprehension] = useState("");
  const CARDS = [
    { icon: "😊", bg: "#1F7A8C", title: "Daily mood check-ins", desc: "You log your mood and optional journal notes each day." },
    { icon: "📋", bg: "#1F7A8C", title: "Weekly EPDS screening", desc: "A 10-question clinical questionnaire completed once per week." },
    { icon: "⌚", bg: "#1F7A8C", title: "Passive wearable monitoring", desc: "Sentina reads HRV, sleep, heart rate, and steps from your wearable device. Only 4 signals are collected." },
    { icon: "👶", bg: "#F5A623", title: "Infant record linkage", desc: "Link your infant's My Health Record for integrated developmental surveillance." },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Before we begin" showBack onBack={() => {}} />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <p className="text-[#6B7280] text-[14px]">Sentina monitors four types of data. You control each one.</p>
        {CARDS.map((c, i) => (
          <div key={c.title} className="bg-white rounded-xl shadow-sm border-l-4 border-[#1F7A8C] p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: i === 3 ? "#FEF3C7" : "#E8F4F6" }}>
              {c.icon}
            </div>
            <div className="flex-1">
              <p className="text-[#1A5C6B] font-bold text-[15px]">{c.title}</p>
              <p className="text-[#6B7280] text-[13px] mt-0.5">{c.desc}</p>
            </div>
            <Toggle on={toggles[i]} onToggle={() => setToggles(t => t.map((v, j) => j === i ? !v : v))} />
          </div>
        ))}
        <div className="bg-[#E8F4F6] rounded-xl p-4">
          <p className="text-[#1A5C6B] font-bold text-[13px] mb-2">In your own words, what will Sentina monitor?</p>
          <textarea value={comprehension} onChange={e => setComprehension(e.target.value)}
            className="w-full border border-[#1F7A8C]/30 rounded-lg p-3 text-[14px] resize-none focus:outline-none focus:border-[#1F7A8C] bg-white"
            rows={3} placeholder="Type your answer here..." />
          <p className="text-[#6B7280] text-[11px] italic mt-1">This helps us confirm you understand your consent.</p>
        </div>
        <button onClick={onNext} className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl">
          I understand and agree
        </button>
      </div>
    </div>
  );
}

// Screen 4 — Wearable Connection
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1d1d1f">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function FitbitIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7">
      <circle cx="16" cy="5.5" r="2.5" fill="#00B0B9" />
      <circle cx="16" cy="26.5" r="2.5" fill="#00B0B9" />
      <circle cx="5.5" cy="16" r="2.5" fill="#00B0B9" />
      <circle cx="26.5" cy="16" r="2.5" fill="#00B0B9" />
      <circle cx="8.4" cy="8.4" r="2" fill="#00B0B9" />
      <circle cx="23.6" cy="23.6" r="2" fill="#00B0B9" />
      <circle cx="23.6" cy="8.4" r="2" fill="#00B0B9" />
      <circle cx="8.4" cy="23.6" r="2" fill="#00B0B9" />
      <circle cx="16" cy="16" r="3" fill="#00B0B9" />
    </svg>
  );
}

function GarminIcon() {
  return (
    <svg viewBox="0 0 40 24" className="w-10 h-6">
      <path d="M4 12 C4 6.48 8.48 2 14 2 L14 8 C11.79 8 10 9.79 10 12 C10 14.21 11.79 16 14 16 L14 22 C8.48 22 4 17.52 4 12Z" fill="#007DC5"/>
      <path d="M14 8 L20 8 L20 22 L14 22 L14 16 C16.21 16 18 14.21 18 12 C18 9.79 16.21 8 14 8Z" fill="#007DC5"/>
      <text x="22" y="16.5" fontSize="10" fontWeight="700" fill="#007DC5" fontFamily="Arial, sans-serif" letterSpacing="0.5">GARMIN</text>
    </svg>
  );
}

function WearableScreen({ onNext }: { onNext: () => void }) {
  const [connected, setConnected] = useState<string | null>(null);
  const DEVICES: { name: string; sub: string; Logo: () => JSX.Element; bg: string }[] = [
    { name: "Apple Watch", sub: "via Apple HealthKit", Logo: AppleIcon, bg: "#f5f5f7" },
    { name: "Fitbit", sub: "via OAuth 2.0", Logo: FitbitIcon, bg: "#e6f9fa" },
    { name: "Garmin", sub: "via OAuth 2.0", Logo: GarminIcon, bg: "#e8f2fb" },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Connect your wearable" showBack onBack={() => {}} />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <p className="text-[#6B7280] text-[14px]">Sentina will monitor HRV, sleep, heart rate, and steps — nothing else.</p>
        {DEVICES.map(d => (
          <div key={d.name} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: d.bg }}>
              <d.Logo />
            </div>
            <div className="flex-1">
              <p className="text-[#1A5C6B] font-bold text-[15px]">{d.name}</p>
              <p className="text-[#6B7280] text-[13px]">{d.sub}</p>
            </div>
            <button onClick={() => setConnected(d.name)}
              className={`px-4 py-1.5 border-[1.5px] border-[#1F7A8C] rounded-xl text-[13px] font-semibold transition-all
                ${connected === d.name ? "bg-[#1F7A8C] text-white" : "text-[#1F7A8C] bg-white"}`}>
              {connected === d.name ? "Connected ✓" : "Connect"}
            </button>
          </div>
        ))}
        <div className="bg-[#E8F4F6] rounded-xl p-3 flex items-center gap-2">
          <Shield size={16} color="#1F7A8C" className="shrink-0" />
          <p className="text-[#6B7280] text-[13px]">Only 4 signals are collected. No GPS or audio.</p>
        </div>
        <button onClick={onNext} className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl">
          {connected ? "Continue" : "Skip for now — connect later"}
        </button>
      </div>
    </div>
  );
}

// Screen 5 — Setup Complete
function SetupCompleteScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 bg-[#1F7A8C]">
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <SentinaLogo className="w-[160px] object-contain brightness-0 invert" />
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
          <CheckCircle2 size={44} color="#2ECC71" />
        </div>
        <div className="text-center flex flex-col gap-2">
          <p className="text-white font-bold text-[24px]">You are all set, Sarah</p>
          <p className="text-white text-[16px]" style={{ opacity: 0.85 }}>
            Sentina is now monitoring in the background.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Watch size={16} color="rgba(255,255,255,0.7)" />
            <p className="text-white text-[14px]" style={{ opacity: 0.7 }}>Apple Watch connected</p>
          </div>
        </div>
      </div>
      <button onClick={onNext}
        className="w-full h-[48px] border-2 border-white text-white font-bold text-[16px] rounded-xl">
        Go to home
      </button>
    </div>
  );
}

// Screen 6 — Home
function HomeScreen({ onCheckin, onEPDS, onCrisis }: {
  onCheckin: () => void; onEPDS: () => void; onCrisis: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader right={
        <button className="relative text-white" onClick={onCrisis}>
          <Bell size={20} color="white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D64045] rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
        </button>
      } />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#1F7A8C] shadow-sm flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#1F7A8C] ring-offset-2 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1778109303723-d474b7f6a278?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
              alt="Sarah Mitchell"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <p className="text-[#1A5C6B] font-bold text-[22px]">Good morning, Sarah</p>
            <p className="text-[#6B7280] text-[14px]">34 weeks postpartum</p>
          </div>
        </div>
        {/* 2-column check-in actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Daily Check-in */}
          <button onClick={onCheckin}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-start gap-2 text-left active:bg-[#E8F4F6] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E8F4F6] flex items-center justify-center text-xl">
              😊
            </div>
            <div>
              <p className="text-[#1A5C6B] font-bold text-[14px] leading-tight">Daily Check-in</p>
              <p className="text-[#6B7280] text-[12px] mt-0.5">How are you feeling today?</p>
            </div>
            <span className="text-[12px] font-semibold text-[#1F7A8C]">Tap to log →</span>
          </button>

          {/* Weekly EPDS */}
          <button onClick={onEPDS}
            className="bg-[#FEF3C7] rounded-xl shadow-sm p-4 flex flex-col items-start gap-2 text-left active:bg-[#FDE68A] transition-colors border border-[#F5A623]/30">
            <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 flex items-center justify-center">
              <Clipboard size={20} color="#F5A623" />
            </div>
            <div>
              <p className="text-[#1A5C6B] font-bold text-[14px] leading-tight">Weekly EPDS</p>
              <p className="text-[#6B7280] text-[12px] mt-0.5">10 questions · ~3 min</p>
            </div>
            <span className="text-[12px] font-semibold text-[#F5A623]">Due today →</span>
          </button>
        </div>
        {/* Mood history chart */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Mood This Week</p>
            <div className="flex items-center gap-1.5">
              <Dot color="#D64045" />
              <span className="text-[12px] text-[#D64045] font-medium">2 days missed</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={MOOD_HISTORY} barSize={26} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
              <XAxis key="mh-x" dataKey="day" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis key="mh-y" domain={[0, 5]} hide />
              <Tooltip
                key="mh-tip"
                cursor={{ fill: "#F8FAFB" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length || payload[0].value == null) return null;
                  const v = payload[0].value as number;
                  const emojis = ["", "😢", "😕", "😐", "🙂", "😊"];
                  return (
                    <div className="bg-white border border-gray-100 rounded-lg px-2 py-1 shadow text-[12px] text-[#1A2B32]">
                      {emojis[v]} Mood {v}/5
                    </div>
                  );
                }}
              />
              <Bar key="mh-bar" dataKey="mood" radius={[4, 4, 2, 2]}>
                {MOOD_HISTORY.map((entry, i) => (
                  <Cell
                    key={`mh-cell-${i}`}
                    fill={
                      entry.mood == null ? "#F3F4F6"
                      : entry.mood >= 4 ? "#2ECC71"
                      : entry.mood === 3 ? "#F5A623"
                      : "#D64045"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[
              { color: "#2ECC71", label: "Good (4–5)" },
              { color: "#F5A623", label: "Neutral (3)" },
              { color: "#D64045", label: "Low (1–2)" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-[#6B7280]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#E8F4F6] rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Dot color="#2ECC71" />
          <p className="text-[#1A5C6B] text-[13px] flex-1">Sentina is monitoring in the background</p>
          <p className="text-[#6B7280] text-[12px]">Apple Watch</p>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { Icon: Heart,      label: "HRV",      value: "62ms",   sub: "7-day avg" },
            { Icon: Moon,       label: "Sleep",     value: "7.2h",   sub: "7-day avg" },
            { Icon: Footprints, label: "Steps",     value: "6,840",  sub: "today" },
            { Icon: Heart,      label: "Rest HR",   value: "72bpm",  sub: "7-day avg" },
          ].map(({ Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-2 flex flex-col gap-0.5">
              <Icon size={13} color="#1F7A8C" />
              <p className="text-[#6B7280] text-[9px] leading-tight">{label}</p>
              <p className="text-[#1A5C6B] font-bold text-[12px] leading-tight">{value}</p>
              <p className="text-[#9CA3AF] text-[9px]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Screen 7 — Daily Check-in
function CheckInScreen({ onBack }: { onBack: () => void }) {
  const [mood, setMood] = useState<number | null>(2);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Today's check-in" showBack onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <CheckCircle2 size={48} color="#2ECC71" />
            <p className="text-[#1A5C6B] font-bold text-[17px] text-center">Thank you. Sentina is keeping watch.</p>
            <p className="text-[#6B7280] text-[14px]">Check back tomorrow</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
              <p className="text-[#1A5C6B] font-bold text-[16px]">How are you feeling today?</p>
              <div className="flex justify-between">
                {["😢", "😕", "😐", "🙂", "😊"].map((e, i) => (
                  <button key={i} onClick={() => setMood(i)}
                    className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl transition-all
                      ${mood === i ? "ring-2 ring-[#1F7A8C] bg-[#E8F4F6] scale-110" : "bg-gray-50"}`}>
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex justify-between px-1">
                {[1, 2, 3, 4, 5].map(n => <span key={n} className="text-[11px] text-[#6B7280] w-[52px] text-center">{n}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-[#1A5C6B] font-bold text-[14px] mb-2">Today's notes (optional)</p>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="How are you feeling today?"
                className="w-full border border-gray-200 rounded-lg p-3 text-[14px] resize-none focus:outline-none focus:border-[#1F7A8C]"
                rows={4} />
              <div className="flex items-center gap-1.5 mt-1">
                <Shield size={13} color="#1F7A8C" />
                <p className="text-[11px] italic text-[#6B7280]">Processed privately on your device</p>
              </div>
            </div>
            <div className="bg-[#E8F4F6] rounded-xl p-3">
              <p className="text-[#1A5C6B] text-[13px] mb-2">Sentina is also monitoring your:</p>
              <div className="flex gap-2">
                {["HRV", "Sleep", "Steps", "Rest HR"].map(t => (
                  <span key={t} className="bg-white text-[#1F7A8C] text-[12px] px-3 py-1 rounded-full border border-[#1F7A8C]/30">{t}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setDone(true)} className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[15px] rounded-xl">
              Done for today
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Screen 8 — EPDS
function EPDSScreen({ onBack }: { onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [finalAnswers, setFinalAnswers] = useState<number[] | null>(null);

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (qIdx === 9) {
      setFinalAnswers(newAnswers);
      return;
    }
    setAnswers(newAnswers);
    setQIdx(qIdx + 1);
    setSelected(null);
  }

  if (finalAnswers !== null) {
    const score = finalAnswers.reduce((sum, ans, i) => {
      const q = EPDS_QUESTIONS[i];
      return sum + (q.rev ? ans : 3 - ans);
    }, 0);
    const high = score >= 13;
    const q10Concern = finalAnswers[9] !== 3;
    const CONTACTS = [
      { name: "Lifeline", number: "13 11 14", desc: "24/7 crisis support" },
      { name: "Beyond Blue", number: "1300 22 4636", desc: "24/7 mental health support" },
      { name: "PANDA", number: "1300 726 306", desc: "Perinatal mental health" },
    ];
    return (
      <div className="flex-1 flex flex-col">
        <TealHeader title="Weekly check-in" />
        <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">

          {/* Score card */}
          <div className={`rounded-xl p-5 flex flex-col items-center gap-3
            ${high ? "bg-[#FEF3C7] border border-[#F5A623]/40" : "bg-[#DCFCE7] border border-[#2ECC71]/40"}`}>
            {high
              ? <AlertTriangle size={44} color="#F5A623" />
              : <CheckCircle2 size={44} color="#2ECC71" />}
            <div className="text-center">
              <p className="text-[#1A5C6B] font-bold text-[17px]">
                {high
                  ? "Thank you for sharing. Your midwife has been notified and will be in touch."
                  : "Your responses have been recorded."}
              </p>
              {!high && (
                <p className="text-[#6B7280] text-[14px] mt-1">Your midwife can see your results.</p>
              )}
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] text-[13px]">Your EPDS score</p>
              <p className="font-bold text-[32px]" style={{ color: high ? "#F5A623" : "#2ECC71" }}>{score}</p>
              <p className="text-[#6B7280] text-[12px]">out of 30</p>
            </div>
            <div className="text-right">
              <p className="text-[#6B7280] text-[12px] mb-1">Clinical threshold</p>
              <div className="flex items-center justify-end gap-2">
                <div className="h-px w-8 border-t-2 border-dashed border-[#D64045]" />
                <span className="text-[#D64045] font-bold text-[16px]">13</span>
              </div>
              <div className="mt-2">
                {high
                  ? <RiskBadge level="monitor" />
                  : <RiskBadge level="stable" />}
              </div>
            </div>
          </div>

          {/* Midwife notification */}
          <div className="bg-[#E8F4F6] rounded-xl p-3 flex items-start gap-2">
            <CheckCircle2 size={16} color="#1F7A8C" className="shrink-0 mt-0.5" />
            <p className="text-[#1A5C6B] text-[13px]">
              {high
                ? "Your midwife Dr Emma Wilson has been notified and will contact you soon."
                : "Your midwife Dr Emma Wilson can see your results in the Sentina dashboard."}
            </p>
          </div>

          {/* Q10 crisis alert */}
          {q10Concern && (
            <div className="bg-[#FEF2F2] border-l-4 border-[#D64045] rounded-xl p-4">
              <p className="text-[#D64045] font-bold text-[14px] mb-1">Support is available right now</p>
              <p className="text-[#1A2B32] text-[13px]">
                We noticed your response to the last question. Your care team has been alerted. Please reach out if you need immediate support.
              </p>
            </div>
          )}

          {/* Crisis contacts (shown if high score OR Q10 concern) */}
          {(high || q10Concern) && (
            <>
              <p className="text-[#1A5C6B] font-bold text-[15px] mt-1">Reach out now</p>
              {CONTACTS.map(c => (
                <div key={c.name} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8F4F6] flex items-center justify-center shrink-0">
                    <Phone size={16} color="#1F7A8C" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1A5C6B] font-bold text-[14px]">{c.name}</p>
                    <p className="text-[#1F7A8C] font-bold text-[18px]">{c.number}</p>
                    <p className="text-[#6B7280] text-[12px]">{c.desc}</p>
                  </div>
                  <button className="px-3 py-1.5 border-[1.5px] border-[#1F7A8C] rounded-xl text-[#1F7A8C] text-[12px] font-semibold shrink-0">
                    Call now
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Next EPDS */}
          {!high && !q10Concern && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8F4F6] flex items-center justify-center shrink-0">
                <Clipboard size={16} color="#1F7A8C" />
              </div>
              <div>
                <p className="text-[#1A5C6B] font-semibold text-[14px]">Next check-in</p>
                <p className="text-[#6B7280] text-[13px]">Your next EPDS is due in 7 days</p>
              </div>
            </div>
          )}

          <button onClick={onBack}
            className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[15px] rounded-xl mt-1">
            Return home
          </button>
        </div>
      </div>
    );
  }

  const progress = ((qIdx) / 10) * 100;
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#1F7A8C] px-4 pt-3 pb-0 shrink-0">
        <div className="flex items-center gap-2 h-[48px]">
          <button onClick={onBack} className="text-white"><ArrowLeft size={20} /></button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-[17px]">Weekly check-in</p>
            <p className="text-white/70 text-[13px]">10 questions — about 3 minutes</p>
          </div>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full mx-0 mt-2">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <p className="text-[#6B7280] text-[13px]">Question {qIdx + 1} of 10</p>
        <p className="text-[#1A5C6B] font-bold text-[17px]">{EPDS_QUESTIONS[qIdx].q}</p>
        <div className="flex flex-col gap-2">
          {EPDS_OPTS.map((opt, i) => (
            <button key={opt} onClick={() => setSelected(i)}
              className={`p-4 rounded-xl text-left text-[14px] border-2 transition-all
                ${selected === i ? "border-[#1F7A8C] bg-[#E8F4F6] text-[#1A5C6B] font-semibold"
                  : "border-gray-200 bg-white text-[#1A2B32]"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                  ${selected === i ? "border-[#1F7A8C]" : "border-gray-300"}`}>
                  {selected === i && <div className="w-2 h-2 rounded-full bg-[#1F7A8C]" />}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
        <button onClick={handleNext} disabled={selected === null}
          className={`w-full h-[48px] font-bold text-[15px] rounded-xl mt-2
            ${selected !== null ? "bg-[#1F7A8C] text-white" : "bg-gray-200 text-gray-400"}`}>
          {qIdx === 9 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

// Screen 9 — Timeline
function TimelineScreen() {
  const [stream, setStream] = useState<"both" | "active" | "passive">("both");
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="My Mood Timeline" />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
          {(["both", "active", "passive"] as const).map(opt => (
            <button key={opt} onClick={() => setStream(opt)}
              className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-all
                ${stream === opt ? "bg-[#1F7A8C] text-white" : "text-[#1F7A8C]"}`}>
              {opt === "both" ? "Both streams" : opt === "active" ? "Active only" : "Passive only"}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[#1A5C6B] font-bold text-[14px] mb-3">12-Week Overview</p>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={TL12} margin={{ top: 4, right: 16, bottom: 0, left: -24 }}>
              <XAxis key="tl12-x" dataKey="w" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis key="tl12-y" domain={[0, 30]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip key="tl12-tip" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <ReferenceLine key="tl12-ref" y={13} stroke="#D64045" strokeDasharray="4 2"
                label={{ value: "Threshold", position: "insideTopRight", fill: "#D64045", fontSize: 10 }} />
              <Line key="tl12-epds" hide={stream === "passive"} type="monotone" dataKey="epds"
                stroke="#1F7A8C" strokeWidth={2} dot={{ r: 3 }} name="EPDS Score" />
              <Line key="tl12-passive" hide={stream === "active"} type="monotone" dataKey="passive"
                stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Passive Risk" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-[2px] bg-[#1F7A8C]" />
              <span className="text-[11px] text-[#6B7280]">EPDS Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 border-t-2 border-dashed border-gray-400" />
              <span className="text-[11px] text-[#6B7280]">Passive Risk</span>
            </div>
          </div>
        </div>
        <div className="bg-[#E8F4F6] border-l-4 border-[#D64045] rounded-xl p-4">
          <p className="text-[#1A5C6B] text-[13px]">
            Sentina has noticed significant changes. Your care team has been alerted and will contact you.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { Icon: Heart,      label: "HRV",               value: "62ms",    color: "#D64045" },
            { Icon: Moon,       label: "Sleep",              value: "7.2 hrs", color: "#F5A623" },
            { Icon: Footprints, label: "Steps",              value: "6,840",   color: "#F5A623" },
            { Icon: Heart,      label: "Resting Heart Rate", value: "72 bpm",  color: "#F5A623" },
          ].map(({ Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-1">
              <Icon size={16} color="#1F7A8C" />
              <p className="text-[#6B7280] text-[11px]">{label}</p>
              <p className="text-[#1A5C6B] font-bold text-[15px]">{value}</p>
              <TrendingDown size={13} color={color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Screen 10 — Crisis
function CrisisScreen({ onBack }: { onBack: () => void }) {
  const CONTACTS = [
    { name: "Lifeline", number: "13 11 14", desc: "24/7 crisis support" },
    { name: "Beyond Blue", number: "1300 22 4636", desc: "24/7 mental health support" },
    { name: "PANDA", number: "1300 726 306", desc: "Perinatal mental health" },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-[#1A5C6B] px-4 shrink-0" style={{ paddingTop: 12, paddingBottom: 16 }}>
        <div className="flex items-center gap-2 mb-2">
          <SentinaLogo className="h-6 w-auto brightness-0 invert" />
        </div>
        <p className="text-white font-bold text-[22px] text-center">We are here for you</p>
        <div className="mt-2 h-[3px] bg-[#F5A623] rounded-full" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col gap-3">
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#F5A623] p-4 flex gap-3">
          <Heart size={30} color="#F5A623" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[#1A2B32] text-[15px]">
              Sentina has noticed you may need some support right now. Your care team has been notified.
            </p>
            <p className="text-[#1F7A8C] font-bold text-[15px] mt-2">You are not alone.</p>
          </div>
        </div>
        <p className="text-[#1A5C6B] font-bold text-[16px]">Reach out now</p>
        {CONTACTS.map(c => (
          <div key={c.name} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F4F6] flex items-center justify-center shrink-0">
              <Phone size={18} color="#1F7A8C" />
            </div>
            <div className="flex-1">
              <p className="text-[#1A5C6B] font-bold text-[15px]">{c.name}</p>
              <p className="text-[#1F7A8C] font-bold text-[20px]">{c.number}</p>
              <p className="text-[#6B7280] text-[12px]">{c.desc}</p>
            </div>
            <button className="px-3 py-1.5 border-[1.5px] border-[#1F7A8C] rounded-xl text-[#1F7A8C] text-[12px] font-semibold">
              Call now
            </button>
          </div>
        ))}
        <div className="bg-[#E8F4F6] rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 size={16} color="#1F7A8C" className="shrink-0" />
          <p className="text-[#1A5C6B] text-[13px]">Your midwife has been notified and will be in touch.</p>
        </div>
        <button onClick={onBack} className="text-[#6B7280] text-[14px] text-center py-2">
          Return to home screen
        </button>
      </div>
    </div>
  );
}

// ── MESSAGES SCREEN ────────────────────────────────────────────────────────
type ChatMessage = { id: number; from: "patient" | "clinician"; text: string; time: string; date?: string };

const CHAT_HISTORY: ChatMessage[] = [
  { id: 1, from: "clinician", text: "Hi Sarah, I've reviewed your latest EPDS results. Your score this week was 11 — I'd love to chat about how you've been feeling. Are you available for a call today?", time: "9:15 AM", date: "Yesterday" },
  { id: 2, from: "patient", text: "Hi Dr. Wilson! Yes, I'm free this afternoon around 2pm?", time: "9:32 AM" },
  { id: 3, from: "clinician", text: "Perfect — I'll call you at 2pm. In the meantime, keep up with your daily check-ins. They really help me track your progress 💙", time: "9:45 AM" },
  { id: 4, from: "patient", text: "Thank you! The breathing exercises have been helping a lot.", time: "10:02 AM" },
  { id: 5, from: "clinician", text: "That's wonderful to hear! See you at 2pm.", time: "10:05 AM" },
  { id: 6, from: "clinician", text: "Sarah, just a reminder about your in-person appointment tomorrow at 10:00am at Royal Women's Hospital. Please bring your mood diary if you have it 🏥", time: "8:47 AM", date: "Today" },
];

function MessagesScreen() {
  const [view, setView] = useState<"inbox" | "chat">("inbox");
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_HISTORY);
  const [draft, setDraft] = useState("");
  const [hasRead, setHasRead] = useState(false);

  function openChat() { setView("chat"); setHasRead(true); }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1, from: "patient", text, time: "Just now",
    }]);
    setDraft("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1, from: "clinician",
        text: "Thanks for your message, Sarah. I'll get back to you shortly. Take care 💙",
        time: "Just now",
      }]);
    }, 1500);
  }

  const unreadCount = hasRead ? 0 : 1;

  if (view === "chat") {
    return (
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center px-4 py-3 bg-[#1F7A8C] gap-3">
          <button onClick={() => setView("inbox")} className="text-white shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-[13px] shrink-0">EW</div>
          <div className="flex-1">
            <p className="text-white font-bold text-[15px]">Dr. Emma Wilson</p>
            <p className="text-white/75 text-[11px]">Midwife · Royal Women's Hospital</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#2ECC71]" title="Online" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F8FAFB] flex flex-col gap-3">
          {messages.map((msg, i) => {
            const showDate = msg.date && (i === 0 || messages[i - 1].date !== msg.date);
            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-2">
                    <span className="bg-gray-200 text-[#6B7280] text-[11px] px-3 py-0.5 rounded-full">{msg.date}</span>
                  </div>
                )}
                <div className={`flex ${msg.from === "patient" ? "justify-end" : "justify-start"} gap-2 items-end`}>
                  {msg.from === "clinician" && (
                    <div className="w-7 h-7 rounded-full bg-[#1F7A8C] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-0.5">EW</div>
                  )}
                  <div className="max-w-[72%]">
                    <div className={`px-3.5 py-2.5 rounded-2xl text-[14px] leading-snug
                      ${msg.from === "patient"
                        ? "bg-[#1F7A8C] text-white rounded-br-sm"
                        : "bg-white text-[#1A2B32] shadow-sm rounded-bl-sm border border-gray-100"}`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-[#9CA3AF] mt-0.5 ${msg.from === "patient" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-200">
          <input
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Message Dr. Wilson…"
            className="flex-1 bg-[#F8FAFB] border border-gray-200 rounded-2xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1F7A8C]"
          />
          <button onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
            style={{ backgroundColor: draft.trim() ? "#1F7A8C" : "#E5E7EB" }}>
            <Send size={16} color={draft.trim() ? "white" : "#9CA3AF"} />
          </button>
        </div>
      </div>
    );
  }

  // Inbox view
  const lastMsg = CHAT_HISTORY[CHAT_HISTORY.length - 1];
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Messages" />
      <div className="flex-1 overflow-y-auto bg-[#F8FAFB]">
        {/* Conversation row */}
        <button onClick={openChat}
          className="w-full bg-white flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 active:bg-gray-50">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#1F7A8C] flex items-center justify-center text-white font-bold text-[14px]">EW</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2ECC71] rounded-full border-2 border-white" />
          </div>

          {/* Name + preview — min-w-0 lets truncate work inside flex */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[#1A2B32] font-bold text-[14px] truncate">Dr. Emma Wilson</p>
              <p className="text-[#9CA3AF] text-[11px] shrink-0">{lastMsg.time}</p>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-[#6B7280] text-[13px] truncate">{lastMsg.text}</p>
              {!hasRead && (
                <span className="w-5 h-5 bg-[#1F7A8C] rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Security note */}
        <div className="flex items-start gap-3 mx-4 mt-4 p-3.5 bg-[#E8F4F6] rounded-xl">
          <Shield size={15} color="#1F7A8C" className="shrink-0 mt-0.5" />
          <p className="text-[#1A5C6B] text-[12px] leading-relaxed">
            Messages between you and your care team are end-to-end encrypted and stored securely.
          </p>
        </div>
      </div>
    </div>
  );
}

// Screen 11 — Family
function FamilyScreen() {
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Family Health" />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#F5A623] p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-xl shrink-0">👶</div>
            <div className="flex-1">
              <p className="text-[#1A5C6B] font-bold text-[16px]">Baby Mitchell</p>
              <p className="text-[#6B7280] text-[13px]">DOB: 12 Mar 2025</p>
              <p className="text-[#6B7280] text-[13px]">12 weeks old</p>
            </div>
            <RiskBadge level="high" />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} color="#1F7A8C" />
              <p className="text-[#1F7A8C] text-[13px]">Your MCH nurse has been notified.</p>
            </div>
            <p className="text-[#6B7280] text-[13px]">Enhanced developmental surveillance recommended at your next visit.</p>
            <p className="text-[#6B7280] text-[13px]">Next MCH appointment: 2 Jun 2025</p>
            <p className="text-[#6B7280] text-[11px] italic">Your midwife can also see this.</p>
          </div>
        </div>
        <div className="bg-[#E8F4F6] rounded-xl p-4 flex items-start gap-2">
          <Info size={16} color="#1F7A8C" className="shrink-0 mt-0.5" />
          <p className="text-[#1A5C6B] text-[13px]">
            Infant flags are generated when maternal mental health risk is elevated for 2+ consecutive weeks.
          </p>
        </div>
      </div>
    </div>
  );
}

// Screen 12 — Profile
function ProfileScreen() {
  const [consent, setConsent] = useState([true, true, true, true]);
  const [notifs, setNotifs] = useState([true, true, true]);
  const CONSENT_LABELS = ["Mood monitoring", "EPDS screening", "Wearable monitoring", "Infant record linkage"];
  const NOTIF_LABELS = ["Daily check-in reminder", "Weekly EPDS reminder", "Clinician messages"];
  return (
    <div className="flex-1 flex flex-col">
      <TealHeader title="Profile" />
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFB] flex flex-col gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#1F7A8C] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[18px]">SM</span>
          </div>
          <div className="flex-1">
            <p className="text-[#1A5C6B] font-bold text-[17px]">Sarah Mitchell</p>
            <p className="text-[#6B7280] text-[14px]">34 weeks postpartum</p>
          </div>
          <button className="px-3 py-1.5 border border-[#1F7A8C] rounded-lg text-[#1F7A8C] text-[13px] font-semibold">Edit</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[#1F7A8C] text-[13px] font-bold mb-3">WEARABLE CONNECTIONS</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Watch size={18} color="#1F7A8C" />
              <span className="text-[#1A2B32] text-[14px]">Apple Watch</span>
            </div>
            <div className="flex items-center gap-2">
              <Dot color="#2ECC71" />
              <span className="text-[#6B7280] text-[13px]">Connected</span>
              <button className="text-[#6B7280] text-[13px]">Change</button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <p className="text-[#1F7A8C] text-[13px] font-bold">CONSENT SETTINGS</p>
          {CONSENT_LABELS.map((label, i) => (
            <div key={`consent-${i}`} className="flex items-center justify-between">
              <span className="text-[#1A2B32] text-[14px]">{label}</span>
              <Toggle on={consent[i]} onToggle={() => setConsent(c => c.map((v, j) => j === i ? !v : v))} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <p className="text-[#1F7A8C] text-[13px] font-bold">NOTIFICATIONS</p>
          {NOTIF_LABELS.map((label, i) => (
            <div key={`notif-${i}`} className="flex items-center justify-between">
              <span className="text-[#1A2B32] text-[14px]">{label}</span>
              <Toggle on={notifs[i]} onToggle={() => setNotifs(n => n.map((v, j) => j === i ? !v : v))} />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[#1F7A8C] text-[13px] font-bold mb-3">PRIVACY</p>
          {["View privacy policy", "How Sentina uses your data"].map(l => (
            <p key={l} className="text-[#1F7A8C] text-[14px] py-1">{l}</p>
          ))}
          <p className="text-[#6B7280] text-[14px] py-1">Download my data</p>
        </div>
        <button className="text-[#D64045] text-[14px] text-center py-2">Sign out</button>
      </div>
    </div>
  );
}

function PatientApp() {
  const [screen, setScreen] = useState<PatientScreen>("welcome");
  const render = () => {
    switch (screen) {
      case "welcome": return <WelcomeScreen onNext={() => setScreen("account")} onLogin={() => setScreen("login")} />;
      case "login": return <LoginScreen onLogin={() => setScreen("home")} onBack={() => setScreen("welcome")} />;
      case "account": return <AccountScreen onNext={() => setScreen("consent")} />;
      case "consent": return <ConsentScreen onNext={() => setScreen("wearable")} />;
      case "wearable": return <WearableScreen onNext={() => setScreen("setup")} />;
      case "setup": return <SetupCompleteScreen onNext={() => setScreen("home")} />;
      case "home": return <HomeScreen onCheckin={() => setScreen("checkin")} onEPDS={() => setScreen("epds")} onCrisis={() => setScreen("crisis")} />;
      case "checkin": return <CheckInScreen onBack={() => setScreen("home")} />;
      case "epds": return <EPDSScreen onBack={() => setScreen("home")} />;
      case "timeline": return <TimelineScreen />;
      case "crisis": return <CrisisScreen onBack={() => setScreen("home")} />;
      case "messages": return <MessagesScreen />;
      case "family": return <FamilyScreen />;
      case "profile": return <ProfileScreen />;
    }
  };
  return (
    <MobileShell screen={screen} onNav={setScreen}>
      {render()}
    </MobileShell>
  );
}

// ── CLINICIAN DASHBOARD ────────────────────────────────────────────────────
function ClinicianSidebar({ active, onNav, onLogout }: { active: ClinicianScreen; onNav: (s: ClinicianScreen) => void; onLogout: () => void }) {
  const items: { id: ClinicianScreen; Icon: React.ComponentType<{ size: number; color: string }>; label: string; badge?: number }[] = [
    { id: "patients",   Icon: Users,     label: "Patients" },
    { id: "alerts",     Icon: Bell,      label: "Alerts", badge: 3 },
    { id: "careplans",  Icon: FileText,  label: "Care Plans" },
    { id: "reports",    Icon: BarChart2, label: "Reports" },
    { id: "settings",   Icon: Settings,  label: "Settings" },
  ];
  return (
    <div className="w-[240px] bg-[#1A5C6B] flex flex-col shrink-0 h-full" style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}>
      <div className="px-6 py-8">
        <SentinaLogo className="h-14 w-auto object-contain brightness-0 invert" />
      </div>
      <nav className="flex-1">
        {items.map(({ id, Icon, label, badge }, idx) => {
          const isActive = active === id;
          return (
            <button key={`nav-${idx}`} onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-5 text-white text-[14px] h-[48px]
                ${isActive ? "bg-white/15 border-l-[3px] border-[#1F7A8C]" : "hover:bg-white/10"}`}>
              <Icon size={18} color="white" />
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className="bg-[#D64045] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/20 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[13px] shrink-0">EW</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[13px]">Dr Emma Wilson</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.6)" }}>Midwife — Royal Women's Hospital</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-[13px] font-semibold">
          <LogOut size={15} color="white" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function DesktopHeader({ title, showSearch = true }: { title: string; showSearch?: boolean }) {
  return (
    <div className="flex items-center px-8 bg-white border-b border-[#E5E7EB] h-[64px] shrink-0 gap-4">
      <p className="text-[#1A5C6B] font-bold text-[24px] flex-1">{title}</p>
      {showSearch && (
        <>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 gap-2 h-9 w-[240px]">
            <Search size={16} color="#6B7280" />
            <input placeholder="Search patients..." className="text-[14px] focus:outline-none flex-1" />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#6B7280]">
            <option>All patients</option>
          </select>
          <button className="relative">
            <Bell size={24} color="#1A5C6B" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D64045] rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
          </button>
        </>
      )}
    </div>
  );
}

// Clinician Screen 1 — FHIR Launch
function FHIRLaunchScreen({ onReady }: { onReady: () => void }) {
  useEffect(() => { const t = setTimeout(onReady, 2500); return () => clearTimeout(t); }, [onReady]);
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 bg-white">
      <SentinaLogo className="w-[200px] object-contain" />
      <Loader2 size={36} color="#1F7A8C" className="animate-spin" />
      <p className="text-[#6B7280] text-[14px]">Loading patient context from EHR...</p>
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} color="#2ECC71" />
        <p className="text-[#6B7280] text-[12px]">Authenticated via EHR Identity Provider</p>
      </div>
    </div>
  );
}

// Clinician Screen 2 — Patient Priority List
function PatientListScreen({ onView }: { onView: () => void }) {
  const PATIENTS = [
    { name: "Sarah Mitchell", sub: "34w postpartum", risk: "high" as const, epds: 16, epdsColor: "#D64045", trend: "↓", trendColor: "#D64045", checkin: "3 days ago", checkinColor: "#D64045", flag: true },
    { name: "Jennifer Lee", sub: "28w pregnant", risk: "monitor" as const, epds: 11, epdsColor: "#F5A623", trend: "→", trendColor: "#6B7280", checkin: "Yesterday", checkinColor: "#6B7280", flag: false },
    { name: "Emily Clark", sub: "16w pregnant", risk: "stable" as const, epds: 6, epdsColor: "#2ECC71", trend: "↑", trendColor: "#2ECC71", checkin: "Today", checkinColor: "#6B7280", flag: false },
    { name: "Priya Sharma", sub: "8w postpartum", risk: "stable" as const, epds: 4, epdsColor: "#2ECC71", trend: "↑", trendColor: "#2ECC71", checkin: "Today", checkinColor: "#6B7280", flag: false },
    { name: "Amy Nguyen", sub: "22w pregnant", risk: "stable" as const, epds: 7, epdsColor: "#2ECC71", trend: "→", trendColor: "#6B7280", checkin: "Yesterday", checkinColor: "#6B7280", flag: false },
  ];
  return (
    <>
      <DesktopHeader title="My Patients" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Patients", value: "24", color: "#1A5C6B" },
            { label: "High Risk", value: "3", color: "#D64045" },
            { label: "Needs Attention", value: "7", color: "#F5A623" },
            { label: "Stable", value: "14", color: "#2ECC71" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border-t-[3px]" style={{ borderTopColor: "#1F7A8C" }}>
              <p className="text-[#6B7280] text-[13px]">{label}</p>
              <p className="font-bold text-[32px]" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#FEF3C7] border-l-4 border-[#F5A623] rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={18} color="#F5A623" />
          <p className="text-[#1A2B32] text-[14px] flex-1">2 patients require immediate attention — EPDS score above clinical threshold</p>
          <button className="text-[#1F7A8C] text-[14px] font-semibold">View all alerts →</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8F4F6]">
                {["Patient", "Risk Level", "EPDS Score", "Passive Trend", "Last Check-in", "Infant Flag", "Action"].map(h => (
                  <th key={h} className="text-left text-[#1A5C6B] font-bold text-[13px] px-4 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PATIENTS.map((p, i) => (
                <tr key={p.name} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFB]"}>
                  <td className="px-4 py-4">
                    <p className="text-[#1A5C6B] font-bold text-[15px]">{p.name}</p>
                    <p className="text-[#6B7280] text-[12px]">{p.sub}</p>
                  </td>
                  <td className="px-4 py-4"><RiskBadge level={p.risk} /></td>
                  <td className="px-4 py-4"><span className="font-bold text-[16px]" style={{ color: p.epdsColor }}>{p.epds}</span></td>
                  <td className="px-4 py-4"><span className="font-bold text-[16px]" style={{ color: p.trendColor }}>{p.trend}</span></td>
                  <td className="px-4 py-4"><span className="text-[13px]" style={{ color: p.checkinColor }}>{p.checkin}</span></td>
                  <td className="px-4 py-4">
                    {p.flag && <Flag size={18} color="#F5A623" fill="#F5A623" />}
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={p.name === "Sarah Mitchell" ? onView : undefined}
                      className="px-4 py-1.5 border-[1.5px] border-[#1F7A8C] rounded-lg text-[#1F7A8C] text-[13px] font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-[#6B7280] text-[13px]">Showing 5 of 24 patients</p>
            <div className="flex items-center gap-2">
              <button className="text-[#6B7280]"><ChevronLeft size={18} /></button>
              {[1, 2, 3].map(n => (
                <button key={n} className={`w-8 h-8 rounded-lg text-[13px] ${n === 1 ? "bg-[#1F7A8C] text-white" : "text-[#6B7280]"}`}>{n}</button>
              ))}
              <button className="text-[#6B7280]"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Clinician Screen 3 — Patient Detail
function PatientDetailScreen({ onBack }: { onBack: () => void }) {
  const [stream, setStream] = useState<"both" | "active" | "passive">("both");
  const [showChat, setShowChat] = useState(false);
  const [calling, setCalling] = useState<"idle" | "ringing" | "connected">("idle");
  const [clinicianDraft, setClinicianDraft] = useState("");
  const [clinicianMessages, setClinicianMessages] = useState<ChatMessage[]>(CHAT_HISTORY);

  function sendClinicianMessage() {
    const text = clinicianDraft.trim();
    if (!text) return;
    setClinicianMessages(prev => [...prev, { id: prev.length + 1, from: "clinician", text, time: "Just now" }]);
    setClinicianDraft("");
    setTimeout(() => {
      setClinicianMessages(prev => [...prev, {
        id: prev.length + 1, from: "patient",
        text: "Thank you Dr. Wilson, I'll keep that in mind 😊",
        time: "Just now",
      }]);
    }, 1800);
  }

  function startCall() {
    setCalling("ringing");
    setTimeout(() => setCalling("connected"), 2200);
  }

  const EPDS_HISTORY = [
    { date: "12 May 2025", score: 8, color: "#2ECC71", change: "—", changeColor: "#6B7280" },
    { date: "19 May 2025", score: 10, color: "#6B7280", change: "↑2", changeColor: "#F5A623" },
    { date: "26 May 2025", score: 13, color: "#F5A623", change: "↑3", changeColor: "#F5A623" },
    { date: "2 Jun 2025", score: 16, color: "#D64045", change: "↑3", changeColor: "#D64045", highlight: true },
  ];

  return (
    <>
      <DesktopHeader title="Patient Detail — Sarah Mitchell" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] relative">
        <button onClick={onBack} className="flex items-center gap-1 text-[#1F7A8C] text-[14px] mb-6 hover:underline">
          <ChevronLeft size={16} /> Back to patients
        </button>

        {/* Call overlay */}
        {calling !== "idle" && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-[#1A5C6B] rounded-2xl p-10 flex flex-col items-center gap-5 shadow-2xl min-w-[320px]">
              <div className="relative">
                {calling === "ringing" && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                    <span className="absolute -inset-3 rounded-full bg-white/10 animate-ping" style={{ animationDelay: "0.3s" }} />
                  </>
                )}
                <div className="relative w-20 h-20 rounded-full bg-white/25 flex items-center justify-center">
                  <span className="text-white font-bold text-[24px]">SM</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-[20px]">Sarah Mitchell</p>
                <p className="text-white/70 text-[14px] mt-1">
                  {calling === "ringing" ? "Calling…" : "Connected · 00:04"}
                </p>
              </div>
              {calling === "connected" && (
                <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                  <span className="text-white text-[13px]">Secure voice call</span>
                </div>
              )}
              <button onClick={() => setCalling("idle")}
                className="w-14 h-14 rounded-full bg-[#D64045] flex items-center justify-center shadow-lg hover:bg-[#b83339] transition-colors">
                <Phone size={22} color="white" style={{ transform: "rotate(135deg)" }} />
              </button>
              <p className="text-white/50 text-[12px]">Tap to end call</p>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex-[6] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
              <div className="w-[52px] h-[52px] rounded-full bg-[#1F7A8C] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[18px]">SM</span>
              </div>
              <div className="flex-1">
                <p className="text-[#1A5C6B] font-bold text-[20px]">Sarah Mitchell</p>
                <p className="text-[#6B7280] text-[13px]">34 weeks postpartum • DOB: 12 Mar 1990</p>
                <p className="text-[#6B7280] text-[12px]">Assigned midwife: You</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => setShowChat(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors
                      ${showChat ? "bg-[#1A5C6B] text-white" : "bg-[#1F7A8C] text-white hover:bg-[#1A5C6B]"}`}>
                    <MessageCircle size={14} /> Send message
                  </button>
                  <button onClick={startCall}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2ECC71] text-white text-[13px] font-semibold rounded-lg hover:bg-[#27ae60] transition-colors">
                    <Phone size={14} /> Call patient
                  </button>
                  <button className="px-4 py-2 border-[1.5px] border-[#1F7A8C] text-[#1F7A8C] text-[13px] font-semibold rounded-lg">Create referral</button>
                  <button className="text-[#6B7280] text-[13px] px-2">View in My Health Record</button>
                </div>
              </div>
              <RiskBadge level="high" />
            </div>

            {/* Chat panel — appears below patient card */}
            {showChat && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ height: 420 }}>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#1F7A8C] shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-[12px] shrink-0">SM</div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-[14px]">Sarah Mitchell</p>
                    <p className="text-white/70 text-[11px]">Patient · last seen today</p>
                  </div>
                  <button onClick={() => setShowChat(false)} className="text-white/70 hover:text-white text-[20px] leading-none px-1">×</button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#F8FAFB] flex flex-col gap-2.5">
                  {clinicianMessages.map((msg, i) => {
                    const isMine = msg.from === "clinician";
                    const showDate = msg.date && (i === 0 || clinicianMessages[i - 1].date !== msg.date);
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-1">
                            <span className="bg-gray-200 text-[#6B7280] text-[10px] px-3 py-0.5 rounded-full">{msg.date}</span>
                          </div>
                        )}
                        <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                          {!isMine && (
                            <div className="w-6 h-6 rounded-full bg-[#E8F4F6] flex items-center justify-center text-[#1F7A8C] text-[9px] font-bold shrink-0">SM</div>
                          )}
                          <div className="max-w-[70%]">
                            <div className={`px-3 py-2 rounded-2xl text-[13px] leading-snug
                              ${isMine
                                ? "bg-[#1F7A8C] text-white rounded-br-sm"
                                : "bg-white text-[#1A2B32] shadow-sm border border-gray-100 rounded-bl-sm"}`}>
                              {msg.text}
                            </div>
                            <p className={`text-[10px] text-[#9CA3AF] mt-0.5 ${isMine ? "text-right" : "text-left"}`}>{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-200 shrink-0">
                  <input
                    value={clinicianDraft} onChange={e => setClinicianDraft(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendClinicianMessage()}
                    placeholder="Message Sarah…"
                    className="flex-1 bg-[#F8FAFB] border border-gray-200 rounded-xl px-3 py-2 text-[13px] focus:outline-none focus:border-[#1F7A8C]"
                  />
                  <button onClick={sendClinicianMessage}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: clinicianDraft.trim() ? "#1F7A8C" : "#E5E7EB" }}>
                    <Send size={14} color={clinicianDraft.trim() ? "white" : "#9CA3AF"} />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#1A5C6B] font-bold text-[16px]">16-Week Mood Overview</p>
                <div className="flex gap-1">
                  {(["both", "active", "passive"] as const).map(opt => (
                    <button key={opt} onClick={() => setStream(opt)}
                      className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all
                        ${stream === opt ? "bg-[#1F7A8C] text-white" : "text-[#1F7A8C] border border-[#1F7A8C]/30"}`}>
                      {opt === "both" ? "Both" : opt === "active" ? "Active" : "Passive"}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={TL16} margin={{ top: 4, right: 20, bottom: 0, left: -20 }}>
                  <XAxis key="tl16-x" dataKey="w" tick={{ fontSize: 10, fill: "#6B7280" }} />
                  <YAxis key="tl16-y" domain={[0, 30]} tick={{ fontSize: 10, fill: "#6B7280" }} />
                  <Tooltip key="tl16-tip" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <ReferenceLine key="tl16-ref" y={13} stroke="#D64045" strokeDasharray="4 2"
                    label={{ value: "Clinical threshold (13)", position: "insideTopRight", fill: "#D64045", fontSize: 10 }} />
                  <Line key="tl16-epds" hide={stream === "passive"} type="monotone" dataKey="epds"
                    stroke="#1F7A8C" strokeWidth={2} dot={{ r: 3 }} name="EPDS Score" />
                  <Line key="tl16-passive" hide={stream === "active"} type="monotone" dataKey="passive"
                    stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Passive Risk" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 pb-3"><p className="text-[#1A5C6B] font-bold text-[16px]">EPDS History</p></div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#E8F4F6]">
                    {["Date", "Score", "Change", "Administered By"].map(h => (
                      <th key={h} className="text-left text-[#1A5C6B] font-bold text-[13px] px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EPDS_HISTORY.map(row => (
                    <tr key={row.date} className={row.highlight ? "bg-[#FEF2F2]" : "border-t border-gray-100"}>
                      <td className="px-4 py-3 text-[14px] text-[#6B7280]">{row.date}</td>
                      <td className="px-4 py-3 font-bold text-[16px]" style={{ color: row.color }}>{row.score}</td>
                      <td className="px-4 py-3 font-semibold text-[14px]" style={{ color: row.changeColor }}>{row.change}</td>
                      <td className="px-4 py-3 text-[14px] text-[#6B7280]">Self</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Right column */}
          <div className="flex-[4] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#D64045] p-5">
              <p className="text-[#D64045] font-bold text-[16px] mb-3">Active Alerts</p>
              {[
                { dot: "#D64045", text: "EPDS score 16 — above clinical threshold", time: "Today 9:42am" },
                { dot: "#F5A623", text: "No active check-in for 3 days — passive monitoring active", time: "3 days ago" },
                { dot: "#F5A623", text: "Passive physiological deterioration detected — HRV declining, sleep reduced", time: "2 days ago" },
              ].map(a => (
                <div key={a.text} className="flex items-start gap-2 mb-3">
                  <Dot color={a.dot} />
                  <div>
                    <p className="text-[#1A2B32] text-[14px]">{a.text}</p>
                    <p className="text-[#6B7280] text-[12px]">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-[#1F7A8C] p-5">
              <p className="text-[#1F7A8C] font-bold text-[14px] mb-3">Passive Monitoring</p>
              {[
                { Icon: Heart, label: "Heart Rate Variability", value: "58ms",    color: "#D64045" },
                { Icon: Moon, label: "Sleep Duration",          value: "5.8 hrs", color: "#F5A623" },
                { Icon: Footprints, label: "Daily Steps",       value: "3,200",   color: "#F5A623" },
                { Icon: Heart, label: "Resting Heart Rate",     value: "82 bpm",  color: "#D64045" },
              ].map(({ Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                  <Icon size={16} color="#1F7A8C" />
                  <span className="text-[#6B7280] text-[13px] flex-1">{label}</span>
                  <span className="font-bold text-[14px]" style={{ color }}>{value}</span>
                  <TrendingDown size={14} color={color} />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#F5A623] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Baby size={20} color="#F5A623" />
                <p className="text-[#F5A623] font-bold text-[14px]">Infant Flag Active</p>
              </div>
              <p className="text-[#6B7280] text-[13px]">Maternal risk elevated for 3 weeks.</p>
              <p className="text-[#6B7280] text-[13px] mt-1">Enhanced developmental surveillance recommended.</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 size={14} color="#1F7A8C" />
                <p className="text-[#1F7A8C] text-[12px]">Flag sent to MCH nurse: 14 Apr 2025</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-[#1F7A8C] p-5">
              <p className="text-[#1A5C6B] font-bold text-[14px] mb-3">Active Care Plan</p>
              {["GP Mental Health Treatment Plan — referred", "Perinatal psychology referral — pending"].map(item => (
                <div key={item} className="flex items-start gap-2 mb-2">
                  <CheckCircle2 size={16} color="#1F7A8C" className="shrink-0 mt-0.5" />
                  <p className="text-[#1A2B32] text-[13px]">{item}</p>
                </div>
              ))}
              <p className="text-[#1F7A8C] text-[13px] mt-2">View full care plan</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Clinician Screen 4 — Alerts Feed
function AlertsFeedScreen({ onViewPatient }: { onViewPatient: () => void }) {
  const [tab, setTab] = useState("All");
  const TABS = ["All", "Unread (3)", "High Priority", "Infant Flags"];
  const ALERTS = [
    {
      border: "#D64045", dot: "#D64045", priority: "HIGH PRIORITY", priorityColor: "#D64045",
      title: "Sarah Mitchell — EPDS score 16, above clinical threshold",
      body: "Action required: Review patient and initiate care plan",
      time: "Today 9:42am", read: false,
    },
    {
      border: "#F5A623", dot: "#F5A623", priority: "MONITOR", priorityColor: "#F5A623",
      title: "Sarah Mitchell — No active check-in for 3 days. Passive monitoring active.",
      body: "",
      time: "3 days ago", read: false,
    },
    {
      border: "#D1D5DB", dot: "#D1D5DB", priority: "INFANT FLAG", priorityColor: "#F5A623",
      title: "Baby Mitchell — Maternal risk elevated 3 weeks. Flag written to infant My Health Record. MCH nurse notified.",
      body: "",
      time: "14 Apr 2025", read: true,
    },
  ];
  return (
    <>
      <DesktopHeader title="Alerts" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-4">
        <div className="flex gap-1 border-b border-gray-200 bg-white rounded-t-xl px-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-[14px] font-semibold border-b-2 transition-all
                ${tab === t ? "border-[#1F7A8C] text-[#1F7A8C]" : "border-transparent text-[#6B7280]"}`}>
              {t}
            </button>
          ))}
        </div>
        {ALERTS.map((a, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border-l-4 p-5" style={{ borderLeftColor: a.border }}>
            <div className="flex items-start gap-3">
              <Dot color={a.dot} />
              <div className="flex-1">
                <p className="text-[11px] font-bold mb-1" style={{ color: a.priorityColor }}>{a.priority}</p>
                <p className={`text-[15px] text-[#1A2B32] ${!a.read ? "font-bold" : ""}`}>{a.title}</p>
                {a.body && <p className="text-[#6B7280] text-[13px] mt-1">{a.body}</p>}
                <p className="text-[#6B7280] text-[12px] mt-2">{a.time}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={onViewPatient} className="text-[#1F7A8C] text-[14px] font-semibold hover:underline">View patient</button>
                {!a.read && (
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-[#6B7280] text-[13px]">Acknowledge</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Clinician Screen — Care Plans
function CarePlansScreen() {
  const [selected, setSelected] = useState<"sarah" | "michael" | null>(null);

  if (selected === "michael") {
    return (
      <>
        <DesktopHeader title="Care Plan — Baby Michael Mitchell" showSearch={false} />
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-5">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-[#1F7A8C] text-[14px] hover:underline self-start">
            <ChevronLeft size={16} /> Back to Care Plans
          </button>

          {/* Infant header card */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F5A623] flex items-center justify-center shrink-0">
              <Baby size={28} color="white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[#1A5C6B] font-bold text-[20px]">Baby Michael Mitchell</p>
                <span className="px-2.5 py-0.5 bg-[#FEF3C7] text-[#F5A623] text-[12px] font-bold rounded-full">Infant — 8 weeks</span>
              </div>
              <p className="text-[#6B7280] text-[13px] mt-0.5">DOB: 6 April 2025 · Mother: Sarah Mitchell</p>
              <p className="text-[#6B7280] text-[13px]">MCH Nurse: Lisa Chen · Assigned Midwife: Dr. Emma Wilson</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                <span className="text-[#F5A623] text-[13px] font-semibold">Enhanced surveillance active — maternal risk elevated 3 weeks</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-[6] flex flex-col gap-4">
              {/* Developmental milestones */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-[#1A5C6B] font-bold text-[16px] mb-4">Developmental Milestones</p>
                {[
                  { milestone: "Birth weight check",          date: "6 Apr 2025",  status: "Met",     note: "3.4 kg — within normal range" },
                  { milestone: "2-week maternal bonding obs.", date: "20 Apr 2025", status: "Met",     note: "Adequate bonding observed" },
                  { milestone: "6-week general check",        date: "17 May 2025", status: "Met",     note: "Social smile present, reflexes normal" },
                  { milestone: "8-week immunisations",        date: "1 Jun 2025",  status: "Due",     note: "Diphtheria, tetanus, pertussis, polio, Hib, Hep B" },
                  { milestone: "4-month check",               date: "6 Aug 2025",  status: "Planned", note: "Motor, vision, hearing screening" },
                  { milestone: "6-month enhanced review",     date: "6 Oct 2025",  status: "Planned", note: "Enhanced — maternal EPDS monitoring in effect" },
                ].map(r => {
                  const sc: Record<string, string> = { Met: "#2ECC71", Due: "#F5A623", Planned: "#9CA3AF" };
                  return (
                    <div key={r.milestone} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: sc[r.status] }} />
                      <div className="flex-1">
                        <p className="text-[#1A2B32] text-[14px] font-semibold">{r.milestone}</p>
                        <p className="text-[#6B7280] text-[12px] mt-0.5">{r.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: sc[r.status] }}>{r.status}</span>
                        <p className="text-[#9CA3AF] text-[11px] mt-1">{r.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Care directives */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-[#1A5C6B] font-bold text-[15px] mb-3">Active Care Directives</p>
                {[
                  "Monthly enhanced MCH visits until maternal EPDS score < 10 for 4 consecutive weeks",
                  "Maternal bonding observation at every visit — document quality of interaction",
                  "Flag to DHHS if two consecutive missed visits or safeguarding concern identified",
                  "Coordinate with Dr. Emma Wilson on maternal mental health status before each visit",
                ].map((d, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0">
                    <CheckCircle2 size={15} color="#1F7A8C" className="shrink-0 mt-0.5" />
                    <p className="text-[#1A2B32] text-[13px]">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-[4] flex flex-col gap-4">
              {/* Risk summary */}
              <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#F5A623] p-5">
                <p className="text-[#F5A623] font-bold text-[15px] mb-3">Risk Summary</p>
                {[
                  { label: "Maternal EPDS (latest)", value: "16", color: "#D64045" },
                  { label: "Maternal risk status",   value: "High Risk", color: "#D64045" },
                  { label: "Infant risk status",     value: "Monitor",   color: "#F5A623" },
                  { label: "Weeks flagged",          value: "3 weeks",   color: "#F5A623" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-[#6B7280] text-[13px]">{r.label}</span>
                    <span className="font-bold text-[14px]" style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Visit log */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-[#1A5C6B] font-bold text-[15px] mb-3">Visit Log</p>
                {[
                  { date: "17 May 2025", by: "Lisa Chen",       note: "6-week check — normal development, bonding adequate" },
                  { date: "20 Apr 2025", by: "Lisa Chen",       note: "2-week visit — feeding well, maternal fatigue noted" },
                  { date: "6 Apr 2025",  by: "Dr. Emma Wilson", note: "Birth — handover to MCH, enhanced flag active" },
                ].map(v => (
                  <div key={v.date} className="mb-3 last:mb-0 pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-center">
                      <p className="text-[#1A2B32] text-[13px] font-semibold">{v.by}</p>
                      <p className="text-[#9CA3AF] text-[11px]">{v.date}</p>
                    </div>
                    <p className="text-[#6B7280] text-[12px] mt-0.5">{v.note}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
                <p className="text-[#1A5C6B] font-bold text-[14px] mb-1">Actions</p>
                <button className="w-full py-2 bg-[#1F7A8C] text-white text-[13px] font-semibold rounded-lg">Record new visit</button>
                <button className="w-full py-2 border border-[#1F7A8C] text-[#1F7A8C] text-[13px] font-semibold rounded-lg">Update care directives</button>
                <button className="w-full py-2 border border-gray-200 text-[#6B7280] text-[13px] rounded-lg">Export to My Health Record</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (selected === "sarah") {
    return (
      <>
        <DesktopHeader title="Care Plan — Sarah Mitchell" showSearch={false} />
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-5">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-[#1F7A8C] text-[14px] hover:underline self-start">
            <ChevronLeft size={16} /> Back to Care Plans
          </button>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1F7A8C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[20px]">SM</span>
            </div>
            <div className="flex-1">
              <p className="text-[#1A5C6B] font-bold text-[20px]">Sarah Mitchell</p>
              <p className="text-[#6B7280] text-[13px]">34 weeks postpartum · DOB: 12 Mar 1990</p>
            </div>
            <RiskBadge level="high" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-[#1A5C6B] font-bold text-[15px] mb-3">Active Interventions</p>
            {["GP Mental Health Treatment Plan — referred", "Perinatal psychology referral — pending", "Weekly EPDS monitoring", "Passive biometric surveillance active"].map(item => (
              <div key={item} className="flex items-start gap-2 mb-2.5">
                <CheckCircle2 size={15} color="#1F7A8C" className="shrink-0 mt-0.5" />
                <p className="text-[#1A2B32] text-[13px]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // List view
  const PLANS = [
    {
      id: "sarah" as const,
      avatar: "SM", avatarBg: "#1F7A8C", name: "Sarah Mitchell",
      sub: "Mother · 34 wks postpartum · High Risk",
      risk: "high" as const, updated: "2 Jun 2025",
      items: ["GP Mental Health Plan", "Psychology referral", "Passive monitoring"],
    },
    {
      id: "michael" as const,
      avatar: null, avatarBg: "#F5A623", name: "Baby Michael Mitchell",
      sub: "Infant · 8 weeks · Enhanced surveillance",
      risk: "monitor" as const, updated: "17 May 2025",
      items: ["Enhanced MCH visits", "Bonding observation", "6-month review planned"],
    },
  ];

  return (
    <>
      <DesktopHeader title="Care Plans" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#6B7280] text-[14px]">2 active care plans in your caseload</p>
          <button className="px-4 py-2 bg-[#1F7A8C] text-white text-[13px] font-semibold rounded-lg">+ New care plan</button>
        </div>
        {PLANS.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: p.avatarBg }}>
              {p.avatar
                ? <span className="text-white font-bold text-[16px]">{p.avatar}</span>
                : <Baby size={24} color="white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[#1A2B32] font-bold text-[16px]">{p.name}</p>
                <RiskBadge level={p.risk} />
              </div>
              <p className="text-[#6B7280] text-[13px]">{p.sub}</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {p.items.map(i => (
                  <span key={i} className="px-2.5 py-0.5 bg-[#E8F4F6] text-[#1A5C6B] text-[12px] rounded-full">{i}</span>
                ))}
              </div>
              <p className="text-[#9CA3AF] text-[12px] mt-2">Last updated: {p.updated}</p>
            </div>
            <button onClick={() => setSelected(p.id)}
              className="px-4 py-2 bg-[#1F7A8C] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1A5C6B] transition-colors shrink-0">
              View plan
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// Clinician Screen — Reports
function ReportsScreen() {
  const [period, setPeriod] = useState<"1m" | "3m" | "6m">("3m");

  const EPDS_TREND = [
    { month: "Jan", avg: 9.2, high: 3 }, { month: "Feb", avg: 10.1, high: 4 },
    { month: "Mar", avg: 9.8, high: 4 }, { month: "Apr", avg: 11.2, high: 6 },
    { month: "May", avg: 10.6, high: 5 }, { month: "Jun", avg: 12.1, high: 8 },
  ];

  const RISK_DIST = [
    { label: "Stable",  value: 18, color: "#2ECC71" },
    { label: "Monitor", value: 9,  color: "#F5A623" },
    { label: "High",    value: 5,  color: "#D64045" },
  ];

  const REFERRALS = [
    { name: "Sarah Mitchell",   type: "Perinatal Psychology",    status: "Pending",   date: "2 Jun 2025" },
    { name: "Amy Chen",         type: "GP Mental Health Plan",   status: "Active",    date: "14 May 2025" },
    { name: "Priya Nair",       type: "Psychiatry",              status: "Completed", date: "3 Apr 2025" },
    { name: "Jess Thompson",    type: "Social Work",             status: "Active",    date: "28 May 2025" },
  ];

  const statusColor: Record<string, string> = { Pending: "#F5A623", Active: "#1F7A8C", Completed: "#2ECC71" };
  const total = RISK_DIST.reduce((s, r) => s + r.value, 0);

  return (
    <>
      <DesktopHeader title="Reports" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-6">

        {/* Period selector */}
        <div className="flex items-center justify-between">
          <p className="text-[#1A5C6B] font-bold text-[16px]">Caseload Overview — Royal Women's Hospital</p>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {(["1m","3m","6m"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded text-[13px] font-semibold transition-all
                  ${period === p ? "bg-[#1F7A8C] text-white" : "text-[#6B7280] hover:text-[#1F7A8C]"}`}>
                {p === "1m" ? "1 Month" : p === "3m" ? "3 Months" : "6 Months"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Patients", value: "32", sub: "+3 this month", color: "#1F7A8C" },
            { label: "High Risk",      value: "5",  sub: "Requires review", color: "#D64045" },
            { label: "Avg EPDS Score", value: "10.6", sub: "↑ 0.8 from last month", color: "#F5A623" },
            { label: "Interventions",  value: "12", sub: "4 referrals pending", color: "#2ECC71" },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm p-5 border-t-4" style={{ borderTopColor: k.color }}>
              <p className="text-[#6B7280] text-[12px] font-semibold uppercase tracking-wide">{k.label}</p>
              <p className="text-[#1A2B32] font-bold text-[32px] mt-1" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[#9CA3AF] text-[12px] mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* EPDS trend chart */}
          <div className="flex-[6] bg-white rounded-xl shadow-sm p-5">
            <p className="text-[#1A5C6B] font-bold text-[15px] mb-4">Average EPDS Score Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={EPDS_TREND} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
                <XAxis key="rep-x" dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis key="rep-y" domain={[0, 20]} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip key="rep-tip" contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <ReferenceLine key="rep-ref" y={13} stroke="#D64045" strokeDasharray="4 2"
                  label={{ value: "Threshold (13)", position: "insideTopRight", fill: "#D64045", fontSize: 10 }} />
                <Line key="rep-avg" type="monotone" dataKey="avg" stroke="#1F7A8C" strokeWidth={2.5}
                  dot={{ r: 4, fill: "#1F7A8C" }} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk distribution */}
          <div className="flex-[4] bg-white rounded-xl shadow-sm p-5">
            <p className="text-[#1A5C6B] font-bold text-[15px] mb-4">Risk Distribution — {total} patients</p>
            <div className="flex flex-col gap-3 mt-2">
              {RISK_DIST.map(r => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Dot color={r.color} />
                      <span className="text-[#1A2B32] text-[14px]">{r.label}</span>
                    </div>
                    <span className="font-bold text-[14px]" style={{ color: r.color }}>
                      {r.value} <span className="text-[#9CA3AF] font-normal text-[12px]">({Math.round(r.value / total * 100)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.value / total * 100}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[#6B7280] text-[12px]">High-risk patients flagged to MCH: <span className="font-bold text-[#1A2B32]">5</span></p>
              <p className="text-[#6B7280] text-[12px] mt-1">Passive monitoring active: <span className="font-bold text-[#1A2B32]">22 patients</span></p>
            </div>
          </div>
        </div>

        {/* Referrals table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Recent Referrals & Interventions</p>
            <button className="text-[#1F7A8C] text-[13px] font-semibold">Export CSV</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8F4F6]">
                {["Patient", "Referral Type", "Status", "Date"].map(h => (
                  <th key={h} className="text-left text-[#1A5C6B] font-bold text-[13px] px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERRALS.map(r => (
                <tr key={r.name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-[14px] font-semibold text-[#1A2B32]">{r.name}</td>
                  <td className="px-5 py-3 text-[14px] text-[#6B7280]">{r.type}</td>
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold text-white"
                      style={{ backgroundColor: statusColor[r.status] }}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-[14px] text-[#6B7280]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Clinician Screen — Settings
function ClinicianSettingsScreen() {
  const [notifs, setNotifs] = useState([true, true, false, true]);
  const [integrations, setIntegrations] = useState([true, true, false]);
  const NOTIF_LABELS = ["High-risk EPDS alerts", "Missed check-in alerts", "Weekly caseload digest", "Infant flag notifications"];
  const INTEGRATION_LABELS = ["Royal Women's Hospital EHR (SMART on FHIR)", "My Health Record API", "Perinatal Psychology Referral System"];

  return (
    <>
      <DesktopHeader title="Settings" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">

          {/* Profile */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Clinician Profile</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1F7A8C] flex items-center justify-center text-white font-bold text-[18px] shrink-0">EW</div>
              <div>
                <p className="text-[#1A2B32] font-bold text-[16px]">Dr. Emma Wilson</p>
                <p className="text-[#6B7280] text-[13px]">Midwife · Perinatal Mental Health Unit</p>
                <p className="text-[#6B7280] text-[13px]">Royal Women's Hospital</p>
              </div>
            </div>
            {[
              { label: "Provider ID", value: "HPI-I 8003 6100 0020 3422" },
              { label: "Email",       value: "e.wilson@rwh.org.au" },
              { label: "EHR Role",    value: "Midwife — Level 3" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{f.label}</span>
                <span className="text-[#1A2B32] text-[13px] font-medium">{f.value}</span>
              </div>
            ))}
            <button className="mt-1 px-4 py-2 border border-[#1F7A8C] rounded-lg text-[#1F7A8C] text-[13px] font-semibold self-start">Edit profile</button>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Notification Preferences</p>
            {NOTIF_LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-[#1A2B32] text-[14px]">{label}</span>
                <Toggle on={notifs[i]} onToggle={() => setNotifs(n => n.map((v, j) => j === i ? !v : v))} />
              </div>
            ))}
            <div className="mt-2 pt-3 border-t border-gray-100">
              <p className="text-[#6B7280] text-[12px]">Alert delivery: <span className="font-semibold text-[#1A2B32]">In-app + Email</span></p>
            </div>
          </div>

          {/* EHR Integrations */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">EHR Integrations</p>
            {INTEGRATION_LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-[#1A2B32] text-[14px]">{label}</p>
                  <p className="text-[#9CA3AF] text-[11px] mt-0.5">{integrations[i] ? "Connected · SMART on FHIR v2" : "Not connected"}</p>
                </div>
                <Toggle on={integrations[i]} onToggle={() => setIntegrations(n => n.map((v, j) => j === i ? !v : v))} />
              </div>
            ))}
          </div>

          {/* Session & Security */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Session & Security</p>
            {[
              { label: "Session timeout",        value: "30 minutes" },
              { label: "Authentication method",  value: "SMART on FHIR SSO" },
              { label: "Last login",             value: "Today, 8:34 AM" },
              { label: "Data residency",         value: "Australia (ap-southeast-2)" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{f.label}</span>
                <span className="text-[#1A2B32] text-[13px] font-medium">{f.value}</span>
              </div>
            ))}
            <button className="mt-1 px-4 py-2 bg-[#D64045] rounded-lg text-white text-[13px] font-semibold self-start">Sign out</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SMART on FHIR LOGIN ────────────────────────────────────────────────────
type SmartAuthStep = "idle" | "redirecting" | "authenticating" | "context" | "done";

function SmartFHIRLoginScreen({ role, onSuccess }: {
  role: "clinician" | "mch";
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<SmartAuthStep>("idle");

  const isClinician = role === "clinician";
  const ehrName = isClinician ? "Royal Women's Hospital EHR" : "Maternal & Child Health IS";
  const userName = isClinician ? "Dr. Emma Wilson" : "Nurse Priya Sharma";
  const userRole = isClinician ? "Midwife · Perinatal Mental Health Unit" : "MCH Nurse · Area Health Service";
  const userInitials = isClinician ? "EW" : "PS";

  const STEPS: { key: SmartAuthStep; label: string }[] = [
    { key: "redirecting",     label: `Redirecting to ${ehrName}…` },
    { key: "authenticating",  label: "Authenticating via SMART on FHIR…" },
    { key: "context",         label: "Loading patient context…" },
    { key: "done",            label: "Access granted" },
  ];

  function handleLogin() {
    const delays = [700, 1100, 900, 600];
    let acc = 0;
    (["redirecting", "authenticating", "context", "done"] as SmartAuthStep[]).forEach((s, i) => {
      acc += delays[i];
      setTimeout(() => {
        setStep(s);
        if (s === "done") setTimeout(onSuccess, 500);
      }, acc);
    });
  }

  const activeIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F8FAFB]">
      <div className="w-full max-w-[480px] flex flex-col gap-6 px-6">

        {/* Logo + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <SentinaLogo className="h-24 w-auto object-contain" />
          <div>
            <p className="text-[#1A5C6B] font-bold text-[22px] mt-1">
              {isClinician ? "Clinician Sign-In" : "MCH Nurse Sign-In"}
            </p>
            <p className="text-[#6B7280] text-[14px] mt-1">
              Access is provided via SMART on FHIR single sign-on from your hospital EHR
            </p>
          </div>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

          {/* EHR identity block */}
          <div className="flex items-center gap-4 p-4 bg-[#E8F4F6] rounded-xl">
            <div className="w-11 h-11 rounded-xl bg-[#1F7A8C] flex items-center justify-center shrink-0">
              <FileText size={20} color="white" />
            </div>
            <div>
              <p className="text-[#1A5C6B] font-bold text-[15px]">{ehrName}</p>
              <p className="text-[#6B7280] text-[12px]">SMART on FHIR v2 · HL7 compliant</p>
            </div>
          </div>

          {step === "idle" ? (
            <>
              <div className="flex flex-col gap-2 text-[13px] text-[#6B7280]">
                {[
                  "Your clinical role and permissions are inherited from the EHR",
                  "Patient context is automatically supplied — no duplicate entry",
                  "Session is bound to your EHR token and expires on logout",
                ].map(t => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2 size={15} color="#2ECC71" className="shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleLogin}
                className="w-full h-[48px] bg-[#1F7A8C] hover:bg-[#1A5C6B] text-white font-bold text-[15px] rounded-xl transition-colors flex items-center justify-center gap-2">
                <Shield size={16} />
                Sign in with {ehrName}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              {STEPS.map((s, i) => {
                const isDone = activeIdx > i || step === "done";
                const isActive = STEPS[activeIdx]?.key === s.key && step !== "done";
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                      ${isDone ? "bg-[#2ECC71]" : isActive ? "bg-[#1F7A8C]" : "bg-gray-100"}`}>
                      {isDone
                        ? <CheckCircle2 size={14} color="white" />
                        : isActive
                          ? <Loader2 size={14} color="white" className="animate-spin" />
                          : <span className="w-2 h-2 rounded-full bg-gray-300" />
                      }
                    </div>
                    <span className={`text-[13px] ${isDone ? "text-[#1A2B32]" : isActive ? "text-[#1F7A8C] font-semibold" : "text-[#9CA3AF]"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}

              {step === "done" && (
                <div className="mt-3 flex items-center gap-3 bg-[#E8F4F6] rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F7A8C] flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                    {userInitials}
                  </div>
                  <div>
                    <p className="text-[#1A5C6B] font-bold text-[14px]">{userName}</p>
                    <p className="text-[#6B7280] text-[12px]">{userRole}</p>
                  </div>
                  <CheckCircle2 size={18} color="#2ECC71" className="ml-auto shrink-0" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2">
          <Shield size={13} color="#9CA3AF" />
          <p className="text-[#9CA3AF] text-[12px]">
            Secured by SMART on FHIR · OAuth 2.0 · Session encrypted end-to-end
          </p>
        </div>
      </div>
    </div>
  );
}

function ClinicianDashboard({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<ClinicianScreen>("launch");
  const render = () => {
    switch (screen) {
      case "launch": return <FHIRLaunchScreen onReady={() => setScreen("patients")} />;
      case "patients": return <PatientListScreen onView={() => setScreen("detail")} />;
      case "detail": return <PatientDetailScreen onBack={() => setScreen("patients")} />;
      case "alerts":    return <AlertsFeedScreen onViewPatient={() => setScreen("detail")} />;
      case "careplans": return <CarePlansScreen />;
      case "reports":   return <ReportsScreen />;
      case "settings":  return <ClinicianSettingsScreen />;
    }
  };
  if (screen === "launch") {
    return <div className="flex-1 flex flex-col">{render()}</div>;
  }
  return (
    <div className="flex flex-1 overflow-hidden">
      <ClinicianSidebar active={screen} onNav={setScreen} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">{render()}</div>
    </div>
  );
}

// ── MCH NURSE PORTAL ───────────────────────────────────────────────────────
function MCHSidebar({ active, onNav, onLogout }: { active: MCHScreen; onNav: (s: MCHScreen) => void; onLogout: () => void }) {
  const items: { id: MCHScreen; Icon: React.ComponentType<{ size: number; color: string }>; label: string; badge?: number }[] = [
    { id: "flags",       Icon: Flag,      label: "Infant Flags", badge: 5 },
    { id: "assessment",  Icon: Clipboard, label: "Assessments" },
    { id: "history",     Icon: FileText,  label: "Care Plans" },
    { id: "mchsettings", Icon: Settings,  label: "Settings" },
  ];
  return (
    <div className="w-[240px] bg-[#1A5C6B] flex flex-col shrink-0 h-full" style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}>
      <div className="px-6 py-8">
        <SentinaLogo className="h-14 w-auto object-contain brightness-0 invert" />
      </div>
      <nav className="flex-1">
        {items.map(({ id, Icon, label, badge }, idx) => {
          const isActive = active === id;
          return (
            <button key={`mch-nav-${idx}`} onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-5 text-white text-[14px] h-[48px]
                ${isActive ? "bg-white/15 border-l-[3px] border-[#1F7A8C]" : "hover:bg-white/10"}`}>
              <Icon size={18} color="white" />
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className="bg-[#D64045] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/20 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[13px] shrink-0">LC</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[13px]">Lisa Chen</p>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.6)" }}>MCH Nurse — City of Melbourne</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-[13px] font-semibold">
          <LogOut size={15} color="white" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// MCH Screen 1 — Portal Launch
function PortalLaunchScreen({ onReady }: { onReady: () => void }) {
  useEffect(() => { const t = setTimeout(onReady, 2500); return () => clearTimeout(t); }, [onReady]);
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 bg-white">
      <SentinaLogo className="w-[200px] object-contain" />
      <Loader2 size={36} color="#1F7A8C" className="animate-spin" />
      <p className="text-[#6B7280] text-[14px]">Loading infant surveillance data...</p>
      <div className="flex items-center gap-2">
        <Shield size={16} color="#1F7A8C" />
        <p className="text-[#1F7A8C] text-[12px]">Role: MCH Nurse — accessing infant flags only</p>
      </div>
    </div>
  );
}

// MCH Screen 2 — Infant Surveillance Dashboard
function InfantFlagsScreen({ onAssess }: { onAssess: () => void }) {
  const INFANTS = [
    { name: "Baby Mitchell", dob: "12 Mar 2025", risk: "high" as const, duration: "3 weeks", durationColor: "#D64045", rec: "Enhanced developmental surveillance", due: "Overdue", dueColor: "#D64045", cta: "Assess now", ctaPrimary: true },
    { name: "Baby Thompson", dob: "8 Feb 2025", risk: "monitor" as const, duration: "2 weeks", durationColor: "#F5A623", rec: "Monitor development closely", due: "Due today", dueColor: "#F5A623", cta: "Assess now", ctaPrimary: true },
    { name: "Baby Nguyen", dob: "2 Feb 2025", risk: "monitor" as const, duration: "2 weeks", durationColor: "#F5A623", rec: "Monitor development closely", due: "Due this week", dueColor: "#6B7280", cta: "Assess now", ctaPrimary: true },
    { name: "Baby Patel", dob: "18 Jan 2025", risk: "monitor" as const, duration: "2 weeks", durationColor: "#F5A623", rec: "Monitor development closely", due: "Due next week", dueColor: "#6B7280", cta: "Schedule", ctaPrimary: false },
  ];
  return (
    <>
      <DesktopHeader title="Infant Surveillance Dashboard" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-6">
        <p className="text-[#6B7280] text-[14px] -mt-2">Infants with active maternal mental health flags</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Flags", value: "5", color: "#1A5C6B" },
            { label: "Red Risk", value: "2", color: "#D64045" },
            { label: "Amber Risk", value: "3", color: "#F5A623" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border-t-[3px]" style={{ borderTopColor: "#1F7A8C" }}>
              <p className="text-[#6B7280] text-[13px]">{label}</p>
              <p className="font-bold text-[32px]" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8F4F6]">
                {["Infant Name", "DOB", "Maternal Risk", "Risk Duration", "Recommendation", "Assessment Due", "Action"].map(h => (
                  <th key={h} className="text-left text-[#1A5C6B] font-bold text-[13px] px-4 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INFANTS.map((inf, i) => (
                <tr key={inf.name} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFB]"}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👶</span>
                      <span className="text-[#1A5C6B] font-bold text-[15px]">{inf.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#6B7280] text-[13px]">{inf.dob}</td>
                  <td className="px-4 py-4"><RiskBadge level={inf.risk} /></td>
                  <td className="px-4 py-4 font-semibold text-[13px]" style={{ color: inf.durationColor }}>{inf.duration}</td>
                  <td className="px-4 py-4 text-[#1A2B32] text-[13px]">{inf.rec}</td>
                  <td className="px-4 py-4 font-bold text-[13px]" style={{ color: inf.dueColor }}>{inf.due}</td>
                  <td className="px-4 py-4">
                    <button onClick={inf.name === "Baby Mitchell" ? onAssess : undefined}
                      className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold ${inf.ctaPrimary
                        ? "bg-[#1F7A8C] text-white" : "border border-gray-300 text-[#6B7280]"}`}>
                      {inf.cta}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#E8F4F6] rounded-xl p-4 flex items-start gap-3">
          <Info size={18} color="#1F7A8C" className="shrink-0 mt-0.5" />
          <p className="text-[#6B7280] text-[13px]">
            Flags are generated by Sentina when maternal mental health risk is amber or red for 2 or more consecutive weeks.
            Assessment results submitted here are shared with the maternal care team via the Sentina FHIR server.
          </p>
        </div>
      </div>
    </>
  );
}

// MCH Screen 3 — Assessment Entry
function AssessmentEntryScreen({ onBack }: { onBack: () => void }) {
  const [domains, setDomains] = useState(["above", "above", "near", "above", "near"]);
  const [result, setResult] = useState("monitor");
  const [obs, setObs] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const DOMAINS = ["Communication", "Gross Motor", "Fine Motor", "Problem Solving", "Personal-Social"];
  const CUTOFFS = ["above", "near", "below"];
  return (
    <>
      <DesktopHeader title="Record Developmental Assessment" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB]">
        <p className="text-[#6B7280] text-[13px] mb-5">Infant Flags &gt; Baby Mitchell &gt; New Assessment</p>
        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex-[65] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-[#F5A623] p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center text-2xl shrink-0">👶</div>
                  <div>
                    <p className="text-[#1A5C6B] font-bold text-[18px]">Baby Mitchell</p>
                    <p className="text-[#6B7280] text-[13px]">DOB: 12 Mar 2025 (12 weeks old)</p>
                    <p className="text-[#6B7280] text-[13px]">Mother: Sarah Mitchell</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#6B7280] text-[13px] mb-1">Maternal Risk:</p>
                  <RiskBadge level="high" />
                  <p className="text-[#F5A623] text-[13px] mt-1">Risk duration: 3 weeks</p>
                  <p className="text-[#6B7280] text-[12px]">Sentina flag active since: 14 Apr 2025</p>
                </div>
              </div>
            </div>
            {submitted ? (
              <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-[#1F7A8C] p-12 flex flex-col items-center gap-3">
                <CheckCircle2 size={48} color="#2ECC71" />
                <p className="text-[#1A5C6B] font-bold text-[16px]">Assessment recorded successfully</p>
                <p className="text-[#6B7280] text-[14px]">Results shared with Sarah Mitchell's care team via Sentina.</p>
                <button onClick={onBack} className="text-[#1F7A8C] text-[14px] font-semibold mt-2">Return to infant flags</button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-[#1F7A8C] p-5 flex flex-col gap-4">
                <p className="text-[#1F7A8C] font-bold text-[16px]">ASQ-3 Developmental Assessment</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">Assessment Date</p>
                    <input type="date" defaultValue="2025-06-02"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#1F7A8C]" />
                  </div>
                  <div>
                    <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">Assessment Location</p>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#1F7A8C]">
                      <option>Home visit</option><option>Clinic</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-[#1A5C6B] text-[13px] font-bold mb-1">Assessor</p>
                  <input type="text" value="Lisa Chen — MCH Nurse" readOnly
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#6B7280] bg-gray-50" />
                </div>
                <p className="text-[#1A5C6B] font-bold text-[16px]">Domain Scores</p>
                {DOMAINS.map((d, i) => (
                  <div key={`domain-${i}`} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <p className="text-[#1A5C6B] font-bold text-[14px] w-36 shrink-0">{d}</p>
                    <div className="flex gap-4 flex-1">
                      {CUTOFFS.map(c => (
                        <label key={c} className="flex items-center gap-1.5 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                            ${domains[i] === c ? "border-[#1F7A8C]" : "border-gray-300"}`}
                            onClick={() => setDomains(dms => dms.map((v, j) => j === i ? c : v))}>
                            {domains[i] === c && <div className="w-2 h-2 rounded-full bg-[#1F7A8C]" />}
                          </div>
                          <span className="text-[13px] capitalize">{c} cutoff</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-[#1A5C6B] font-bold text-[14px] mb-2">Overall ASQ-3 Result</p>
                  <select value={result} onChange={e => setResult(e.target.value)}
                    className="w-full border border-[#1F7A8C] rounded-lg px-3 py-2 text-[14px] focus:outline-none">
                    <option value="track">Development on track</option>
                    <option value="monitor">Monitor development</option>
                    <option value="referral">Referral recommended</option>
                  </select>
                </div>
                <div>
                  <p className="text-[#1A5C6B] font-bold text-[14px] mb-2">Clinical Observations</p>
                  <textarea value={obs} onChange={e => setObs(e.target.value)}
                    placeholder="Document your clinical observations and any concerns..."
                    className="w-full border border-gray-200 rounded-lg p-3 text-[14px] resize-none focus:outline-none focus:border-[#1F7A8C]"
                    rows={4} />
                </div>
                <button onClick={() => setSubmitted(true)}
                  className="w-full h-[48px] bg-[#1F7A8C] text-white font-bold text-[16px] rounded-xl">
                  Submit Assessment
                </button>
              </div>
            )}
          </div>
          {/* Right column */}
          <div className="flex-[35] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-[#1F7A8C] p-5">
              <p className="text-[#1F7A8C] font-bold text-[14px]">Maternal Mental Health Context</p>
              <p className="text-[#6B7280] text-[11px] italic mb-3">For clinical context only — provided by Sentina</p>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#6B7280] text-[13px]">Current risk:</p>
                <RiskBadge level="high" />
              </div>
              <p className="text-[#6B7280] text-[13px] font-bold mb-2">EPDS Score (last 8 weeks)</p>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={SPARK} margin={{ top: 4, right: 8, bottom: 0, left: -30 }}>
                  <XAxis key="sp-x" dataKey="w" tick={{ fontSize: 9, fill: "#6B7280" }} />
                  <YAxis key="sp-y" domain={[0, 30]} tick={{ fontSize: 9, fill: "#6B7280" }} />
                  <ReferenceLine key="sp-ref" y={13} stroke="#D64045" strokeDasharray="3 2" />
                  <Line key="sp-line" type="monotone" dataKey="v" stroke="#1F7A8C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[#D64045] font-bold text-[14px] mt-2">Latest score: 16</p>
              <div className="border-t border-gray-100 mt-3 pt-3">
                <p className="text-[#6B7280] text-[13px] font-bold mb-2">Passive signals (last 7 days)</p>
                {[
                  { Icon: Heart,      label: "HRV",               value: "58ms ↓",    color: "#D64045" },
                  { Icon: Moon,       label: "Sleep",              value: "5.8 hrs ↓", color: "#F5A623" },
                  { Icon: Footprints, label: "Steps",              value: "3,200 ↓",   color: "#F5A623" },
                  { Icon: Heart,      label: "Resting Heart Rate", value: "82 bpm ↑",  color: "#D64045" },
                ].map(({ Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-2 py-1.5">
                    <Icon size={14} color="#1F7A8C" />
                    <span className="text-[#6B7280] text-[13px] flex-1">{label}</span>
                    <span className="font-semibold text-[13px]" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3">
                <p className="text-[#6B7280] text-[13px]">Flag duration:</p>
                <p className="text-[#D64045] font-bold text-[14px]">3 weeks</p>
              </div>
              <p className="text-[#1F7A8C] text-[12px] mt-3">Full maternal record available via My Health Record</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// MCH Screen 4 — Assessment History
type CarePlanRow = {
  id: string; name: string; dob: string; age: string; mother: string;
  lastVisit: string; nextVisit: string;
  result: string; resultColor: string; level: "stable" | "monitor" | "high";
  shared: boolean; flag: boolean;
};

const MCH_CARE_PLANS: CarePlanRow[] = [
  {
    id: "michael",
    name: "Baby Michael Mitchell", dob: "6 Apr 2025", age: "8 weeks", mother: "Sarah Mitchell",
    lastVisit: "17 May 2025", nextVisit: "1 Jun 2025",
    result: "Enhanced surveillance", resultColor: "#F5A623", level: "monitor",
    shared: true, flag: true,
  },
  {
    id: "nguyen",
    name: "Baby Nguyen", dob: "12 Feb 2025", age: "11 weeks", mother: "Linh Nguyen",
    lastVisit: "15 Apr 2025", nextVisit: "15 Jun 2025",
    result: "Development on track", resultColor: "#2ECC71", level: "stable",
    shared: true, flag: false,
  },
  {
    id: "thompson",
    name: "Baby Thompson", dob: "5 Jan 2025", age: "17 weeks", mother: "Jess Thompson",
    lastVisit: "10 Apr 2025", nextVisit: "10 Jun 2025",
    result: "Monitor development", resultColor: "#F5A623", level: "monitor",
    shared: true, flag: false,
  },
  {
    id: "patel",
    name: "Baby Patel", dob: "20 Dec 2024", age: "23 weeks", mother: "Priya Nair",
    lastVisit: "2 Apr 2025", nextVisit: "2 Jun 2025",
    result: "Referral recommended", resultColor: "#D64045", level: "high",
    shared: false, flag: false,
  },
];

function MCHCarePlanDetail({ plan, onBack }: { plan: CarePlanRow; onBack: () => void }) {
  const isMichael = plan.id === "michael";

  const milestones = isMichael ? [
    { label: "Birth weight check",           date: "6 Apr 2025",   status: "Met",     note: "3.4 kg — within normal range" },
    { label: "2-week maternal bonding obs.",  date: "20 Apr 2025",  status: "Met",     note: "Adequate bonding observed, feeding well" },
    { label: "6-week general check",          date: "17 May 2025",  status: "Met",     note: "Social smile present, reflexes normal" },
    { label: "8-week immunisations",          date: "1 Jun 2025",   status: "Due",     note: "DTaP-IPV-Hib, Hep B, Rotavirus" },
    { label: "4-month developmental review", date: "6 Aug 2025",   status: "Planned", note: "Motor, vision, hearing screening" },
    { label: "6-month enhanced review",      date: "6 Oct 2025",   status: "Planned", note: "Enhanced — maternal EPDS monitoring in effect" },
  ] : [
    { label: "Birth check",            date: plan.dob,        status: "Met",     note: "Normal birth weight and reflexes" },
    { label: "2-week visit",           date: "2 weeks later", status: "Met",     note: "Feeding established" },
    { label: "6-week general check",   date: plan.lastVisit,  status: "Met",     note: plan.result },
    { label: "4-month check",          date: plan.nextVisit,  status: "Planned", note: "Routine developmental screening" },
  ];

  const directives = isMichael ? [
    "Monthly enhanced MCH visits until maternal EPDS < 10 for 4 consecutive weeks",
    "Maternal bonding observation documented at every visit",
    "Flag to DHHS if two consecutive missed visits or safeguarding concern identified",
    "Coordinate with Dr. Emma Wilson on maternal mental health before each visit",
  ] : [
    "Routine MCH visits per schedule",
    "Notify assigned GP if developmental concerns identified",
    plan.level !== "stable" ? "Monitor closely and reassess at next visit" : "Continue standard care pathway",
  ];

  const visits = isMichael ? [
    { date: "17 May 2025", by: "Lisa Chen",       note: "6-week check — normal development, bonding adequate, maternal fatigue noted" },
    { date: "20 Apr 2025", by: "Lisa Chen",       note: "2-week visit — feeding well, weight gain normal" },
    { date: "6 Apr 2025",  by: "Dr. Emma Wilson", note: "Birth handover — enhanced surveillance flag active from maternal risk" },
  ] : [
    { date: plan.lastVisit, by: "Lisa Chen", note: plan.result + " — no concerns flagged" },
  ];

  const sc: Record<string, string> = { Met: "#2ECC71", Due: "#F5A623", Planned: "#9CA3AF" };

  return (
    <>
      <DesktopHeader title={`Care Plan — ${plan.name}`} showSearch={false} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-5">
        <button onClick={onBack}
          className="flex items-center gap-1 text-[#1F7A8C] text-[14px] hover:underline self-start">
          <ChevronLeft size={16} /> Back to Care Plans
        </button>

        {/* Infant header */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: plan.level === "high" ? "#D64045" : plan.level === "monitor" ? "#F5A623" : "#2ECC71" }}>
            <Baby size={28} color="white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-[#1A5C6B] font-bold text-[20px]">{plan.name}</p>
              <RiskBadge level={plan.level} />
              {plan.flag && (
                <span className="px-2.5 py-0.5 bg-[#FEF3C7] text-[#F5A623] text-[12px] font-bold rounded-full">Enhanced surveillance</span>
              )}
            </div>
            <p className="text-[#6B7280] text-[13px] mt-1">DOB: {plan.dob} · Age: {plan.age} · Mother: {plan.mother}</p>
            <p className="text-[#6B7280] text-[13px]">MCH Nurse: Lisa Chen{isMichael ? " · Assigned Midwife: Dr. Emma Wilson" : ""}</p>
            {isMichael && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                <span className="text-[#F5A623] text-[13px] font-semibold">Maternal EPDS 16 — enhanced infant monitoring active</span>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#9CA3AF] text-[12px]">Last visit: <span className="text-[#1A2B32] font-semibold">{plan.lastVisit}</span></p>
            <p className="text-[#9CA3AF] text-[12px] mt-1">Next visit: <span className="text-[#1F7A8C] font-semibold">{plan.nextVisit}</span></p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left — milestones + directives */}
          <div className="flex-[6] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-[#1A5C6B] font-bold text-[16px] mb-4">Developmental Milestones</p>
              {milestones.map(m => (
                <div key={m.label} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: sc[m.status] }} />
                  <div className="flex-1">
                    <p className="text-[#1A2B32] text-[14px] font-semibold">{m.label}</p>
                    <p className="text-[#6B7280] text-[12px] mt-0.5">{m.note}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: sc[m.status] }}>{m.status}</span>
                    <p className="text-[#9CA3AF] text-[11px] mt-1">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-[#1A5C6B] font-bold text-[15px] mb-3">Care Directives</p>
              {directives.map((d, i) => (
                <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0">
                  <CheckCircle2 size={15} color="#1F7A8C" className="shrink-0 mt-0.5" />
                  <p className="text-[#1A2B32] text-[13px]">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — risk summary, visit log, actions */}
          <div className="flex-[4] flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border-l-4 p-5"
              style={{ borderLeftColor: plan.level === "high" ? "#D64045" : plan.level === "monitor" ? "#F5A623" : "#2ECC71" }}>
              <p className="font-bold text-[15px] mb-3" style={{ color: plan.level === "high" ? "#D64045" : plan.level === "monitor" ? "#F5A623" : "#2ECC71" }}>
                Risk Summary
              </p>
              {(isMichael ? [
                { label: "Maternal EPDS (latest)",  value: "16",        color: "#D64045" },
                { label: "Maternal risk status",    value: "High Risk", color: "#D64045" },
                { label: "Infant risk status",      value: "Monitor",   color: "#F5A623" },
                { label: "Weeks under enhanced obs",value: "3 weeks",   color: "#F5A623" },
                { label: "ASQ-3 last score",        value: "Normal",    color: "#2ECC71" },
              ] : [
                { label: "ASQ-3 result",   value: plan.result,  color: plan.resultColor },
                { label: "Risk level",     value: plan.level.charAt(0).toUpperCase() + plan.level.slice(1), color: plan.resultColor },
                { label: "Weeks on file",  value: "On track",   color: "#2ECC71" },
              ]).map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-[#6B7280] text-[13px]">{r.label}</span>
                  <span className="font-bold text-[14px]" style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-[#1A5C6B] font-bold text-[15px] mb-3">Visit Log</p>
              {visits.map(v => (
                <div key={v.date} className="mb-3 last:mb-0 pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center">
                    <p className="text-[#1A2B32] text-[13px] font-semibold">{v.by}</p>
                    <p className="text-[#9CA3AF] text-[11px]">{v.date}</p>
                  </div>
                  <p className="text-[#6B7280] text-[12px] mt-0.5">{v.note}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2">
              <p className="text-[#1A5C6B] font-bold text-[14px] mb-1">Actions</p>
              <button className="w-full py-2.5 bg-[#1F7A8C] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1A5C6B] transition-colors">
                Record new visit
              </button>
              <button className="w-full py-2.5 border border-[#1F7A8C] text-[#1F7A8C] text-[13px] font-semibold rounded-lg hover:bg-[#E8F4F6] transition-colors">
                Update care directives
              </button>
              <button className="w-full py-2.5 border border-gray-200 text-[#6B7280] text-[13px] rounded-lg hover:bg-gray-50 transition-colors">
                Export to My Health Record
              </button>
              {plan.flag && (
                <button className="w-full py-2.5 bg-[#FEF3C7] text-[#F5A623] text-[13px] font-semibold rounded-lg">
                  Notify DHHS — safeguarding
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AssessmentHistoryScreen() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<CarePlanRow | null>(null);

  if (selected) return <MCHCarePlanDetail plan={selected} onBack={() => setSelected(null)} />;

  const filtered = tab === "Flagged"
    ? MCH_CARE_PLANS.filter(r => r.flag)
    : tab === "Referral recommended"
      ? MCH_CARE_PLANS.filter(r => r.level === "high")
      : MCH_CARE_PLANS;

  return (
    <>
      <DesktopHeader title="Care Plans" />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-t-xl px-2 py-1">
            {["All", "Flagged", "Referral recommended"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-all
                  ${tab === t ? "bg-[#1F7A8C] text-white" : "text-[#6B7280] hover:text-[#1F7A8C]"}`}>
                {t}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-[#1F7A8C] text-white text-[13px] font-semibold rounded-lg">+ New care plan</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8F4F6]">
                {["Infant", "Age / DOB", "Mother", "Last Visit", "Status", "Shared", "Action"].map(h => (
                  <th key={h} className="text-left text-[#1A5C6B] font-bold text-[13px] px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className={`border-t border-gray-100 hover:bg-[#F0F9FA] transition-colors ${row.flag ? "bg-[#FFFBEB]" : i % 2 === 0 ? "bg-white" : "bg-[#F8FAFB]"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: row.level === "high" ? "#FEE2E2" : row.level === "monitor" ? "#FEF3C7" : "#DCFCE7" }}>
                        <Baby size={16} color={row.level === "high" ? "#D64045" : row.level === "monitor" ? "#F5A623" : "#2ECC71"} />
                      </div>
                      <div>
                        <p className="text-[#1A5C6B] font-bold text-[13px]">{row.name}</p>
                        {row.flag && <span className="text-[10px] font-bold text-[#F5A623]">⚑ Enhanced</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-[13px]">
                    <p>{row.age}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{row.dob}</p>
                  </td>
                  <td className="px-4 py-3 text-[#1A2B32] text-[13px] font-medium">{row.mother}</td>
                  <td className="px-4 py-3 text-[#6B7280] text-[13px]">{row.lastVisit}</td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-bold" style={{ color: row.resultColor }}>{row.result}</span>
                  </td>
                  <td className="px-4 py-3">
                    {row.shared
                      ? <div className="flex items-center gap-1"><CheckCircle2 size={14} color="#2ECC71" /><span className="text-[#2ECC71] text-[12px]">Shared</span></div>
                      : <span className="text-[#9CA3AF] text-[12px]">Pending</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(row)}
                      className="px-3 py-1.5 bg-[#1F7A8C] text-white text-[12px] font-semibold rounded-lg hover:bg-[#1A5C6B] transition-colors">
                      View plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// MCH Screen — Settings
function MCHSettingsScreen() {
  const [notifs, setNotifs] = useState([true, true, false, true]);
  const [sharing, setSharing] = useState([true, true, false]);
  const NOTIF_LABELS = ["New infant flags from clinicians", "Missed visit alerts", "Weekly caseload summary", "EPDS threshold breaches"];
  const SHARING_LABELS = ["Share assessment data with assigned midwife", "Push updates to My Health Record", "DHHS mandatory reporting integration"];

  return (
    <>
      <DesktopHeader title="Settings" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFB] flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">

          {/* MCH Nurse profile */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">MCH Nurse Profile</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1F7A8C] flex items-center justify-center text-white font-bold text-[18px] shrink-0">LC</div>
              <div>
                <p className="text-[#1A2B32] font-bold text-[16px]">Lisa Chen</p>
                <p className="text-[#6B7280] text-[13px]">MCH Nurse · City of Melbourne</p>
                <p className="text-[#6B7280] text-[13px]">Area Health Service — Inner North</p>
              </div>
            </div>
            {[
              { label: "Provider ID",   value: "HPI-I 8003 6100 0084 1127" },
              { label: "Email",         value: "l.chen@health.vic.gov.au" },
              { label: "Service region",value: "City of Melbourne LGA" },
              { label: "EHR access",    value: "MCH Information System" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{f.label}</span>
                <span className="text-[#1A2B32] text-[13px] font-medium">{f.value}</span>
              </div>
            ))}
            <button className="mt-1 px-4 py-2 border border-[#1F7A8C] rounded-lg text-[#1F7A8C] text-[13px] font-semibold self-start">Edit profile</button>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Notification Preferences</p>
            {NOTIF_LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-[#1A2B32] text-[14px]">{label}</span>
                <Toggle on={notifs[i]} onToggle={() => setNotifs(n => n.map((v, j) => j === i ? !v : v))} />
              </div>
            ))}
            <div className="mt-2 pt-3 border-t border-gray-100">
              <p className="text-[#6B7280] text-[12px]">Delivery: <span className="font-semibold text-[#1A2B32]">In-app + SMS</span></p>
            </div>
          </div>

          {/* Data sharing */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Data Sharing & Integration</p>
            {SHARING_LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-[#1A2B32] text-[14px]">{label}</p>
                  <p className="text-[#9CA3AF] text-[11px] mt-0.5">{sharing[i] ? "Active" : "Disabled"}</p>
                </div>
                <Toggle on={sharing[i]} onToggle={() => setSharing(n => n.map((v, j) => j === i ? !v : v))} />
              </div>
            ))}
          </div>

          {/* Session & Security */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[#1A5C6B] font-bold text-[15px]">Session & Security</p>
            {[
              { label: "Session timeout",       value: "20 minutes" },
              { label: "Authentication",        value: "SMART on FHIR SSO" },
              { label: "Last login",            value: "Today, 7:58 AM" },
              { label: "Role-based access",     value: "MCH Nurse — read/write infant records" },
              { label: "Data residency",        value: "Australia (ap-southeast-2)" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-[#6B7280] text-[13px]">{f.label}</span>
                <span className="text-[#1A2B32] text-[13px] font-medium">{f.value}</span>
              </div>
            ))}
            <button className="mt-1 px-4 py-2 bg-[#D64045] rounded-lg text-white text-[13px] font-semibold self-start">Sign out</button>
          </div>
        </div>
      </div>
    </>
  );
}

function MCHNursePortal({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<MCHScreen>("launch");
  const render = () => {
    switch (screen) {
      case "launch": return <PortalLaunchScreen onReady={() => setScreen("flags")} />;
      case "flags":       return <InfantFlagsScreen onAssess={() => setScreen("assessment")} />;
      case "assessment":  return <AssessmentEntryScreen onBack={() => setScreen("flags")} />;
      case "history":     return <AssessmentHistoryScreen />;
      case "mchsettings": return <MCHSettingsScreen />;
    }
  };
  if (screen === "launch") {
    return <div className="flex-1 flex flex-col">{render()}</div>;
  }
  return (
    <div className="flex flex-1 overflow-hidden">
      <MCHSidebar active={screen} onNav={setScreen} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">{render()}</div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [iface, setIface] = useState<InterfaceId>("patient");
  const [clinicianAuthed, setClinicianAuthed] = useState(false);
  const [mchAuthed, setMchAuthed] = useState(false);

  const TABS: { id: InterfaceId; label: string }[] = [
    { id: "patient", label: "📱  Patient App" },
    { id: "clinician", label: "🖥️  Clinician Dashboard" },
    { id: "mch", label: "🏥  MCH Nurse Portal" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <div className="bg-[#1A5C6B] flex items-center justify-end px-6 py-2 shrink-0">
        <div className="flex gap-1">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setIface(id)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all
                ${iface === id ? "bg-white text-[#1A5C6B]" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {iface === "patient" && (
          <div className="flex-1 overflow-y-auto">
            <PatientApp />
          </div>
        )}
        {iface === "clinician" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {clinicianAuthed
              ? <ClinicianDashboard onLogout={() => setClinicianAuthed(false)} />
              : <SmartFHIRLoginScreen role="clinician" onSuccess={() => setClinicianAuthed(true)} />
            }
          </div>
        )}
        {iface === "mch" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {mchAuthed
              ? <MCHNursePortal onLogout={() => setMchAuthed(false)} />
              : <SmartFHIRLoginScreen role="mch" onSuccess={() => setMchAuthed(true)} />
            }
          </div>
        )}
      </div>
    </div>
  );
}
