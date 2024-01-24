export interface RoleInfo {
  name: string;
  code: string;
  id: number;
  type: string;
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  loginName: string;
  password: string;
  captcha: string;
  bindKey: string;
  applicationId: number;
  deviceId: number;
}

/**
 * @description: Login interface parameters
 */
export interface LoginTestParams {
  loginName: string;
  password: string;
  applicationId: number;
  deviceId: number;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  id: string | number;
  token: string;
  role: RoleInfo;
}

export interface GetAccessTokenParams {
  refreshToken: string;
}

export interface TokenResultModel {
  token: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserLoginInfoModel {
  // 用户id
  id: string | number;
  // 登陆名称
  loginName?: string;
  // 用户名称
  userName?: string;
  // 用户类型 0-集团用户 1-超级用户 2-公司用户 3-站点用户 4-供应商
  userType?: number;
  // 头像
  avatar?: string;
  // 介绍
  desc?: string;
  // 用户角色集合
  roles: RoleInfo[];
  // 主页地址
  homePath?: string;
  // 密码剩余有效期
  pwdExpiredInDays?: number;
}

export interface GetUserBasicInfoModel {
  /** 用户id */
  id: number;
  /** 用户权限id */
  userId: number;
  /** 登录账号 */
  loginName: string;
  /** 用户类型 0-集团用户 1-超级用户 2-公司用户 3-站点用户 4-供应商 */
  userType: number;
  /** 用户昵称 */
  userName: string;
  /** 用户头像组 */
  avatarGroup: string;
  /** 用户头像图片相对路径 */
  avatar: string;
  /** 用户头像图片链接 */
  avatarUrl: string;
  /** 用户状态 0-启用 1-禁用 */
  status: string;
  /** 备注 */
  remark: string;
  /** 创建人 */
  createdBy: string;
  /** 创建时间 */
  createdTime: string;
  /** 更新人 */
  updatedBy: string;
  /** 更新时间 */
  updatedTime: string;
  /** 机构ID */
  orgId: number;
  /** 组织机构编码 */
  orgCode: string;
  /** 组织机构名称 */
  orgName: string;
  /** 父节点id */
  parentId: number;
  /** 机构类型ID */
  typeId: number;
  /** 机构类型 */
  type: string;
  /** 机构类型名称 */
  typeName: string;
  /** 机构路径 */
  path: string;
  /** 绑定的角色编号 */
  roleIds: number[];
  /** 绑定的设备编号 */
  deviceIds: number[];
  station: any;
  stationInfo: any;
  /** 供应商id */
  supplierId: number;
}
