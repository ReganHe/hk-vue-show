import { defHttp } from '/@/utils/http/axios';
import { queryItem, pageData, maintenanceCreateItem, ListItem } from './model';

enum Api {
  getMaintenanceList = '/1.0/wo/get_paged',
  addMaintenance = '/1.0/wo/add',
  editMaintenance = '/1.0/wo/edit',
  getDetail = '/1.0/wo/get_one',
  removeUrl = '/1.0/wo/remove/',
}

/**
 * 获取维修报告分页数据
 */
export function getPageList(params: queryItem) {
  return defHttp.get<pageData>({
    url: Api.getMaintenanceList,
    params,
  });
}
/** 新增维修报告 */
export function createMaintenance(data: maintenanceCreateItem) {
  return defHttp.post<any>({
    url: Api.addMaintenance,
    data,
  });
}
/** 编辑维修报告 */
export function updateMaintenance(data) {
  return defHttp.put<any>({
    url: Api.editMaintenance,
    data,
  });
}
/** 获取维修报告详情 */
export function getDetail(id: number) {
  return defHttp.get<ListItem>({
    url: Api.getDetail,
    params: {
      id: id,
    },
  });
}
/** 删除维修报告 */
export function removeMaintenance(id: number) {
  return defHttp.delete<any>({
    url: Api.removeUrl + id,
  });
}
