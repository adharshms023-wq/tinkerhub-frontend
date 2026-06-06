import { createFileRoute } from "@tanstack/react-router";
import { Users, UserCheck, CalendarOff, TrendingUp, Zap, Settings, LayoutDashboard, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tinkerhub · Attendance Dashboard" },
      { name: "description", content: "Real-time attendance, leave status and team engagement for the Tinkerhub crew." },
      { property: "og:title", content: "Tinkerhub · Attendance Dashboard" },
      { property: "og:description", content: "Real-time attendance, leave status and team engagement for the Tinkerhub crew." },
    ],
  }),
  component: Dashboard,
});

// Mock values – swap with template/server data later

type Stat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bg: string;
  delta: string;
};



function Dashboard() {
  const [data, setData] = useState({
    total_employees: 0,
    present_today: 0,
    leave_today: 0,
    attendance_rate: 0,
  });
  const [resolvedApiUrl, setResolvedApiUrl] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    setResolvedApiUrl(apiUrl);
    
    const fetchDashboard = () => {
      fetch(`${apiUrl}/api/dashboard/`)
        .then((res) => res.json())
        .then((result) => setData(result))
        .catch((err) => console.error(err));
    };

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 3000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const stats: Stat[] = [
  { label: "Total Employees", value: String(data.total_employees), icon: Users, bg: "bg-[var(--color-lilac)]", delta: "+2 this week" },
  { label: "Present Today", value: String(data.present_today), icon: UserCheck, bg: "bg-[var(--color-mint)]", delta: "On schedule" },
  { label: "On Leave", value: String(data.leave_today), icon: CalendarOff, bg: "bg-[var(--color-coral)]", delta: "3 approved" },
  { label: "Attendance Rate", value: `${data.attendance_rate}%`, icon: TrendingUp, bg: "bg-[var(--color-bolt)]", delta: "▲ 4% vs last wk" },
];
  return (
    <div className="min-h-screen text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="brutal-sm flex h-10 w-10 items-center justify-center rounded-xl bg-bolt">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">tinkerhub</div>
              <div className="text-lg font-bold">Attendance</div>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a className="brutal-sm brutal-hover flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-background">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </a>
            <a className="brutal-sm brutal-hover flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold">
              <Users className="h-4 w-4" /> Employees
            </a>
            <a className="brutal-sm brutal-hover hidden items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold sm:flex">
              <Settings className="h-4 w-4" /> Admin
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <section className="brutal relative overflow-hidden rounded-3xl bg-bolt p-8 md:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rotate-12 rounded-3xl border-2 border-ink bg-mint" />
          <div className="absolute -bottom-12 right-32 h-32 w-32 rounded-full border-2 border-ink bg-coral" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-background px-3 py-1 font-mono text-xs uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> {today}
            </div>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[0.95] md:text-6xl">
              Attendance <span className="italic">overview.</span>
            </h1>
            <p className="mt-3 max-w-xl text-base md:text-lg">
              Monitor the Tinkerhub crew — who's in, who's out, and how the team is showing up today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="brutal-sm brutal-hover inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-background">
                Mark Attendance <ArrowUpRight className="h-4 w-4" />
              </button>
              <button className="brutal-sm brutal-hover inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 font-semibold">
                Export Report
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`brutal brutal-hover rounded-3xl ${s.bg} p-5`}>
              <div className="flex items-start justify-between">
                <div className="brutal-sm flex h-10 w-10 items-center justify-center rounded-xl bg-background">
                  <s.icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest">{s.delta}</span>
              </div>
              <div className="mt-6">
                <div className="text-5xl font-bold leading-none">{s.value}</div>
                <div className="mt-2 text-sm font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </section>
          
        {/* PANELS */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Today's summary */}
          <div className="brutal rounded-3xl bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">📅 Today's Summary</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">live</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <SummaryTile value={data.total_employees} label="Employees" tone="bg-lilac" />
              <SummaryTile value={data.present_today} label="Present" tone="bg-mint" />
              <SummaryTile value={data.leave_today} label="Leave" tone="bg-coral" />
              <SummaryTile value={`${data.attendance_rate}%`} label="Rate" tone="bg-bolt" />
            </div>
            

            {/* Attendance bar */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                <span>Attendance pulse</span>
                <span>{data.attendance_rate}% / 100%</span>
              </div>
              <div className="brutal-sm h-6 overflow-hidden rounded-full bg-background">
                <div
                  className="flex h-full items-center justify-end rounded-full bg-ink pr-2 font-mono text-[10px] text-background"
                  style={{ width: `${data.attendance_rate}%` }}
                >
                  {data.attendance_rate}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="brutal rounded-3xl bg-ink p-6 text-background">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <p className="mt-1 text-sm opacity-70">Jump straight to the tools you use most.</p>

            <div className="mt-6 space-y-3">
              <ActionBtn icon={Users} label="Manage Employees" />
              <ActionBtn icon={Settings} label="Admin Panel" />
              <ActionBtn icon={CalendarOff} label="Leave Requests" />
            </div>

            <div className="mt-8 border-t border-background/20 pt-4 font-mono text-[11px] uppercase tracking-widest opacity-60">
              built with ⚡ at tinkerhub
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} Tinkerhub — Learn. Make. Share.
        {resolvedApiUrl && (
          <div className="mt-2 lowercase opacity-50">
            API: {resolvedApiUrl}
          </div>
        )}
      </footer>
    </div>
    
  );
  
}

function SummaryTile({ value, label, tone }: { value: string | number; label: string; tone: string }) {
  return (
    <div className={`brutal-sm rounded-2xl ${tone} p-4`}>
      <div className="text-3xl font-bold leading-none">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest">{label}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string }) {
  return (
    <button className="brutal-hover flex w-full items-center justify-between rounded-2xl border-2 border-background/20 bg-background/5 px-4 py-3 text-left text-sm font-semibold hover:bg-bolt hover:text-ink">
      <span className="flex items-center gap-3">
        <span className="brutal-sm flex h-9 w-9 items-center justify-center rounded-xl bg-bolt text-ink">
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </span>
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}
