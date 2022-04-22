/*
 * @Author: yunfei
 * @since: 2022-03-09 18:05:44
 * @lastTime: 2022-03-09 18:15:37
 * @文件相对于项目的路径: /trunkverse/src/utils/MapApi.js
 * @LastAuthor: Do not edit
 * @message:高德地图API
 */

import $ from 'axios';

const params = {
  key: 'f9fb947d4e8257e9e4b4e67adc0390e9',
  subdistrict: 1,
};
const getLocation = (name) => {
  return $.get('https://restapi.amap.com/v3/config/district?parameters', {
    params: {
      ...params,
      keywords: name,
    },
  }).then(({ data }) => data);
};

export { getLocation };
