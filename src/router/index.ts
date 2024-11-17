import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { 
            hidden: true,
            title: '登录'
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '首页',
                    icon: 'HomeFilled',
                }
            }
        ]
    },
    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        meta: {
            title: '系统管理',
            icon: 'Setting'
        },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/system/user/index.vue'),
                meta: {
                    title: '用户管理',
                    icon: 'User'
                }
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/system/role/index.vue'),
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
