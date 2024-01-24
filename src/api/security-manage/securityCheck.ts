import { defHttp } from '/@/utils/http/axios';
// import { ErrorMessageMode } from '/#/axios';

import {
  SecurityCheckDayParamsModel,
  CommonListPageModel,
  SecurityCheckDayModel,
} from './model/scModel';

enum Api {
  GetSecurityCheckDay = '/1.0/sc/get_day_paged',
}

/**
 * 获取安全检查（日）列表
 */
export function getSecurityCheckDay(params: SecurityCheckDayParamsModel) {
  return defHttp.get<CommonListPageModel<SecurityCheckDayModel>>({
    url: Api.GetSecurityCheckDay,
    params,
  });
}
