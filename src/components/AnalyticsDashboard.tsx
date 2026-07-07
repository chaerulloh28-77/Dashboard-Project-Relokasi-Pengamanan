import React, { useState, useMemo, useEffect } from "react";
import { ProjectData } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  ShieldAlert,
  Award,
  TrendingDown,
  Clock,
  HelpCircle,
  ChevronRight,
  Filter,
  ArrowRight,
  Search,
  RefreshCw,
  Zap,
  Check,
  FileText,
  Sliders,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalyticsDashboardProps {
  filteredProjects: ProjectData[];
  allProjects: ProjectData[];
}

// Colors palette for Recharts with premium gradients
const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#0ea5e9", // Sky
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#f43f5e", // Rose
  "#14b8a6", // Teal
  "#64748b"  // Slate
];

const MONTHS_MAP: Record<string, number> = {
  "januari": 1, "februari": 2, "maret": 3, "april": 4, "mei": 5, "juni": 6,
  "juli": 7, "agustus": 8, "september": 9, "oktober": 10, "november": 11, "desember": 12,
  "jan": 1, "feb": 2, "mar": 3, "apr": 4, "mei_short": 5, "jun": 6,
  "jul": 7, "agt": 8, "sep": 9, "okt": 10, "nov": 11, "des": 12
};

export function AnalyticsDashboard({ filteredProjects, allProjects }: AnalyticsDashboardProps) {
  // Real-time synchronization state tracking
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString("id-ID"));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(1);
  const [simulationData, setSimulationData] = useState<ProjectData[] | null>(null);

  // Trigger brief pulse animation whenever the datasets update
  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
    }, 450);
    return () => clearTimeout(timer);
  }, [filteredProjects, allProjects]);

  // Handle simulation trigger to showcase live updates
  const handleSimulateUpdate = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Modify a random subset to increase progress slightly to demonstrate dynamic graph rendering
      const simulated = (simulationData || filteredProjects).map((p, idx) => {
        if (idx % 3 === 0 && p.progressConstruction < 100) {
          const addProgress = Math.min(100 - p.progressConstruction, Math.floor(Math.random() * 25) + 10);
          return {
            ...p,
            progressConstruction: p.progressConstruction + addProgress,
            lengthM: p.lengthM + (Math.random() > 0.6 ? Math.floor(Math.random() * 150) : 0),
            statusConstruction: p.progressConstruction + addProgress === 100 ? "Project Done" : p.statusConstruction
          };
        }
        return p;
      });
      setSimulationData(simulated);
      setDataVersion(prev => prev + 1);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
    }, 600);
  };

  const handleResetSimulation = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSimulationData(null);
      setDataVersion(prev => prev + 1);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
    }, 400);
  };

  // Toggle baseline
  const [useFilteredOnly, setUseFilteredOnly] = useState<boolean>(true);

  // Active dataset select (with optional simulated modifications)
  const currentFilteredDataset = useMemo(() => {
    return simulationData || filteredProjects;
  }, [simulationData, filteredProjects]);

  const activeDataset = useMemo(() => {
    return useFilteredOnly ? currentFilteredDataset : allProjects;
  }, [useFilteredOnly, currentFilteredDataset, allProjects]);

  // Active chart interactive configurations
  const [lineChartMetric, setLineChartMetric] = useState<"projects" | "progress" | "length">("projects");
  const [lineChartType, setLineChartType] = useState<"area" | "line" | "bar">("area");
  
  const [barChartDimension, setBarChartDimension] = useState<"jabo" | "vendor" | "pic">("jabo");
  const [barSearchQuery, setBarSearchQuery] = useState<string>("");

  const [pieChartDimension, setPieChartDimension] = useState<"status" | "complexity" | "method">("status");
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [pieProjectSearch, setPieProjectSearch] = useState<string>("");
  const [tempPieSearch, setTempPieSearch] = useState<string>("");

  // --- DATA PROCESSING 1: MONTHLY TRENDS (LINE / AREA / BAR CHART) ---
  const lineChartData = useMemo(() => {
    const monthlyGroups: Record<string, { count: number; totalProgress: number; totalLength: number }> = {};

    activeDataset.forEach((p) => {
      let rawMonth = (p.planCoBulan || p.bulan || "Belum Ditentukan").trim();
      if (!rawMonth) rawMonth = "Belum Ditentukan";
      const key = rawMonth;

      if (!monthlyGroups[key]) {
        monthlyGroups[key] = { count: 0, totalProgress: 0, totalLength: 0 };
      }

      monthlyGroups[key].count += 1;
      monthlyGroups[key].totalProgress += p.progressConstruction || 0;
      monthlyGroups[key].totalLength += p.lengthM || 0;
    });

    return Object.entries(monthlyGroups)
      .map(([month, data]) => {
        const avgProgress = data.count > 0 ? Math.round(data.totalProgress / data.count) : 0;
        return {
          month,
          projects: data.count,
          progress: avgProgress,
          length: Math.round(data.totalLength)
        };
      })
      .sort((a, b) => {
        const monthA = a.month.toLowerCase();
        const monthB = b.month.toLowerCase();

        const findMonthOrder = (str: string) => {
          for (const [mName, order] of Object.entries(MONTHS_MAP)) {
            if (str.includes(mName)) return order;
          }
          return 99;
        };

        const orderA = findMonthOrder(monthA);
        const orderB = findMonthOrder(monthB);

        if (orderA !== orderB) return orderA - orderB;
        return a.month.localeCompare(b.month);
      });
  }, [activeDataset]);

  // --- DATA PROCESSING 2: DIMENSION DISTRIBUTIONS (BAR CHART) ---
  const barChartData = useMemo(() => {
    const groups: Record<string, { count: number; totalLength: number; totalProgress: number }> = {};

    activeDataset.forEach((p) => {
      let key = "Lainnya";
      if (barChartDimension === "jabo") {
        key = p.jabo || "General";
      } else if (barChartDimension === "vendor") {
        key = p.vendor || "Tanpa Vendor";
      } else if (barChartDimension === "pic") {
        key = p.pic || "Tanpa PIC";
      }

      if (!groups[key]) {
        groups[key] = { count: 0, totalLength: 0, totalProgress: 0 };
      }

      groups[key].count += 1;
      groups[key].totalLength += p.lengthM || 0;
      groups[key].totalProgress += p.progressConstruction || 0;
    });

    // Convert & sort
    let rawList = Object.entries(groups).map(([name, data]) => ({
      name,
      projects: data.count,
      totalLength: Math.round(data.totalLength),
      avgProgress: data.count > 0 ? Math.round(data.totalProgress / data.count) : 0
    }));

    // Apply inline search filter inside bar chart
    if (barSearchQuery.trim()) {
      const q = barSearchQuery.toLowerCase();
      rawList = rawList.filter(item => item.name.toLowerCase().includes(q));
    }

    return rawList.sort((a, b) => b.projects - a.projects).slice(0, 8);
  }, [activeDataset, barChartDimension, barSearchQuery]);

  // --- DATA PROCESSING 3: PROPORTIONS (PIE CHART) ---
  const pieChartData = useMemo(() => {
    const groups: Record<string, number> = {};

    activeDataset.forEach((p) => {
      let key = "Lainnya";
      if (pieChartDimension === "status") {
        key = p.statusConstruction || "Belum Mulai";
      } else if (pieChartDimension === "complexity") {
        key = p.categoryConstruction || "Minor";
      } else if (pieChartDimension === "method") {
        key = p.metodeProject || "TRENCHING";
      }

      groups[key] = (groups[key] || 0) + 1;
    });

    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [activeDataset, pieChartDimension]);

  // Automatically select the first slice on dimension change or if selected slice is no longer valid
  useEffect(() => {
    if (pieChartData.length > 0) {
      const isStillValid = pieChartData.some(d => d.name === selectedPieSlice);
      if (!isStillValid) {
        setSelectedPieSlice(pieChartData[0].name);
      }
    } else {
      setSelectedPieSlice(null);
    }
  }, [pieChartDimension, pieChartData]);

  // Reset search fields when changing category or slice selection to avoid stuck query views
  useEffect(() => {
    setTempPieSearch("");
    setPieProjectSearch("");
  }, [selectedPieSlice, pieChartDimension]);

  // Deep dive projects filtering based on selected pie slice
  const selectedSliceProjects = useMemo(() => {
    if (!selectedPieSlice) return [];
    
    return activeDataset.filter(p => {
      let key = "Lainnya";
      if (pieChartDimension === "status") {
        key = p.statusConstruction || "Belum Mulai";
      } else if (pieChartDimension === "complexity") {
        key = p.categoryConstruction || "Minor";
      } else if (pieChartDimension === "method") {
        key = p.metodeProject || "TRENCHING";
      }
      return key === selectedPieSlice;
    }).filter(p => {
      if (!pieProjectSearch.trim()) return true;
      const tokens = pieProjectSearch.toLowerCase().trim().split(/\s+/);
      if (tokens.length === 0) return true;

      // Extract the PIC field and convert to lowercase for comparison
      const picText = (p.pic || "").toLowerCase();

      // Every typed keyword token must be present in the PIC's name
      return tokens.every(token => picText.includes(token));
    });
  }, [activeDataset, pieChartDimension, selectedPieSlice, pieProjectSearch]);

  // --- DATA PROCESSING 4: INTERACTIVE KPI CALCULATION ---
  const insights = useMemo(() => {
    const total = activeDataset.length;
    if (total === 0) {
      return {
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        notStartedProjects: 0,
        completedPct: 0,
        pendingCount: 0,
        topVendorName: "-",
        topVendorCount: 0,
        activeLengthSum: 0,
        avgProgress: 0,
        surveyedPct: 0,
        auditedPct: 0,
        riskScore: "RENDAH" as "RENDAH" | "SEDANG" | "TINGGI",
        alerts: [] as { text: string; severity: "info" | "warning" | "critical"; count: number }[]
      };
    }

    // Done projects count
    const completed = activeDataset.filter(
      (p) =>
        p.statusConstruction === "Project Done" ||
        p.progressConstruction === 100 ||
        (p.statusConstruction?.toLowerCase().includes("selesai") ?? false)
    ).length;

    // In Progress count (0 < progress < 100)
    const inProgress = activeDataset.filter(
      (p) => p.progressConstruction > 0 && p.progressConstruction < 100
    ).length;

    const notStarted = activeDataset.filter(
      (p) => p.progressConstruction === 0 || p.statusConstruction === "Belum Mulai"
    ).length;

    const completedPct = Math.round((completed / total) * 100);

    // Pending projects count
    const pending = activeDataset.filter(
      (p) =>
        p.statusConstruction?.toLowerCase().includes("pending") ||
        p.statusConstruction?.toLowerCase().includes("hold")
    ).length;

    // Average progress
    const avgProgress = Math.round(activeDataset.reduce((sum, p) => sum + (p.progressConstruction || 0), 0) / total);

    // Total active length sum
    const activeLengthSum = activeDataset.reduce((sum, p) => sum + (p.lengthM || 0), 0);

    // Surveyed percentage
    const surveyed = activeDataset.filter(p => p.statusSurveyMaterial === "Sudah Survey").length;
    const surveyedPct = Math.round((surveyed / total) * 100);

    // Audited percentage
    const audited = activeDataset.filter(p => p.statusAudit === "Sudah Audit").length;
    const auditedPct = Math.round((audited / total) * 100);

    // Find vendor with largest workload
    const vendorWorkloads = activeDataset.reduce((acc, p) => {
      const v = p.vendor || "Belum Ditentukan";
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let topVendorName = "-";
    let topVendorCount = 0;
    Object.entries(vendorWorkloads).forEach(([name, count]) => {
      const numCount = count as number;
      if (numCount > topVendorCount && name !== "Belum Ditentukan" && name !== "-") {
        topVendorName = name;
        topVendorCount = numCount;
      }
    });

    // Detect bottlenecks & alerts with severity tags
    const alerts: { text: string; severity: "info" | "warning" | "critical"; count: number }[] = [];
    
    // Alert 1: Low progress in high aging
    const criticalAgingProjects = activeDataset.filter(p => {
      const isCritical = p.categoryConstruction === "Critical" || p.categoryConstruction === "Major";
      const hasLowProgress = (p.progressConstruction || 0) < 30;
      const isNotCancelled = !p.statusConstruction?.toLowerCase().includes("batal") && !p.statusConstruction?.toLowerCase().includes("cancel");
      return isCritical && hasLowProgress && isNotCancelled;
    });

    if (criticalAgingProjects.length > 0) {
      alerts.push({
        text: `${criticalAgingProjects.length} Proyek Critical/Major dengan laju progres kritis (<30%) memerlukan perhatian segera.`,
        severity: "critical",
        count: criticalAgingProjects.length
      });
    }

    // Alert 2: Permit issues
    const permitIssuesCount = activeDataset.filter(
      p => p.statusPermit?.toLowerCase().includes("belum") || p.statusPermit?.toLowerCase().includes("rejection") || p.statusPermit?.toLowerCase().includes("kendala")
    ).length;
    if (permitIssuesCount > 0) {
      alerts.push({
        text: `${permitIssuesCount} Proyek terhambat kendala perizinan instansi daerah (Permit / Galian).`,
        severity: "critical",
        count: permitIssuesCount
      });
    }

    // Alert 3: APD Need list
    const apdNeedsCount = activeDataset.filter(p => p.apdRelokasi === "Need").length;
    if (apdNeedsCount > 0) {
      alerts.push({
        text: `${apdNeedsCount} Proyek membutuhkan supply perlindungan APD Relokasi untuk pengamanan aset Linknet.`,
        severity: "warning",
        count: apdNeedsCount
      });
    }

    // Alert 4: Outstanding material survey
    const outstandingSurveyMat = activeDataset.filter(
      p => p.statusSurveyMaterial === "Belum Survey" && !p.statusConstruction?.toLowerCase().includes("selesai")
    ).length;
    if (outstandingSurveyMat > 0) {
      alerts.push({
        text: `${outstandingSurveyMat} Lokasi galian aktif belum menyelesaikan tahapan checklist Survey Material fisik.`,
        severity: "info",
        count: outstandingSurveyMat
      });
    }

    // Simple Risk Score computation
    let riskScore: "RENDAH" | "SEDANG" | "TINGGI" = "RENDAH";
    const criticalCount = alerts.filter(a => a.severity === "critical").reduce((s, a) => s + a.count, 0);
    if (criticalCount > 3 || alerts.length >= 3) {
      riskScore = "TINGGI";
    } else if (criticalCount > 0 || alerts.length > 1) {
      riskScore = "SEDANG";
    }

    return {
      totalProjects: total,
      completedProjects: completed,
      inProgressProjects: inProgress,
      notStartedProjects: notStarted,
      completedPct,
      pendingCount: pending,
      topVendorName,
      topVendorCount,
      activeLengthSum,
      avgProgress,
      surveyedPct,
      auditedPct,
      riskScore,
      alerts
    };
  }, [activeDataset]);

  return (
    <div className="flex flex-col gap-8 text-slate-800" id="enhanced-analytics-dashboard">
      
      {/* 1. REAL-TIME DATA SYNC HEADER STATUS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-indigo-900/40 shadow-xl relative overflow-hidden">
        
        {/* Animated background laser lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md border border-indigo-500/30">
                PROYEKSI ANALITIK KABEL
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isSyncing ? "animate-ping" : "animate-pulse"}`} />
                Dashboard Monitoring Sync Active
              </div>
            </div>

            <h3 className="font-extrabold text-xl md:text-2xl text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              Statistik Real-time & Visualisasi Konstruksi
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Memproses data volume galian tanah, penarikan kabel, pemakaian APD Relokasi, dan audit finansial yang terhubung langsung dengan Dashboard Monitoring manipulasi tabel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Simulation controls to play with the charts */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 shadow-inner">
              <button
                onClick={handleSimulateUpdate}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Mensimulasikan progres penambahan lapangan untuk melihat grafik bergerak"
              >
                <Zap className="w-3.5 h-3.5" />
                Simulasi Update
              </button>
              {simulationData && (
                <button
                  onClick={handleResetSimulation}
                  disabled={isSyncing}
                  className="p-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset simulasi kembali ke data dashboard real"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Scope selection */}
            <div className="bg-slate-800/50 p-1 rounded-2xl border border-slate-700/40 flex gap-1">
              <button
                onClick={() => setUseFilteredOnly(true)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  useFilteredOnly
                    ? "bg-indigo-600/90 text-white shadow-md"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Data Filter ({filteredProjects.length})
              </button>
              <button
                onClick={() => setUseFilteredOnly(false)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  !useFilteredOnly
                    ? "bg-indigo-600/90 text-white shadow-md"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Semua Data ({allProjects.length})
              </button>
            </div>
          </div>
        </div>

        {/* Sync Metadata strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-slate-400 font-medium">
          <span>Sinkronisasi Terakhir: <strong className="text-indigo-400 font-mono">{lastSyncTime}</strong></span>
          <span>Status Buffer: <strong className="text-emerald-400 font-mono">OK</strong></span>
          <span>Sesi Aktif: <strong className="text-indigo-300 font-mono">Real-Time WebSocket Link</strong></span>
          {simulationData && (
            <span className="animate-pulse text-amber-400 font-bold">
              ⚠️ Menampilkan Mode Simulasi Lapangan (Grafik Diperbarui)
            </span>
          )}
        </div>
      </div>

      {/* 2. BENTO STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="bento-overview-cards">
        
        {/* KPI Card 1: TOTAL ACTIVE & COMPLETION */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">
              Kuantitas
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penyelesaian Proyek</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {insights.completedProjects}
              </h3>
              <span className="text-slate-400 text-sm font-bold">/ {insights.totalProjects} Selesai</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Rasio Selesai</span>
              <span className="text-indigo-600 font-mono">{insights.completedPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${insights.completedPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-indigo-600 h-full rounded-full" 
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {insights.inProgressProjects} Aktif
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {insights.notStartedProjects} Antrean
              </span>
            </div>
          </div>
        </motion.div>

        {/* KPI Card 2: TOTAL CABLE METERS WITH PROGRESS */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Kabel FO
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akumulasi Penarikan</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {(insights.activeLengthSum / 1000).toFixed(1)}
              </h3>
              <span className="text-slate-500 text-sm font-bold">KM Galian</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Target Bulan Ini (100 KM)</span>
              <span className="text-emerald-600 font-mono">
                {Math.min(100, Math.round((insights.activeLengthSum / 100000) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (insights.activeLengthSum / 100000) * 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-emerald-500 h-full rounded-full" 
              />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold pt-1">
              Akumulasi panjang kabel terpasang: <strong className="text-slate-700 font-mono">{insights.activeLengthSum.toLocaleString("id-ID")} M</strong>
            </p>
          </div>
        </motion.div>

        {/* KPI Card 3: AVERAGE PHYSICAL PROGRESS */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md animate-pulse">
              Fisik Rerata
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rata-rata Progres</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-amber-600 tracking-tight">
                {insights.avgProgress}%
              </h3>
              <span className="text-slate-400 text-xs font-bold">Konstruksi Fisik</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Sertifikasi Audit Finansial</span>
              <span className="text-slate-800 font-bold">{insights.auditedPct}% Done</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${insights.auditedPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-amber-500 h-full rounded-full" 
              />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold pt-1">
              Checklist Survey Material selesai: <strong className="text-slate-700 font-mono">{insights.surveyedPct}%</strong>
            </p>
          </div>
        </motion.div>

        {/* KPI Card 4: RISK ASSESSMENT & PERMITS */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl border ${
              insights.riskScore === "TINGGI" 
                ? "bg-rose-50 border-rose-100 text-rose-600" 
                : insights.riskScore === "SEDANG"
                  ? "bg-amber-50 border-amber-100 text-amber-600"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              insights.riskScore === "TINGGI" 
                ? "bg-rose-100 text-rose-800" 
                : insights.riskScore === "SEDANG"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
            }`}>
              {insights.riskScore} RISK
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pemberhentian & Isu</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {insights.alerts.length}
              </h3>
              <span className="text-slate-500 text-sm font-bold">Temuan Kendala</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Beban Mitra Terbesar</span>
              <span className="text-slate-800 font-extrabold truncate max-w-[120px]">{insights.topVendorName}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2 flex justify-between">
              <span>Delay Izin Pemda:</span>
              <span className="text-rose-600 font-bold font-mono">
                {activeDataset.filter(p => p.statusPermit?.toLowerCase().includes("belum") || p.statusPermit?.toLowerCase().includes("rejection")).length} Proyek
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3. TWO COHESIVE MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHART WIDGET 1: MONTHLY TRENDING & DYNAMIC PREDICTION (7 COLUMNS) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6" id="enhanced-line-chart-card">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Tren Kronologis Proyek (Bulanan)</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Analisis tren penyelesaian penarikan kabel berdasarkan Rencana Bulan Selesai (CO)</p>
            </div>

            {/* Toggle controls for metrics and presentation style */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Type toggle: Area vs Line vs Bar */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5">
                {[
                  { key: "area", label: "Area" },
                  { key: "line", label: "Line" },
                  { key: "bar", label: "Bar" }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setLineChartType(t.key as any)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      lineChartType === t.key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Metric toggle */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5">
                {[
                  { key: "projects", label: "Kuantitas" },
                  { key: "progress", label: "Rata Progres" },
                  { key: "length", label: "Meter" }
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setLineChartMetric(m.key as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      lineChartMetric === m.key
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <div className="h-72 w-full">
            {lineChartData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-1" />
                Tidak ada data bulanan untuk divisualisasikan.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {lineChartType === "area" ? (
                  <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="premiumColorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                      </linearGradient>
                      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'medium' }} 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => {
                        if (lineChartMetric === "length") {
                          return val >= 1000 ? `${(val / 1000).toFixed(1)}k m` : `${val} m`;
                        }
                        if (lineChartMetric === "progress") {
                          return `${val}%`;
                        }
                        return val;
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: '#f8fafc',
                        fontFamily: 'sans-serif',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#818cf8', marginBottom: '4px' }}
                      formatter={(value: any) => {
                        if (lineChartMetric === "length") return [`${value.toLocaleString("id-ID")} Meter`, "Total Panjang"];
                        if (lineChartMetric === "progress") return [`${value}%`, "Rata-rata Progres"];
                        return [`${value} Proyek`, "Total Volume"];
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={lineChartMetric} 
                      name={
                        lineChartMetric === "projects" 
                          ? "Kuantitas Proyek" 
                          : lineChartMetric === "progress" 
                            ? "Rata-rata Progres (%)" 
                            : "Total Panjang Kabel (Meter)"
                      }
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#premiumColorGradient)" 
                      filter="url(#neonGlow)"
                      activeDot={{ r: 7, strokeWidth: 0, fill: '#6366f1' }}
                    />
                  </AreaChart>
                ) : lineChartType === "line" ? (
                  <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <filter id="neonGlowLine" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'medium' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '16px', 
                        border: 'none', 
                        color: '#f8fafc',
                        fontSize: '11px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={lineChartMetric} 
                      stroke="#8b5cf6" 
                      strokeWidth={4} 
                      filter="url(#neonGlowLine)"
                      dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: '#8b5cf6' }}
                      activeDot={{ r: 7, strokeWidth: 0, fill: '#8b5cf6' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'medium' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#f8fafc', fontSize: '11px' }}
                    />
                    <Bar 
                      dataKey={lineChartMetric} 
                      fill="#0ea5e9" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={50}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART WIDGET 2: DEEP-DIVE DONUT INTERACTIVE SEGMENTATION (5 COLUMNS) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5" id="interactive-pie-card">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Proporsi & Segmentasi Proyek</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Klik pada diagram donat untuk filter & jelajah daftar proyek</p>
            </div>

            {/* Dimension selector pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5 self-start">
              {[
                { key: "status", label: "Status" },
                { key: "complexity", label: "Skala" },
                { key: "method", label: "Metode" }
              ].map((d) => (
                <button
                  key={d.key}
                  onClick={() => setPieChartDimension(d.key as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    pieChartDimension === d.key
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Left side: Pie Render */}
            <div className="md:col-span-6 h-56 relative flex items-center justify-center">
              {pieChartData.length === 0 ? (
                <div className="text-slate-400 text-xs flex flex-col items-center">
                  <AlertCircle className="w-8 h-8 text-slate-300 mb-1" />
                  Tidak ada data proporsi.
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        onClick={(data) => {
                          if (data && data.name) {
                            setSelectedPieSlice(data.name);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} 
                            stroke={selectedPieSlice === entry.name ? "#1e1b4b" : "none"}
                            strokeWidth={selectedPieSlice === entry.name ? 3 : 0}
                            style={{
                              outline: 'none',
                              filter: selectedPieSlice === entry.name ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none',
                              opacity: selectedPieSlice === null || selectedPieSlice === entry.name ? 1 : 0.6,
                              transition: 'all 0.2s ease-in-out'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderRadius: '12px', 
                          border: 'none', 
                          color: '#f8fafc',
                          fontFamily: 'sans-serif',
                          fontSize: '11px'
                        }}
                        formatter={(value: any) => [`${value} Proyek`, "Jumlah"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Total indicator in center of donut chart */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Kategori</span>
                    <span className="text-xl font-black text-slate-800 leading-none my-0.5">
                      {selectedPieSlice ? selectedPieSlice : "Semua"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {selectedPieSlice 
                        ? `${pieChartData.find(d => d.name === selectedPieSlice)?.value || 0} Proyek`
                        : `${pieChartData.reduce((sum, item) => sum + item.value, 0)} Proyek`
                      }
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Right side: Legend Lists with percentage breakdowns */}
            <div className="md:col-span-6 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {pieChartData.map((item, idx) => {
                const totalVal = pieChartData.reduce((s, d) => s + d.value, 0);
                const pct = totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0;
                const isSelected = selectedPieSlice === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => setSelectedPieSlice(item.name)}
                    className={`flex items-center justify-between text-left p-2 rounded-xl transition-all border cursor-pointer ${
                      isSelected 
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm font-bold" 
                        : "bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}
                      />
                      <span className="text-[11px] truncate">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono shrink-0 ml-1 opacity-90">
                      {item.value} ({pct}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep dive detail list of projects matching the selected slice */}
          {selectedPieSlice && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mt-2 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[9px] font-bold text-indigo-600 block uppercase">Jelajah Proyek Kategori</span>
                  <span className="text-xs font-black text-slate-800">
                    Kategori: {selectedPieSlice} ({selectedSliceProjects.length} Proyek Terdeteksi)
                  </span>
                </div>
                
                {/* Micro search input inside card */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setPieProjectSearch(tempPieSearch)}
                    className="absolute left-1.5 text-slate-400 hover:text-white hover:bg-indigo-600 p-1 rounded-md transition-all flex items-center justify-center cursor-pointer z-10 w-6 h-6 border border-transparent hover:border-indigo-500 shadow-xs"
                    title="Cari berdasarkan nama PIC (Klik untuk memproses)"
                    id="pie-search-submit-btn"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={tempPieSearch}
                    onChange={(e) => setTempPieSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPieProjectSearch(tempPieSearch);
                      }
                    }}
                    placeholder="Cari nama PIC... (klik icon atau tekan Enter)"
                    className="pl-9 pr-8 py-1.5 rounded-lg border border-slate-300 text-[11px] w-56 md:w-76 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white transition-all font-medium text-slate-700"
                    id="pie-search-input-field"
                  />
                  {(tempPieSearch || pieProjectSearch) && (
                    <button
                      onClick={() => {
                        setTempPieSearch("");
                        setPieProjectSearch("");
                      }}
                      className="absolute right-2 text-slate-400 hover:text-rose-600 font-bold text-xs cursor-pointer p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title="Bersihkan pencarian"
                      id="pie-search-clear-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Search Active Status Banner */}
              {pieProjectSearch && (
                <div className="bg-indigo-50/75 border border-indigo-100 text-indigo-950 text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-between font-semibold">
                  <span>
                    Menampilkan proyek dengan nama PIC mengandung kata kunci: <strong className="text-indigo-600">"{pieProjectSearch}"</strong>
                  </span>
                  <button
                    onClick={() => {
                      setTempPieSearch("");
                      setPieProjectSearch("");
                    }}
                    className="text-[10px] text-indigo-500 hover:text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}

              {/* Project micro list */}
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-[11px]">
                {selectedSliceProjects.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">Tidak ada proyek yang sesuai filter.</p>
                ) : (
                  selectedSliceProjects.map((proj) => (
                    <div key={`${proj.no}-${proj.pmoId}`} className="bg-white border border-slate-200/80 p-2.5 rounded-xl flex justify-between items-center gap-4 hover:border-indigo-300 transition-colors">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{proj.namaProject}</p>
                        <div className="flex gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                          <span>PMO ID: {proj.pmoId}</span>
                          <span>•</span>
                          <span>PIC: {proj.pic}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="font-bold text-slate-700 font-mono block">{proj.progressConstruction}%</span>
                          <span className="text-[9px] text-slate-400 block">{proj.vendor}</span>
                        </div>
                        <div className="w-1.5 h-8 rounded-full bg-slate-100 overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ height: `${proj.progressConstruction}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. COMPARISON BAR CHART & LIVE METRICS SEARCH ENGINE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6" id="enhanced-bar-chart-card">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Komparasi Beban Distribusi Kerja</h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Menampilkan kuantitas proyek bersandingan dengan rata-rata progres fisik. Gunakan kolom pencarian untuk memfilter vendor/daerah.
            </p>
          </div>

          {/* Interactive filter search and toggle dimension */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Live Search Box Inside Bar Widget */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={barSearchQuery}
                onChange={(e) => setBarSearchQuery(e.target.value)}
                placeholder="Cari vendor, jabo, PIC..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-44 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-semibold"
              />
              {barSearchQuery && (
                <button 
                  onClick={() => setBarSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-800 text-[10px] font-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Toggle dimension button pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5">
              {[
                { key: "jabo", label: "Jabo Area" },
                { key: "vendor", label: "Vendor Mitra" },
                { key: "pic", label: "PIC Waspang" }
              ].map((d) => (
                <button
                  key={d.key}
                  onClick={() => setBarChartDimension(d.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    barChartDimension === d.key
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          {barChartData.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <AlertCircle className="w-8 h-8 text-slate-300 mb-1" />
              Tidak ditemukan hasil yang cocok dengan kata kunci "{barSearchQuery}".
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: '#4f46e5', fontSize: 10, fontWeight: 'medium' }} 
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Jumlah Proyek', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#4f46e5', fontWeight: 'bold' } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fill: '#10b981', fontSize: 10, fontWeight: 'medium' }} 
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Rata-rata Progres (%)', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: '#10b981', fontWeight: 'bold' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '16px', 
                    border: 'none', 
                    color: '#f8fafc',
                    fontSize: '11px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#818cf8', marginBottom: '4px' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="rect"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}
                />
                <Bar yAxisId="left" dataKey="projects" name="Volume Proyek Aktif" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="avgProgress" name="Rata-rata Progres (%)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 4. JABOTABEK REGIONAL TELEMETRY HEATMAP & FIBER CONNECTIVITY NODE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6" id="regional-telemetry-heatmap-card">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 animate-pulse">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Satelit Telemetri Progres Regional (Jabotabek)</h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Pengukuran real-time utilisasi penarikan kabel FO & rasio kendala izin galian per wilayah</p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Integrasi Node Dinamis Berjalan
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: Interactive Node Matrix (SVG Graphic) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-between h-80">
            <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            <div className="flex justify-between items-center relative z-10">
              <div>
                <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">Interactive Node Grid</span>
                <p className="text-xs text-slate-300 font-bold">Matriks Jalur Distribusi Linknet</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                SCANNING
              </span>
            </div>

            {/* Simulated interactive grid with glow effect */}
            <div className="relative z-10 flex-1 my-4 flex items-center justify-center">
              <svg className="w-full h-full max-h-[160px]" viewBox="0 0 300 150">
                {/* Connections with glowing animations */}
                <line x1="50" y1="75" x2="110" y2="40" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="110" y1="40" x2="190" y2="40" stroke="#10b981" strokeWidth="1.5" />
                <line x1="50" y1="75" x2="110" y2="110" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="110" y1="110" x2="190" y2="110" stroke="#6366f1" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="190" y1="40" x2="250" y2="75" stroke="#4f46e5" strokeWidth="1.5" />
                <line x1="190" y1="110" x2="250" y2="75" stroke="#ef4444" strokeWidth="2" />
                
                {/* Node Circles */}
                <g className="cursor-pointer group">
                  <circle cx="50" cy="75" r="10" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
                  <circle cx="50" cy="75" r="4" fill="#818cf8" />
                  <text x="50" y="98" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">HUB WEST</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="110" cy="40" r="10" fill="#0f172a" stroke="#34d399" strokeWidth="3" />
                  <circle cx="110" cy="40" r="4" fill="#34d399" />
                  <text x="110" y="24" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">JABO_1</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="190" cy="40" r="10" fill="#0f172a" stroke="#6366f1" strokeWidth="3" />
                  <circle cx="190" cy="40" r="4" fill="#6366f1" />
                  <text x="190" y="24" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">JABO_2</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="110" cy="110" r="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
                  <circle cx="110" cy="110" r="4" fill="#fbbf24" />
                  <text x="110" y="128" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">JABO_3</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="190" cy="110" r="10" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
                  <circle cx="190" cy="110" r="4" fill="#818cf8" />
                  <text x="190" y="128" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">JABO_4/5</text>
                </g>

                <g className="cursor-pointer group">
                  <circle cx="250" cy="75" r="10" fill="#0f172a" stroke="#f87171" strokeWidth="3" />
                  <circle cx="250" cy="75" r="4" fill="#f87171" className="animate-pulse" />
                  <text x="250" y="98" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">CORE EAST</text>
                </g>
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800">
              <span>FIBER LINK STATUS: <strong className="text-emerald-400">OPTIMAL</strong></span>
              <span>STABILITAS JALUR: <strong className="text-indigo-400">99.8%</strong></span>
            </div>
          </div>

          {/* RIGHT: Regional Data Heatmap list */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest block border-b border-slate-100 pb-1">
              Rasio Kinerja & Penyelesaian Per Wilayah
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(() => {
                // Compute regional stats
                const regions = ["JABOTABEK_1", "JABOTABEK_2", "JABOTABEK_3", "JABOTABEK_4", "JABOTABEK_5"];
                
                return regions.map((region) => {
                  const regionProjects = activeDataset.filter(p => p.jabo === region);
                  const totalCount = regionProjects.length;
                  const completedCount = regionProjects.filter(p => p.progressConstruction === 100 || p.statusConstruction === "Project Done").length;
                  const avgProg = totalCount > 0 ? Math.round(regionProjects.reduce((sum, p) => sum + (p.progressConstruction || 0), 0) / totalCount) : 0;
                  const totalLength = regionProjects.reduce((sum, p) => sum + (p.lengthM || 0), 0);
                  const issueCount = regionProjects.filter(p => p.statusPermit?.toLowerCase().includes("belum") || p.statusPermit?.toLowerCase().includes("rejection") || p.apdRelokasi === "Need").length;

                  let progressColor = "bg-indigo-600";
                  let borderCol = "hover:border-indigo-200";
                  if (region === "JABOTABEK_1") { progressColor = "bg-emerald-500"; }
                  else if (region === "JABOTABEK_2") { progressColor = "bg-blue-500"; }
                  else if (region === "JABOTABEK_3") { progressColor = "bg-amber-500"; }
                  else if (region === "JABOTABEK_4") { progressColor = "bg-indigo-500"; }
                  else { progressColor = "bg-purple-500"; }

                  return (
                    <div key={region} className={`p-4 rounded-2xl border border-slate-150 bg-slate-50/40 transition-all ${borderCol} hover:bg-white hover:shadow-xs flex flex-col justify-between gap-3`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-slate-800">{region.replace("_", " ")}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{totalCount} Proyek Terdaftar</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          avgProg === 100 ? "bg-emerald-100 text-emerald-800" : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {completedCount} Selesai
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Progress Wilayah</span>
                          <span className="font-mono">{avgProg}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${avgProg}%` }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-100/60 pt-2">
                        <span>Kabel FO: <strong className="font-mono text-slate-700">{totalLength.toLocaleString("id-ID")} M</strong></span>
                        {issueCount > 0 ? (
                          <span className="text-rose-500 flex items-center gap-0.5 font-bold">
                            ⚠️ {issueCount} Isu
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold">✓ Bersih</span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>
      </div>

      {/* 5. COHESIVE SMART AUDIT CHECKLISTS & AI MITIGATION RECOMMENDATION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="ai-insights-panel">
        
        {/* Left column: Technical Survey Matrix & Checklists (4 columns) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600" />
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-800 text-sm">Capaian Audit & Administrasi</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Capaian kesiapan kelengkapan dokumen penunjang galian</p>
            </div>

            <div className="space-y-4">
              
              {/* Financial Audit */}
              <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-slate-150 shadow-3xs">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 font-bold">Audit Keuangan Finansial</span>
                  <span className="text-slate-800 font-black">{insights.auditedPct}% Selesai</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${insights.auditedPct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                  <span>Sudah: {activeDataset.filter(p => p.statusAudit === "Sudah Audit").length}</span>
                  <span>Belum: {activeDataset.filter(p => p.statusAudit === "Belum Audit").length}</span>
                </div>
              </div>

              {/* Material Survey */}
              <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-slate-150 shadow-3xs">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 font-bold">Survey Material Lapangan</span>
                  <span className="text-slate-800 font-black">{insights.surveyedPct}% Selesai</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${insights.surveyedPct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                  <span>Sudah: {activeDataset.filter(p => p.statusSurveyMaterial === "Sudah Survey").length}</span>
                  <span>Belum: {activeDataset.filter(p => p.statusSurveyMaterial === "Belum Survey").length}</span>
                </div>
              </div>

              {/* Labor Survey */}
              <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-slate-150 shadow-3xs">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-500 font-bold">Checklist Survey Labor (Pekerja)</span>
                  <span className="text-slate-800 font-black">
                    {activeDataset.length > 0 
                      ? Math.round((activeDataset.filter(p => p.statusSurveyLabour === "Sudah Survey").length / activeDataset.length) * 100) 
                      : 0}% Selesai
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${activeDataset.length > 0 ? (activeDataset.filter(p => p.statusSurveyLabour === "Sudah Survey").length / activeDataset.length) * 100 : 0}%` }} />
                </div>
              </div>

            </div>

            {/* Target reminder note */}
            <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl flex items-center gap-2 text-[10px] text-indigo-700">
              <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Seluruh dokumen harus disetujui PMO sebelum tanggal dateline.</span>
            </div>
          </div>
        </div>

        {/* Right column: Actionable AI Insights and Bottleneck Solutions (8 columns) */}
        <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <h4 className="font-bold text-slate-900 text-sm">Analisis Bottleneck & Rekomendasi Taktis</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Rekomendasi penanganan kendala galian instansi & permit berdasarkan data aktif</p>
            </div>
            
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-200">
              AI-Style Analis
            </span>
          </div>

          {/* Actionable items checklist */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[310px] pr-2">
            {insights.alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-700">Portofolio Konstruksi Berjalan Sempurna!</p>
                <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                  Tidak ditemukan anomali kritis. Seluruh permit galian, survei labor, dan progres proyek berjalan sesuai milestones.
                </p>
              </div>
            ) : (
              insights.alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-2xl transition-all group shadow-3xs"
                >
                  <span className={`rounded-xl p-2.5 mt-0.5 group-hover:scale-105 transition-transform shrink-0 ${
                    alert.severity === "critical"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : alert.severity === "warning"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {alert.severity === "critical" ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : alert.severity === "warning" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${
                        alert.severity === "critical" ? "text-rose-600" : alert.severity === "warning" ? "text-amber-600" : "text-blue-600"
                      }`}>
                        TEMUAN #{index + 1} • {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-md font-mono">
                        {alert.count} Lokasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed mb-2">
                      {alert.text}
                    </p>

                    {/* Proactive mitigation plan generated on-the-fly */}
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
                      <p className="font-extrabold text-indigo-700 text-[10px] uppercase tracking-wide flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        Rekomendasi Langkah Mitigasi:
                      </p>
                      <p className="leading-normal font-medium">
                        {alert.severity === "critical" 
                          ? "Segera lakukan koordinasi dengan tim waspang & PIC terkait untuk pengajuan ulang berkas izin atau mitigasi rute alternatif penarikan kabel."
                          : alert.severity === "warning"
                            ? "Instruksikan vendor pelaksana untuk segera mengambil & memasang APD Relokasi di area rawan demi keselamatan pengamanan aset Linknet."
                            : "Jadwalkan kunjungan tim estimator lapangan minggu ini agar checklist kelengkapan material segera terbit di sistem."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Real-time demo info banner footer */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
              <p className="text-[11px] text-slate-600 font-semibold leading-normal">
                Visualisasi ini dihitung secara dinamis. Anda dapat mengubah status, pic, vendor, atau progres proyek di <span className="font-extrabold text-indigo-600">Dashboard Monitoring</span>, dan grafik donat, komparasi bar, serta tren kronologis di sini akan langsung menyesuaikan secara instan.
              </p>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
