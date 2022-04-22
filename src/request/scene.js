/**
 * 与scene有关接口
 */
import http from './index';

export const getSceneList = async (param) => {
    return await http.get('/scenes', {
        params: param
    });
}
export const addScene = async (params) => {
    return await http.post('/addScene', params)
}
export const deleteScene = async (params) => {
    return await http.delete('/deleteScene', {
        data: params
    })
}
export const editScene = async (params) => {
    return await http.put('/editScene', params)
}
export const getTagData = async (param) => {
    return await http.get('/tags', {
        params: param
    })
}

export const changeSceneCollect = async (params) => {
    return await http.post('/collect', params)
}

export const getSceneVersionById = async (param) => {
    return await http.get('/sceneVersionAll', {
        params: param
    })
}