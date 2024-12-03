<template>
    <div class="actress-list">
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="left">
                        <el-input
                            v-model="searchForm.keyword"
                            placeholder="请输入艺名或中文名搜索"
                            clearable
                            @keyup.enter="handleSearch"
                            class="search-input"
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                        <el-button type="primary" @click="handleSearch">
                            <el-icon><Search /></el-icon>搜索
                        </el-button>
                        <el-button @click="resetSearch">
                            <el-icon><Refresh /></el-icon>重置
                        </el-button>
                    </div>
                    <div class="right">
                        <el-button type="primary" @click="handleAdd">
                            <el-icon><Plus /></el-icon>新增女优
                        </el-button>
                    </div>
                </div>
            </template>

            <el-table 
                :data="tableData" 
                border 
                style="width: 100%"
                v-loading="loading"
            >
                <el-table-column type="index" label="序号" width="80" align="center" />
                <el-table-column label="头像" width="100" align="center">
                    <template #default="scope">
                        <el-avatar :size="60" :src="scope.row.avatarUrl" />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="艺名" width="150" />
                <el-table-column prop="nameCn" label="中文名" width="150" />
                <el-table-column prop="works" label="作品数" width="100" align="center" />
                <el-table-column prop="remark" label="描述" min-width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="success" link @click="handleWorks(scope.row)">作品</el-button>
                        <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 50]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>

        <!-- 添加/编辑对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogType === 'add' ? '新增女优' : '编辑女优'"
            width="600px"
        >
            <el-form :model="actressForm" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="艺名" prop="name">
                    <el-input v-model="actressForm.name" placeholder="请输入艺名（日文名）" />
                </el-form-item>
                <el-form-item label="中文名" prop="nameCn">
                    <el-input v-model="actressForm.nameCn" placeholder="请输入中文名" />
                </el-form-item>
                <el-form-item label="头像链接" prop="avatarUrl">
                    <div class="avatar-input">
                        <el-input 
                            v-model="actressForm.avatarUrl" 
                            placeholder="请输入头像图片链接"
                            clearable
                        >
                            <template #append>
                                <el-button @click="previewAvatar">预览</el-button>
                            </template>
                        </el-input>
                    </div>
                    <div class="avatar-preview" v-if="actressForm.avatarUrl">
                        <el-image
                            :src="actressForm.avatarUrl"
                            :preview-src-list="[actressForm.avatarUrl]"
                            fit="cover"
                            class="avatar-image"
                            @error="handleImageError"
                        >
                            <template #error>
                                <div class="image-error">
                                    <el-icon><Picture-Failed /></el-icon>
                                    <span>加载失败</span>
                                </div>
                            </template>
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input
                        v-model="actressForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入描述信息"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 图片预览对话框 -->
        <el-dialog v-model="previewVisible" title="头像预览" width="400px" append-to-body>
            <div class="preview-container">
                <el-image
                    :src="actressForm.avatarUrl"
                    fit="contain"
                    class="preview-image"
                    @error="handleImageError"
                >
                    <template #error>
                        <div class="image-error">
                            <el-icon><Picture-Failed /></el-icon>
                            <span>图片加载失败</span>
                        </div>
                    </template>
                </el-image>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActressList, addActress, updateActress, deleteActress, type Actress } from '@/api/video/actress'

// 表格数据
const tableData = ref<Actress[]>([])
const loading = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 表单对象
const formRef = ref<FormInstance>()
const actressForm = reactive<Actress>({
    id: undefined,
    name: '',
    nameCn: '',
    avatarUrl: '',
    remark: ''
})

// 表单验证规则
const formRules: FormRules = {
    name: [
        { required: true, message: '请输入艺名', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    nameCn: [
        { required: true, message: '请输入中文名', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    avatarUrl: [
        { required: true, message: '请输入头像链接', trigger: 'blur' },
        { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
    ]
}

// 图片预览
const previewVisible = ref(false)
const previewAvatar = () => {
    if (!actressForm.avatarUrl) {
        ElMessage.warning('请先输入图片链接')
        return
    }
    previewVisible.value = true
}

// 处理图片加载错误
const handleImageError = () => {
    ElMessage.error('图片加载失败，请检查链接是否有效')
}

// 搜索表单
const searchForm = reactive({
    keyword: ''
})

// 获取列表数据
const getList = async () => {
    try {
        loading.value = true
        const params = {
            page: currentPage.value,
            size: pageSize.value,
            keyword: searchForm.keyword || undefined
        }
        const res = await getActressList(params)
        tableData.value = res.data.records
        total.value = res.data.total
    } catch (error) {
        console.error('获取列表失败:', error)
        ElMessage.error('获取列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索方法
const handleSearch = () => {
    currentPage.value = 1 // 重置到第一页
    getList()
}

// 重置搜索
const resetSearch = () => {
    searchForm.keyword = ''
    handleSearch()
}

// 方法
const handleAdd = () => {
    dialogType.value = 'add'
    resetForm()
    dialogVisible.value = true
}

const handleEdit = (row: Actress) => {
    dialogType.value = 'edit'
    const { id, name, nameCn, avatarUrl, remark } = row
    Object.assign(actressForm, {
        id,
        name,
        nameCn,
        avatarUrl,
        remark
    })
    dialogVisible.value = true
}

const handleWorks = (row: Actress) => {
    console.log('查看作品', row)
}

const handleDelete = async (row: Actress) => {
    try {
        await ElMessageBox.confirm('确认删除该女优信息吗？', '提示', {
            type: 'warning'
        })
        await deleteActress(row.id!)
        ElMessage.success('删除成功')
        getList() // 刷新列表
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
        const submitData = {
            name: actressForm.name,
            nameCn: actressForm.nameCn,
            avatarUrl: actressForm.avatarUrl,
            remark: actressForm.remark
        }
        
        if (dialogType.value === 'add') {
            await addActress(submitData)
            ElMessage.success('添加成功')
        } else {
            if (!actressForm.id) {
                ElMessage.error('编辑失败：缺少ID')
                return
            }
            await updateActress(actressForm.id, submitData)
            ElMessage.success('修改成功')
        }
        
        dialogVisible.value = false
        getList() // 刷新列表
    } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
    }
}

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    actressForm.id = undefined
    actressForm.name = ''
    actressForm.nameCn = ''
    actressForm.avatarUrl = ''
    actressForm.remark = ''
}

// 页面加载时获取数据
onMounted(() => {
    getList()
})

// 分页方法
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    getList()
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getList()
}
</script>

<style scoped lang="scss">
.actress-list {
    padding: 20px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;
            gap: 12px;

            .search-input {
                width: 300px;

                :deep(.el-input__wrapper) {
                    background-color: var(--el-fill-color-blank);
                }

                :deep(.el-input__prefix) {
                    color: var(--el-text-color-secondary);
                }
            }
        }

        .right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    :deep(.el-table) {
        .el-table__fixed-right {
            height: 100% !important;
        }
    }

    .avatar-input {
        width: 100%;
        margin-bottom: 10px;
    }

    .avatar-preview {
        width: 120px;
        height: 120px;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        overflow: hidden;

        .avatar-image {
            width: 100%;
            height: 100%;
        }
    }

    .preview-container {
        display: flex;
        justify-content: center;
        align-items: center;
        
        .preview-image {
            max-width: 100%;
            max-height: 400px;
        }
    }

    .image-error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #909399;
        font-size: 14px;
        height: 100%;

        .el-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
    }
}

.dialog-footer {
    padding-top: 20px;
    text-align: right;
}
</style> 