/*
 * @Author: JackFly
 * @since: 2022-03-29 13:31:13
 * @lastTime: 2022-04-01 19:20:33
 * @文件相对于项目的路径: /trunkverse/src/components/Map/tools/moduleType.js
 * @LastAuthor: Do not edit
 * @message:
 */

const moduleType = {
  ego: {
    symbol: {
      url: "/glb/head.glb",
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      bloom: false,
      shadow: false,
      animation: false,
      loop: false,
      type: 'ego'

    },
    name: "本车",
    id: "ego",
  },
  people: {
    symbol: {
      url: "/glb/people.glb",
      scale: [0.4, 0.4, 0.4],
      bloom: false,
      shadow: false,
      animation: false,
      loop: false,
      type: 'people'

    },
    name: "行人",
    id: "people",
  },
  vehicle: {
    symbol: {
      url: "/glb/motorCar.glb",
      scale: [1, 1, 1],
      bloom: false,
      shadow: false,
      animation: false,
      loop: false,
      type: 'vehicle'
    },
    name: "机动车",
    id: "vehicle",
  },
  bicycle: {
    symbol: {
      url: "/glb/bicycle.glb",
      scale: [0.5, 0.5, 0.5],
      bloom: false,
      shadow: false,
      animation: false,
      loop: false,
      type: 'bicycle'
    },
    name: "非机动车",
    id: "bicycle",
  },
};

export default moduleType;
