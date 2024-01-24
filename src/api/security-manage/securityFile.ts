import { defHttp } from '/@/utils/http/axios';

/**
 * 获取安全管理制度文件列表
 */
export function getSecurityFileList(params: any) {
  return defHttp.get<any>({
    url: `/1.0/attachment/get_safe_attachment_paged/`,
    params,
  });
}
