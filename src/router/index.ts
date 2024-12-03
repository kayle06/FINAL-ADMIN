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
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    {
        path: '/video',
        component: Layout,
        redirect: '/video/list',
        meta: {
            title: '视频管理',
            icon: 'VideoCamera'
        },
        children: [
            {
                path: 'list',
                name: 'VideoList',
                component: () => import('@/views/video/list/index.vue'),
                meta: {
                    title: '视频列表',
                    icon: 'List'
                }
            },
            {
                path: 'tag',
                name: 'TagList',
                component: () => import('@/views/video/tag/index.vue'),
                meta: {
                    title: '标签管理',
                    icon: 'Collection'
                }
            },
            {
                path: 'actress',
                name: 'ActressList',
                component: () => import('@/views/video/actress/index.vue'),
                meta: {
                    title: '女优管理',
                    icon: 'User'
                }
            },
            {
                path: 'category',
                name: 'CategoryList',
                component: () => import('@/views/video/category/index.vue'),
                meta: {
                    title: '分类管理',
                    icon: 'Files'
                }
            },
            {
                path: 'series',
                name: 'SeriesList',
                component: () => import('@/views/video/series/index.vue'),
                meta: {
                    title: '系列管理',
                    icon: 'Film'
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
