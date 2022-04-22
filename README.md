
# 仿真平台系统前端相关技术栈
```
前端相关技术：vue3+vite、vuex、ElementUI-plus、maptalks、threejs
```    
# 仿真平台系统后端相关技术栈
项目地址：https://github.com/yunfei111666/FastAPI-tortoise-orm
```
后端使用Python 相关技术：fastAPI、Mysql + Tortoise_orm
```

# 目录结构

```
├── build                      // 构建相关  
├── public                     // 静态文件
│   ├── geojson                // 地图json
│   ├── hdr                    // 3d文件
│   └── css                    // css
├── src                        // 源代码
│   ├── assets                 // 静态资源
│   │    ├── css               // 公用css
│   │    ├── img               // 图片
│   │    ├── mock              // mock数据
│   │    └── theme             // 主题样式
│   ├── components             // 全局公用组件
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── utils                  // 全局公用方法
│   ├── pages                  // view视图
│   └── main.js                // 入口 加载组件 初始化等
├── index.html                 // 入口页面
├── README.md                  // 项目说明
├── .gitignore                 // git 忽略项
├── .gitlab-ci.yml             // ci/cd
├── yarn.lock                  // yarn.lock
├── package.json               // package.json
└── vite.config.js             // vite配置文件
```
# 安装

```bash
yarn
```


# 启动

```
yarn dev
```
