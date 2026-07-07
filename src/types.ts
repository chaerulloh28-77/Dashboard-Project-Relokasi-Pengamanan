export interface ProjectData {
  no: number;
  namaProject: string;
  pmoId: string;
  projectId: string;
  jabo: string;
  projectPlan: string;
  areaKota: string;
  pic: string;
  waspang: string;
  vendor: string;
  metodeProject: string;
  tanggalSurat: string;
  tahun: string;
  bulan: string;
  lengthM: number;
  apdRelokasi: string;
  statusAudit: string;
  apdLinknet: string;
  baSurvey: string;
  statusSurveyMaterial: string;
  statusSurveyLabour: string;
  requestType: string;
  labour: string;
  volume: string;
  poNumber: string;
  typePoLabour: string;
  statusPengajuanPo: string;
  remarks: string;
  statusConstruction: string;
  categoryConstruction: string;
  progressConstruction: number; // Percentage as number (0-100)
  dateUpdate: string;

  // New fields requested by user
  survey?: string;
  ceMaterial?: string;
  sphBoqVendor?: string;
  apdLn?: string;
  timeline?: string;
  statusCe?: string;
  statusMr?: string;
  clover?: string;
  noMr?: string;
  noGin?: string;
  statusMaterial?: string;
  stock?: string;
  material?: string;
  quantity?: string;
  priority?: string;
  adjusment?: string;
  
  // Kabel & Closure
  fo288?: string;
  fo288gl?: string;
  fo144?: string;
  fo96?: string;
  fo96gl?: string;
  fo48?: string;
  fo24?: string;
  fo12?: string;
  coax?: string;
  galvanis2?: string;
  closure288?: string;
  closure144?: string;
  closure96?: string;
  closure48?: string;
  closure24?: string;
  closure12?: string;

  // Sipil / Cons
  tglStartProject?: string;
  statusPermit?: string;
  galianAlurCons?: string;
  galianAksesCons?: string;
  galianCrossingJalanCons?: string;
  galianCrossingJembatanCons?: string;
  galianCrossingSungaiCons?: string;
  instalasiHhMhCons?: string;
  installGalvanisCons?: string;
  installPoleCons?: string;

  // FO / Coax Cons
  fo288Cons?: string;
  fo144Cons?: string;
  fo96Cons?: string;
  fo96glCons?: string;
  fo48Cons?: string;
  fo12Cons?: string;
  coaxCons?: string;

  // Pulling
  fo288Pull?: string;
  fo144Pull?: string;
  fo96Pull?: string;
  fo96glPull?: string;
  fo48Pull?: string;
  fo12Pull?: string;
  coaxPull?: string;

  // Timeline & RCO / SCO
  tglDateline?: string;
  planCoBulan?: string;
  today?: string;
  aging?: string;

  // RCO
  fo288Rco?: string;
  fo144Rco?: string;
  fo96Rco?: string;
  fo96glRco?: string;
  fo48Rco?: string;
  fo24Rco?: string;
  fo12Rco?: string;
  coaxRco?: string;

  // SCO
  fo288Sco?: string;
  fo144Sco?: string;
  fo96Sco?: string;
  fo96glSco?: string;
  fo48Sco?: string;
  fo12Sco?: string;
  coaxSco?: string;

  // CO Statuses
  statusCoFo?: string;
  statusCoCoax?: string;
}

export interface JaboStat {
  name: string;
  count: number;
  totalLength: number;
}

export interface StatusStat {
  name: string;
  count: number;
  color: string;
}

export interface VendorStat {
  name: string;
  count: number;
  totalLength: number;
}
