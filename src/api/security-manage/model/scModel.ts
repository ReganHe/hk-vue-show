export interface SecurityCheckDayParamsModel {
  stationId?: string;
  orderNo?: string;
  status?: number;
  checkResult?: number;
  checkDate?: string;
  checkStartDate?: string;
  checkEndDate?: string;
  submitStartDate?: string;
  submitEndDate?: string;
  type?: number;
  pageNum?: number;
  pageSize?: number;
}

export interface SecurityCheckDayModel {
  id: number;
  orderNo: string;
  inspector: string;
  groups: number;
  status: number;
  stationId: number;
  checkDate: string;
  checkResult: number;
  handleResult: string;
  stationName: string;
  statusDesc: string;
  checkResultDesc: string;
  submitDate: string;
}

export interface CommonListPageModel<T> {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  totalNum: number;
  list: T[];
}
