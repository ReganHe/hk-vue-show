import { defHttp } from '/@/utils/http/axios';

// import { ErrorMessageMode } from '/#/axios';

/**
 * 获取设备列表
 */
export function getDeviceList(params: any) {
  return defHttp.get<any>({ url: '/1.0/device/get_paged', params });
}
/**
 * 获取单个设备信息
 */
export function getDeviceDetail(params: any) {
  return defHttp.get<any>({ url: `/1.0/device/get_one/`, params });
}
/**
 * 新增设备
 */
export function createDevice(data: any) {
  return defHttp.post<any>({ url: '/1.0/device/add', data });
}
/**
 * 修改设备
 */
export function updateDevice(data: any) {
  return defHttp.put<any>({ url: '/1.0/device/edit', data });
}
/**
 * 删除设备
 */
export function removeDevice(id: number) {
  return defHttp.delete<any>({ url: `/1.0/device/remove/${id}` });
}
