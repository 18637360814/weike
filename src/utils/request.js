import { notification } from 'antd';
import axios from 'axios';
import qs from 'qs';                   // 数据格式转换工具  类似json 可将url和对象进行转换  

// import router from 'umi/router';       // 路由
// import NProgress from 'nprogress';     // 滚动条
// import hash from 'hash.js';


// const ROLE_TYPE = {
//     ADMIN: 'admin',
//     DEFAULT: 'admin',
//     DEVELOPER: 'developer',
// }
// const CANCEL_REQUEST_MESSAGE = 'cancel request'
// const { CancelToken } = axios;
// window.cancelRequest = new Map();

const instance = axios.create();       // 创建axios实例化对象

instance.defaults.baseURL = '';        // 设置默认请求路径
instance.defaults.timeout = 15000;     // 设置超时时间

const axiosDefaultOptions = {          // 设置基础参数
  retry: 3,                            // 重试次数
  showLoading: true,                   
  mock: false,                         // 是否启用 mock
  rest: true,                          // 是否启用 rest
  download: false,
  data: {},
};

const getReqHeaderParams  = (params) => {          // 设置请求内容
  return(
    {
      reqHeader: {
        // acctId: '',
        // appId: '21038',                       
        // operTitle: '',
        // sid: cookie.load('sid'),
      },
      reqBody: params,
    }
  )
};
// instance.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const checkStatus = (response) => {                                       // 验证code码
  if (response.status >= 200 && response.status < 300) {                  // 200-300正常返回
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;  // 设置请求错误文本
  notification.error({                                                    // 错误通知
    message:`请求错误 ${response.status}: ${response.url}`,                // 通知标题
    description: errortext,                                               // 通知内容                                
  });
  const error = new Error(errortext);                                     // 创建一个错误对象
  error.name = response.status;                                           // 设置对象
  error.response = response;
  throw error;                                                            // 抛出对象（打断请求）
};

instance.getInstance = () => {
  console.log(this, instance, 'instance');
  return this;
};

instance.useMock = (flag) => {
  console.log(instance, instance.Axios, 'instance');
  // instance.defaults.mock = flag;
  // return axios.create(
  //   {
  //     ...axiosDefaultOptions,
  //     mock: flag,
  //   })
  // ;
  return instance;
};

// const showLoading = (config) => {
//   if (config.showLoading) {
//     // NProgress.start();
//   }
// };
// const hideLoading = () => {
//   // NProgress.done();
// };

instance.interceptors.request.use((config) => {           // 添加一个请求拦截器，用于设置请求过渡状态
  if (                                                   // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    config.method.toUpperCase() === 'POST' ||
    config.method.toUpperCase() === 'PUT' ||
    config.method.toUpperCase() === 'PATCH'
  ) {
    if (!(config.body instanceof FormData)) {            // 非form表单的请求      
      config.headers = {                                 // 设置请求头
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...config.headers,                               // 合并原请求头
      };
      if (!!config.body) {                              
        config.body = JSON.stringify(config.body);
      }
    } else {                                             // form表单的请求      
      // newOptions.body is FormData
      config.headers = {
        Accept: 'application/json',
        ...config.headers,
      };
    }
  }
  const myConfig = {...axiosDefaultOptions, ...instance.defaults, ...config};     // 合并配置项
  if (myConfig.download) {                                                        // 下载
    myConfig.headers = {                                                          // 设置请求头
      ...myConfig.headers,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };
    const downloadData = getReqHeaderParams(myConfig.data);
    myConfig.data = qs.stringify({jsonRequest: JSON.stringify(downloadData)});    // 设置请求数据
    myConfig.responseType = 'blob';               
  } else {                                                                        // 非下载
    myConfig.data = getReqHeaderParams(myConfig.data);
  }
  // showLoading('loading...');
  return myConfig;
}, (error) => Promise.reject(error));

instance.interceptors.request.use((request) => {
  if (request.method === 'post') {
    request.params = {};
  }
  return request;
});

// 添加一个返回拦截器
instance.interceptors.response.use((response) => {
  // hideLoading();
  response.url = response.config.url;
  checkStatus(response);
  return (response.config.download) ? handleDownloadFile(response) : handleOk(response);
}, (error) => {
  // NProgress.done();
  return handleError(error);
});

/* 下载方法 */
function downFile(blob, fileName) {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); // 创建下载的链接
    link.download = fileName; // 下载后文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click(); // 点击下载
    window.URL.revokeObjectURL(link.href); // 释放掉blob对象
    document.body.removeChild(link); // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName);
  }
}

function handleDownloadFile(resp) {
  let headers = resp.headers;
  let contentType = headers['content-type'];

  // console.log('响应头信息', headers);
  if (!resp.data) {
    console.error('响应异常：', resp);
    return false;
  } else {
    // console.warn('下载文件：', resp);
    const blob = new Blob([resp.data], {type: contentType});

    const contentDisposition = resp.headers['content-disposition'];
    let fileName = 'unknown';
    if (contentDisposition) {
        // fileName = window.decodeURI(resp.headers['content-disposition'].split('=')[1]);
        fileName = '燃气行业标准物料数据'
    }
    // console.log('文件名称：', fileName);
    downFile(blob, fileName);
  }
}

function handleOk(response) {
  const { data } = response;
  const {retCode = '0000000', rspBody, retDesc = '' } = data;
  if (retCode === '0000000') {
    return Promise.resolve(rspBody || data);
  } else if (retCode === '6000902' || retCode === '6000901' || retCode === '0100099' || retCode === '9999999' || retCode === '11030003') {
    return Promise.resolve(data);
  }
  return Promise.reject(
    {
      error: {
        code: retCode,
        descp: retDesc,
        data: data,
      },
    }
  );

}

function handleError(error) {
  const { response } = error;
  const { data } = response; // statusText, status,
  const err = {
    error,
    data: data,
  };
  // 获取重试次数
  error.request.retryCount = error.request.retryCount || 0;
  // 判断是否超过了重试次数
  if (error.request.retryCount >= error.request.retry) {
    return Promise.reject(err);
  }

  response.url = response.config.url;
  checkStatus(response);

//   if (String(message) === CANCEL_REQUEST_MESSAGE) {
//     return {
//       success: false,
//     };
//   }
  // 登录错误不重试
  if (response.url === '/rest/login4pc') {
    return Promise.reject(err);
  }
  // 重试次数自增
  error.retryCount += 1;
  // 重新发起请求
  // return fly.request(err.request);

  // if (response && response instanceof Object) {
  //   const { data, statusText } = response;
  //   statusCode = response.status;
  //   msg = data.retDesc || statusText;
  // } else {
  //   status = 600;
  //   msg = error.message || 'Network Error';
  // }
  return Promise.reject(err);

}

export default instance;