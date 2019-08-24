import request from '@/utils/request';

export async function queryCurrent(params) {
  let res = null;
  try {
    res = await request
      .post('/res/api/users/user/findUserInfo', params)
      .then(function (response) {
        return response;
      });
  } catch (error) {
    console.log(error);
  }
  return res;
}
