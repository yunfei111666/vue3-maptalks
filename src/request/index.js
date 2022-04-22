/*
 * @Description: 
 * @Project: 
 * @Author: yunfei
 * @Date: 2022-03-22 15:46:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-22 18:48:35
 * @Modified By: yunfei
 * @FilePath: /demo/vue3-maptalks/src/request/index.js
 */

import axios from "axios";
import { ElMessage } from 'element-plus';

const http = axios.create({
    baseURL: 'http://192.168.3.200:8098/api',
    timeout: 10000
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        // 请求头携带token
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

http.interceptors.response.use((res) => {
    // 状态码为 2xx 范围时都会调用该函数，处理响应数据
    if (res.status === 200) {
        const data = res.data;
        let msg = '';
        if (data.detail) {
            switch (data.detail.code) {
                case 401:
                    ElMessage({
                        type: 'error',
                        message: '请重新登录！',
                        showClose: true
                    });
                    location.href = '/login';
                    localStorage.removeItem('token');
                    break;
                case 404:
                    msg = data.detail.msg
                    break;
                case 422:
                    msg = '参数有误！';
                    break;
                case 500:
                    msg = '服务器无法请求'
                case 502:
                    msg = '服务器内部报错！';
                    break;
                default:
                    msg = '';
                    break;
            }
        }

        if (msg) {
            ElMessage({
                type: 'error',
                message: msg,
                showClose: true
            });
        }
        if (data.code && data.code !== 200) {
            alert(23)
            ElMessage({
                type: 'error',
                message: data.msg,
                showClose: true
            });
        }
        return Promise.resolve(data);
    }
}, (error) => {
    try {
        if (error.response.status) {
            console.log('error', error)
            // 状态码超过 2xx 范围时都会调用该函数，处理错误响应
            switch (error.response.status) {
                case 401:
                    ElMessage({
                        type: 'error',
                        message: '请重新登录',
                        showClose: true
                    });
                    localStorage.removeItem('token');
                    break;
                case 404:
                    ElMessage({
                        type: 'error',
                        message: '请求路径找不到！',
                        showClose: true
                    });
                    break;
                case 422:
                    ElMessage({
                        type: 'error',
                        message: '参数出错',
                        showClose: true
                    });
                    break;
                case 500:
                    ElMessage({
                        type: 'error',
                        message: '服务器无法请求',
                        showClose: true
                    });
                case 502:
                    ElMessage({
                        type: 'error',
                        message: '服务器内部报错！',
                        showClose: true
                    });
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
    catch (error) {
        ElMessage({
            type: 'error',
            message: '请求出错',
            showClose: true
        });
    }

});

export default http;
