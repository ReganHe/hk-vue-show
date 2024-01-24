/* 手机号 */
export function validatePhone(phone) {
  // 放宽验证
  const reg = new RegExp('^[1][0-9](([0-9]{9})|([0-9]{11}))$');
  // const reg = new RegExp('^[1][3,4,5,7,8](([0-9]{9})|([0-9]{11}))$')
  return reg.test(phone);
}

/* 身份证 */
export function validateIdcard(idcard) {
  // 放宽验证
  const reg = new RegExp(
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  );
  // const reg = new RegExp('^[1][3,4,5,7,8](([0-9]{9})|([0-9]{11}))$')
  return reg.test(idcard);
}
