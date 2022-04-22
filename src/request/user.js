/**
 * 用户管理
 */
import http from './index';

export const getUserList = async () => {
    return await http.get('/users');
}

export const createUser = async (params) => {
    return await http.post('/user', params)
}

export const deleteUser = async (params) => {
    const address = '/user/' + params.uid;
    return await http.delete(address, {
        data: params
    })
}
export const updateUser = async (params) => {
    const  address = '/user/' + params.uid;
    return await http.put(address, params)
}
export const getUser = async () => {
    return await http.get('/me');
}
//退出
export const logout = async () => {
    return await http.post('/logout')
}