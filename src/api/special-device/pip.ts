import { defHttp } from '/@/utils/http/axios';

// import { ErrorMessageMode } from '/#/axios';

/**
 * 获取设备列表
 */
export function getPipList(params: any) {
  return defHttp.get<any>({ url: '/1.0/pip/get_paged', params });
}
/**
 * 获取设备列表
 */
export function getPipLength(params: any) {
  return defHttp.get<any>({ url: '/1.0/pip/get_length', params });
}
/**
 * 获取单个设备信息
 */
export function getPipDetail(params: any) {
  return defHttp.get<any>({ url: `/1.0/pip/get_one`, params });
}
/**
 * 新增设备
 */
export function createPip(data: any) {
  return defHttp.post<any>({ url: '/1.0/pip/add', data });
}
/**
 * 修改设备
 */
export function updatePip(data: any) {
  return defHttp.put<any>({ url: '/1.0/pip/edit', data });
}
/**
 * 删除设备
 */
export function discardPip(data: any) {
  return defHttp.put<any>({ url: `/1.0/pip/discard`, data });
}
/**
 * 获取站点额外信息
 */
export function getStationExtra(id: any) {
  return defHttp.get<any>({ url: `/1.0/org_manage/org/get_org_extra_info/${id}/` });
}
/**
 * 修改站点额外信息
 */
export function updateStationExtra(data: any) {
  return defHttp.put<any>({ url: '/1.0/org_manage/org/modify_extra/', data });
}
