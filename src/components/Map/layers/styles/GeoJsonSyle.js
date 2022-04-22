/*
 * @Author: yunfei
 * @since: 2022-03-09 15:18:08
 * @lastTime: 2022-03-09 16:13:31
 * @文件相对于项目的路径: /trunkverse/src/pages/Map/layers/styles/GeoJsonSyle.js
 * @LastAuthor: Do not edit
 * @message:
 */

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: 'line',
        },
        sceneConfig: {},
        type: 'line',
      },
      symbol: {
        lineBloom: false,
        lineCap: 'butt',
        lineColor: [1, 0, 0.0, 1],
        lineDx: 0,
        lineDy: 0,
        lineGapWidth: 0,
        lineJoin: 'bevel',
        lineOpacity: 1,
        linePatternAnimSpeed: 0,
        linePatternFile: null,
        lineStrokeWidth: 0,
        lineStrokeColor: [0, 0, 0, 0],
        lineJoinPatternMode: 0,
        lineWidth: {
          stops: [
            [1, 10],
            [20, 1],
          ],
        },
        visible: true,
      },
    },
  ],
};
export default style;
