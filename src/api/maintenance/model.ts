export interface queryItem {
  stationId?: Number;
  orderNo?: String;
  status?: Number;
  nature?: Number;
  beginDate?: String;
  endDate?: String;
  pageNum: Number;
  pageSize: Number;
}

// 附件item
interface Attachments {
  id: number;
  fileName: string;
  createdBy: string;
  createdTime: string;
  effectiveDay: string;
  expiryDay: string;
  fileStatus: number;
  fileStatusDesc: string;
}

// 列表返回字段接口
export interface ListItem {
  id: number;
  orderNo: string;
  contents: string;
  conclusion: number;
  conclusionContent: string;
  detailedList: string;
  nature: number;
  repairApplicant: string;
  stationId: number;
  contacts: string;
  phone: string;
  repairDate: string;
  checkId: number;
  checkType: number;
  status: number;
  repairUnit: string;
  stationName: string;
  natureDesc: string;
  conclusionDesc: string;
  statusDesc: string;
  rejectReason: string;
  confirmedBy: String;
  attachments: Attachments[];
  addAttachments: Attachments[];
}
export interface pageData {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  totalNum: number;
  list: ListItem[];
}

// 维修报告新增
interface FileList {
  id?: number;
  fileName?: string;
  url?: string;
  type?: number;
  relationKey?: number;
  effectiveDay?: string;
  expiryDay?: string;
  expireRemind?: number;
  errorMsg?: string;
}

export interface maintenanceCreateItem {
  id?: number;
  contents?: string;
  conclusion?: number;
  conclusionContent?: string;
  detailedList?: string;
  nature?: number;
  repairApplicant?: string;
  stationId?: number;
  contacts?: string;
  phone?: string;
  repairDate?: string;
  checkId?: number;
  checkType?: number;
  fileList?: FileList[];
  confirmedBy?: String;
  status?: number;
  rejectReason?: string;
}
