<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 左侧品牌区域 -->
            <div class="login-left">
                <div class="login-left-content">
                    <img src="../assets/images/logo.png" class="logo" alt="logo">
                    <h2 class="title">{{ title }}</h2>
                    <p class="desc">{{ desc }}</p>
                </div>
            </div>
            <!-- 右侧表单区域 -->
            <div class="login-right">
                <component :is="currentComponent" @switch-component="switchComponent" />
                <div class="browser-tips">
                    <el-divider content-position="center">{{ browserTips }}</el-divider>
                    <div class="browser-icons">
                        <a href="https://www.microsoft.com/zh-cn/edge" target="_blank">
                            <img src="../assets/browser/edge-icon.png" alt="Microsoft Edge">
                        </a>
                        <a href="https://www.google.com/chrome" target="_blank">
                            <img src="../assets/browser/chrome-icon.png" alt="Google Chrome">
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <Copyright />
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import LoginForm from '@/components/LoginForm/index.vue'
import RegisterForm from '@/components/RegisterForm/index.vue'
import ForgotPasswordForm from '@/components/ForgotPasswordForm/index.vue'
import Copyright from '@/components/Copyright/index.vue'

const title = import.meta.env.VITE_APP_TITLE
const desc = import.meta.env.VITE_APP_DESC
const browserTips = import.meta.env.VITE_APP_BROWSER_TIPS
// 使用 shallowRef 来存储当前显示的组件
const currentComponent = shallowRef(LoginForm)

// 切换组件的方法
const switchComponent = (component: string) => {
    switch (component) {
        case 'login':
            currentComponent.value = LoginForm
            break
        case 'register':
            currentComponent.value = RegisterForm
            break
        case 'forgot-password':
            currentComponent.value = ForgotPasswordForm
            break
    }
}
</script>

<style scoped lang="scss">
.login-container {
    height: 100vh;
    // background: linear-gradient(to right bottom, #1890ff, #36cfc9);
    background: linear-gradient(to left bottom, #F2F2F2, #FEFEFE);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.login-box {
    width: 96%;
    max-width: 950px;
    height: 550px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    margin: auto 0;
}

.login-left {
    width: 80%;
    background: linear-gradient(to bottom, #F2F2F2, #FEFEFE);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;

    .login-left-content {
        text-align: center;

        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            color: #1890ff;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .desc {
            color: #999;
            font-size: 14px;
            line-height: 1.8;
        }
    }
}

.login-right {
    width: 50%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .browser-tips {
        text-align: center;
        // margin-top: 30px;
        color: #909399;
        font-size: 14px;

        :deep(.el-divider__text) {
            font-size: 14px;
            color: #909399;
            white-space: nowrap;
        }

        .browser-icons {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            gap: 15px;

            img {
                width: 25px;
                height: 25px;
            }
        }
    }
}



// 响应式布局
@media screen and (max-width: 768px) {
    .login-box {
        flex-direction: column;
        height: auto;
        margin: 20px;
    }

    .login-left,
    .login-right {
        width: 100%;
        padding: 30px 20px;
    }
}
</style>