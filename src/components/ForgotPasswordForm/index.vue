<template>
    <div class="forgot-password-form">
        <div class="form-header">
            <h2>{{ title }}</h2>
        </div>
        <el-form ref="formRef" :model="resetForm" :rules="resetRules" size="large">
            <el-form-item prop="email">
                <el-input v-model="resetForm.email" placeholder="请输入注册邮箱">
                    <template #prefix>
                        <el-icon><Message /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" class="submit-button" @click="handleReset">
                    发送重置邮件
                </el-button>
            </el-form-item>
        </el-form>
        <div class="form-footer">
            <el-link type="primary" :underline="false" @click="backToLogin">返回登录</el-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Message } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const title = import.meta.env.VITE_FORGOT_PASSWORD_TITLE

const emit = defineEmits(['switch-component'])

const formRef = ref<FormInstance>()
const loading = ref(false)

const resetForm = reactive({
    email: ''
})

const resetRules = {
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

const handleReset = async () => {
    if (!formRef.value) return
    try {
        loading.value = true
        await formRef.value.validate()
        // 这里添加重置密码逻辑
        console.log('重置密码表单提交', resetForm)
    } catch (error) {
        console.error('表单验证失败:', error)
    } finally {
        loading.value = false
    }
}

const backToLogin = () => {
    emit('switch-component', 'login')
}
</script>

<style scoped>
.forgot-password-form {
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
    text-align: center;
    margin-top: 20px;
}

:deep(.el-input__wrapper) {
    background-color: #f5f7fa;
}

:deep(.el-input__inner) {
    height: 40px;
}
</style> 