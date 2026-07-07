import React from "react";
import { ProjectData } from "../types";
import { 
  Calendar, FileText, Layers, MapPin, Activity, CheckCircle2, 
  HardDrive, Gauge, Clock, ShieldCheck, ClipboardCheck, 
  Cable, Hammer, Milestone, Info, Star, ChevronRight, HelpCircle
} from "lucide-react";

interface ProjectEditTabsProps {
  editForm: ProjectData;
  setEditForm: (form: ProjectData) => void;
  tab: string;
}

export const ProjectEditTabs: React.FC<ProjectEditTabsProps> = ({ editForm, setEditForm, tab }) => {
  const updateField = (field: keyof ProjectData, value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  if (tab === "general") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Informasi Utama & Identifikasi</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Nama Project *</label>
              <input 
                type="text" 
                required
                value={editForm.namaProject || ""}
                onChange={e => updateField("namaProject", e.target.value)}
                placeholder="Masukkan nama project..."
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">PMO ID</label>
              <input 
                type="text" 
                value={editForm.pmoId || ""}
                onChange={e => updateField("pmoId", e.target.value)}
                placeholder="Contoh: PMO-GOV-123"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Project ID SAP</label>
              <input 
                type="text" 
                value={editForm.projectId || ""}
                onChange={e => updateField("projectId", e.target.value)}
                placeholder="Masukkan ID SAP"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-mono"
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
                value={editForm.jabo || "JABOTABEK_1"}
                onChange={e => updateField("jabo", e.target.value)}
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
                value={editForm.areaKota || ""}
                onChange={e => updateField("areaKota", e.target.value)}
                placeholder="Contoh: Jakarta Barat"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">PIC Project</label>
              <input 
                type="text" 
                value={editForm.pic || ""}
                onChange={e => updateField("pic", e.target.value)}
                placeholder="Nama PIC"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Waspang</label>
              <input 
                type="text" 
                value={editForm.waspang || ""}
                onChange={e => updateField("waspang", e.target.value)}
                placeholder="Nama Pengawas"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Administrasi & Penjadwalan</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Metode Penarikan</label>
              <select 
                value={editForm.metodeProject || "TRENCHING"}
                onChange={e => updateField("metodeProject", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
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
                value={editForm.tanggalSurat || ""}
                onChange={e => updateField("tanggalSurat", e.target.value)}
                placeholder="Contoh: 12-Jun-24"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Tahun</label>
              <input 
                type="text" 
                value={editForm.tahun || "2026"}
                onChange={e => updateField("tahun", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Bulan</label>
              <input 
                type="text" 
                value={editForm.bulan || "Juli"}
                onChange={e => updateField("bulan", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Panjang Kabel (Meter)</label>
            <input 
              type="number" 
              value={editForm.lengthM || 0}
              onChange={e => updateField("lengthM", Number(e.target.value))}
              placeholder="Panjang"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">APD Relokasi</label>
            <select 
              value={editForm.apdRelokasi || "No Need"}
              onChange={e => updateField("apdRelokasi", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            >
              <option value="Need">Need</option>
              <option value="No Need">No Need</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Status Audit</label>
            <select 
              value={editForm.statusAudit || "Belum Audit"}
              onChange={e => updateField("statusAudit", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
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
              value={editForm.apdLinknet || ""}
              onChange={e => updateField("apdLinknet", e.target.value)}
              placeholder="Status APD Linknet"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Vendor Pelaksana Utama</label>
            <input 
              type="text" 
              value={editForm.vendor || ""}
              onChange={e => updateField("vendor", e.target.value)}
              placeholder="Nama Vendor"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Remarks / Catatan Lapangan</label>
            <textarea 
              rows={2}
              value={editForm.remarks || ""}
              onChange={e => updateField("remarks", e.target.value)}
              placeholder="Catatan umum progress"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  if (tab === "survey") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Survey & BA Lapangan</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Survey</label>
              <input 
                type="text" 
                value={editForm.survey || ""}
                onChange={e => updateField("survey", e.target.value)}
                placeholder="Status survey"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">BA Survey</label>
              <input 
                type="text" 
                value={editForm.baSurvey || ""}
                onChange={e => updateField("baSurvey", e.target.value)}
                placeholder="Nomor BA Survey"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status Survey Material</label>
              <select 
                value={editForm.statusSurveyMaterial || "Belum Survey"}
                onChange={e => updateField("statusSurveyMaterial", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              >
                <option value="Belum Survey">Belum Survey</option>
                <option value="Sudah Survey">Sudah Survey</option>
                <option value="No Need">No Need</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status Survey Labour</label>
              <select 
                value={editForm.statusSurveyLabour || "Belum Survey"}
                onChange={e => updateField("statusSurveyLabour", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
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
                value={editForm.ceMaterial || ""}
                onChange={e => updateField("ceMaterial", e.target.value)}
                placeholder="CE Material"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">SPH / BOQ Vendor</label>
              <input 
                type="text" 
                value={editForm.sphBoqVendor || ""}
                onChange={e => updateField("sphBoqVendor", e.target.value)}
                placeholder="SPH / BOQ status"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">APD LN</label>
              <input 
                type="text" 
                value={editForm.apdLn || ""}
                onChange={e => updateField("apdLn", e.target.value)}
                placeholder="APD LN status"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Timeline</label>
              <input 
                type="text" 
                value={editForm.timeline || ""}
                onChange={e => updateField("timeline", e.target.value)}
                placeholder="Timeline"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
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
                value={editForm.statusCe || ""}
                onChange={e => updateField("statusCe", e.target.value)}
                placeholder="Status CE"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status MR</label>
              <input 
                type="text" 
                value={editForm.statusMr || ""}
                onChange={e => updateField("statusMr", e.target.value)}
                placeholder="Status MR"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Clover</label>
              <input 
                type="text" 
                value={editForm.clover || ""}
                onChange={e => updateField("clover", e.target.value)}
                placeholder="Clover status"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">No MR</label>
              <input 
                type="text" 
                value={editForm.noMr || ""}
                onChange={e => updateField("noMr", e.target.value)}
                placeholder="No MR"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">No GIN</label>
            <input 
              type="text" 
              value={editForm.noGin || ""}
              onChange={e => updateField("noGin", e.target.value)}
              placeholder="No GIN"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Status Material</label>
            <input 
              type="text" 
              value={editForm.statusMaterial || ""}
              onChange={e => updateField("statusMaterial", e.target.value)}
              placeholder="Status Material"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Stock</label>
            <input 
              type="text" 
              value={editForm.stock || ""}
              onChange={e => updateField("stock", e.target.value)}
              placeholder="Stock status"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">MATERIAL</label>
            <input 
              type="text" 
              value={editForm.material || ""}
              onChange={e => updateField("material", e.target.value)}
              placeholder="Nama Material"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Quantity</label>
            <input 
              type="text" 
              value={editForm.quantity || ""}
              onChange={e => updateField("quantity", e.target.value)}
              placeholder="Quantity"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Priority</label>
            <input 
              type="text" 
              value={editForm.priority || ""}
              onChange={e => updateField("priority", e.target.value)}
              placeholder="Priority"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-500">Adjusment</label>
            <input 
              type="text" 
              value={editForm.adjusment || ""}
              onChange={e => updateField("adjusment", e.target.value)}
              placeholder="Adjusment"
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  if (tab === "kabel") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Pipa & Kapasitas Kabel Fiber Optik</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { field: "fo288", label: "FO 288" },
              { field: "fo288gl", label: "FO 288GL" },
              { field: "fo144", label: "FO 144" },
              { field: "fo96", label: "FO 96" },
              { field: "fo96gl", label: "FO 96GL" },
              { field: "fo48", label: "FO 48" },
              { field: "fo24", label: "FO 24" },
              { field: "fo12", label: "FO 12" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Coax</label>
            <input 
              type="text" 
              value={editForm.coax || ""}
              onChange={e => updateField("coax", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Galvanis 2"</label>
            <input 
              type="text" 
              value={editForm.galvanis2 || ""}
              onChange={e => updateField("galvanis2", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Kebutuhan Closure (Sambungan Joint)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { field: "closure288", label: "Closure 288" },
              { field: "closure144", label: "Closure 144" },
              { field: "closure96", label: "Closure 96" },
              { field: "closure48", label: "Closure 48" },
              { field: "closure24", label: "Closure 24" },
              { field: "closure12", label: "Closure 12" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "civil") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Perizinan & Penjadwalan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Tgl Start Project</label>
              <input 
                type="text" 
                value={editForm.tglStartProject || ""}
                onChange={e => updateField("tglStartProject", e.target.value)}
                placeholder="Format: 01-Jan-2026 atau status"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status Permit (Izin)</label>
              <input 
                type="text" 
                value={editForm.statusPermit || ""}
                onChange={e => updateField("statusPermit", e.target.value)}
                placeholder="Status Izin"
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Pekerjaan Galian & Struktur Lapangan (Cons)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { field: "galianAlurCons", label: "Galian Alur (Cons)" },
              { field: "galianAksesCons", label: "Galian Akses (Cons)" },
              { field: "galianCrossingJalanCons", label: "Galian Crossing Jalan (Cons)" },
              { field: "galianCrossingJembatanCons", label: "Galian Crossing Jembatan (Cons)" },
              { field: "galianCrossingSungaiCons", label: "Galian Crossing Sungai (Cons)" },
              { field: "instalasiHhMhCons", label: "Instalasi HH/MH (Cons)" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Install Galvanis (Cons)</label>
            <input 
              type="text" 
              value={editForm.installGalvanisCons || ""}
              onChange={e => updateField("installGalvanisCons", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Install Pole (Cons)</label>
            <input 
              type="text" 
              value={editForm.installPoleCons || ""}
              onChange={e => updateField("installPoleCons", e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  if (tab === "fo_cons") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Kabel Terpasang (Cons)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { field: "fo288Cons", label: "FO 288 (Cons)" },
              { field: "fo144Cons", label: "FO 144 (Cons)" },
              { field: "fo96Cons", label: "FO 96 (Cons)" },
              { field: "fo96glCons", label: "FO 96GL (Cons)" },
              { field: "fo48Cons", label: "FO 48 (Cons)" },
              { field: "fo12Cons", label: "FO 12 (Cons)" },
              { field: "coaxCons", label: "Coax (Cons)" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Penarikan Kabel (Pulling)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { field: "fo288Pull", label: "FO 288 (Pull)" },
              { field: "fo144Pull", label: "FO 144 (Pull)" },
              { field: "fo96Pull", label: "FO 96 (Pull)" },
              { field: "fo96glPull", label: "FO 96GL (Pull)" },
              { field: "fo48Pull", label: "FO 48 (Pull)" },
              { field: "fo12Pull", label: "FO 12 (Pull)" },
              { field: "coaxPull", label: "Coax (Pull)" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Status & Skala Konstruksi</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status Construction</label>
              <select 
                value={editForm.statusConstruction || "Not Started"}
                onChange={e => updateField("statusConstruction", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm focus:ring-2"
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
                value={editForm.categoryConstruction || ""}
                onChange={e => updateField("categoryConstruction", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Progress Construction (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={editForm.progressConstruction || 0}
                onChange={e => updateField("progressConstruction", Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "co_timeline") {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Milestone & Aging (Umur Project)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Tgl Dateline</label>
              <input 
                type="text" 
                value={editForm.tglDateline || ""}
                onChange={e => updateField("tglDateline", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Plan CO Bulan</label>
              <input 
                type="text" 
                value={editForm.planCoBulan || ""}
                onChange={e => updateField("planCoBulan", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Today</label>
              <input 
                type="text" 
                value={editForm.today || ""}
                onChange={e => updateField("today", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Aging</label>
              <input 
                type="text" 
                value={editForm.aging || ""}
                onChange={e => updateField("aging", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Ready for Cut-Over (Rco)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { field: "fo288Rco", label: "FO 288 (Rco)" },
              { field: "fo144Rco", label: "FO 144 (Rco)" },
              { field: "fo96Rco", label: "FO 96 (Rco)" },
              { field: "fo96glRco", label: "FO 96GL (Rco)" },
              { field: "fo48Rco", label: "FO 48 (Rco)" },
              { field: "fo24Rco", label: "FO 24 (Rco)" },
              { field: "fo12Rco", label: "FO 12 (Rco)" },
              { field: "coaxRco", label: "Coax (Rco)" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Splicing & Splice Cut-Over (SCo)</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { field: "fo288Sco", label: "FO 288 (SCo)" },
              { field: "fo144Sco", label: "FO 144 (SCo)" },
              { field: "fo96Sco", label: "FO 96 (SCo)" },
              { field: "fo96glSco", label: "FO 96GL (SCo)" },
              { field: "fo48Sco", label: "FO 48 (SCo)" },
              { field: "fo12Sco", label: "FO 12 (SCo)" },
              { field: "coaxSco", label: "Coax (SCo)" },
            ].map(f => (
              <div key={f.field} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">{f.label}</label>
                <input 
                  type="text" 
                  value={(editForm as any)[f.field] || ""}
                  onChange={e => updateField(f.field as any, e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-4">Status Akhir Cut-Over (CO)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status CO FO</label>
              <input 
                type="text" 
                value={editForm.statusCoFo || ""}
                onChange={e => updateField("statusCoFo", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500">Status CO Coax</label>
              <input 
                type="text" 
                value={editForm.statusCoCoax || ""}
                onChange={e => updateField("statusCoCoax", e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

interface ProjectDetailTabsProps {
  selectedProject: ProjectData;
  tab: string;
}

export const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({ selectedProject, tab }) => {
  const renderItem = (label: string, value: any, isMono = false) => {
    return (
      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
        <p className={`text-xs font-bold text-slate-800 mt-0.5 ${isMono ? "font-mono" : ""}`}>
          {value !== undefined && value !== null && value !== "" ? String(value) : "-"}
        </p>
      </div>
    );
  };

  const renderStatusItem = (label: string, value: any, statusType: "survey" | "audit" | "apd") => {
    let colorClass = "bg-slate-400";
    if (statusType === "survey") {
      colorClass = value === "Sudah Survey" ? "bg-emerald-500" : value === "No Need" ? "bg-indigo-500" : "bg-amber-400";
    } else if (statusType === "audit") {
      colorClass = value === "Sudah Audit" ? "bg-emerald-500" : value === "Proses Audit" ? "bg-amber-500" : "bg-slate-400";
    } else if (statusType === "apd") {
      colorClass = value === "Need" ? "bg-rose-500 animate-pulse" : value === "Completed" ? "bg-emerald-500" : "bg-slate-400";
    }

    return (
      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
        <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
          {value || "-"}
        </p>
      </div>
    );
  };

  if (tab === "dashboard") {
    const displayValue = (val: any, suffix = "") => {
      if (val === undefined || val === null || val === "") return "-";
      return `${val}${suffix}`;
    };

    const statusColor = (val: string | undefined, type: "survey" | "audit" | "apd" | "permit" | "construction") => {
      if (!val) return "text-slate-400 bg-slate-50 border-slate-100";
      const s = val.toLowerCase();
      if (type === "construction") {
        if (s.includes("done") || s.includes("complete") || s.includes("selesai")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
        if (s.includes("progress") || s.includes("jalan")) return "text-blue-700 bg-blue-50 border-blue-100 animate-pulse";
        if (s.includes("hold") || s.includes("pending")) return "text-amber-700 bg-amber-50 border-amber-100";
        return "text-slate-700 bg-slate-50 border-slate-150";
      }
      if (type === "survey") {
        if (s.includes("sudah") || s.includes("done") || s.includes("yes")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
        if (s.includes("no need")) return "text-indigo-700 bg-indigo-50 border-indigo-100";
        return "text-amber-700 bg-amber-50 border-amber-100";
      }
      if (type === "audit") {
        if (s.includes("sudah") || s.includes("selesai") || s.includes("done")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
        return "text-amber-700 bg-amber-50 border-amber-100";
      }
      if (type === "apd") {
        if (s.includes("need")) return "text-rose-700 bg-rose-50 border-rose-100 animate-pulse";
        if (s.includes("completed") || s.includes("done")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
        return "text-slate-700 bg-slate-50 border-slate-100";
      }
      if (type === "permit") {
        if (s.includes("ok") || s.includes("ijin") || s.includes("permit") || s.includes("sudah") || s.includes("selesai") || s.includes("approved")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
        return "text-amber-700 bg-amber-50 border-amber-100";
      }
      return "text-slate-700 bg-slate-50 border-slate-100";
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* TOP BANNER OVERVIEW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 p-4 rounded-2xl border border-indigo-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-500/15">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Status Progres</span>
              <p className="text-sm font-black text-slate-800 mt-0.5">{displayValue(selectedProject.statusConstruction)}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] font-extrabold text-indigo-600">{selectedProject.progressConstruction || 0}%</span>
                <div className="w-16 bg-indigo-200/50 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${selectedProject.progressConstruction || 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/15">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Jabo & Area Kota</span>
              <p className="text-sm font-black text-slate-800 mt-0.5 truncate max-w-[150px]">{displayValue(selectedProject.jabo)}</p>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5 truncate max-w-[150px]">{displayValue(selectedProject.areaKota)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/10 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-500/15">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Tgl Start Project</span>
              <p className="text-sm font-black text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.tglStartProject)}</p>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5 font-mono">Permit: {displayValue(selectedProject.statusPermit)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-500/5 to-sky-600/10 p-4 rounded-2xl border border-sky-100 flex items-center gap-4">
            <div className="p-3 bg-sky-600 text-white rounded-xl shadow-md shadow-sky-500/15">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Panjang Kabel</span>
              <p className="text-sm font-black text-slate-800 mt-0.5 font-mono">
                {selectedProject.lengthM ? `${selectedProject.lengthM.toLocaleString("id-ID")} M` : "0 M"}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5 truncate max-w-[150px]">{displayValue(selectedProject.vendor)}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ADMINISTRASI & UMUM */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">1. Administrasi, Surat & Lokasi</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tanggal Surat</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.tanggalSurat)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tahun</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.tahun)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Bulan</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.bulan)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Length (M)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">
                {selectedProject.lengthM ? `${selectedProject.lengthM.toLocaleString("id-ID")} M` : "-"}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">APD Relokasi</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 border ${statusColor(selectedProject.apdRelokasi, "apd")}`}>
                {selectedProject.apdRelokasi || "-"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Audit</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 border ${statusColor(selectedProject.statusAudit, "audit")}`}>
                {selectedProject.statusAudit || "-"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">APD Linknet</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.apdLinknet)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Project ID SAP</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.projectId)}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SURVEY & MATERIAL PROCUREMENT */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ClipboardCheck className="w-4 h-4 text-sky-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">2. Survey, Procurement & Material</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Survey</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.survey)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">BA Survey</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.baSurvey)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Survey Material</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 border ${statusColor(selectedProject.statusSurveyMaterial, "survey")}`}>
                {selectedProject.statusSurveyMaterial || "-"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Survey Labour</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 border ${statusColor(selectedProject.statusSurveyLabour, "survey")}`}>
                {selectedProject.statusSurveyLabour || "-"}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">CE Material</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.ceMaterial)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SPH / BOQ Vendor</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={selectedProject.sphBoqVendor}>{displayValue(selectedProject.sphBoqVendor)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">APD LN</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.apdLn)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Timeline</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.timeline)}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status CE</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.statusCe)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status MR</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.statusMr)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Clover</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.clover)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">No MR</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.noMr)}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">No GIN</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.noGin)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Material</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.statusMaterial)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Stock</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.stock)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">MATERIAL</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={selectedProject.material}>{displayValue(selectedProject.material)}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Quantity</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.quantity)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Priority</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-semibold">{displayValue(selectedProject.priority)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 col-span-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Adjusment</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.adjusment)}</p>
            </div>
          </div>

          {selectedProject.remarks && (
            <div className="bg-slate-100/50 p-3.5 rounded-xl border border-slate-200/50 mt-2">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase block tracking-wider mb-1">Remarks</span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{selectedProject.remarks}</p>
            </div>
          )}
        </div>

        {/* SECTION 3: KAPASITAS KABEL & CLOSURE */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cable className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">3. Kapasitas Kabel & Closure (Spesifikasi)</h4>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block">Kabel Specification</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {[
                { label: "FO 288", val: selectedProject.fo288 },
                { label: "FO 288GL", val: selectedProject.fo288gl },
                { label: "FO 144", val: selectedProject.fo144 },
                { label: "FO 96", val: selectedProject.fo96 },
                { label: "FO 96GL", val: selectedProject.fo96gl },
                { label: "FO 48", val: selectedProject.fo48 },
                { label: "FO 24", val: selectedProject.fo24 },
                { label: "FO 12", val: selectedProject.fo12 },
                { label: "Coax", val: selectedProject.coax },
                { label: "Galvanis 2\"", val: selectedProject.galvanis2 },
              ].map(item => (
                <div key={`spec-${item.label}`} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[9px] text-slate-400 font-bold block">{item.label}</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
            <span className="text-[10px] text-purple-600 font-black uppercase tracking-wider block">Kebutuhan Joint Closure</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: "Closure 288", val: selectedProject.closure288 },
                { label: "Closure 144", val: selectedProject.closure144 },
                { label: "Closure 96", val: selectedProject.closure96 },
                { label: "Closure 48", val: selectedProject.closure48 },
                { label: "Closure 24", val: selectedProject.closure24 },
                { label: "Closure 12", val: selectedProject.closure12 },
              ].map(item => (
                <div key={`closure-${item.label}`} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center font-mono">
                  <span className="text-[9px] text-slate-400 font-bold block">{item.label}</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: SIPIL, PERMIT & GALIAN */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hammer className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">4. Pekerjaan Sipil & Galian Lapangan (Cons)</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tgl Start Project</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.tglStartProject)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Permit</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 border ${statusColor(selectedProject.statusPermit, "permit")}`}>
                {selectedProject.statusPermit || "-"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Galian Alur (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.galianAlurCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Galian Akses (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.galianAksesCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Galian Crossing Jalan (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.galianCrossingJalanCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Galian Crossing Jembatan (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.galianCrossingJembatanCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Galian Crossing Sungai (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.galianCrossingSungaiCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Instalasi HH/MH (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.instalasiHhMhCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Install Galvanis (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.installGalvanisCons)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 col-span-2 md:col-span-3">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Install Pole (Tiang) (Cons)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.installPoleCons)}</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: KABEL TERPASANG (CONS) & PENARIKAN (PULLING) */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">5. Kabel Terpasang (Cons) & Penarikan Kabel (Pulling)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block">Kabel Terpasang (Cons)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: "FO 288", val: selectedProject.fo288Cons },
                  { label: "FO 144", val: selectedProject.fo144Cons },
                  { label: "FO 96", val: selectedProject.fo96Cons },
                  { label: "FO 96GL", val: selectedProject.fo96glCons },
                  { label: "FO 48", val: selectedProject.fo48Cons },
                  { label: "FO 12", val: selectedProject.fo12Cons },
                  { label: "Coax", val: selectedProject.coaxCons },
                ].map(item => (
                  <div key={`cons-${item.label}`} className="bg-emerald-50/30 p-2 rounded-lg border border-emerald-100/50">
                    <span className="text-[9px] text-slate-400 font-semibold block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block">Penarikan Kabel (Pulling)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
                {[
                  { label: "FO 288", val: selectedProject.fo288Pull },
                  { label: "FO 144", val: selectedProject.fo144Pull },
                  { label: "FO 96", val: selectedProject.fo96Pull },
                  { label: "FO 96GL", val: selectedProject.fo96glPull },
                  { label: "FO 48", val: selectedProject.fo48Pull },
                  { label: "FO 12", val: selectedProject.fo12Pull },
                  { label: "Coax", val: selectedProject.coaxPull },
                ].map(item => (
                  <div key={`pull-${item.label}`} className="bg-indigo-50/30 p-2 rounded-lg border border-indigo-100/50">
                    <span className="text-[9px] text-slate-400 font-semibold block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: SPLICING & SPLICE CUT-OVER TIMELINE */}
        <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Milestone className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">6. Ready for Cut-Over (Rco), SCo & Splicing Timeline</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status Construction</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mt-1 border border-indigo-100 ${statusColor(selectedProject.statusConstruction, "construction")}`}>
                {selectedProject.statusConstruction || "-"}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Category Construction</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{displayValue(selectedProject.categoryConstruction)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Progress Construction</span>
              <p className="text-xs font-bold text-indigo-600 mt-0.5 font-mono">{selectedProject.progressConstruction !== undefined ? `${selectedProject.progressConstruction}%` : "0%"}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Construction (%)</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${selectedProject.progressConstruction || 0}%` }} />
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Tgl Dateline</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.tglDateline)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Plan CO Bulan</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-semibold text-indigo-600">{displayValue(selectedProject.planCoBulan)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Today</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{displayValue(selectedProject.today)}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Aging (Hari)</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono text-rose-600">{displayValue(selectedProject.aging)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-amber-700 font-black uppercase tracking-wider block">Ready for Cut-Over (Rco)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "FO 288", val: selectedProject.fo288Rco },
                  { label: "FO 144", val: selectedProject.fo144Rco },
                  { label: "FO 96", val: selectedProject.fo96Rco },
                  { label: "FO 96GL", val: selectedProject.fo96glRco },
                  { label: "FO 48", val: selectedProject.fo48Rco },
                  { label: "FO 24", val: selectedProject.fo24Rco },
                  { label: "FO 12", val: selectedProject.fo12Rco },
                  { label: "Coax", val: selectedProject.coaxRco },
                ].map(item => (
                  <div key={`rco-${item.label}`} className="bg-amber-50/30 p-2 rounded-lg border border-amber-100/40 text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-purple-700 font-black uppercase tracking-wider block">Splice Cut-Over (SCo) / Splicing</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "FO 288", val: selectedProject.fo288Sco },
                  { label: "FO 144", val: selectedProject.fo144Sco },
                  { label: "FO 96", val: selectedProject.fo96Sco },
                  { label: "FO 96GL", val: selectedProject.fo96glSco },
                  { label: "FO 48", val: selectedProject.fo48Sco },
                  { label: "FO 12", val: selectedProject.fo12Sco },
                  { label: "Coax", val: selectedProject.coaxSco },
                ].map(item => (
                  <div key={`sco-${item.label}`} className="bg-purple-50/30 p-2 rounded-lg border border-purple-100/40 text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.val || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mb-1">Status CO FO</span>
              <p className="text-xs font-bold text-indigo-700 font-mono">{displayValue(selectedProject.statusCoFo)}</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mb-1">Status CO Coax</span>
              <p className="text-xs font-bold text-indigo-700 font-mono">{displayValue(selectedProject.statusCoCoax)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "general") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {renderItem("Project ID SAP", selectedProject.projectId, true)}
          {renderItem("PMO ID", selectedProject.pmoId, true)}
          {renderItem("Jabo Wilayah", selectedProject.jabo)}
          {renderItem("Area / Kota", selectedProject.areaKota)}
          {renderItem("PIC Project", selectedProject.pic)}
          {renderItem("Waspang", selectedProject.waspang)}
          {renderItem("Metode Penarikan", selectedProject.metodeProject)}
          {renderItem("Tanggal Surat", selectedProject.tanggalSurat, true)}
          {renderItem("Tahun & Bulan", `${selectedProject.bulan || "-"} ${selectedProject.tahun || "-"}`)}
          {renderItem("Panjang Kabel", selectedProject.lengthM ? `${selectedProject.lengthM.toLocaleString("id-ID")} Meter` : "0 Meter", true)}
          {renderStatusItem("APD Relokasi", selectedProject.apdRelokasi, "apd")}
          {renderStatusItem("Status Audit Finansial", selectedProject.statusAudit, "audit")}
          {renderItem("APD Linknet", selectedProject.apdLinknet)}
          <div className="col-span-2">
            {renderItem("Vendor Pelaksana Utama", selectedProject.vendor)}
          </div>
        </div>

        {selectedProject.remarks && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remarks / Update Lapangan</span>
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedProject.remarks}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (tab === "survey") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderItem("Survey", selectedProject.survey)}
          {renderItem("BA Survey", selectedProject.baSurvey, true)}
          {renderStatusItem("Status Survey Material", selectedProject.statusSurveyMaterial, "survey")}
          {renderStatusItem("Status Survey Labour", selectedProject.statusSurveyLabour, "survey")}
          {renderItem("CE Material", selectedProject.ceMaterial)}
          {renderItem("SPH / BOQ Vendor", selectedProject.sphBoqVendor)}
          {renderItem("APD LN", selectedProject.apdLn)}
          {renderItem("Timeline", selectedProject.timeline)}
          {renderItem("Status CE", selectedProject.statusCe)}
          {renderItem("Status MR", selectedProject.statusMr)}
          {renderItem("Clover", selectedProject.clover)}
          {renderItem("No MR", selectedProject.noMr, true)}
          {renderItem("No GIN", selectedProject.noGin, true)}
          {renderItem("Status Material", selectedProject.statusMaterial)}
          {renderItem("Stock", selectedProject.stock)}
          {renderItem("MATERIAL", selectedProject.material)}
          {renderItem("Quantity", selectedProject.quantity)}
          {renderItem("Priority", selectedProject.priority)}
          <div className="col-span-2">
            {renderItem("Adjusment", selectedProject.adjusment)}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "kabel") {
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50/15 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pipa & Kapasitas Kabel Fiber Optik</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FO 288", val: selectedProject.fo288 },
              { label: "FO 288GL", val: selectedProject.fo288gl },
              { label: "FO 144", val: selectedProject.fo144 },
              { label: "FO 96", val: selectedProject.fo96 },
              { label: "FO 96GL", val: selectedProject.fo96gl },
              { label: "FO 48", val: selectedProject.fo48 },
              { label: "FO 24", val: selectedProject.fo24 },
              { label: "FO 12", val: selectedProject.fo12 },
            ].map(k => (
              <div key={k.label} className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{k.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{k.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderItem("Coax", selectedProject.coax)}
          {renderItem("Galvanis 2\"", selectedProject.galvanis2)}
        </div>

        <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Kebutuhan Closure (Sambungan Joint)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Closure 288", val: selectedProject.closure288 },
              { label: "Closure 144", val: selectedProject.closure144 },
              { label: "Closure 96", val: selectedProject.closure96 },
              { label: "Closure 48", val: selectedProject.closure48 },
              { label: "Closure 24", val: selectedProject.closure24 },
              { label: "Closure 12", val: selectedProject.closure12 },
            ].map(c => (
              <div key={c.label} className="bg-white p-2.5 rounded-xl border border-slate-100 font-mono">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{c.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{c.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "civil") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {renderItem("Tgl Start Project", selectedProject.tglStartProject, true)}
          {renderItem("Status Permit (Izin)", selectedProject.statusPermit)}
        </div>

        <div className="bg-slate-50/30 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Pekerjaan Galian & Struktur Lapangan (Cons)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Galian Alur (Cons)", val: selectedProject.galianAlurCons },
              { label: "Galian Akses (Cons)", val: selectedProject.galianAksesCons },
              { label: "Galian Crossing Jalan (Cons)", val: selectedProject.galianCrossingJalanCons },
              { label: "Galian Crossing Jembatan (Cons)", val: selectedProject.galianCrossingJembatanCons },
              { label: "Galian Crossing Sungai (Cons)", val: selectedProject.galianCrossingSungaiCons },
              { label: "Instalasi HH/MH (Cons)", val: selectedProject.instalasiHhMhCons },
              { label: "Install Galvanis (Cons)", val: selectedProject.installGalvanisCons },
              { label: "Install Pole (Tiang) (Cons)", val: selectedProject.installPoleCons },
            ].map(cv => (
              <div key={cv.label} className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{cv.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{cv.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "fo_cons") {
    return (
      <div className="space-y-6">
        <div className="bg-emerald-50/15 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-emerald-700">Kabel Terpasang (Cons)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FO 288 (Cons)", val: selectedProject.fo288Cons },
              { label: "FO 144 (Cons)", val: selectedProject.fo144Cons },
              { label: "FO 96 (Cons)", val: selectedProject.fo96Cons },
              { label: "FO 96GL (Cons)", val: selectedProject.fo96glCons },
              { label: "FO 48 (Cons)", val: selectedProject.fo48Cons },
              { label: "FO 12 (Cons)", val: selectedProject.fo12Cons },
              { label: "Coax (Cons)", val: selectedProject.coaxCons },
            ].map(c => (
              <div key={c.label} className="bg-white p-2.5 rounded-xl border border-slate-100 font-semibold text-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{c.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{c.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50/15 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-indigo-700">Penarikan Kabel (Pulling)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FO 288 (Pull)", val: selectedProject.fo288Pull },
              { label: "FO 144 (Pull)", val: selectedProject.fo144Pull },
              { label: "FO 96 (Pull)", val: selectedProject.fo96Pull },
              { label: "FO 96GL (Pull)", val: selectedProject.fo96glPull },
              { label: "FO 48 (Pull)", val: selectedProject.fo48Pull },
              { label: "FO 12 (Pull)", val: selectedProject.fo12Pull },
              { label: "Coax (Pull)", val: selectedProject.coaxPull },
            ].map(p => (
              <div key={p.label} className="bg-white p-2.5 rounded-xl border border-slate-100 font-mono font-semibold text-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{p.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{p.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {renderItem("Status Construction", selectedProject.statusConstruction)}
          {renderItem("Category Construction", selectedProject.categoryConstruction)}
          <div className="col-span-2 md:col-span-1">
            {renderItem("Progress Construction", selectedProject.progressConstruction !== undefined ? `${selectedProject.progressConstruction}%` : "0%")}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "co_timeline") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderItem("Tgl Dateline", selectedProject.tglDateline, true)}
          {renderItem("Plan CO Bulan", selectedProject.planCoBulan)}
          {renderItem("Today (Sekarang)", selectedProject.today, true)}
          {renderItem("Aging (Hari)", selectedProject.aging, true)}
        </div>

        <div className="bg-amber-50/15 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-amber-700">Ready for Cut-Over (Rco)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FO 288 (Rco)", val: selectedProject.fo288Rco },
              { label: "FO 144 (Rco)", val: selectedProject.fo144Rco },
              { label: "FO 96 (Rco)", val: selectedProject.fo96Rco },
              { label: "FO 96GL (Rco)", val: selectedProject.fo96glRco },
              { label: "FO 48 (Rco)", val: selectedProject.fo48Rco },
              { label: "FO 24 (Rco)", val: selectedProject.fo24Rco },
              { label: "FO 12 (Rco)", val: selectedProject.fo12Rco },
              { label: "Coax (Rco)", val: selectedProject.coaxRco },
            ].map(r => (
              <div key={r.label} className="bg-white p-2.5 rounded-xl border border-slate-100 font-semibold text-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{r.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{r.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-50/15 p-4 border border-slate-100 rounded-2xl">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-purple-700">Splicing & Splice Cut-Over (SCo)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "FO 288 (SCo)", val: selectedProject.fo288Sco },
              { label: "FO 144 (SCo)", val: selectedProject.fo144Sco },
              { label: "FO 96 (SCo)", val: selectedProject.fo96Sco },
              { label: "FO 96GL (SCo)", val: selectedProject.fo96glSco },
              { label: "FO 48 (SCo)", val: selectedProject.fo48Sco },
              { label: "FO 12 (SCo)", val: selectedProject.fo12Sco },
              { label: "Coax (SCo)", val: selectedProject.coaxSco },
            ].map(s => (
              <div key={s.label} className="bg-white p-2.5 rounded-xl border border-slate-100 font-semibold text-slate-700">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{s.label}</span>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{s.val || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {renderItem("Status CO FO", selectedProject.statusCoFo)}
          {renderItem("Status CO Coax", selectedProject.statusCoCoax)}
        </div>
      </div>
    );
  }

  return null;
};
