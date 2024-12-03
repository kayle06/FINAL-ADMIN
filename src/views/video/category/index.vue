<template>
    <div class="category-list">
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="left">
                        <el-input
                            v-model="searchForm.keyword"
                            placeholder="请输入分类名称搜索"
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
                            <el-icon><Plus /></el-icon>新增分类
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
                <el-table-column 
                    type="index" 
                    label="序号" 
                    width="60" 
                    align="center"
                    fixed="left"
                />
                <el-table-column 
                    prop="name" 
                    label="分类名称" 
                    min-width="180"
                    show-overflow-tooltip
                />
                <el-table-column 
                    label="操作" 
                    width="150" 
                    fixed="right" 
                    align="center"
                >
                    <template #default="scope">
                        <el-button 
                            type="primary" 
                            link 
                            @click="handleEdit(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-button 
                            type="danger" 
                            link 
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
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
            :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
            width="500px"
        >
            <el-form :model="categoryForm" :rules="formRules" ref="formRef" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCategory, updateCategory, deleteCategory, listCategories, type Category } from '@/api/video/category'

// 搜索表单
const searchForm = reactive({
    keyword: ''
})

// 表格数据
const tableData = ref<Category[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const categoryForm = reactive<Category>({
    id: undefined,
    name: ''
})

// 表单验证规则
const formRules: FormRules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ]
}

// 获取列表数据
const getList = async () => {
    try {
        loading.value = true
        const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchForm.keyword || undefined
        }
        const res = await listCategories(params)
        tableData.value = res.data.records
        total.value = res.data.total
    } catch (error) {
        console.error('获取列表失败:', error)
        ElMessage.error('获取列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    currentPage.value = 1
    getList()
}

// 重置搜索
const resetSearch = () => {
    searchForm.keyword = ''
    handleSearch()
}

// 新增
const handleAdd = () => {
    dialogType.value = 'add'
    categoryForm.id = undefined
    categoryForm.name = ''
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Category) => {
    dialogType.value = 'edit'
    Object.assign(categoryForm, row)
    dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Category) => {
    try {
        await ElMessageBox.confirm('确认删除该分类吗？', '提示', {
            type: 'warning'
        })
        await deleteCategory(row.id!)
        ElMessage.success('删除成功')
        getList()
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
        if (dialogType.value === 'add') {
            await createCategory(categoryForm)
            ElMessage.success('添加成功')
        } else {
            await updateCategory(categoryForm.id!, categoryForm)
            ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getList()
    } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
    }
}

// 分页
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    getList()
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getList()
}

onMounted(() => {
    getList()
})
</script>

<style scoped lang="scss">
.category-list {
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
}
</style> 