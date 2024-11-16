<template>
    <div class="copyright">
        <p class="copyright-text">
            Copyright © {{ currentYear }} 
            <a href="https://github.com" target="_blank" rel="noopener">
                {{ appName }}
            </a>
        </p>
        <p class="copyright-links">
            <a href="https://github.com" target="_blank" rel="noopener">帮助文档</a>
            <el-divider direction="vertical" />
            <a href="https://github.com" target="_blank" rel="noopener">隐私政策</a>
            <el-divider direction="vertical" />
            <a href="https://github.com" target="_blank" rel="noopener">条款声明</a>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = import.meta.env.VITE_APP_TITLE
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
.copyright {
    text-align: center;
    padding: 20px 0;
    color: #909399;
    font-size: 14px;

    .copyright-text {
        margin-bottom: 8px;
        
        a {
            color: #909399;
            text-decoration: none;
            
            &:hover {
                color: #409EFF;
            }
        }
    }
    
    .copyright-links {
        a {
            color: #909399;
            text-decoration: none;
            transition: color 0.4s ease;
            
            &:hover {
                color: #409EFF;
            }
        }
        
        :deep(.el-divider) {
            margin: 0 10px;
            background-color: #909399;
        }
    }
}
</style> 