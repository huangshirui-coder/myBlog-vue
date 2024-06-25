import axios from "axios";
import constant from "./constant";
//处理url参数
import qs from "qs";

import store from "../store";


axios.defaults.baseURL = constant.baseURL;


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data !== null && response.data.hasOwnProperty("code") && response.data.code !== 200) {
    if (response.data.code === 300) {
      store.commit("loadCurrentUser", {});
      localStorage.removeItem("userToken");
      store.commit("loadCurrentAdmin", {});
      localStorage.removeItem("adminToken");
      window.location.href = constant.webURL + "/user";
    }
    return Promise.reject(new Error(response.data.message));
  } else {
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
// 当data为普通对象时，会被设置为application/json;charset=utf-8


export default {
  post(url, params = {}, isAdmin = false) {
    let token;
    if (isAdmin) {
      token = localStorage.getItem("adminToken")
    } else {
      token = localStorage.getItem("userToken")
    }

    return new Promise((resolve, reject) => {
      axios({
        url: url,               // 请求地址
        method: "post",                       // 请求方法
        headers: {                            // 请求头
          "token": token,
          "Content-Type": "application/json",
        },
        data: params
      }).then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  get(url, params = {}, isAdmin = false) {
    let token;
    if (isAdmin) {
      token = localStorage.getItem("adminToken");
    } else {
      token = localStorage.getItem("userToken");
    }

    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: "get",
        headers: {
          "token": token,
          "Content-Type": "application/json",
        },
        params: params
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  upload(url, param, isAdmin = false, option) {
    let config;
    if (isAdmin) {
      config = {
        headers: {"Authorization": localStorage.getItem("adminToken"), "Content-Type": "multipart/form-data"},
        timeout: 60000
      };
    } else {
      config = {
        headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"},
        timeout: 60000
      };
    }
    if (typeof option !== "undefined") {
      config.onUploadProgress = progressEvent => {
        if (progressEvent.total > 0) {
          progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
        }
        option.onProgress(progressEvent);
      };
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  uploadQiniu(url, param) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
