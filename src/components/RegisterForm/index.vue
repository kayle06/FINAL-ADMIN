<template>
    <div class="register-form">
        <div class="form-header">
            <h2>{{ title }}</h2>
        </div>
        <el-form ref="formRef" :model="registerForm" :rules="registerRules" size="large">
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="用户名">
                    <template #prefix>
                        <el-icon><User /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="registerForm.password" type="password" placeholder="密码" show-password>
                    <template #prefix>
                        <el-icon><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" show-password>
                    <template #prefix>
                        <el-icon><Lock /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" class="submit-button" @click="handleRegister">
                    注 册
                </el-button>
            </el-form-item>
        </el-form>
        <div class="form-footer">
            已有账号？
            <el-link type="primary" :underline="false" @click="backToLogin">返回登录</el-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const title = import.meta.env.VITE_REGISTER_TITLE

const emit = defineEmits(['switch-component'])

const formRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: ''
})

const validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, message: '用户名长度不能小于4位', trigger: 'blur' },
        { max: 16, message: '用户名长度不能超过16位', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        { max: 16, message: '密码长度不能超过16位', trigger: 'blur' },
        { pattern: /^\S*$/, message: '密码不能包含空格', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, validator: validatePass2, trigger: 'blur' }
    ]
}

const handleRegister = async () => {
    if (!formRef.value) return
    try {
        loading.value = true
        await formRef.value.validate()
        // 这里添加注册逻辑
        console.log('注册表单提交', registerForm)
    } catch (error) {
        console.error('注册验证失败:', error)
    } finally {
        loading.value = false
    }
}

const backToLogin = () => {
    emit('switch-component', 'login')
}
</script>

<style scoped>
.register-form {
    width: 400px;
    padding: 20px;
}

.form-header {
    text-align: center;
    margin-bottom: 30px;
}

.form-header h2 {
    font-size: 20px;
    font-weight: 500;
}

.submit-button {
    width: 100%;
}

.form-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #909399;
}

:deep(.el-input__wrapper) {
    background-color: #f5f7fa;
}

:deep(.el-input__inner) {
    height: 40px;
}
</style>