import { defHttp } from '/@/utils/http/axios';

// import { ErrorMessageMode } from '/#/axios';

/**
 * 获取设备列表
 */
export function getPVList(params: any) {
  return defHttp.get<any>({ url: '/1.0/pv/get_paged', params });
}
/**
 * 获取单个设备信息
 */
export function getPVDetail(params: any) {
  return defHttp.get<any>({ url: `/1.0/pv/get_one`, params });
}
/**
 * 新增设备
 */
export function createPV(data: any) {
  return defHttp.post<any>({ url: '/1.0/pv/add', data });
}
/**
 * 修改设备
 */
export function updatePV(data: any) {
  return defHttp.put<any>({ url: '/1.0/pv/edit', data });
}
/**
 * 删除设备
 */
export function discardPV(data: any) {
  return defHttp.put<any>({ url: `/1.0/pv/discard`, data });
}
