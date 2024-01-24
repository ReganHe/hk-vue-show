import { defHttp } from '/@/utils/http/axios';
import {
  organizationQuery,
  pageData,
  ListItem,
  orgEditInfo,
  personData,
  personAddItem,
  personItem,
  workerAttachmentData,
} from './model';

enum Api {
  getOrganizationList = '/1.0/org_manage/org/get_org_info_paged',
  gerOrgInfo = '/1.0/org_manage/org/get_org_info/',
  updateOrgUrl = '/1.0/org_manage/org/modify',
  personUrl = '/1.0/org_manage/worker/get_org_workers',
  personAddUrl = '/1.0/org_manage/worker/add',
  personUpdateUrl = '/1.0/org_manage/worker/modify',
  personDelUrl = '/1.0/org_manage/worker/remove/',
  workerAttachmentUrl = '/1.0/org_manage/worker/attachment/get_list',
  workerAttachmentEditUrl = '/1.0/org_manage/worker/attachment/modify_batch',
  workerAttachmentDelUrl = '/1.0/org_manage/worker/attachment/remove/',
}

/**
 * 获取站点机构分页数据
 */
export function getPageList(params: organizationQuery) {
  return defHttp.get<pageData>({
    url: Api.getOrganizationList,
    params,
  });
}
/**
 * 获取站点机构信息
 */
export function getOrgInfo(id: Number) {
  return defHttp.get<ListItem>({
    url: Api.gerOrgInfo + id,
  });
}
/**
 * 修改站点机构信息
 */
export function updateOrgInfo(data: orgEditInfo) {
  return defHttp.put<ListItem>({
    url: Api.updateOrgUrl,
    data,
  });
}
/**
 * 获取机构下员工列表
 */
export function getPersonList(orgId: Number) {
  return defHttp.get<personData>({
    url: Api.personUrl,
    params: {
      orgId: orgId,
    },
  });
}
/**
 * 机构下员工新增
 */
export function addPerson(data: personAddItem) {
  return defHttp.post<personItem>({
    url: Api.personAddUrl,
    data,
  });
}
/**
 * 机构下员工修改
 */
export function updatePerson(data: personAddItem) {
  return defHttp.put<personItem>({
    url: Api.personUpdateUrl,
    data,
  });
}
/**
 * 机构下员工删除
 */
export function removePerson(id: number) {
  return defHttp.delete<any>({
    url: Api.personDelUrl + id,
  });
}
/**
 * 获取员工资质证书
 */
export function getWorkerAttachmentList(id: Number) {
  return defHttp.get<workerAttachmentData>({
    url: Api.workerAttachmentUrl,
    params: {
      workerId: id,
    },
  });
}
/**
 * 机构下员工资质证书修改
 */
export function updateWorkerAttachment(data: any) {
  return defHttp.put<any>({
    url: Api.workerAttachmentEditUrl,
    data,
  });
}
/**
 * 机构下员工资质证书删除
 */
export function removeWorkerAttachment(id: number) {
  return defHttp.delete<any>({
    url: Api.workerAttachmentDelUrl + id,
  });
}
