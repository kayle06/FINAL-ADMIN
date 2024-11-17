<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const title = import.meta.env.VITE_APP_TITLE
const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 从路由配置生成菜单
const menus = computed(() => {
    return router.options.routes.filter(route => {
        // 过滤掉不需要显示的路由
        return !route.meta?.hidden && route.path !== '/login'
    }).map(route => {
        // 处理根路由
        if (route.path === '/') {
            return {
                ...route.children![0],
                path: '/dashboard'  // 确保路径正确
            }
        }
        // 处理其他路由
        return {
            ...route,
            path: route.path,
            children: route.children?.map(child => ({
                ...child,
                path: `${route.path}/${child.path}`  // 拼接完整路径
            }))
        }
    })
})
</script>

<template>
    <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
        <div class="logo">
            <h2 v-show="!isCollapse">{{ title }}</h2>
        </div>
        <el-scrollbar>
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :unique-opened="true"
                :collapse-transition="false"
                class="sidebar-menu"
                router
            >
                <template v-for="(menu, index) in menus" :key="index">
                    <!-- 没有子菜单的菜单项 -->
                    <el-menu-item v-if="!menu.children?.length" :index="menu.path">
                        <el-icon>
                            <component :is="menu.meta?.icon" />
                        </el-icon>
                        <template #title>
                            <span>{{ menu.meta?.title }}</span>
                        </template>
                    </el-menu-item>

                    <!-- 有子菜单的菜单项 -->
                    <el-sub-menu v-else :index="menu.path">
                        <template #title>
                            <el-icon>
                                <component :is="menu.meta?.icon" />
                            </el-icon>
                            <span>{{ menu.meta?.title }}</span>
                        </template>
                        <el-menu-item
                            v-for="child in menu.children"
                            :key="child.path"
                            :index="child.path"
                        >
                            <el-icon>
                                <component :is="child.meta?.icon || 'Document'" />
                            </el-icon>
                            <template #title>{{ child.meta?.title }}</template>
                        </el-menu-item>
                    </el-sub-menu>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template> 

<style scoped lang="scss">
.sidebar-container {
    width: 210px;
}

.logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    h2 {
        font-size: 18px;
        font-weight: 600;
        color: #000;
    }
}
</style>
