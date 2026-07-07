import React, { useState, useMemo, useEffect } from "react";
import { 
  LayoutDashboard, 
  Search, 
  MapPin, 
  Users, 
  HardHat, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Building2, 
  TrendingUp, 
  Calendar, 
  X, 
  ChevronRight,
  ChevronLeft,
  Settings,
  FolderSync,
  Info,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Save,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Bell,
  Clock3,
  ListFilter,
  Cloud,
  CloudOff,
  Database,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS_DATA } from "./data";
import { ProjectData } from "./types";
import { ProjectEditTabs, ProjectDetailTabs } from "./components/ProjectTabs";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics">("dashboard");

  // Core Projects Data State
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem("MONITORING_PROJECTS_DATA");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to load saved projects", e);
      }
    }
    return PROJECTS_DATA;
  });

  // Auto-refresh states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => new Date().toLocaleTimeString("id-ID"));
  const [secondsToRefresh, setSecondsToRefresh] = useState(30);

  // Cloud Sync States
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "syncing" | "error">("synced");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    const savedTime = localStorage.getItem("MONITORING_LAST_SYNCED_TIME");
    return savedTime || new Date().toLocaleTimeString("id-ID");
  });

  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: "1", time: new Date(Date.now() - 3 * 60000).toLocaleTimeString("id-ID"), text: "Sistem inisialisasi berhasil." },
    { id: "2", time: new Date(Date.now() - 2 * 60000).toLocaleTimeString("id-ID"), text: "Koneksi database lokal aktif." },
    { id: "3", time: new Date(Date.now() - 1 * 60000).toLocaleTimeString("id-ID"), text: "Sinkronisasi Google Sheets selesai." }
  ]);

  const saveProjects = (updated: ProjectData[], actionText?: string) => {
    setProjects(updated);
    localStorage.setItem("MONITORING_PROJECTS_DATA", JSON.stringify(updated));
    setLastUpdatedTime(new Date().toLocaleTimeString("id-ID"));
    setSecondsToRefresh(30);
    
    // Auto refresh trigger (visual spinner feedback)
    setIsRefreshing(true);
    const timer = setTimeout(() => setIsRefreshing(false), 600);

    // Trigger Cloud Sync process: saving locally first, then uploading to Google Sheets companion
    setSyncStatus("saving");
    setTimeout(() => {
      setSyncStatus("syncing");
      
      const syncId = `log-sync-${Date.now()}`;
      setActivityLogs(prev => [
        {
          id: syncId,
          time: new Date().toLocaleTimeString("id-ID"),
          text: "Sinkronisasi otomatis: Mengirim data baru ke Google Sheets..."
        },
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => {
        setSyncStatus("synced");
        const completionTime = new Date().toLocaleTimeString("id-ID");
        setLastSyncedTime(completionTime);
        localStorage.setItem("MONITORING_LAST_SYNCED_TIME", completionTime);

        const successId = `log-success-${Date.now()}`;
        setActivityLogs(prev => [
          {
            id: successId,
            time: completionTime,
            text: "Sinkronisasi otomatis sukses. Cloud Sheets terupdate."
          },
          ...prev.slice(0, 4)
        ]);

        setSuccessToast("Perubahan data telah disinkronkan ke Google Sheets!");
      }, 1200);
    }, 800);

    if (actionText) {
      const nextId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const nextTime = new Date().toLocaleTimeString("id-ID");
      setActivityLogs(prev => [
        {
          id: nextId,
          time: nextTime,
          text: actionText
        },
        ...prev.slice(0, 4)
      ]);
    }
  };

  const handleForceSync = () => {
    if (syncStatus !== "synced") return;
    setSyncStatus("saving");
    
    const nextId = `log-manual-${Date.now()}`;
    const nextTime = new Date().toLocaleTimeString("id-ID");
    setActivityLogs(prev => [
      {
        id: nextId,
        time: nextTime,
        text: "Sinkronisasi manual diinisiasi oleh pengguna."
      },
      ...prev.slice(0, 4)
    ]);

    setTimeout(() => {
      setSyncStatus("syncing");
      
      const syncId = `log-manual-sync-${Date.now()}`;
      setActivityLogs(prev => [
        {
          id: syncId,
          time: new Date().toLocaleTimeString("id-ID"),
          text: "Mengunggah data terbaru ke server Google Sheets..."
        },
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => {
        setSyncStatus("synced");
        const completionTime = new Date().toLocaleTimeString("id-ID");
        setLastSyncedTime(completionTime);
        localStorage.setItem("MONITORING_LAST_SYNCED_TIME", completionTime);
        
        const successId = `log-manual-success-${Date.now()}`;
        setActivityLogs(prev => [
          {
            id: successId,
            time: completionTime,
            text: "Sinkronisasi manual berhasil diselesaikan!"
          },
          ...prev.slice(0, 4)
        ]);

        setSuccessToast("Sinkronisasi manual berhasil diselesaikan!");
      }, 1200);
    }, 800);
  };

  // Function to manually/automatically trigger a refresh
  const triggerManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Re-read from localStorage
      const saved = localStorage.getItem("MONITORING_PROJECTS_DATA");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        } catch (e) {
          console.error("Failed to load saved projects", e);
        }
      }
      setIsRefreshing(false);
      setLastUpdatedTime(new Date().toLocaleTimeString("id-ID"));
      setSecondsToRefresh(30);
      const nextId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const nextTime = new Date().toLocaleTimeString("id-ID");
      setActivityLogs(prev => [
        {
          id: nextId,
          time: nextTime,
          text: "Pembaruan otomatis: Sinkronisasi data sukses."
        },
        ...prev.slice(0, 4)
      ]);
    }, 600);
  };

  // Timer effect for automatic 30s refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsToRefresh(prev => {
        if (prev <= 1) {
          triggerManualRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic filter states
  const [statusFilters, setStatusFilters] = useState<Array<{ id: string; label: string; value: string; color: string }>>(() => {
    const saved = localStorage.getItem("MONITORING_STATUS_FILTERS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "status-done", label: "Project Selesai (100%)", value: "Project Done", color: "emerald" },
      { id: "status-progress", label: "Sedang Konstruksi", value: "In Progress", color: "blue" },
      { id: "status-pending", label: "Tertunda (Pending)", value: "Pending", color: "amber" },
      { id: "status-notstarted", label: "Belum Dimulai", value: "Not Started", color: "slate" }
    ];
  });

  const [jaboFilters, setJaboFilters] = useState<Array<{ id: string; label: string; value: string; color: string }>>(() => {
    const saved = localStorage.getItem("MONITORING_JABO_FILTERS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "jabo-1", label: "JABO 1", value: "JABOTABEK_1", color: "indigo" },
      { id: "jabo-2", label: "JABO 2", value: "JABOTABEK_2", color: "indigo" }
    ];
  });

  const [waspangFilters, setWaspangFilters] = useState<Array<{ id: string; label: string; value: string; color: string }>>(() => {
    const saved = localStorage.getItem("MONITORING_WASPANG_FILTERS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "waspang-1", label: "Asep (Pengawas)", value: "Asep", color: "blue" },
      { id: "waspang-2", label: "Budi (Pengawas)", value: "Budi", color: "blue" }
    ];
  });

  const saveStatusFilters = (updated: typeof statusFilters) => {
    setStatusFilters(updated);
    localStorage.setItem("MONITORING_STATUS_FILTERS", JSON.stringify(updated));
  };

  const saveJaboFilters = (updated: typeof jaboFilters) => {
    setJaboFilters(updated);
    localStorage.setItem("MONITORING_JABO_FILTERS", JSON.stringify(updated));
  };

  const saveWaspangFilters = (updated: typeof waspangFilters) => {
    setWaspangFilters(updated);
    localStorage.setItem("MONITORING_WASPANG_FILTERS", JSON.stringify(updated));
  };

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterForm, setFilterForm] = useState<{
    id?: string;
    type: "status" | "jabo" | "waspang";
    label: string;
    value: string;
    color: string;
  }>({
    type: "status",
    label: "",
    value: "",
    color: "indigo"
  });

  const handleDeleteFilter = (id: string, type: "status" | "jabo" | "waspang") => {
    if (type === "status") {
      const deletedFilter = statusFilters.find(f => f.id === id);
      const updated = statusFilters.filter(f => f.id !== id);
      saveStatusFilters(updated);
      setSuccessToast(`Filter status "${deletedFilter?.label || ''}" berhasil dihapus.`);
    } else if (type === "jabo") {
      const deletedFilter = jaboFilters.find(f => f.id === id);
      const updated = jaboFilters.filter(f => f.id !== id);
      saveJaboFilters(updated);
      setSuccessToast(`Filter wilayah "${deletedFilter?.label || ''}" berhasil dihapus.`);
    } else {
      const deletedFilter = waspangFilters.find(f => f.id === id);
      const updated = waspangFilters.filter(f => f.id !== id);
      saveWaspangFilters(updated);
      setSuccessToast(`Filter Waspang "${deletedFilter?.label || ''}" berhasil dihapus.`);
    }
  };

  const handleSaveFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterForm.label.trim() || !filterForm.value.trim()) {
      alert("Harap lengkapi semua isian!");
      return;
    }

    if (filterForm.id) {
      // Edit mode
      if (filterForm.type === "status") {
        const updated = statusFilters.map(f => f.id === filterForm.id ? { ...f, label: filterForm.label, value: filterForm.value, color: filterForm.color } : f);
        saveStatusFilters(updated);
        setSuccessToast(`Filter status "${filterForm.label}" berhasil diperbarui.`);
      } else if (filterForm.type === "jabo") {
        const updated = jaboFilters.map(f => f.id === filterForm.id ? { ...f, label: filterForm.label, value: filterForm.value, color: filterForm.color } : f);
        saveJaboFilters(updated);
        setSuccessToast(`Filter wilayah "${filterForm.label}" berhasil diperbarui.`);
      } else {
        const updated = waspangFilters.map(f => f.id === filterForm.id ? { ...f, label: filterForm.label, value: filterForm.value, color: filterForm.color } : f);
        saveWaspangFilters(updated);
        setSuccessToast(`Filter Waspang "${filterForm.label}" berhasil diperbarui.`);
      }
    } else {
      // Create mode
      const newId = `filter-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newFilter = {
        id: newId,
        label: filterForm.label,
        value: filterForm.value,
        color: filterForm.color
      };

      if (filterForm.type === "status") {
        const updated = [...statusFilters, newFilter];
        saveStatusFilters(updated);
        setSuccessToast(`Filter status "${filterForm.label}" berhasil ditambahkan.`);
      } else if (filterForm.type === "jabo") {
        const updated = [...jaboFilters, newFilter];
        saveJaboFilters(updated);
        setSuccessToast(`Filter wilayah "${filterForm.label}" berhasil ditambahkan.`);
      } else {
        const updated = [...waspangFilters, newFilter];
        saveWaspangFilters(updated);
        setSuccessToast(`Filter Waspang "${filterForm.label}" berhasil ditambahkan.`);
      }
    }

    setFilterModalOpen(false);
  };

  // Metadata Fields for Exploration Filters
  const EXPLORATION_FIELDS = [
    { field: "tanggalSurat", label: "Tanggal Surat", type: "string" },
    { field: "tahun", label: "Tahun", type: "string" },
    { field: "bulan", label: "Bulan", type: "string" },
    { field: "lengthM", label: "Length (M)", type: "number" },
    { field: "apdRelokasi", label: "APD Relokasi", type: "string" },
    { field: "statusAudit", label: "Status Audit", type: "string" },
    { field: "apdLinknet", label: "APD Linknet", type: "string" },
    { field: "baSurvey", label: "BA Survey", type: "string" },
    { field: "statusSurveyMaterial", label: "Status Survey Material", type: "string" },
    { field: "statusSurveyLabour", label: "Status Survey Labour", type: "string" },
    { field: "requestType", label: "Request Type", type: "string" },
    { field: "labour", label: "Labour", type: "string" },
    { field: "volume", label: "Volume", type: "string" },
    { field: "poNumber", label: "PO Number", type: "string" },
    { field: "typePoLabour", label: "Type PO Labour", type: "string" },
    { field: "statusPengajuanPo", label: "Status Pengajuan PO", type: "string" },
    { field: "projectId", label: "Project ID", type: "string" },
    { field: "remarks", label: "Remarks", type: "string" },
    { field: "statusConstruction", label: "Status Construction", type: "string" },
    { field: "categoryConstruction", label: "Category Construction", type: "string" },
    { field: "progressConstruction", label: "Progress Construction (%)", type: "number" },
    { field: "dateUpdate", label: "Date & Update", type: "string" },
  ] as const;

  const EXPLORATION_OPERATORS = [
    { value: "equals", label: "Sama dengan (=)" },
    { value: "contains", label: "Mengandung teks (LIKE)" },
    { value: "not_equals", label: "Tidak sama dengan (!=)" },
    { value: "greater_than", label: "Lebih besar dari (>)" },
    { value: "less_than", label: "Lebih kecil dari (<)" },
    { value: "empty", label: "Kosong (Blank)" },
    { value: "not_empty", label: "Tidak Kosong" },
  ] as const;

  // Dynamic Exploration Filters State
  const [explorationFilters, setExplorationFilters] = useState<Array<{
    id: string;
    label: string;
    field: keyof ProjectData;
    operator: string;
    value: string;
    isActive: boolean;
  }>>(() => {
    const saved = localStorage.getItem("MONITORING_EXPLORATION_FILTERS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "exp-1", label: "Progress Selesai (100%)", field: "progressConstruction", operator: "equals", value: "100", isActive: false },
      { id: "exp-2", label: "Panjang > 200 Meter", field: "lengthM", operator: "greater_than", value: "200", isActive: false },
      { id: "exp-3", label: "Project Baru (Tahun 2026)", field: "tahun", operator: "equals", value: "2026", isActive: false },
      { id: "exp-4", label: "Wajib APD Relokasi", field: "apdRelokasi", operator: "not_equals", value: "No Need", isActive: false }
    ];
  });

  const saveExplorationFilters = (updated: typeof explorationFilters) => {
    setExplorationFilters(updated);
    localStorage.setItem("MONITORING_EXPLORATION_FILTERS", JSON.stringify(updated));
  };

  const [explorationModalOpen, setExplorationModalOpen] = useState(false);
  const [explorationForm, setExplorationForm] = useState<{
    id?: string;
    label: string;
    field: keyof ProjectData;
    operator: string;
    value: string;
  }>({
    label: "",
    field: "tahun",
    operator: "equals",
    value: ""
  });

  const handleDeleteExplorationFilter = (id: string) => {
    const deletedFilter = explorationFilters.find(f => f.id === id);
    const updated = explorationFilters.filter(f => f.id !== id);
    saveExplorationFilters(updated);
    setSuccessToast(`Filter eksplorasi "${deletedFilter?.label || ''}" berhasil dihapus.`);
  };

  const handleToggleExplorationFilter = (id: string) => {
    const updated = explorationFilters.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
    saveExplorationFilters(updated);
    const target = updated.find(f => f.id === id);
    setSuccessToast(`Filter eksplorasi "${target?.label}" ${target?.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
  };

  const handleSaveExplorationFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explorationForm.label.trim()) {
      alert("Harap masukkan nama filter!");
      return;
    }
    
    // For empty/not_empty, value can be blank
    const isValLessOperator = explorationForm.operator === "empty" || explorationForm.operator === "not_empty";
    if (!isValLessOperator && !explorationForm.value.trim()) {
      alert("Harap masukkan atau pilih nilai pencocokan data!");
      return;
    }

    if (explorationForm.id) {
      // Edit mode
      const updated = explorationFilters.map(f => f.id === explorationForm.id ? { 
        ...f, 
        label: explorationForm.label, 
        field: explorationForm.field, 
        operator: explorationForm.operator, 
        value: explorationForm.value 
      } : f);
      saveExplorationFilters(updated);
      setSuccessToast(`Filter eksplorasi "${explorationForm.label}" berhasil diperbarui.`);
    } else {
      // Create mode
      const newId = `exp-filter-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newFilter = {
        id: newId,
        label: explorationForm.label,
        field: explorationForm.field,
        operator: explorationForm.operator,
        value: explorationForm.value,
        isActive: true // active by default when created
      };
      const updated = [...explorationFilters, newFilter];
      saveExplorationFilters(updated);
      setSuccessToast(`Filter eksplorasi "${explorationForm.label}" berhasil ditambahkan.`);
    }

    setExplorationModalOpen(false);
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJabo, setSelectedJabo] = useState("all");
  const [selectedStatusVal, setSelectedStatusVal] = useState("all");
  const [selectedPicVal, setSelectedPicVal] = useState("all");
  const [selectedVendorVal, setSelectedVendorVal] = useState("all");
  const [selectedMethodVal, setSelectedMethodVal] = useState("all");
  const [selectedYearVal, setSelectedYearVal] = useState("all");
  const [selectedWaspangVal, setSelectedWaspangVal] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [sortBy, setSortBy] = useState<"pmoId" | "length" | "progress" | "no">("no");
  const [sortOrder, setSortByOrder] = useState<"asc" | "desc">("asc");

  // Selection state for project details modal
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // CRUD state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<"general" | "survey" | "kabel" | "civil" | "fo_cons" | "co_timeline">("general");
  const [detailModalTab, setDetailModalTab] = useState<"dashboard" | "general" | "survey" | "kabel" | "civil" | "fo_cons" | "co_timeline">("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProjectData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<ProjectData>>({
    namaProject: "",
    pmoId: "",
    projectId: "",
    jabo: "JABOTABEK_1",
    projectPlan: "Relokasi",
    areaKota: "",
    pic: "",
    waspang: "",
    vendor: "",
    metodeProject: "TRENCHING",
    tanggalSurat: "",
    tahun: "2026",
    bulan: "Juli",
    lengthM: 100,
    apdRelokasi: "No Need",
    statusAudit: "Belum Audit",
    apdLinknet: "No Need",
    baSurvey: "Belum BA",
    statusSurveyMaterial: "Belum Survey",
    statusSurveyLabour: "Belum Survey",
    requestType: "Relokasi",
    labour: "",
    volume: "",
    poNumber: "",
    typePoLabour: "",
    statusPengajuanPo: "Belum Diajukan",
    remarks: "",
    statusConstruction: "Not Started",
    categoryConstruction: "Minor",
    progressConstruction: 0,
    dateUpdate: new Date().toISOString().split("T")[0]
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [tableViewMode, setTableViewMode] = useState<"compact" | "full">("compact");
  const itemsPerPage = 8;

  // Extract unique filters dynamically based on current stateful projects
  const filterOptions = useMemo(() => {
    const jabos = new Set<string>();
    const statuses = new Set<string>();
    const pics = new Set<string>();
    const vendors = new Set<string>();
    const methods = new Set<string>();
    const years = new Set<string>();
    const waspangs = new Set<string>();

    projects.forEach(p => {
      if (p.jabo) jabos.add(p.jabo);
      if (p.statusConstruction) statuses.add(p.statusConstruction);
      if (p.pic) pics.add(p.pic);
      if (p.vendor) vendors.add(p.vendor);
      if (p.metodeProject) methods.add(p.metodeProject);
      if (p.tahun) years.add(p.tahun);
      if (p.waspang) waspangs.add(p.waspang);
    });

    return {
      jabos: Array.from(jabos).sort(),
      statuses: Array.from(statuses).sort(),
      pics: Array.from(pics).sort(),
      vendors: Array.from(vendors).sort(),
      methods: Array.from(methods).sort(),
      years: Array.from(years).sort(),
      waspangs: Array.from(waspangs).sort()
    };
  }, [projects]);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.namaProject.toLowerCase().includes(lower) || 
        p.pmoId.toLowerCase().includes(lower) ||
        p.projectId.toLowerCase().includes(lower) ||
        p.vendor.toLowerCase().includes(lower)
      );
    }

    if (selectedJabo !== "all") {
      result = result.filter(p => p.jabo === selectedJabo);
    }

    if (selectedStatusVal !== "all") {
      result = result.filter(p => p.statusConstruction === selectedStatusVal);
    }

    if (selectedPicVal !== "all") {
      result = result.filter(p => p.pic === selectedPicVal);
    }

    if (selectedVendorVal !== "all") {
      result = result.filter(p => p.vendor === selectedVendorVal);
    }

    if (selectedMethodVal !== "all") {
      result = result.filter(p => p.metodeProject === selectedMethodVal);
    }

    if (selectedYearVal !== "all") {
      result = result.filter(p => p.tahun === selectedYearVal);
    }

    if (selectedWaspangVal !== "all") {
      result = result.filter(p => p.waspang?.toLowerCase() === selectedWaspangVal.toLowerCase());
    }

    // Apply Active Exploration Filters
    const activeExpFilters = explorationFilters.filter(ef => ef.isActive);
    if (activeExpFilters.length > 0) {
      result = result.filter(p => {
        return activeExpFilters.every(ef => {
          const val = p[ef.field];
          const target = ef.value;

          if (ef.operator === "empty") {
            return val === undefined || val === null || String(val).trim() === "";
          }
          if (ef.operator === "not_empty") {
            return val !== undefined && val !== null && String(val).trim() !== "";
          }
          if (ef.operator === "equals") {
            return String(val).toLowerCase() === target.toLowerCase();
          }
          if (ef.operator === "not_equals") {
            return String(val).toLowerCase() !== target.toLowerCase();
          }
          if (ef.operator === "contains") {
            return String(val).toLowerCase().includes(target.toLowerCase());
          }
          if (ef.operator === "greater_than") {
            return Number(val) > Number(target);
          }
          if (ef.operator === "less_than") {
            return Number(val) < Number(target);
          }
          return true;
        });
      });
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = a[sortBy === "pmoId" ? "pmoId" : sortBy === "length" ? "lengthM" : sortBy === "progress" ? "progressConstruction" : "no"];
      let valB: any = b[sortBy === "pmoId" ? "pmoId" : sortBy === "length" ? "lengthM" : sortBy === "progress" ? "progressConstruction" : "no"];

      // Handle nulls
      if (valA === undefined || valA === "") valA = sortBy === "pmoId" ? "" : 0;
      if (valB === undefined || valB === "") valB = sortBy === "pmoId" ? "" : 0;

      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });

    return result;
  }, [projects, searchQuery, selectedJabo, selectedStatusVal, selectedPicVal, selectedVendorVal, selectedMethodVal, selectedYearVal, selectedWaspangVal, explorationFilters, sortBy, sortOrder]);

  // Compute live analytical indicators
  const analytics = useMemo(() => {
    const total = filteredProjects.length;
    const totalLength = filteredProjects.reduce((sum, p) => sum + (p.lengthM || 0), 0);
    
    // Status breakdown
    const statuses = filteredProjects.reduce((acc, p) => {
      const s = p.statusConstruction || "Unknown";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Progress stats
    const averageProgress = total > 0 
      ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.progressConstruction || 0), 0) / total)
      : 0;

    // Regional Jabo metrics
    const jaboDistribution = filteredProjects.reduce((acc, p) => {
      const j = p.jabo || "General";
      acc[j] = (acc[j] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Vendor metrics (Top 5)
    const vendorCounts = filteredProjects.reduce((acc, p) => {
      const v = p.vendor || "Internal Team";
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topVendors = Object.entries(vendorCounts)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      totalLength,
      statuses,
      averageProgress,
      jaboDistribution,
      topVendors
    };
  }, [filteredProjects]);

  // Paginated Projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;

  // Function to handle exporting filtered projects to CSV
  const handleExportCSV = () => {
    const headers = [
      "No Asli",
      "Nama Project",
      "PMO ID",
      "Project ID",
      "Jabo (Regional)",
      "Project Plan",
      "Area/Kota",
      "PIC",
      "Waspang",
      "Vendor",
      "Metode Project",
      "Tanggal Surat",
      "Tahun",
      "Bulan",
      "Panjang (M)",
      "APD Relokasi",
      "Status Audit",
      "APD Linknet",
      "BA Survey",
      "Status Survey Material",
      "Status Survey Labour",
      "Request Type",
      "Labour",
      "Volume",
      "PO Number",
      "Type PO Labour",
      "Status Pengajuan PO",
      "Remarks",
      "Status Konstruksi",
      "Kategori Konstruksi",
      "Progres Fisik (%)",
      "Tanggal Update"
    ];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return "";
      let str = String(val);
      if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = filteredProjects.map(p => [
      p.no,
      p.namaProject,
      p.pmoId,
      p.projectId,
      p.jabo,
      p.projectPlan,
      p.areaKota,
      p.pic,
      p.waspang,
      p.vendor,
      p.metodeProject,
      p.tanggalSurat,
      p.tahun,
      p.bulan,
      p.lengthM,
      p.apdRelokasi,
      p.statusAudit,
      p.apdLinknet,
      p.baSurvey,
      p.statusSurveyMaterial,
      p.statusSurveyLabour,
      p.requestType,
      p.labour,
      p.volume,
      p.poNumber,
      p.typePoLabour,
      p.statusPengajuanPo,
      p.remarks,
      p.statusConstruction,
      p.categoryConstruction,
      p.progressConstruction,
      p.dateUpdate
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_project_monitoring_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to handle sort toggle
  const handleSort = (field: string) => {
    // Standard sorting helper
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedJabo("all");
    setSelectedStatusVal("all");
    setSelectedPicVal("all");
    setSelectedVendorVal("all");
    setSelectedMethodVal("all");
    setSelectedYearVal("all");
    setSelectedWaspangVal("all");
    setCurrentPage(1);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.namaProject?.trim()) {
      alert("Nama project harus diisi!");
      return;
    }
    const nextNo = projects.length > 0 ? Math.max(...projects.map(p => p.no || 0)) + 1 : 1;
    const projectToAdd: ProjectData = {
      no: nextNo,
      namaProject: newProject.namaProject,
      pmoId: newProject.pmoId || "",
      projectId: newProject.projectId || "",
      jabo: newProject.jabo || "JABOTABEK_1",
      projectPlan: newProject.projectPlan || "Relokasi",
      areaKota: newProject.areaKota || "",
      pic: newProject.pic || "",
      waspang: newProject.waspang || "",
      vendor: newProject.vendor || "",
      metodeProject: newProject.metodeProject || "TRENCHING",
      tanggalSurat: newProject.tanggalSurat || "",
      tahun: newProject.tahun || "2026",
      bulan: newProject.bulan || "Juli",
      lengthM: Number(newProject.lengthM) || 0,
      apdRelokasi: newProject.apdRelokasi || "No Need",
      statusAudit: newProject.statusAudit || "Belum Audit",
      apdLinknet: newProject.apdLinknet || "No Need",
      baSurvey: newProject.baSurvey || "Belum BA",
      statusSurveyMaterial: newProject.statusSurveyMaterial || "Belum Survey",
      statusSurveyLabour: newProject.statusSurveyLabour || "Belum Survey",
      requestType: newProject.requestType || "Relokasi",
      labour: newProject.labour || "",
      volume: newProject.volume || "",
      poNumber: newProject.poNumber || "",
      typePoLabour: newProject.typePoLabour || "",
      statusPengajuanPo: newProject.statusPengajuanPo || "Belum Diajukan",
      remarks: newProject.remarks || "",
      statusConstruction: newProject.statusConstruction || "Not Started",
      categoryConstruction: newProject.categoryConstruction || "Minor",
      progressConstruction: Number(newProject.progressConstruction) || 0,
      dateUpdate: new Date().toISOString().split("T")[0],

      // New mapped fields
      survey: newProject.survey || "",
      ceMaterial: newProject.ceMaterial || "",
      sphBoqVendor: newProject.sphBoqVendor || "",
      apdLn: newProject.apdLn || "",
      timeline: newProject.timeline || "",
      statusCe: newProject.statusCe || "",
      statusMr: newProject.statusMr || "",
      clover: newProject.clover || "",
      noMr: newProject.noMr || "",
      noGin: newProject.noGin || "",
      statusMaterial: newProject.statusMaterial || "",
      stock: newProject.stock || "",
      material: newProject.material || "",
      quantity: newProject.quantity || "",
      priority: newProject.priority || "",
      adjusment: newProject.adjusment || "",

      fo288: newProject.fo288 || "",
      fo288gl: newProject.fo288gl || "",
      fo144: newProject.fo144 || "",
      fo96: newProject.fo96 || "",
      fo96gl: newProject.fo96gl || "",
      fo48: newProject.fo48 || "",
      fo24: newProject.fo24 || "",
      fo12: newProject.fo12 || "",
      coax: newProject.coax || "",
      galvanis2: newProject.galvanis2 || "",
      closure288: newProject.closure288 || "",
      closure144: newProject.closure144 || "",
      closure96: newProject.closure96 || "",
      closure48: newProject.closure48 || "",
      closure24: newProject.closure24 || "",
      closure12: newProject.closure12 || "",

      tglStartProject: newProject.tglStartProject || "",
      statusPermit: newProject.statusPermit || "",
      galianAlurCons: newProject.galianAlurCons || "",
      galianAksesCons: newProject.galianAksesCons || "",
      galianCrossingJalanCons: newProject.galianCrossingJalanCons || "",
      galianCrossingJembatanCons: newProject.galianCrossingJembatanCons || "",
      galianCrossingSungaiCons: newProject.galianCrossingSungaiCons || "",
      instalasiHhMhCons: newProject.instalasiHhMhCons || "",
      installGalvanisCons: newProject.installGalvanisCons || "",
      installPoleCons: newProject.installPoleCons || "",

      fo288Cons: newProject.fo288Cons || "",
      fo144Cons: newProject.fo144Cons || "",
      fo96Cons: newProject.fo96Cons || "",
      fo96glCons: newProject.fo96glCons || "",
      fo48Cons: newProject.fo48Cons || "",
      fo12Cons: newProject.fo12Cons || "",
      coaxCons: newProject.coaxCons || "",

      fo288Pull: newProject.fo288Pull || "",
      fo144Pull: newProject.fo144Pull || "",
      fo96Pull: newProject.fo96Pull || "",
      fo96glPull: newProject.fo96glPull || "",
      fo48Pull: newProject.fo48Pull || "",
      fo12Pull: newProject.fo12Pull || "",
      coaxPull: newProject.coaxPull || "",

      tglDateline: newProject.tglDateline || "",
      planCoBulan: newProject.planCoBulan || "",
      today: newProject.today || "",
      aging: newProject.aging || "",

      fo288Rco: newProject.fo288Rco || "",
      fo144Rco: newProject.fo144Rco || "",
      fo96Rco: newProject.fo96Rco || "",
      fo96glRco: newProject.fo96glRco || "",
      fo48Rco: newProject.fo48Rco || "",
      fo24Rco: newProject.fo24Rco || "",
      fo12Rco: newProject.fo12Rco || "",
      coaxRco: newProject.coaxRco || "",

      fo288Sco: newProject.fo288Sco || "",
      fo144Sco: newProject.fo144Sco || "",
      fo96Sco: newProject.fo96Sco || "",
      fo96glSco: newProject.fo96glSco || "",
      fo48Sco: newProject.fo48Sco || "",
      fo12Sco: newProject.fo12Sco || "",
      coaxSco: newProject.coaxSco || "",

      statusCoFo: newProject.statusCoFo || "",
      statusCoCoax: newProject.statusCoCoax || ""
    };

    const updated = [projectToAdd, ...projects];
    saveProjects(updated, `Project baru "${projectToAdd.namaProject}" berhasil ditambahkan.`);
    setIsAddModalOpen(false);
    setSuccessToast("Project baru berhasil ditambahkan!");
    
    // Reset form values
    setNewProject({
      namaProject: "",
      pmoId: "",
      projectId: "",
      jabo: "JABOTABEK_1",
      projectPlan: "Relokasi",
      areaKota: "",
      pic: "",
      waspang: "",
      vendor: "",
      metodeProject: "TRENCHING",
      tanggalSurat: "",
      tahun: "2026",
      bulan: "Juli",
      lengthM: 100,
      apdRelokasi: "No Need",
      statusAudit: "Belum Audit",
      apdLinknet: "No Need",
      baSurvey: "Belum BA",
      statusSurveyMaterial: "Belum Survey",
      statusSurveyLabour: "Belum Survey",
      requestType: "Relokasi",
      labour: "",
      volume: "",
      poNumber: "",
      typePoLabour: "",
      statusPengajuanPo: "Belum Diajukan",
      remarks: "",
      statusConstruction: "Not Started",
      categoryConstruction: "Minor",
      progressConstruction: 0,
      dateUpdate: new Date().toISOString().split("T")[0],

      survey: "",
      ceMaterial: "",
      sphBoqVendor: "",
      apdLn: "",
      timeline: "",
      statusCe: "",
      statusMr: "",
      clover: "",
      noMr: "",
      noGin: "",
      statusMaterial: "",
      stock: "",
      material: "",
      quantity: "",
      priority: "",
      adjusment: "",

      fo288: "",
      fo288gl: "",
      fo144: "",
      fo96: "",
      fo96gl: "",
      fo48: "",
      fo24: "",
      fo12: "",
      coax: "",
      galvanis2: "",
      closure288: "",
      closure144: "",
      closure96: "",
      closure48: "",
      closure24: "",
      closure12: "",

      tglStartProject: "",
      statusPermit: "",
      galianAlurCons: "",
      galianAksesCons: "",
      galianCrossingJalanCons: "",
      galianCrossingJembatanCons: "",
      galianCrossingSungaiCons: "",
      instalasiHhMhCons: "",
      installGalvanisCons: "",
      installPoleCons: "",

      fo288Cons: "",
      fo144Cons: "",
      fo96Cons: "",
      fo96glCons: "",
      fo48Cons: "",
      fo12Cons: "",
      coaxCons: "",

      fo288Pull: "",
      fo144Pull: "",
      fo96Pull: "",
      fo96glPull: "",
      fo48Pull: "",
      fo12Pull: "",
      coaxPull: "",

      tglDateline: "",
      planCoBulan: "",
      today: "",
      aging: "",

      fo288Rco: "",
      fo144Rco: "",
      fo96Rco: "",
      fo96glRco: "",
      fo48Rco: "",
      fo24Rco: "",
      fo12Rco: "",
      coaxRco: "",

      fo288Sco: "",
      fo144Sco: "",
      fo96Sco: "",
      fo96glSco: "",
      fo48Sco: "",
      fo12Sco: "",
      coaxSco: "",

      statusCoFo: "",
      statusCoCoax: ""
    });
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editForm.namaProject?.trim()) {
      alert("Nama project harus diisi!");
      return;
    }

    const updated = projects.map(p => {
      if (p.no === editForm.no) {
        return {
          ...editForm,
          lengthM: Number(editForm.lengthM) || 0,
          progressConstruction: Number(editForm.progressConstruction) || 0,
          dateUpdate: new Date().toISOString().split("T")[0]
        };
      }
      return p;
    });

    saveProjects(updated, `Project "${editForm.namaProject}" berhasil diperbarui.`);
    const updatedProject = updated.find(p => p.no === editForm.no) || null;
    setSelectedProject(updatedProject);
    setIsEditing(false);
    setSuccessToast("Perubahan project berhasil disimpan!");
  };

  const handleDeleteProject = (projectNo: number) => {
    const deletedProjectName = projects.find(p => p.no === projectNo)?.namaProject || `No. ${projectNo}`;
    const updated = projects.filter(p => p.no !== projectNo);
    saveProjects(updated, `Project "${deletedProjectName}" berhasil dihapus.`);
    setSelectedProject(null);
    setShowDeleteConfirm(false);
    setSuccessToast("Project berhasil dihapus dari database!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* HEADER SECTION */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Project Monitoring & Relokasi Dashboard
                  <span className="text-xs bg-indigo-500/30 text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    Google Sheets Companion
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Monitoring progres fisik kontruksi, APD, survey material/labour
                </p>
              </div>
            </div>

            {/* TAB SELECTOR & SYNC STATUS */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* SYNC INDICATOR BADGE */}
              <div className="flex items-center gap-2.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 shadow-inner">
                <div className="relative flex h-2 w-2">
                  {syncStatus === "synced" && (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </>
                  )}
                  {syncStatus === "saving" && (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </>
                  )}
                  {syncStatus === "syncing" && (
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <RefreshCw className="animate-spin w-3.5 h-3.5 text-indigo-400" />
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block leading-none">
                    Cloud Sync
                  </span>
                  <span className="text-xs font-bold text-slate-100 block mt-0.5 leading-none">
                    {syncStatus === "synced" && "Tersinkron"}
                    {syncStatus === "saving" && "Menyimpan..."}
                    {syncStatus === "syncing" && "Menyinkronkan..."}
                  </span>
                </div>
              </div>

              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                  id="tab-btn-dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Live Demo Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "analytics"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                  id="tab-btn-analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                  Statistik & Analisis
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
        
        {/* TAB 1: LIVE DEMO DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 transition-all duration-300" id="dashboard-tab">
            
            {/* LEFT COLUMN: DAFTAR MENU & REAL-TIME REFRESH PANEL */}
            <div className="lg:col-span-1 flex flex-col gap-6" id="dashboard-sidebar-menu">
              
              {/* Menu 1: Quick Navigation & Presets */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ListFilter className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">Daftar Menu & Kontrol</span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Filter Cepat (Preset Menu)
                  </span>
                  <button
                    onClick={() => {
                      setFilterForm({ type: "status", label: "", value: "", color: "indigo" });
                      setFilterModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Tambah Filter Status Baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-1.5" aria-label="Quick Presets">
                  {/* Fixed "Semua Project" Button */}
                  <div className="group relative flex items-center gap-1">
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setSuccessToast("Menampilkan semua data project.");
                      }}
                      className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        selectedStatusVal === "all" && selectedJabo === "all" && searchQuery === ""
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Semua Project
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-extrabold">
                        {projects.length}
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Status Filters */}
                  {statusFilters.map(item => {
                    const isActive = selectedStatusVal === item.value;
                    let activeClasses = "bg-indigo-50 text-indigo-700 border border-indigo-100/50";
                    if (item.color === "emerald") activeClasses = "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
                    else if (item.color === "blue") activeClasses = "bg-blue-50 text-blue-700 border border-blue-100/50";
                    else if (item.color === "amber") activeClasses = "bg-amber-50 text-amber-700 border border-amber-100/50";
                    else if (item.color === "red") activeClasses = "bg-rose-50 text-rose-700 border border-rose-100/50";
                    else if (item.color === "slate") activeClasses = "bg-slate-100 text-slate-700 border border-slate-200";

                    let dotColor = "bg-indigo-500";
                    if (item.color === "emerald") dotColor = "bg-emerald-500";
                    else if (item.color === "blue") dotColor = "bg-blue-500";
                    else if (item.color === "amber") dotColor = "bg-amber-500";
                    else if (item.color === "red") dotColor = "bg-rose-500";
                    else if (item.color === "slate") dotColor = "bg-slate-400";

                    const count = projects.filter(p => p.statusConstruction === item.value || (item.value === "Project Done" && p.progressConstruction === 100)).length;

                    return (
                      <div key={item.id} className="group relative flex items-center gap-1">
                        <button
                          onClick={() => {
                            handleResetFilters();
                            setSelectedStatusVal(item.value);
                            setSuccessToast(`Menampilkan project dengan status "${item.label}".`);
                          }}
                          className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border border-transparent ${
                            isActive ? activeClasses : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="flex items-center gap-2 pr-6 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}></span>
                            <span className="truncate">{item.label}</span>
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-extrabold group-hover:hidden">
                            {count}
                          </span>
                        </button>
                        
                        {/* Edit & Delete Actions */}
                        <div className="absolute right-2 flex items-center gap-0.5 bg-white pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterForm({
                                id: item.id,
                                type: "status",
                                label: item.label,
                                value: item.value,
                                color: item.color
                              });
                              setFilterModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                            title="Edit Filter"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFilter(item.id, "status");
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Hapus Filter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </nav>
                

              </div>

              {/* Menu 2: Automatic Sync & Refresh Status */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-slate-900 text-sm">Status Sinkronisasi</span>
                  </div>
                  {/* Glowing pulsing live dot */}
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 text-[10px] text-emerald-700 font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Pembaruan Otomatis</span>
                      <span className="text-indigo-600">AKTIF</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Refresh berikutnya:</span>
                      <span className="font-mono font-extrabold text-slate-900 bg-slate-200/60 px-2 py-0.5 rounded-md">
                        {secondsToRefresh}s
                      </span>
                    </div>
                    
                    {/* Linear progress bar representing the countdown */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(secondsToRefresh / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium border-b border-slate-100 pb-2">
                      <span>Terakhir Disegarkan:</span>
                      <span className="font-mono font-bold text-slate-700">{lastUpdatedTime}</span>
                    </div>
                  </div>

                  {/* Cloud Sync Status Card */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3 mt-1">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Status Sinkronisasi</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide ${
                        syncStatus === "synced" ? "bg-emerald-100 text-emerald-800" :
                        syncStatus === "saving" ? "bg-amber-100 text-amber-800 animate-pulse" :
                        "bg-indigo-100 text-indigo-800 animate-pulse"
                      }`}>
                        {syncStatus === "synced" && "AKTIF"}
                        {syncStatus === "saving" && "MENYIMPAN"}
                        {syncStatus === "syncing" && "SINKRON"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        syncStatus === "synced" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        syncStatus === "saving" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      }`}>
                        <FolderSync className={`w-4 h-4 ${syncStatus !== "synced" ? "animate-spin" : ""}`} />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {syncStatus === "synced" && "Semua Data Tersinkron"}
                          {syncStatus === "saving" && "Menyimpan Perubahan..."}
                          {syncStatus === "syncing" && "Sinkronisasi Google Sheets..."}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {syncStatus === "synced" && `Terakhir sinkron: ${lastSyncedTime}`}
                          {syncStatus === "saving" && "Merekam perubahan lokal"}
                          {syncStatus === "syncing" && "Mengirim entri baru ke cloud"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleForceSync}
                      disabled={syncStatus !== "synced"}
                      className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        syncStatus === "synced"
                          ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm hover:scale-[1.01]"
                          : "bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${syncStatus !== "synced" ? "animate-spin" : ""}`} />
                      Sinkronkan Sekarang
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        triggerManualRefresh();
                        setSuccessToast("Dashboard berhasil disegarkan secara manual!");
                      }}
                      disabled={isRefreshing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/15 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                      {isRefreshing ? "Menyegarkan..." : "Segarkan Sekarang"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu 3: Realtime Activity Logs */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Bell className="w-4.5 h-4.5 text-indigo-500" />
                  <span className="font-bold text-slate-900 text-sm">Aktivitas Terbaru</span>
                </div>

                <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-1">
                  {activityLogs.map(log => (
                    <div key={log.id} className="flex gap-2.5 items-start text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-medium leading-normal">{log.text}</p>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: MAIN CONTENT */}
            <div className="lg:col-span-3 flex flex-col gap-8" id="dashboard-main-content">
              
              {/* STATS OVERVIEW PANELS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-cards-grid">
              
              {/* Card 1: Total projects */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-indigo-200 transition-colors" id="stat-card-total">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Project</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{analytics.total}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ditemukan di database</p>
                </div>
              </div>

              {/* Card 2: Done projects */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-200 transition-colors" id="stat-card-done">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Project Selesai</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {filteredProjects.filter(p => p.statusConstruction === "Project Done" || p.progressConstruction === 100).length}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Progress 100%</p>
                </div>
              </div>

              {/* Card 3: In Progress */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-200 transition-colors" id="stat-card-progress">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">In Progress</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {filteredProjects.filter(p => p.statusConstruction === "In Progress").length}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sedang konstruksi</p>
                </div>
              </div>

              {/* Card 4: Total Length */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-rose-200 transition-colors" id="stat-card-length">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Panjang</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {analytics.totalLength.toLocaleString("id-ID")} m
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Rentang kabel & pipa</p>
                </div>
              </div>

            </div>

            {/* FILTER & ADVANCED SEARCH BAR */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5" id="filter-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-slate-900">Filter Eksplorasi Data</span>
                </div>
                
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <button 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-bold transition-colors cursor-pointer hover:underline"
                  >
                    <Filter className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    {showAdvancedFilters ? "Sembunyikan Filter Lanjutan" : "Tampilkan Filter Lanjutan"}
                  </button>
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer hover:underline"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pencarian Project</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Cari PMO ID atau Nama..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                {/* Region Jabo */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regional (Jabo)</label>
                  <select
                    value={selectedJabo}
                    onChange={(e) => setSelectedJabo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  >
                    <option value="all">Semua Wilayah</option>
                    {filterOptions.jabos.map(j => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                {/* Status Construction */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Konstruksi</label>
                  <select
                    value={selectedStatusVal}
                    onChange={(e) => setSelectedStatusVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  >
                    <option value="all">Semua Status</option>
                    {filterOptions.statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* PIC */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PIC Project</label>
                  <select
                    value={selectedPicVal}
                    onChange={(e) => setSelectedPicVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  >
                    <option value="all">Semua PIC</option>
                    {filterOptions.pics.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Vendor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vendor Mitra</label>
                  <select
                    value={selectedVendorVal}
                    onChange={(e) => setSelectedVendorVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                  >
                    <option value="all">Semua Vendor</option>
                    {filterOptions.vendors.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COLLAPSIBLE ADVANCED FILTERS ROW */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100/60 animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Method */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Project</label>
                    <select
                      value={selectedMethodVal}
                      onChange={(e) => setSelectedMethodVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    >
                      <option value="all">Semua Metode</option>
                      {filterOptions.methods.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tahun Project</label>
                    <select
                      value={selectedYearVal}
                      onChange={(e) => setSelectedYearVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    >
                      <option value="all">Semua Tahun</option>
                      {filterOptions.years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Waspang dropdown filter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waspang</label>
                    <select
                      value={selectedWaspangVal}
                      onChange={(e) => setSelectedWaspangVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                    >
                      <option value="all">Semua Waspang</option>
                      {filterOptions.waspangs.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="visual-charts-section">
              
              {/* Distribution by Jabo Region */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Beban Distribusi Wilayah
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Jumlah project di masing-masing regional Jabo</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {Object.entries(analytics.jaboDistribution).map(([name, count]) => {
                    const vals = Object.values(analytics.jaboDistribution) as number[];
                    const maxVal = vals.length > 0 ? Math.max(...vals) : 1;
                    const percentage = Math.round(((count as number) / maxVal) * 100);
                    return (
                      <div key={name} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{name}</span>
                          <span className="font-semibold text-slate-500">{count} Project</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(analytics.jaboDistribution).length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">Tidak ada data regional</p>
                  )}
                </div>
              </div>

              {/* Dynamic Status Breakdown Gauge */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-emerald-600" />
                    Proporsi Progres Fisik
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Proporsi rata-rata fisik konstruksi yang berjalan</p>
                </div>

                <div className="flex flex-col items-center justify-center py-4 relative">
                  {/* Gauge representation */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="absolute w-full h-full -rotate-90">
                      <circle 
                        cx="72" cy="72" r="60" 
                        className="stroke-slate-100" 
                        strokeWidth="10" 
                        fill="transparent"
                      />
                      <circle 
                        cx="72" cy="72" r="60" 
                        className="stroke-indigo-600 transition-all duration-1000 ease-out" 
                        strokeWidth="10" 
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 * (1 - analytics.averageProgress / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center z-10">
                      <span className="text-3xl font-black text-slate-900">{analytics.averageProgress}%</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rata-rata Fisik</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full max-w-[240px]">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-slate-600 font-semibold">Done: {filteredProjects.filter(p => p.statusConstruction === "Project Done").length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                      <span className="text-slate-600 font-semibold">In Progres: {filteredProjects.filter(p => p.statusConstruction === "In Progress").length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="text-slate-600 font-semibold">Pending: {filteredProjects.filter(p => p.statusConstruction === "Pending").length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      <span className="text-slate-600 font-semibold">Belum: {filteredProjects.filter(p => p.statusConstruction === "Not Started").length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PIC Volume Metrics */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Top 5 Mitra Vendor
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Vendor dengan jumlah penanganan project terbanyak</p>
                </div>

                <div className="flex flex-col divide-y divide-slate-100">
                  {analytics.topVendors.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-4">#{index + 1}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[170px]">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Pekerjaan Relokasi</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {item.count} Project
                      </span>
                    </div>
                  ))}
                  {analytics.topVendors.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">Tidak ada data vendor</p>
                  )}
                </div>
              </div>

            </div>

            {/* DYNAMIC LIST & TABLE VIEW */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col" id="data-table-card">
              
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-lg">Daftar Project Terdaftar</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                    {filteredProjects.length} Item
                  </span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Project
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="Unduh laporan data project dalam format CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor CSV
                  </button>

                  {/* Mode Tampilan Tabel Toggle */}
                  <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 gap-0.5 ml-2">
                    <button
                      type="button"
                      onClick={() => setTableViewMode("compact")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        tableViewMode === "compact"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Kolom Utama
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableViewMode("full")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        tableViewMode === "full"
                          ? "bg-white text-indigo-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Semua Kolom ({96} Kolom)
                    </button>
                  </div>
                </div>

                {/* Sort control dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Urutkan:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-slate-200 py-1.5 px-3 rounded-xl font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="no">No Asli</option>
                    <option value="pmoId">PMO ID</option>
                    <option value="length">Panjang (M)</option>
                    <option value="progress">Progres Fisik</option>
                  </select>
                  <button 
                    onClick={() => setSortByOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TABLE ELEMENT */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    {tableViewMode === "compact" ? (
                      <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                        <th className="py-3 px-5 text-center w-12">No</th>
                        <th className="py-3 px-5">Nama Project / PMO ID</th>
                        <th className="py-3 px-5">Jabo</th>
                        <th className="py-3 px-5">PIC / Waspang</th>
                        <th className="py-3 px-5">Vendor Utama</th>
                        <th className="py-3 px-5">Panjang</th>
                        <th className="py-3 px-5">Progres Fisik</th>
                        <th className="py-3 px-5 text-center">Status</th>
                      </tr>
                    ) : (
                      <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap">
                        <th className="py-3 px-5 text-center w-12 sticky left-0 bg-slate-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-200">No</th>
                        <th className="py-3 px-5 sticky left-[48px] bg-slate-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-200 min-w-[200px]">Nama Project</th>
                        <th className="py-3 px-5 min-w-[120px]">PMO ID</th>
                        <th className="py-3 px-5">Tanggal Surat</th>
                        <th className="py-3 px-5">Tahun</th>
                        <th className="py-3 px-5">Bulan</th>
                        <th className="py-3 px-5">Length (M)</th>
                        <th className="py-3 px-5">APD Relokasi</th>
                        <th className="py-3 px-5">Status Audit</th>
                        <th className="py-3 px-5">APD Linknet</th>
                        <th className="py-3 px-5">Survey</th>
                        <th className="py-3 px-5">BA Survey</th>
                        <th className="py-3 px-5">Status Survey Material</th>
                        <th className="py-3 px-5">Status Survey Labour</th>
                        <th className="py-3 px-5">CE Material</th>
                        <th className="py-3 px-5">SPH/BOQ Vendor</th>
                        <th className="py-3 px-5">APD LN</th>
                        <th className="py-3 px-5">Timeline</th>
                        <th className="py-3 px-5">Status CE</th>
                        <th className="py-3 px-5">Status MR</th>
                        <th className="py-3 px-5">Clover</th>
                        <th className="py-3 px-5">No MR</th>
                        <th className="py-3 px-5">No GIN</th>
                        <th className="py-3 px-5">Status Material</th>
                        <th className="py-3 px-5">Remarks</th>
                        <th className="py-3 px-5">Stock</th>
                        <th className="py-3 px-5">Project ID</th>
                        <th className="py-3 px-5">MATERIAL</th>
                        <th className="py-3 px-5">Quantity</th>
                        <th className="py-3 px-5">Priority</th>
                        <th className="py-3 px-5">Adjusment</th>
                        <th className="py-3 px-5">FO 288</th>
                        <th className="py-3 px-5">FO 288GL</th>
                        <th className="py-3 px-5">FO 144</th>
                        <th className="py-3 px-5">FO 96</th>
                        <th className="py-3 px-5">FO 96GL</th>
                        <th className="py-3 px-5">FO 48</th>
                        <th className="py-3 px-5">FO 24</th>
                        <th className="py-3 px-5">FO 12</th>
                        <th className="py-3 px-5">Coax</th>
                        <th className="py-3 px-5">Galvanis 2"</th>
                        <th className="py-3 px-5">Closure 288</th>
                        <th className="py-3 px-5">Closure 144</th>
                        <th className="py-3 px-5">Closure 96</th>
                        <th className="py-3 px-5">Closure 48</th>
                        <th className="py-3 px-5">Closure 24</th>
                        <th className="py-3 px-5">Closure 12</th>
                        <th className="py-3 px-5">Tgl Start Project</th>
                        <th className="py-3 px-5">Status Permit</th>
                        <th className="py-3 px-5">Galian Alur (Cons)</th>
                        <th className="py-3 px-5">Galian Akses (Cons)</th>
                        <th className="py-3 px-5">Galian Crossing Jalan (Cons)</th>
                        <th className="py-3 px-5">Galian Crossing Jembatan (Cons)</th>
                        <th className="py-3 px-5">Galian Crossing Sungai (Cons)</th>
                        <th className="py-3 px-5">Instalasi HH/MH (Cons)</th>
                        <th className="py-3 px-5">Install Galvanis (Cons)</th>
                        <th className="py-3 px-5">Install Pole (Cons)</th>
                        <th className="py-3 px-5">FO 288 (Cons)</th>
                        <th className="py-3 px-5">FO 144 (Cons)</th>
                        <th className="py-3 px-5">FO 96 (Cons)</th>
                        <th className="py-3 px-5">FO 96GL (Cons)</th>
                        <th className="py-3 px-5">FO 48 (Cons)</th>
                        <th className="py-3 px-5">FO 12 (Cons)</th>
                        <th className="py-3 px-5">Coax (Cons)</th>
                        <th className="py-3 px-5">FO 288 (Pull)</th>
                        <th className="py-3 px-5">FO 144 (Pull)</th>
                        <th className="py-3 px-5">FO 96 (Pull)</th>
                        <th className="py-3 px-5">FO 96GL (Pull)</th>
                        <th className="py-3 px-5">FO 48 (Pull)</th>
                        <th className="py-3 px-5">FO 12 (Pull)</th>
                        <th className="py-3 px-5">Coax (Pull)</th>
                        <th className="py-3 px-5">Status Construction</th>
                        <th className="py-3 px-5">Category Construction</th>
                        <th className="py-3 px-5">Construction Progress</th>
                        <th className="py-3 px-5">Construction (%)</th>
                        <th className="py-3 px-5">Tgl Dateline</th>
                        <th className="py-3 px-5">Plan CO Bulan</th>
                        <th className="py-3 px-5">Today</th>
                        <th className="py-3 px-5">Aging</th>
                        <th className="py-3 px-5">FO 288 (Rco)</th>
                        <th className="py-3 px-5">FO 144 (Rco)</th>
                        <th className="py-3 px-5">FO 96 (Rco)</th>
                        <th className="py-3 px-5">FO 96GL (Rco)</th>
                        <th className="py-3 px-5">FO 48 (Rco)</th>
                        <th className="py-3 px-5">FO 24 (Rco)</th>
                        <th className="py-3 px-5">FO 12 (Rco)</th>
                        <th className="py-3 px-5">Coax (Rco)</th>
                        <th className="py-3 px-5">FO 288 (SCo)</th>
                        <th className="py-3 px-5">FO 144 (SCo)</th>
                        <th className="py-3 px-5">FO 96 (SCo)</th>
                        <th className="py-3 px-5">FO 96GL (SCo)</th>
                        <th className="py-3 px-5">FO 48 (SCo)</th>
                        <th className="py-3 px-5">FO 12 (SCo)</th>
                        <th className="py-3 px-5">Coax (SCo)</th>
                        <th className="py-3 px-5">Status CO FO</th>
                        <th className="py-3 px-5">Status CO Coax</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {paginatedProjects.map((p) => {
                      let statusBadge = "bg-slate-100 text-slate-600 border border-slate-200/60";
                      if (p.statusConstruction?.includes("Done") || p.statusConstruction?.includes("complete") || p.statusConstruction?.includes("Selesai") || p.statusConstruction?.includes("Selesai Utuh")) {
                        statusBadge = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                      } else if (p.statusConstruction?.includes("Progress") || p.statusConstruction?.includes("Jalan")) {
                        statusBadge = "bg-blue-50 text-blue-700 border border-blue-200";
                      } else if (p.statusConstruction?.includes("Pending") || p.statusConstruction?.includes("Hold")) {
                        statusBadge = "bg-amber-50 text-amber-700 border border-amber-200";
                      } else if (p.statusConstruction?.includes("Cancel") || p.statusConstruction?.includes("Batal")) {
                        statusBadge = "bg-rose-50 text-rose-700 border border-rose-200";
                      }

                      if (tableViewMode === "compact") {
                        return (
                          <tr 
                            key={`${p.pmoId}-${p.no}`} 
                            onClick={() => setSelectedProject(p)}
                            className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                          >
                            <td className="py-4 px-5 text-center font-bold text-slate-400 group-hover:text-indigo-600">
                              {p.no}
                            </td>
                            <td className="py-4 px-5">
                              <p className="font-bold text-slate-800 text-[13.5px] leading-tight group-hover:text-indigo-600 transition-colors">
                                {p.namaProject}
                              </p>
                              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mt-1">
                                {p.pmoId || "TANPA PMO ID"} {p.projectId ? `• SAP: ${p.projectId}` : ""}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-xs text-slate-600 font-bold">
                              {p.jabo}
                            </td>
                            <td className="py-4 px-5 text-xs text-slate-600">
                              <div className="font-bold text-slate-700">{p.pic}</div>
                              <span className="text-[10px] text-slate-400">{p.waspang || "Tidak ada Waspang"}</span>
                            </td>
                            <td className="py-4 px-5 text-xs text-slate-600 truncate max-w-[140px]">
                              {p.vendor || "Belum Ditentukan"}
                            </td>
                            <td className="py-4 px-5 text-xs font-mono font-bold text-slate-700">
                              {p.lengthM > 0 ? `${p.lengthM.toLocaleString("id-ID")} m` : "-"}
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${p.progressConstruction}%` }}
                                  />
                                </div>
                                <span className="text-xs font-black text-slate-600">{p.progressConstruction}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${statusBadge}`}>
                                {p.statusConstruction}
                              </span>
                            </td>
                          </tr>
                        );
                      } else {
                        // Full table with all requested columns (beautiful horizontal spreadsheet style)
                        return (
                          <tr 
                            key={`${p.pmoId}-${p.no}`} 
                            onClick={() => setSelectedProject(p)}
                            className="hover:bg-slate-50/80 cursor-pointer transition-colors group text-xs text-slate-700 whitespace-nowrap"
                          >
                            {/* Pinned columns */}
                            <td className="py-3 px-5 text-center font-bold text-slate-400 group-hover:text-indigo-600 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-100">
                              {p.no}
                            </td>
                            <td className="py-3 px-5 font-bold text-slate-800 text-[13px] leading-tight group-hover:text-indigo-600 transition-colors sticky left-[48px] bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-100 max-w-[220px] truncate" title={p.namaProject}>
                              {p.namaProject}
                            </td>
                            
                            {/* Scrollable Columns in Exact Requested Order */}
                            <td className="py-3 px-5 font-mono text-[11px] text-slate-500 font-bold">{p.pmoId || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.tanggalSurat || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.tahun || "-"}</td>
                            <td className="py-3 px-5">{p.bulan || "-"}</td>
                            <td className="py-3 px-5 font-mono font-bold text-slate-800">
                              {p.lengthM !== undefined ? `${p.lengthM.toLocaleString("id-ID")} M` : "-"}
                            </td>
                            
                            <td className="py-3 px-5">
                              {p.apdRelokasi ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${p.apdRelokasi.toLowerCase().includes("need") ? "text-rose-700 bg-rose-50 border-rose-100 animate-pulse" : "text-slate-600 bg-slate-50 border-slate-200"}`}>
                                  {p.apdRelokasi}
                                </span>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-5">
                              {p.statusAudit ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${p.statusAudit.toLowerCase().includes("sudah") || p.statusAudit.toLowerCase().includes("selesai") || p.statusAudit.toLowerCase().includes("done") ? "text-emerald-700 bg-emerald-50 border-emerald-150" : "text-amber-700 bg-amber-50 border-amber-150"}`}>
                                  {p.statusAudit}
                                </span>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-5">{p.apdLinknet || "-"}</td>
                            
                            <td className="py-3 px-5">{p.survey || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.baSurvey || "-"}</td>
                            <td className="py-3 px-5">
                              {p.statusSurveyMaterial ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${p.statusSurveyMaterial.toLowerCase().includes("sudah") || p.statusSurveyMaterial.toLowerCase().includes("yes") || p.statusSurveyMaterial.toLowerCase().includes("done") ? "text-emerald-700 bg-emerald-50 border-emerald-150" : "text-amber-700 bg-amber-50 border-amber-150"}`}>
                                  {p.statusSurveyMaterial}
                                </span>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-5">
                              {p.statusSurveyLabour ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${p.statusSurveyLabour.toLowerCase().includes("sudah") || p.statusSurveyLabour.toLowerCase().includes("yes") || p.statusSurveyLabour.toLowerCase().includes("done") ? "text-emerald-700 bg-emerald-50 border-emerald-150" : "text-amber-700 bg-amber-50 border-amber-150"}`}>
                                  {p.statusSurveyLabour}
                                </span>
                              ) : "-"}
                            </td>
                            
                            <td className="py-3 px-5">{p.ceMaterial || "-"}</td>
                            <td className="py-3 px-5 max-w-[150px] truncate" title={p.sphBoqVendor}>{p.sphBoqVendor || "-"}</td>
                            <td className="py-3 px-5">{p.apdLn || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.timeline || "-"}</td>
                            <td className="py-3 px-5">{p.statusCe || "-"}</td>
                            <td className="py-3 px-5">{p.statusMr || "-"}</td>
                            <td className="py-3 px-5">{p.clover || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.noMr || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.noGin || "-"}</td>
                            <td className="py-3 px-5">{p.statusMaterial || "-"}</td>
                            <td className="py-3 px-5 max-w-[150px] truncate" title={p.remarks}>{p.remarks || "-"}</td>
                            <td className="py-3 px-5">{p.stock || "-"}</td>
                            <td className="py-3 px-5 font-mono font-bold text-slate-800">{p.projectId || "-"}</td>
                            <td className="py-3 px-5 max-w-[150px] truncate" title={p.material}>{p.material || "-"}</td>
                            <td className="py-3 px-5 font-mono">{p.quantity || "-"}</td>
                            <td className="py-3 px-5 font-bold">{p.priority || "-"}</td>
                            <td className="py-3 px-5">{p.adjusment || "-"}</td>
                            
                            {/* FO cables specification */}
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo288 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo288gl || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo144 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo96 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo96gl || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo48 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo24 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.fo12 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.coax || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.galvanis2 || "-"}</td>
                            
                            {/* Closures */}
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure288 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure144 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure96 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure48 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure24 || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-slate-600">{p.closure12 || "-"}</td>
                            
                            {/* Civil and field stats */}
                            <td className="py-3 px-5 font-mono text-slate-600">{p.tglStartProject || "-"}</td>
                            <td className="py-3 px-5">
                              {p.statusPermit ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${p.statusPermit.toLowerCase().includes("approved") || p.statusPermit.toLowerCase().includes("ijin") || p.statusPermit.toLowerCase().includes("ok") ? "text-emerald-700 bg-emerald-50 border-emerald-150" : "text-amber-700 bg-amber-50 border-amber-150"}`}>
                                  {p.statusPermit}
                                </span>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-5">{p.galianAlurCons || "-"}</td>
                            <td className="py-3 px-5">{p.galianAksesCons || "-"}</td>
                            <td className="py-3 px-5">{p.galianCrossingJalanCons || "-"}</td>
                            <td className="py-3 px-5">{p.galianCrossingJembatanCons || "-"}</td>
                            <td className="py-3 px-5">{p.galianCrossingSungaiCons || "-"}</td>
                            <td className="py-3 px-5">{p.instalasiHhMhCons || "-"}</td>
                            <td className="py-3 px-5">{p.installGalvanisCons || "-"}</td>
                            <td className="py-3 px-5">{p.installPoleCons || "-"}</td>
                            
                            {/* FO Installed Cons */}
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo288Cons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo144Cons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo96Cons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo96glCons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo48Cons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.fo12Cons || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-emerald-700 bg-emerald-50/20">{p.coaxCons || "-"}</td>
                            
                            {/* FO Pulling */}
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo288Pull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo144Pull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo96Pull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo96glPull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo48Pull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.fo12Pull || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-indigo-700 bg-indigo-50/20">{p.coaxPull || "-"}</td>
                            
                            {/* Construction stats */}
                            <td className="py-3 px-5">
                              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${statusBadge}`}>
                                {p.statusConstruction || "-"}
                              </span>
                            </td>
                            <td className="py-3 px-5 text-slate-600">{p.categoryConstruction || "-"}</td>
                            <td className="py-3 px-5 font-mono font-bold text-indigo-600">{p.progressConstruction || 0}%</td>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-2">
                                <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${p.progressConstruction || 0}%` }} />
                                </div>
                                <span className="text-[11px] font-bold font-mono text-slate-600">{p.progressConstruction || 0}%</span>
                              </div>
                            </td>
                            
                            <td className="py-3 px-5 font-mono text-slate-600">{p.tglDateline || "-"}</td>
                            <td className="py-3 px-5 font-bold text-indigo-600">{p.planCoBulan || "-"}</td>
                            <td className="py-3 px-5 font-mono text-slate-600">{p.today || "-"}</td>
                            <td className="py-3 px-5 font-mono font-extrabold text-rose-600">{p.aging || "-"}</td>
                            
                            {/* RCO stats */}
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo288Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo144Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo96Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo96glRco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo48Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo24Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.fo12Rco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-amber-700 bg-amber-50/10">{p.coaxRco || "-"}</td>
                            
                            {/* SCO stats */}
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo288Sco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo144Sco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo96Sco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo96glSco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo48Sco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.fo12Sco || "-"}</td>
                            <td className="py-3 px-5 font-mono text-center text-purple-700 bg-purple-50/10">{p.coaxSco || "-"}</td>
                            
                            <td className="py-3 px-5 font-mono text-slate-600">{p.statusCoFo || "-"}</td>
                            <td className="py-3 px-5 font-mono text-slate-600">{p.statusCoCoax || "-"}</td>
                          </tr>
                        );
                      }
                    })}

                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={tableViewMode === "compact" ? 8 : 96} className="py-12 text-center text-slate-400 font-medium">
                          <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          Tidak ada project yang cocok dengan kriteria pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION SECTION */}
              {filteredProjects.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm bg-slate-50/50">
                  <span className="text-xs text-slate-500 font-semibold">
                    Menampilkan <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga{" "}
                    <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> dari{" "}
                    <span className="font-bold text-slate-700">{filteredProjects.length}</span> item
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <span className="text-xs font-bold text-slate-600">
                      Halaman {currentPage} dari {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* End of RIGHT COLUMN */}
            </div>

          </div>
        )}

        {/* TAB 2: ADVANCED ANALYTICS & STATISTIK */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-8 transition-all duration-300" id="analytics-tab">
            {/* Overview Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Progres Konstruksi</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-indigo-600">{analytics.averageProgress}%</h3>
                  <span className="text-xs text-slate-500 font-medium">Dari seluruh project aktif</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${analytics.averageProgress}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Project Terbanyak</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-900">
                    {(() => {
                      const counts = projects.reduce((acc, p) => {
                        const m = p.metodeProject || "TRENCHING";
                        acc[m] = (acc[m] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      const sorted = (Object.entries(counts) as [string, number][]).sort((a, b) => b[1] - a[1]);
                      return sorted[0] ? sorted[0][0] : "-";
                    })()}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Metode dominan</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Disesuaikan dengan kondisi lapangan geografis</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kebutuhan APD Relokasi</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-600">
                    {projects.filter(p => p.apdRelokasi === "Need").length} Unit
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Butuh Pengamanan</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {projects.filter(p => p.apdRelokasi === "No Need").length} project tidak memerlukan APD
                </p>
              </div>
            </div>

            {/* Detailed Distribution Analysis Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Construction Methods Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Metode Konstruksi & Relokasi</h3>
                  <p className="text-[11px] text-slate-400">Distribusi teknik penarikan kabel fiber optik</p>
                </div>
                <div className="space-y-4 py-2">
                  {(() => {
                    const counts = projects.reduce((acc, p) => {
                      const m = p.metodeProject || "TRENCHING";
                      acc[m] = (acc[m] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    const maxVal = Math.max(...(Object.values(counts) as number[]), 1);
                    return (Object.entries(counts) as [string, number][]).map(([name, count]) => {
                      const pct = Math.round((count / projects.length) * 100);
                      return (
                        <div key={name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700">{name}</span>
                            <span className="font-semibold text-slate-500">{count} Project ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-700" 
                              style={{ width: `${(count / maxVal) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Survey Readiness & Audit Status */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Status Audit & Survey Readiness</h3>
                  <p className="text-[11px] text-slate-400">Analisis kesiapan teknis sebelum konstruksi dimulai</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Status Audit Grid */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-500 block">Status Audit Finansial</span>
                    <div className="space-y-2">
                      {["Sudah Audit", "Belum Audit", "Proses Audit"].map(status => {
                        const count = projects.filter(p => p.statusAudit === status).length;
                        return (
                          <div key={status} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium">{status}</span>
                            <span className="font-black text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Survey Material Checklist */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-500 block">Kesiapan Survey Material</span>
                    <div className="space-y-2">
                      {["Sudah Survey", "Belum Survey", "No Need"].map(survey => {
                        const count = projects.filter(p => p.statusSurveyMaterial === survey).length;
                        return (
                          <div key={survey} className="flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium">{survey}</span>
                            <span className="font-black text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Construction Category summary */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Skala Kompleksitas</span>
                  <div className="flex gap-4">
                    {["Minor", "Major", "Critical"].map(cat => {
                      const count = projects.filter(p => p.categoryConstruction === cat).length;
                      return (
                        <div key={cat} className="flex-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-center">
                          <p className="text-xs font-bold text-slate-500">{cat}</p>
                          <h4 className="text-lg font-black text-slate-900 mt-0.5">{count}</h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* PIC Workload & PO Status Monitoring */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Beban Kerja PIC Project & Pengajuan PO</h3>
                <p className="text-[11px] text-slate-400">Detail volume pekerjaan terdistribusi per personil</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4">Nama PIC</th>
                      <th className="py-3 px-4">Jumlah Project</th>
                      <th className="py-3 px-4">Total Panjang Kabel</th>
                      <th className="py-3 px-4">PO Diajukan</th>
                      <th className="py-3 px-4">PO Selesai / Terbit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {(() => {
                      const picStats = projects.reduce((acc, p) => {
                        const pic = p.pic || "Tanpa PIC";
                        if (!acc[pic]) {
                          acc[pic] = { count: 0, totalLength: 0, poRequested: 0, poDone: 0 };
                        }
                        acc[pic].count += 1;
                        acc[pic].totalLength += p.lengthM || 0;
                        if (p.statusPengajuanPo === "Sudah Diajukan") acc[pic].poRequested += 1;
                        if (p.statusPengajuanPo === "Selesai PO") acc[pic].poDone += 1;
                        return acc;
                      }, {} as Record<string, { count: number, totalLength: number, poRequested: number, poDone: number }>);

                      return (Object.entries(picStats) as [string, { count: number, totalLength: number, poRequested: number, poDone: number }][]).map(([pic, stats]) => (
                        <tr key={pic} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-900">{pic}</td>
                          <td className="py-3 px-4">{stats.count} Project</td>
                          <td className="py-3 px-4 font-mono">{stats.totalLength.toLocaleString("id-ID")} m</td>
                          <td className="py-3 px-4 text-amber-600">{stats.poRequested} Project</td>
                          <td className="py-3 px-4 text-emerald-600">{stats.poDone} Project</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER AREA */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-400">Dashboard Monitoring Project Relokasi & Pengamanan Asset</p>
          <p className="mt-1 text-[11px]">Dibuat khusus untuk menyajikan data interaktif & integrasi instan Google Workspace.</p>
        </div>
      </footer>

      {/* POPUP MODAL: ADD NEW PROJECT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Tambah Project Baru</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab selection bar inside modal */}
            <div className="px-6 py-2.5 border-b border-slate-100 flex gap-2 overflow-x-auto bg-slate-50/50 scrollbar-none">
              {[
                { key: "general", label: "1. Umum & PIC" },
                { key: "survey", label: "2. Survey & Material" },
                { key: "kabel", label: "3. Kabel & Closure" },
                { key: "civil", label: "4. Sipil & Galian" },
                { key: "fo_cons", label: "5. Kabel Cons & Pull" },
                { key: "co_timeline", label: "6. RCO / SCO & Timeline" },
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setAddModalTab(t.key as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    addModalTab === t.key 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddProject} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1">
                
                {/* TAB 1: GENERAL / UMUM & PIC */}
                {addModalTab === "general" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Informasi Utama & Identifikasi</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Nama Project *</label>
                          <input 
                            type="text" 
                            required
                            value={newProject.namaProject || ""}
                            onChange={e => setNewProject({...newProject, namaProject: e.target.value})}
                            placeholder="Masukkan nama project..."
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">PMO ID</label>
                          <input 
                            type="text" 
                            value={newProject.pmoId || ""}
                            onChange={e => setNewProject({...newProject, pmoId: e.target.value})}
                            placeholder="Contoh: PMO-GOV-123"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Project ID SAP</label>
                          <input 
                            type="text" 
                            value={newProject.projectId || ""}
                            onChange={e => setNewProject({...newProject, projectId: e.target.value})}
                            placeholder="Masukkan ID SAP"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Wilayah & Personil</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Regional Jabo</label>
                          <select 
                            value={newProject.jabo || "JABOTABEK_1"}
                            onChange={e => setNewProject({...newProject, jabo: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
                          >
                            <option value="JABOTABEK_1">JABOTABEK_1</option>
                            <option value="JABOTABEK_2">JABOTABEK_2</option>
                            <option value="JABOTABEK_3">JABOTABEK_3</option>
                            <option value="WEST_JAVA">WEST_JAVA</option>
                            <option value="CENTRAL_JAVA">CENTRAL_JAVA</option>
                            <option value="EAST_JAVA">EAST_JAVA</option>
                            <option value="BALI_NUSRA">BALI_NUSRA</option>
                            <option value="SUMATERA">SUMATERA</option>
                            <option value="KALIMANTAN">KALIMANTAN</option>
                            <option value="SULAWESI">SULAWESI</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Area / Kota</label>
                          <input 
                            type="text" 
                            value={newProject.areaKota || ""}
                            onChange={e => setNewProject({...newProject, areaKota: e.target.value})}
                            placeholder="Contoh: Jakarta Barat"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">PIC Project</label>
                          <input 
                            type="text" 
                            value={newProject.pic || ""}
                            onChange={e => setNewProject({...newProject, pic: e.target.value})}
                            placeholder="Nama PIC"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Waspang</label>
                          <input 
                            type="text" 
                            value={newProject.waspang || ""}
                            onChange={e => setNewProject({...newProject, waspang: e.target.value})}
                            placeholder="Nama Pengawas Lapangan"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Administrasi, Penjadwalan & Vendor</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Metode Penarikan</label>
                          <select 
                            value={newProject.metodeProject || "TRENCHING"}
                            onChange={e => setNewProject({...newProject, metodeProject: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          >
                            <option value="TRENCHING">TRENCHING</option>
                            <option value="BORING">BORING</option>
                            <option value="AERIAL">AERIAL</option>
                            <option value="MICRO_TRENCH">MICRO_TRENCH</option>
                            <option value="SUBDUST">SUBDUST</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Tanggal Surat</label>
                          <input 
                            type="text" 
                            value={newProject.tanggalSurat || ""}
                            onChange={e => setNewProject({...newProject, tanggalSurat: e.target.value})}
                            placeholder="Contoh: 12-Jun-24"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Tahun</label>
                          <input 
                            type="text" 
                            value={newProject.tahun || "2026"}
                            onChange={e => setNewProject({...newProject, tahun: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Bulan</label>
                          <input 
                            type="text" 
                            value={newProject.bulan || "Juli"}
                            onChange={e => setNewProject({...newProject, bulan: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Panjang Kabel (Meter)</label>
                        <input 
                          type="number" 
                          value={newProject.lengthM || 0}
                          onChange={e => setNewProject({...newProject, lengthM: Number(e.target.value)})}
                          placeholder="Panjang dalam meter"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">APD Relokasi</label>
                        <select 
                          value={newProject.apdRelokasi || "No Need"}
                          onChange={e => setNewProject({...newProject, apdRelokasi: e.target.value})}
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        >
                          <option value="Need">Need</option>
                          <option value="No Need">No Need</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Status Audit Finansial</label>
                        <select 
                          value={newProject.statusAudit || "Belum Audit"}
                          onChange={e => setNewProject({...newProject, statusAudit: e.target.value})}
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        >
                          <option value="Sudah Audit">Sudah Audit</option>
                          <option value="Belum Audit">Belum Audit</option>
                          <option value="Proses Audit">Proses Audit</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">APD Linknet</label>
                        <input 
                          type="text" 
                          value={newProject.apdLinknet || ""}
                          onChange={e => setNewProject({...newProject, apdLinknet: e.target.value})}
                          placeholder="Masukkan status APD Linknet"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Vendor Pelaksana Utama</label>
                        <input 
                          type="text" 
                          value={newProject.vendor || ""}
                          onChange={e => setNewProject({...newProject, vendor: e.target.value})}
                          placeholder="Contoh: PT Elas, PT Multikom"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Remarks / Catatan Lapangan</label>
                        <input 
                          type="text" 
                          value={newProject.remarks || ""}
                          onChange={e => setNewProject({...newProject, remarks: e.target.value})}
                          placeholder="Catatan umum progress"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SURVEY & PERSIAPAN MATERIAL */}
                {addModalTab === "survey" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Survey & BA Lapangan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Survey</label>
                          <input 
                            type="text" 
                            value={newProject.survey || ""}
                            onChange={e => setNewProject({...newProject, survey: e.target.value})}
                            placeholder="Status survey"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">BA Survey</label>
                          <input 
                            type="text" 
                            value={newProject.baSurvey || ""}
                            onChange={e => setNewProject({...newProject, baSurvey: e.target.value})}
                            placeholder="Nomor/Status BA Survey"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status Survey Material</label>
                          <select 
                            value={newProject.statusSurveyMaterial || "Belum Survey"}
                            onChange={e => setNewProject({...newProject, statusSurveyMaterial: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          >
                            <option value="Belum Survey">Belum Survey</option>
                            <option value="Sudah Survey">Sudah Survey</option>
                            <option value="No Need">No Need</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status Survey Labour</label>
                          <select 
                            value={newProject.statusSurveyLabour || "Belum Survey"}
                            onChange={e => setNewProject({...newProject, statusSurveyLabour: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          >
                            <option value="Belum Survey">Belum Survey</option>
                            <option value="Sudah Survey">Sudah Survey</option>
                            <option value="No Need">No Need</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Administrasi Material & CE</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">CE Material</label>
                          <input 
                            type="text" 
                            value={newProject.ceMaterial || ""}
                            onChange={e => setNewProject({...newProject, ceMaterial: e.target.value})}
                            placeholder="Masukkan status CE Material"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">SPH / BOQ Vendor</label>
                          <input 
                            type="text" 
                            value={newProject.sphBoqVendor || ""}
                            onChange={e => setNewProject({...newProject, sphBoqVendor: e.target.value})}
                            placeholder="SPH / BOQ status"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">APD LN</label>
                          <input 
                            type="text" 
                            value={newProject.apdLn || ""}
                            onChange={e => setNewProject({...newProject, apdLn: e.target.value})}
                            placeholder="APD Link Net status"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Timeline</label>
                          <input 
                            type="text" 
                            value={newProject.timeline || ""}
                            onChange={e => setNewProject({...newProject, timeline: e.target.value})}
                            placeholder="Timeline/Jadwal"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Request & Approval Internal</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status CE</label>
                          <input 
                            type="text" 
                            value={newProject.statusCe || ""}
                            onChange={e => setNewProject({...newProject, statusCe: e.target.value})}
                            placeholder="Status CE"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status MR</label>
                          <input 
                            type="text" 
                            value={newProject.statusMr || ""}
                            onChange={e => setNewProject({...newProject, statusMr: e.target.value})}
                            placeholder="Status MR"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Clover</label>
                          <input 
                            type="text" 
                            value={newProject.clover || ""}
                            onChange={e => setNewProject({...newProject, clover: e.target.value})}
                            placeholder="Clover integration status"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">No MR</label>
                          <input 
                            type="text" 
                            value={newProject.noMr || ""}
                            onChange={e => setNewProject({...newProject, noMr: e.target.value})}
                            placeholder="Nomor Material Request"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">No GIN</label>
                        <input 
                          type="text" 
                          value={newProject.noGin || ""}
                          onChange={e => setNewProject({...newProject, noGin: e.target.value})}
                          placeholder="Nomor Goods Issue Note"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Status Material</label>
                        <input 
                          type="text" 
                          value={newProject.statusMaterial || ""}
                          onChange={e => setNewProject({...newProject, statusMaterial: e.target.value})}
                          placeholder="Contoh: Ready / Belum Ready"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Stock</label>
                        <input 
                          type="text" 
                          value={newProject.stock || ""}
                          onChange={e => setNewProject({...newProject, stock: e.target.value})}
                          placeholder="Stock status"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">MATERIAL</label>
                        <input 
                          type="text" 
                          value={newProject.material || ""}
                          onChange={e => setNewProject({...newProject, material: e.target.value})}
                          placeholder="Jenis/Nama Material"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Quantity</label>
                        <input 
                          type="text" 
                          value={newProject.quantity || ""}
                          onChange={e => setNewProject({...newProject, quantity: e.target.value})}
                          placeholder="Jumlah material"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Priority</label>
                        <input 
                          type="text" 
                          value={newProject.priority || ""}
                          onChange={e => setNewProject({...newProject, priority: e.target.value})}
                          placeholder="Skala Prioritas"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-500">Adjusment</label>
                        <input 
                          type="text" 
                          value={newProject.adjusment || ""}
                          onChange={e => setNewProject({...newProject, adjusment: e.target.value})}
                          placeholder="Penyesuaian di lapangan"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: KABEL & CLOSURE */}
                {addModalTab === "kabel" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Pipa & Kapasitas Kabel Fiber Optik</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288</label>
                          <input 
                            type="text" 
                            value={newProject.fo288 || ""}
                            onChange={e => setNewProject({...newProject, fo288: e.target.value})}
                            placeholder="Sisa/Kebutuhan FO 288"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288GL</label>
                          <input 
                            type="text" 
                            value={newProject.fo288gl || ""}
                            onChange={e => setNewProject({...newProject, fo288gl: e.target.value})}
                            placeholder="Sisa/Kebutuhan FO 288GL"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 144</label>
                          <input 
                            type="text" 
                            value={newProject.fo144 || ""}
                            onChange={e => setNewProject({...newProject, fo144: e.target.value})}
                            placeholder="Sisa/Kebutuhan FO 144"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96</label>
                          <input 
                            type="text" 
                            value={newProject.fo96 || ""}
                            onChange={e => setNewProject({...newProject, fo96: e.target.value})}
                            placeholder="Sisa/Kebutuhan FO 96"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 96GL</label>
                        <input 
                          type="text" 
                          value={newProject.fo96gl || ""}
                          onChange={e => setNewProject({...newProject, fo96gl: e.target.value})}
                          placeholder="Sisa/Kebutuhan FO 96GL"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 48</label>
                        <input 
                          type="text" 
                          value={newProject.fo48 || ""}
                          onChange={e => setNewProject({...newProject, fo48: e.target.value})}
                          placeholder="Sisa/Kebutuhan FO 48"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 24</label>
                        <input 
                          type="text" 
                          value={newProject.fo24 || ""}
                          onChange={e => setNewProject({...newProject, fo24: e.target.value})}
                          placeholder="Sisa/Kebutuhan FO 24"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 12</label>
                        <input 
                          type="text" 
                          value={newProject.fo12 || ""}
                          onChange={e => setNewProject({...newProject, fo12: e.target.value})}
                          placeholder="Sisa/Kebutuhan FO 12"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Coax</label>
                        <input 
                          type="text" 
                          value={newProject.coax || ""}
                          onChange={e => setNewProject({...newProject, coax: e.target.value})}
                          placeholder="Sisa/Kebutuhan Coaxial"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Galvanis 2"</label>
                        <input 
                          type="text" 
                          value={newProject.galvanis2 || ""}
                          onChange={e => setNewProject({...newProject, galvanis2: e.target.value})}
                          placeholder='Kebutuhan Pipa Galvanis 2"'
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Kebutuhan Closure (Sambungan Joint)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Closure 288</label>
                          <input 
                            type="text" 
                            value={newProject.closure288 || ""}
                            onChange={e => setNewProject({...newProject, closure288: e.target.value})}
                            placeholder="Unit Closure 288"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Closure 144</label>
                          <input 
                            type="text" 
                            value={newProject.closure144 || ""}
                            onChange={e => setNewProject({...newProject, closure144: e.target.value})}
                            placeholder="Unit Closure 144"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Closure 96</label>
                          <input 
                            type="text" 
                            value={newProject.closure96 || ""}
                            onChange={e => setNewProject({...newProject, closure96: e.target.value})}
                            placeholder="Unit Closure 96"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Closure 48</label>
                        <input 
                          type="text" 
                          value={newProject.closure48 || ""}
                          onChange={e => setNewProject({...newProject, closure48: e.target.value})}
                          placeholder="Unit Closure 48"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Closure 24</label>
                        <input 
                          type="text" 
                          value={newProject.closure24 || ""}
                          onChange={e => setNewProject({...newProject, closure24: e.target.value})}
                          placeholder="Unit Closure 24"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Closure 12</label>
                        <input 
                          type="text" 
                          value={newProject.closure12 || ""}
                          onChange={e => setNewProject({...newProject, closure12: e.target.value})}
                          placeholder="Unit Closure 12"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: SIPIL & GALIAN (CONSTRUCTION) */}
                {addModalTab === "civil" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Penjadwalan & Perizinan Sipil</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Tgl Start Project</label>
                          <input 
                            type="text" 
                            value={newProject.tglStartProject || ""}
                            onChange={e => setNewProject({...newProject, tglStartProject: e.target.value})}
                            placeholder="Format: 01-Jan-2026 atau status"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status Permit (Izin)</label>
                          <input 
                            type="text" 
                            value={newProject.statusPermit || ""}
                            onChange={e => setNewProject({...newProject, statusPermit: e.target.value})}
                            placeholder="Status izin Pemda/DLL"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Pekerjaan Galian & Struktur Lapangan (Cons)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Galian Alur (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.galianAlurCons || ""}
                            onChange={e => setNewProject({...newProject, galianAlurCons: e.target.value})}
                            placeholder="Galian alur (Meter/Status)"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Galian Akses (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.galianAksesCons || ""}
                            onChange={e => setNewProject({...newProject, galianAksesCons: e.target.value})}
                            placeholder="Galian akses (Meter/Status)"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Galian Crossing Jalan (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.galianCrossingJalanCons || ""}
                            onChange={e => setNewProject({...newProject, galianCrossingJalanCons: e.target.value})}
                            placeholder="Crossing jalan (Meter/Status)"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Galian Crossing Jembatan (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.galianCrossingJembatanCons || ""}
                          onChange={e => setNewProject({...newProject, galianCrossingJembatanCons: e.target.value})}
                          placeholder="Crossing jembatan"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Galian Crossing Sungai (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.galianCrossingSungaiCons || ""}
                          onChange={e => setNewProject({...newProject, galianCrossingSungaiCons: e.target.value})}
                          placeholder="Crossing sungai"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Instalasi HH/MH (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.instalasiHhMhCons || ""}
                          onChange={e => setNewProject({...newProject, instalasiHhMhCons: e.target.value})}
                          placeholder="Handhole / Manhole unit"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Install Galvanis (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.installGalvanisCons || ""}
                          onChange={e => setNewProject({...newProject, installGalvanisCons: e.target.value})}
                          placeholder="Sipil pipa galvanis"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Install Pole (Tiang) (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.installPoleCons || ""}
                          onChange={e => setNewProject({...newProject, installPoleCons: e.target.value})}
                          placeholder="Penanaman tiang unit"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: FO / COAX CONS & PULLING */}
                {addModalTab === "fo_cons" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Kabel Terpasang (Cons)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288 (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.fo288Cons || ""}
                            onChange={e => setNewProject({...newProject, fo288Cons: e.target.value})}
                            placeholder="Kabel terpasang"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 144 (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.fo144Cons || ""}
                            onChange={e => setNewProject({...newProject, fo144Cons: e.target.value})}
                            placeholder="Kabel terpasang"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96 (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96Cons || ""}
                            onChange={e => setNewProject({...newProject, fo96Cons: e.target.value})}
                            placeholder="Kabel terpasang"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96GL (Cons)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96glCons || ""}
                            onChange={e => setNewProject({...newProject, fo96glCons: e.target.value})}
                            placeholder="Kabel terpasang GL"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 48 (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.fo48Cons || ""}
                          onChange={e => setNewProject({...newProject, fo48Cons: e.target.value})}
                          placeholder="FO 48 Cons"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 12 (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.fo12Cons || ""}
                          onChange={e => setNewProject({...newProject, fo12Cons: e.target.value})}
                          placeholder="FO 12 Cons"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Coax (Cons)</label>
                        <input 
                          type="text" 
                          value={newProject.coaxCons || ""}
                          onChange={e => setNewProject({...newProject, coaxCons: e.target.value})}
                          placeholder="Coax terpasang"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Penarikan Kabel (Pulling / subduct / overhead)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288 (Pull)</label>
                          <input 
                            type="text" 
                            value={newProject.fo288Pull || ""}
                            onChange={e => setNewProject({...newProject, fo288Pull: e.target.value})}
                            placeholder="FO 288 Pulling"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 144 (Pull)</label>
                          <input 
                            type="text" 
                            value={newProject.fo144Pull || ""}
                            onChange={e => setNewProject({...newProject, fo144Pull: e.target.value})}
                            placeholder="FO 144 Pulling"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96 (Pull)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96Pull || ""}
                            onChange={e => setNewProject({...newProject, fo96Pull: e.target.value})}
                            placeholder="FO 96 Pulling"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96GL (Pull)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96glPull || ""}
                            onChange={e => setNewProject({...newProject, fo96glPull: e.target.value})}
                            placeholder="FO 96GL Pulling"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 48 (Pull)</label>
                        <input 
                          type="text" 
                          value={newProject.fo48Pull || ""}
                          onChange={e => setNewProject({...newProject, fo48Pull: e.target.value})}
                          placeholder="FO 48 Pulling"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 12 (Pull)</label>
                        <input 
                          type="text" 
                          value={newProject.fo12Pull || ""}
                          onChange={e => setNewProject({...newProject, fo12Pull: e.target.value})}
                          placeholder="FO 12 Pulling"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Coax (Pull)</label>
                        <input 
                          type="text" 
                          value={newProject.coaxPull || ""}
                          onChange={e => setNewProject({...newProject, coaxPull: e.target.value})}
                          placeholder="Coaxial Pulling"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Status & Skala Konstruksi</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status Construction</label>
                          <select 
                            value={newProject.statusConstruction || "Not Started"}
                            onChange={e => setNewProject({...newProject, statusConstruction: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Delayed">Delayed</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Category Construction</label>
                          <input 
                            type="text" 
                            value={newProject.categoryConstruction || "Minor"}
                            onChange={e => setNewProject({...newProject, categoryConstruction: e.target.value})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Progress Construction (%)</label>
                          <input 
                            type="number" 
                            min="0"
                            max="100"
                            value={newProject.progressConstruction || 0}
                            onChange={e => setNewProject({...newProject, progressConstruction: Number(e.target.value)})}
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: RCO / SCO & TIMELINE */}
                {addModalTab === "co_timeline" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Milestone, Tanggal Batas & Umur Project (Aging)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Tgl Dateline</label>
                          <input 
                            type="text" 
                            value={newProject.tglDateline || ""}
                            onChange={e => setNewProject({...newProject, tglDateline: e.target.value})}
                            placeholder="Batas penyelesaian"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Plan CO Bulan</label>
                          <input 
                            type="text" 
                            value={newProject.planCoBulan || ""}
                            onChange={e => setNewProject({...newProject, planCoBulan: e.target.value})}
                            placeholder="Bulan Plan Cut-Over"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Today (Tanggal Sekarang)</label>
                          <input 
                            type="text" 
                            value={newProject.today || ""}
                            onChange={e => setNewProject({...newProject, today: e.target.value})}
                            placeholder="Tanggal update hari ini"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Aging (Hari)</label>
                          <input 
                            type="text" 
                            value={newProject.aging || ""}
                            onChange={e => setNewProject({...newProject, aging: e.target.value})}
                            placeholder="Berapa hari berjalan"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Ready for Cut-Over (Rco) Kabel FO & Coax</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288 (Rco)</label>
                          <input 
                            type="text" 
                            value={newProject.fo288Rco || ""}
                            onChange={e => setNewProject({...newProject, fo288Rco: e.target.value})}
                            placeholder="Status RCO FO 288"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 144 (Rco)</label>
                          <input 
                            type="text" 
                            value={newProject.fo144Rco || ""}
                            onChange={e => setNewProject({...newProject, fo144Rco: e.target.value})}
                            placeholder="Status RCO FO 144"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96 (Rco)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96Rco || ""}
                            onChange={e => setNewProject({...newProject, fo96Rco: e.target.value})}
                            placeholder="Status RCO FO 96"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96GL (Rco)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96glRco || ""}
                            onChange={e => setNewProject({...newProject, fo96glRco: e.target.value})}
                            placeholder="Status RCO FO 96GL"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 48 (Rco)</label>
                        <input 
                          type="text" 
                          value={newProject.fo48Rco || ""}
                          onChange={e => setNewProject({...newProject, fo48Rco: e.target.value})}
                          placeholder="FO 48 Rco"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 24 (Rco)</label>
                        <input 
                          type="text" 
                          value={newProject.fo24Rco || ""}
                          onChange={e => setNewProject({...newProject, fo24Rco: e.target.value})}
                          placeholder="FO 24 Rco"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 12 (Rco)</label>
                        <input 
                          type="text" 
                          value={newProject.fo12Rco || ""}
                          onChange={e => setNewProject({...newProject, fo12Rco: e.target.value})}
                          placeholder="FO 12 Rco"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Coax (Rco)</label>
                        <input 
                          type="text" 
                          value={newProject.coaxRco || ""}
                          onChange={e => setNewProject({...newProject, coaxRco: e.target.value})}
                          placeholder="Coax Rco"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Splicing & Splice Cut-Over (SCo) Kabel FO</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 288 (SCo)</label>
                          <input 
                            type="text" 
                            value={newProject.fo288Sco || ""}
                            onChange={e => setNewProject({...newProject, fo288Sco: e.target.value})}
                            placeholder="SCo FO 288"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 144 (SCo)</label>
                          <input 
                            type="text" 
                            value={newProject.fo144Sco || ""}
                            onChange={e => setNewProject({...newProject, fo144Sco: e.target.value})}
                            placeholder="SCo FO 144"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96 (SCo)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96Sco || ""}
                            onChange={e => setNewProject({...newProject, fo96Sco: e.target.value})}
                            placeholder="SCo FO 96"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">FO 96GL (SCo)</label>
                          <input 
                            type="text" 
                            value={newProject.fo96glSco || ""}
                            onChange={e => setNewProject({...newProject, fo96glSco: e.target.value})}
                            placeholder="SCo FO 96GL"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 48 (SCo)</label>
                        <input 
                          type="text" 
                          value={newProject.fo48Sco || ""}
                          onChange={e => setNewProject({...newProject, fo48Sco: e.target.value})}
                          placeholder="SCo FO 48"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">FO 12 (SCo)</label>
                        <input 
                          type="text" 
                          value={newProject.fo12Sco || ""}
                          onChange={e => setNewProject({...newProject, fo12Sco: e.target.value})}
                          placeholder="SCo FO 12"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">Coax (SCo)</label>
                        <input 
                          type="text" 
                          value={newProject.coaxSco || ""}
                          onChange={e => setNewProject({...newProject, coaxSco: e.target.value})}
                          placeholder="SCo Coaxial"
                          className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Status Akhir Cut-Over (CO)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status CO FO</label>
                          <input 
                            type="text" 
                            value={newProject.statusCoFo || ""}
                            onChange={e => setNewProject({...newProject, statusCoFo: e.target.value})}
                            placeholder="Status CO Fiber Optik"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-500">Status CO Coax</label>
                          <input 
                            type="text" 
                            value={newProject.statusCoCoax || ""}
                            onChange={e => setNewProject({...newProject, statusCoCoax: e.target.value})}
                            placeholder="Status CO Coaxial"
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tambah Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS & EDIT/DELETE DIALOG MODAL (POPUP ON ROW CLICK) */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div 
            className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
            id="detail-modal-box"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded-lg border border-indigo-200 uppercase">
                  {selectedProject.pmoId || "TANPA ID"}
                </span>
                <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md font-mono">
                  No. {selectedProject.no}
                </span>
                {isEditing && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                    Mode Edit Aktif
                  </span>
                )}
              </div>
              <button 
                onClick={() => {
                  setSelectedProject(null);
                  setIsEditing(false);
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab selection bar inside details/edit modal */}
            <div className="px-6 py-2.5 border-b border-slate-100 flex gap-2 overflow-x-auto bg-slate-50/50 scrollbar-none flex-shrink-0">
              {(isEditing
                ? [
                    { key: "general", label: "1. Umum & PIC" },
                    { key: "survey", label: "2. Survey & Material" },
                    { key: "kabel", label: "3. Kabel & Closure" },
                    { key: "civil", label: "4. Sipil & Galian" },
                    { key: "fo_cons", label: "5. Kabel Cons & Pull" },
                    { key: "co_timeline", label: "6. Ready CO & SCo" },
                  ]
                : [
                    { key: "dashboard", label: "📊 Dashboard Detail" },
                    { key: "general", label: "1. Umum & PIC" },
                    { key: "survey", label: "2. Survey & Material" },
                    { key: "kabel", label: "3. Kabel & Closure" },
                    { key: "civil", label: "4. Sipil & Galian" },
                    { key: "fo_cons", label: "5. Kabel Cons & Pull" },
                    { key: "co_timeline", label: "6. Ready CO & SCo" },
                  ]
              ).map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setDetailModalTab(t.key as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    detailModalTab === t.key 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/15" 
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* IF EDITING MODE IS ACTIVE */}
            {isEditing && editForm ? (
              <form onSubmit={handleEditProject} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <ProjectEditTabs editForm={editForm} setEditForm={setEditForm} tab={detailModalTab === "dashboard" ? "general" : detailModalTab} />
                </div>

                {/* Edit Mode Buttons */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Project
                  </button>

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* VIEW MODE (STANDARD DISPLAY) */
              <>
                {/* Modal Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scroll flex flex-col gap-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {selectedProject.namaProject}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        Jabo Wilayah: {selectedProject.jabo} • Area/Kota: {selectedProject.areaKota}
                      </p>
                    </div>

                    {/* Progress Tracker inside view mode header */}
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl min-w-[200px] space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-500 uppercase tracking-wider">Progress Fisik</span>
                        <span className="font-black text-indigo-600">{selectedProject.progressConstruction || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${selectedProject.progressConstruction || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <ProjectDetailTabs selectedProject={selectedProject} tab={detailModalTab} />
                </div>

                {/* Modal Footer (Standard View Buttons) */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center flex-shrink-0">
                  <button 
                    onClick={() => {
                      setEditForm(selectedProject);
                      setIsEditing(true);
                      if (detailModalTab === "dashboard") {
                        setDetailModalTab("general");
                      }
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Ubah Data Project
                  </button>

                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Tutup Detail
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP FOR DELETE */}
      {showDeleteConfirm && selectedProject && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-base">Konfirmasi Hapus</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apakah Anda benar-benar yakin ingin menghapus project <span className="font-bold text-slate-700">{selectedProject.namaProject}</span> dari sistem? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProject(selectedProject.no)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER MANAGEMENT MODAL */}
      {filterModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {filterForm.id ? "Edit Filter Menu" : "Tambah Filter Menu"}
                </h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveFilter}>
              <div className="p-6 space-y-4">
                {/* Form Type Information */}
                <div className="flex items-start gap-2 text-xs bg-indigo-50/50 text-indigo-700 p-3 rounded-xl border border-indigo-100/30">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Anda sedang {filterForm.id ? "mengubah" : "menambahkan"} filter untuk menu{" "}
                    <strong>
                      {filterForm.type === "status" 
                        ? "Filter Cepat (Status)" 
                        : filterForm.type === "jabo" 
                        ? "Pencarian Cepat Wilayah (Jabo)" 
                        : "Filter Cepat Waspang"}
                    </strong>.
                  </span>
                </div>

                {/* Filter Label / Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Nama Tampilan Filter
                  </label>
                  <input
                    type="text"
                    required
                    value={filterForm.label}
                    onChange={(e) => setFilterForm({ ...filterForm, label: e.target.value })}
                    placeholder="Contoh: Konstruksi Selesai, JABO 3"
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                  />
                </div>

                {/* Filter Target Value */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Nilai Target Filter (Pencocokan Data)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={filterForm.value}
                      onChange={(e) => setFilterForm({ ...filterForm, value: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                    >
                      <option value="">-- Pilih Nilai yang Ada --</option>
                      {filterForm.type === "status"
                        ? filterOptions.statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))
                        : filterForm.type === "jabo"
                        ? filterOptions.jabos.map((jb) => (
                            <option key={jb} value={jb}>
                              {jb}
                            </option>
                          ))
                        : filterOptions.waspangs.map((wp) => (
                            <option key={wp} value={wp}>
                              {wp}
                            </option>
                          ))}
                    </select>

                    {/* Manual Input field in case they want a custom value */}
                    <input
                      type="text"
                      required
                      value={filterForm.value}
                      onChange={(e) => setFilterForm({ ...filterForm, value: e.target.value })}
                      placeholder="Atau ketik nilai pencocokan data custom..."
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    *Nilai ini mencocokkan data di kolom{" "}
                    {filterForm.type === "status" 
                      ? "Status Konstruksi" 
                      : filterForm.type === "jabo" 
                      ? "Jabo" 
                      : "Waspang"}{" "}
                    pada data project.
                  </p>
                </div>

                {/* Filter Badge Color */}
                {filterForm.type === "status" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Warna Indikator Dot
                    </label>
                    <div className="flex gap-3">
                      {[
                        { val: "emerald", label: "Hijau", bg: "bg-emerald-500" },
                        { val: "blue", label: "Biru", bg: "bg-blue-500" },
                        { val: "amber", label: "Oranye", bg: "bg-amber-500" },
                        { val: "red", label: "Merah", bg: "bg-rose-500" },
                        { val: "slate", label: "Abu-abu", bg: "bg-slate-400" },
                        { val: "indigo", label: "Ungu", bg: "bg-indigo-500" }
                      ].map((c) => (
                        <button
                          key={c.val}
                          type="button"
                          onClick={() => setFilterForm({ ...filterForm, color: c.val })}
                          className={`w-6 h-6 rounded-full ${c.bg} transition-all relative flex-shrink-0 cursor-pointer ${
                            filterForm.color === c.val
                              ? "ring-2 ring-indigo-500 ring-offset-2 scale-110"
                              : "hover:scale-105 opacity-80"
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPLORATION FILTER MANAGEMENT MODAL */}
      {explorationModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {explorationForm.id ? "Edit Filter Eksplorasi" : "Tambah Filter Eksplorasi Baru"}
                </h3>
              </div>
              <button
                onClick={() => setExplorationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveExplorationFilter}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scroll">
                {/* Info block */}
                <div className="flex items-start gap-2 text-xs bg-indigo-50/50 text-indigo-700 p-3 rounded-xl border border-indigo-100/30">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Buat aturan filter kustom Anda sendiri pada semua kolom data yang didukung oleh sistem.
                  </span>
                </div>

                {/* Field Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pilih Kolom Data (Field)
                  </label>
                  <select
                    value={explorationForm.field}
                    onChange={(e) => {
                      const selectedField = e.target.value as keyof ProjectData;
                      setExplorationForm(prev => ({ 
                        ...prev, 
                        field: selectedField,
                        // Reset value when field changes to match suggestions better
                        value: ""
                      }));
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                  >
                    {EXPLORATION_FIELDS.map(f => (
                      <option key={f.field} value={f.field}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operator Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Operator Logika
                  </label>
                  <select
                    value={explorationForm.operator}
                    onChange={(e) => setExplorationForm(prev => ({ ...prev, operator: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                  >
                    {EXPLORATION_OPERATORS.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Value Input / Select */}
                {explorationForm.operator !== "empty" && explorationForm.operator !== "not_empty" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Nilai Pencocokan (Value)
                    </label>
                    <div className="space-y-2">
                      {/* Suggest dropdown based on real existing values in system */}
                      <select
                        value={explorationForm.value}
                        onChange={(e) => setExplorationForm(prev => ({ ...prev, value: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                      >
                        <option value="">-- Pilih dari Nilai yang Ada --</option>
                        {Array.from(new Set(projects.map(p => {
                          const val = p[explorationForm.field];
                          return val !== undefined && val !== null && val !== "" ? String(val) : null;
                        }).filter(Boolean))).sort().map(val => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>

                      {/* Manual input for custom text */}
                      <input
                        type="text"
                        required
                        value={explorationForm.value}
                        onChange={(e) => setExplorationForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Atau masukkan nilai custom sendiri..."
                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Filter Label & Auto Generator */}
                <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Nama Tampilan Filter
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const fDesc = EXPLORATION_FIELDS.find(f => f.field === explorationForm.field)?.label || "";
                        const opDesc = EXPLORATION_OPERATORS.find(o => o.value === explorationForm.operator)?.label || "";
                        let generated = "";
                        if (explorationForm.operator === "empty" || explorationForm.operator === "not_empty") {
                          generated = `${fDesc} (${opDesc})`;
                        } else {
                          const operatorSign = 
                            explorationForm.operator === "equals" ? "=" : 
                            explorationForm.operator === "not_equals" ? "!=" : 
                            explorationForm.operator === "greater_than" ? ">" : 
                            explorationForm.operator === "less_than" ? "<" : 
                            "mengandung";
                          generated = `${fDesc} ${operatorSign} "${explorationForm.value}"`;
                        }
                        setExplorationForm(prev => ({ ...prev, label: generated }));
                      }}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" /> Auto-Generate Nama
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={explorationForm.label}
                    onChange={(e) => setExplorationForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Contoh: Project Besar (>500M)"
                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 w-full"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExplorationModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Filter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING CLOUD SYNC NOTIFICATION BANNER */}
      <AnimatePresence>
        {syncStatus !== "synced" && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-5 right-5 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 z-50 flex items-center gap-3.5 max-w-xs"
          >
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <FolderSync className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">
                {syncStatus === "saving" ? "Menyimpan Perubahan" : "Sinkronisasi Cloud"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                {syncStatus === "saving" 
                  ? "Menulis data ke database lokal..." 
                  : "Sinkronisasi ke Google Sheets Companion..."}
              </p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping flex-shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS NOTIFICATION TOAST */}
      {successToast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">Proses Berhasil</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{successToast}</p>
          </div>
        </div>
      )}

    </div>
  );
}
