import type { FormInstance } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

declare global {
    // Element Plus 相关类型
    type ElFormInstance = FormInstance
    
    // Element Plus Icons
    type ElementPlusIcons = typeof ElementPlusIconsVue
} 