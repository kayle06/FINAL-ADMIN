<template>
    <div class="tag-list">
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="left">
                        <el-input
                            v-model="searchForm.keyword"
                            placeholder="请输入标签名称搜索"
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
                            <el-icon><Plus /></el-icon>新增标签
                        </el-button>
                    </div>
                </div>
            </template>

            <el-table 
                :data="tableData" 
                border 
                row-key="id"
                :tree-props="{ children: 'children' }"
                style="width: 100%" 
                v-loading="loading"
                @sort-change="handleSortChange"
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
                    label="标签名称" 
                    min-width="180"
                    show-overflow-tooltip
                >
                    <template #default="{ row }">
                        <span :style="{ paddingLeft: row.parentId ? '0' : '0' }">
                            {{ row.name }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="sort" 
                    label="排序" 
                    width="80" 
                    align="center"
                    sortable="custom"
                    :sort-orders="['ascending', 'descending']"
                    :default-sort="{ prop: 'sort', order: 'ascending' }"
                />
                <el-table-column 
                    label="操作" 
                    width="180" 
                    fixed="right" 
                    align="center"
                >
                    <template #default="scope">
                        <el-button 
                            v-if="!scope.row.parentId"
                            type="primary" 
                            link 
                            @click="handleAddChild(scope.row)"
                        >
                            添加子标签
                        </el-button>
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
            :title="getDialogTitle"
            width="500px"
        >
            <el-form :model="tagForm" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="标签类型" v-if="dialogType === 'add'">
                    <el-radio-group v-model="tagType" @change="handleTagTypeChange">
                        <el-radio label="parent">父标签</el-radio>
                        <el-radio label="child">子标签</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item 
                    label="父级标签" 
                    prop="parentId"
                    v-if="tagType === 'child' || (dialogType === 'edit' && tagForm.parentId)"
                >
                    <el-select
                        v-model="tagForm.parentId"
                        placeholder="请选择父级标签"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="tag in parentTags"
                            :key="tag.id"
                            :label="tag.name"
                            :value="tag.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="tagForm.sort" :min="0" :max="999" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createTag, updateTag, deleteTag, listTags, listAllTags, type Tag } from '@/api/video/tag'

// 搜索表单
const searchForm = reactive({
    keyword: ''
})

// 表格数据
const tableData = ref<Tag[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 标签选项（用于级联选择器）
const tagOptions = ref<Tag[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentParent = ref<Tag | null>(null)
const formRef = ref<FormInstance>()
const tagForm = reactive<Tag>({
    id: undefined,
    name: '',
    parentId: null,
    sort: 0
})

// 父标签列表
const parentTags = ref<Tag[]>([])
const tagType = ref<'parent' | 'child'>('parent')

// 排序参数
const sortParams = reactive({
    prop: 'sort',
    order: 'ascending'
})

// 获取所有父标签
const getParentTags = async () => {
    try {
        const res = await listAllTags()
        // 只显示父标签
        parentTags.value = res.data.filter(tag => !tag.parentId)
    } catch (error) {
        console.error('获取父标签失败:', error)
        ElMessage.error('获取父标签列表失败')
    }
}

// 处理标签类型变化
const handleTagTypeChange = (value: 'parent' | 'child') => {
    tagForm.parentId = null
    if (value === 'child') {
        getParentTags()
    }
}

// 计算对话框标题
const getDialogTitle = computed(() => {
    if (dialogType.value === 'add') {
        return tagType.value === 'parent' ? '新增父标签' : '新增子标签'
    }
    return '编辑标签'
})

// 表单验证规则
const formRules: FormRules = {
    name: [
        { required: true, message: '请输入标签名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    parentId: [
        { 
            required: true, 
            message: '请选择父级标签', 
            trigger: 'change',
            validator: (rule, value, callback) => {
                if (tagType.value === 'child' && !value) {
                    callback(new Error('请选择父级标签'))
                } else {
                    callback()
                }
            }
        }
    ]
}

// 获取所有标签（用于级联选择器）
const getAllTags = async () => {
    try {
        const res = await listAllTags()
        tagOptions.value = res.data
    } catch (error) {
        console.error('获取标签列表失败:', error)
    }
}

// 获取列表数据
const getList = async () => {
    try {
        loading.value = true
        const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            keyword: searchForm.keyword || undefined,
            orderBy: sortParams.prop,
            order: sortParams.order === 'ascending' ? 'asc' : 'desc'
        }
        const res = await listTags(params)
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
    tagType.value = 'parent'
    tagForm.id = undefined
    tagForm.name = ''
    tagForm.parentId = null
    tagForm.sort = 0
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Tag) => {
    dialogType.value = 'edit'
    Object.assign(tagForm, row)
    // 如果是子标签，需要加载父标签列表
    if (row.parentId) {
        getParentTags()
    }
    dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Tag) => {
    try {
        await ElMessageBox.confirm(
            row.children?.length 
                ? '该标签包含子标签，确认删除吗？' 
                : '确认删除该标签吗？', 
            '提示',
            { type: 'warning' }
        )
        await deleteTag(row.id!)
        ElMessage.success('删除成功')
        getList()
        getAllTags() // 刷新标签选项
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
            ...tagForm,
            parentId: tagType.value === 'parent' ? null : tagForm.parentId
        }
        
        if (dialogType.value === 'add') {
            await createTag(submitData)
            ElMessage.success('添加成功')
        } else {
            await updateTag(tagForm.id!, submitData)
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

// 添加子标签
const handleAddChild = (parentRow: Tag) => {
    dialogType.value = 'add'
    tagType.value = 'child'
    tagForm.id = undefined
    tagForm.name = ''
    tagForm.parentId = parentRow.id
    tagForm.sort = 0
    // 确保父标签列表已加载
    getParentTags().then(() => {
        dialogVisible.value = true
    })
}

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string, order: string }) => {
    sortParams.prop = prop
    sortParams.order = order || 'ascending'
    getList()
}

// 检查标签是否已有子标签
const hasChildren = (row: Tag) => {
    return row.children && row.children.length > 0
}

onMounted(() => {
    getList()
    getAllTags()
})
</script>

<style scoped lang="scss">
.tag-list {
    padding: 20px;

    :deep(.el-table) {
        // 设置表格行高
        .el-table__row {
            height: 50px;
        }

        // 调整树形图标的样式
        .el-table__expand-icon {
            margin-right: 8px;
            
            .el-icon {
                font-size: 14px;
            }
        }

        // 优化标签名称的显示
        .cell {
            display: flex;
            align-items: center;
        }

        // 添加禁用按钮的样式
        .el-button.is-disabled {
            color: #909399;
            cursor: not-allowed;
            
            &:hover {
                color: #909399;
            }
        }
    }

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