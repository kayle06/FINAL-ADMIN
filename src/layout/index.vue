<template>
    <div class="app-wrapper">
        <!-- 侧边栏 -->
        <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
            <Sidebar :is-collapse="isCollapse" />
        </div>

        <!-- 主要内容区域 -->
        <div class="main-container">
            <!-- 顶部导航栏 -->
            <div class="navbar">
                <div class="left">
                    <div class="collapse-btn" @click="toggleSidebar">
                        <el-icon :size="20">
                            <component :is="isCollapse ? 'Expand' : 'Fold'" />
                        </el-icon>
                    </div>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                            {{ item.meta?.title }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>

                <div class="right">
                    <el-tooltip content="主题设置" placement="bottom">
                        <div class="action-item" @click="openThemeDrawer">
                            <el-icon :size="16">
                                <Brush />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <el-tooltip content="全屏" placement="bottom">
                        <div class="action-item" @click="toggleFullScreen">
                            <el-icon :size="16">
                                <FullScreen />
                            </el-icon>
                        </div>
                    </el-tooltip>

                    <el-dropdown trigger="click">
                        <div class="avatar-container">
                            <img src="@/assets/images/logo.png" class="avatar">
                            <span class="name">Admin</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleCommand('profile')">
                                    <el-icon><User /></el-icon>个人中心
                                </el-dropdown-item>
                                <el-dropdown-item @click="handleCommand('password')">
                                    <el-icon><Lock /></el-icon>修改密码
                                </el-dropdown-item>
                                <el-dropdown-item divided @click="handleCommand('logout')">
                                    <el-icon><SwitchButton /></el-icon>退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>

            <!-- 主要内容 -->
            <div class="app-main">
                <router-view v-slot="{ Component }">
                    <transition name="fade-transform" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>

        <!-- 主题设置抽屉 -->
        <el-drawer
            v-model="themeDrawer"
            title="主题设置"
            direction="rtl"
            size="300px"
        >
            <div class="theme-drawer">
                <div class="theme-item">
                    <span class="label">主题色</span>
                    <div class="theme-colors">
                        <div
                            v-for="color in themeColors"
                            :key="color"
                            class="color-block"
                            :style="{ backgroundColor: color }"
                            :class="{ active: currentTheme === color }"
                            @click="changeTheme(color)"
                        ></div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar/index.vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

// 面包屑导航
const breadcrumbs = computed(() => {
    return route.matched.filter(item => item.meta && item.meta.title)
})

// 切换侧边栏
const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
}

// 全屏
const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// 下拉菜单命令
const handleCommand = (command: string) => {
    switch (command) {
        case 'profile':
            router.push('/profile')
            break
        case 'password':
            router.push('/password')
            break
        case 'logout':
            router.push('/login')
            break
    }
}

// 主题设置
const themeDrawer = ref(false)
const currentTheme = ref('#409EFF')

const themeColors = [
    '#409EFF', // 默认蓝色
    '#67C23A', // 绿色
    '#E6A23C', // 黄色
    '#F56C6C', // 红色
    '#909399', // 灰色
    '#8B00FF', // 紫色
]

const openThemeDrawer = () => {
    themeDrawer.value = true
}

const changeTheme = (color: string) => {
    currentTheme.value = color
    // 修改 Element Plus 主题色
    const style = document.documentElement.style
    style.setProperty('--el-color-primary', color)
    // 可以添加更多主题色变量
    style.setProperty('--el-color-primary-light-3', lightenColor(color, 0.2))
    style.setProperty('--el-color-primary-light-5', lightenColor(color, 0.4))
    style.setProperty('--el-color-primary-light-7', lightenColor(color, 0.6))
    style.setProperty('--el-color-primary-light-9', lightenColor(color, 0.8))
    style.setProperty('--el-color-primary-dark-2', darkenColor(color, 0.2))
}

// 辅助函数：调亮颜色
const lightenColor = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl[2] = Math.min(1, hsl[2] + amount)
    const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
    return rgbToHex(newRgb[0], newRgb[1], newRgb[2])
}

// 辅助函数：调暗颜色
const darkenColor = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl[2] = Math.max(0, hsl[2] - amount)
    const newRgb = hslToRgb(hsl[0], hsl[1], hsl[2])
    return rgbToHex(newRgb[0], newRgb[1], newRgb[2])
}

// 颜色转换辅助函数
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    return [h, s, l]
}

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
</script>

<style scoped lang="scss">
.app-wrapper {
    position: relative;
    height: 100vh;
    width: 100%;

    .sidebar-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 220px;
        background-color: #fff;
        transition: width 0.3s;
        z-index: 1001;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0,21,41,.08);

        &.is-collapse {
            width: 64px;
        }
    }

    .main-container {
        position: relative;
        margin-left: 220px;
        min-height: 100%;
        transition: margin-left 0.3s;

        .navbar {
            position: fixed;
            top: 0;
            right: 0;
            left: 220px;
            height: 50px;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,21,41,.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 1000;
            transition: left 0.3s;

            .left {
                display: flex;
                align-items: center;
                gap: 16px;

                .collapse-btn {
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    
                    &:hover {
                        background: #f6f6f6;
                    }
                }
            }

            .right {
                display: flex;
                align-items: center;
                gap: 16px;

                .action-item {
                    padding: 4px;
                    cursor: pointer;
                    border-radius: 4px;

                    &:hover {
                        background: #f6f6f6;
                    }
                }

                .avatar-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;

                    &:hover {
                        background: #f6f6f6;
                    }

                    .avatar {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                    }

                    .name {
                        font-size: 14px;
                        color: #606266;
                    }
                }
            }
        }

        .app-main {
            padding: 66px 16px 16px;
            background-color: #f0f2f5;
            min-height: 100vh;
        }
    }

    &.is-collapse {
        .main-container {
            margin-left: 64px;

            .navbar {
                left: 64px;
            }
        }
    }
}

// 路由切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
    transition: all 0.3s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.theme-drawer {
    padding: 20px;

    .theme-item {
        margin-bottom: 20px;

        .label {
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            color: #606266;
        }

        .theme-colors {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .color-block {
                width: 30px;
                height: 30px;
                border-radius: 4px;
                cursor: pointer;
                transition: transform 0.2s;
                position: relative;

                &:hover {
                    transform: scale(1.1);
                }

                &.active::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 16px;
                }
            }
        }
    }
}

/* 暗黑模式样式覆盖 */
:deep(.dark) {
    .sidebar-container {
        background-color: var(--el-bg-color);
        border-right: 1px solid var(--el-border-color-light);
    }

    .navbar {
        background-color: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color-light);
    }

    .app-main {
        background-color: var(--el-bg-color-overlay);
    }

    .el-card {
        background-color: var(--el-bg-color);
        border: 1px solid var(--el-border-color-light);
    }
}
</style> 