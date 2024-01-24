// 站点机构列表query
export interface organizationQuery {
  queryKey?: String;
  pageNum: Number;
  pageSize: Number;
}
// 列表返回字段接口
export interface ListItem {
  orgId: number;
  orgName: string;
  orgShortName: string;
  orgArea: string;
  address: string;
  contact: string;
  phoneNum: string[];
  manager: string;
  workerCount: number;
}
export interface pageData {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  totalNum: number;
  list: ListItem[];
}
// 修改站点信息
export interface orgEditInfo {
  orgId: number;
  orgArea: string;
  address: string;
  phoneNum: string[];
}
// 人员信息基础类型
export interface personItem {
  id: number;
  orgId: number;
  workerNum: string;
  name: string;
  identityNum: string;
  mobile: string;
  jobType: string;
  jobTypeDesc: string;
  groups: number;
  groupsDesc: string;
  remark: string;
}

export interface personData {
  managerList: personItem[];
  safetyManagerList: personItem[];
  ordinaryList: personItem[];
}

export interface personAddItem {
  id?: number;
  orgId?: number;
  workerNum: string;
  name: string;
  identityNum: string;
  mobile: string;
  jobType: string;
  groups: number;
  remark: string;
}
// 资质证书
export interface workerAttachmentItem {
  id?: number;
  fileName?: string;
  createdBy?: string;
  url?: string;
  createdTime?: string;
  effectiveDay?: string;
  expiryDay?: string;
  type?: number;
  relationKey?: number;
  expireRemind?: number;
  fileStatus?: number;
  fileStatusDesc?: string;
  certificateType?: string;
  certificateTypeDesc?: string;
  certificateNo?: string;
  issuingUnit?: string;
  issuingUnitDesc?: string;
  periodOfValidity?: string;
  remark?: string;
  editable?: boolean;
}

export interface workerAttachmentData {
  id?: Number;
  workerNum?: String;
  name?: String;
  workerId?: Number;
  workerAttachmentList: workerAttachmentItem[];
}
