<template>
    <div class="login-form">
        <div class="login-header">
            <h2>{{ title }}</h2>
        </div>

        <el-form ref="formRef" :model="loginForm" :rules="loginRules" size="large">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="用户名">
                    <template #prefix>
                        <el-icon>
                            <User />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" placeholder="密码" maxlength="16" show-password @keyup.enter="handleLogin">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <div class="login-extra">
                <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                <el-link type="primary" :underline="false" @click="handleForgotPassword">忘记密码了？</el-link>
            </div>

            <el-form-item>
                <el-button :loading="loading" type="primary" class="login-button" @click="handleLogin">
                    登 录
                </el-button>
            </el-form-item>
        </el-form>

        <div class="register">
            还没有帐号?
            <el-link type="primary" :underline="false" @click="handleRegister">创建新帐号</el-link>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const formRef = ref<ElFormInstance>()
const rememberMe = ref(false)

const title = import.meta.env.VITE_LOGIN_TITLE

const loginForm = reactive({
    username: '',
    password: ''
})

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
}

const handleLogin = async () => {
    if (!formRef.value) return
    try {
        loading.value = true
        await formRef.value.validate()
        // 这里添加登录逻辑
        router.push('/')
    } catch (error) {
        console.error('登录验证失败:', error)
    } finally {
        loading.value = false
    }
}

const emit = defineEmits(['switch-component'])

const handleRegister = () => {
    emit('switch-component', 'register')
}

const handleForgotPassword = () => {
    emit('switch-component', 'forgot-password')
}

</script>


<style scoped>
.login-form {
    width: 400px;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}

.login-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
        font-size: 20px;
        font-weight: 500;
    }
}

.login-button {
    width: 100%;
}

:deep(.el-input__wrapper) {
    background-color: #f5f7fa;
}

:deep(.el-input__inner) {
    height: 40px;
}

.login-extra {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 2px;
}

.login-extra {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
    gap: 10px;
}

.register {
    display: flex;
    justify-content: center;
    font-size: 14px;
    gap: 10px;
    color: #909399;
}
</style>
