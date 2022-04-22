/*
 * @Author: yunfei
 * @Date: 2022-03-31 13:59:16
 * @LastEditTime: 2022-04-01 10:24:09
 * @FilePath: /trunkverse/src/router/index.js
 * @LastAuthor: Do not edit
 * @Description: 
 */

import { createRouter, createWebHashHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import store from '@/store';

export const userType = {
    root: [
        'scene',
        'task',
        'user',
    ],
    other: [
        'scene',
        'task',
    ]
};


export const routes = [
    {
        path: '/',
        component: () => import('@/pages/home.vue'),
        name: 'home',
        requireAuth: false,
        children: [
            {
                path: '/scene',
                component: () => import('@/pages/scene/index.vue'),
                name: 'scene',
                meta: {
                    title: "场景管理",
                    icon: "cheliangguanli",
                    requireAuth: true,
                }
            },
            {
                path: '/task',
                component: () => import('@/pages/task/index.vue'),
                name: 'task',
                meta: {
                    title:"任务管理",
                    icon: "renwuguanli",
                    requireAuth: true,
                }
            },
            {
                path: '/user',
                component: () => import('@/pages/user/index.vue'),
                name: 'user',
                meta: {
                    title:"用户管理",
                    icon:"zhanghaoguanli",
                    requireAuth: true,
                }
            },
            {
                path: '/edit',
                component: () => import('@/pages/edit/index.vue'),
                name: 'edit',
                meta: {
                    title:"编辑场景",
                    icon:"",
                    requireAuth: false,
                }
            },
        ],
        redirect: '/scene'
    },
    {
        path: '/login',
        component: () => import('@/pages/login.vue'),
        name: 'login',
        meta: {
            title:"登陆",
            icon:"",
            requireAuth: false,
        }
    },
    {
        path: '/404',
        component: () => import('@/pages/404.vue'),
        name: '404',
        meta: {
            title: '404',
            icon: '',
            requireAuth: false,
        }
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
];
const menu = JSON.parse(localStorage.getItem('menuList'));
if (menu && menu.length > 0) {
    store.commit('SAVE_MENU_LIST', menu);
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// token验证
router.beforeEach((to, from, next) => {
    window.document.title=to.meta.title;
    const token = localStorage.getItem('token');
    if (to.path !== '/login' && !token) {
        next('/login');
    }
    // 需要权限认证
    else if (to.matched.some(res => res.meta.requireAuth)) {
        const menuList = store.state.menuList.length > 0
            ? store.state.menuList : JSON.parse(localStorage.getItem('menuList'));
        if (menuList && menuList.length !== 0) {
            let isHaveAuth = menuList.some(item => item === to.name);
            if (isHaveAuth) {
                next();
            }
            else {
                ElMessage({
                    message: "无权限访问",
                    type: 'warning'
                });
                next('/scene');
            }
        }
        else {
            next();
        }
    }
    else {
        next();
    }
})
export default router;
