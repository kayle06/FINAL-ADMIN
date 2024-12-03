<template>
    <div class="series-list">
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="系列名称">
                    <el-input v-model="searchForm.name" placeholder="请输入系列名称" clearable />
                </el-form-item>
                <el-form-item label="制作商">
                    <el-select v-model="searchForm.producer" placeholder="请选择制作商" clearable>
                        <el-option label="制作商1" value="1" />
                        <el-option label="制作商2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card>
            <template #header>
                <div class="card-header">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon><Plus /></el-icon>新增系列
                    </el-button>
                </div>
            </template>

            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="系列名称" />
                <el-table-column prop="nameJp" label="日文名称" />
                <el-table-column prop="producer" label="制作商" width="120" />
                <el-table-column prop="count" label="视频数量" width="100" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="success" link @click="handleVideos(scope.row)">视频列表</el-button>
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

        <!-- 添加/编辑系列对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogType === 'add' ? '新增系列' : '编辑系列'"
            width="600px"
        >
            <el-form :model="seriesForm" label-width="100px">
                <el-form-item label="系列名称" required>
                    <el-input v-model="seriesForm.name" placeholder="请输入系列名称" />
                </el-form-item>
                <el-form-item label="日文名称">
                    <el-input v-model="seriesForm.nameJp" placeholder="请输入日文名称" />
                </el-form-item>
                <el-form-item label="制作商" required>
                    <el-select v-model="seriesForm.producer" placeholder="请选择制作商">
                        <el-option label="制作商1" value="1" />
                        <el-option label="制作商2" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input
                        v-model="seriesForm.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入系列描述"
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
    name: '',
    producer: ''
})

// 表格数据
const tableData = ref([
    {
        name: '系列1',
        nameJp: 'シリーズ1',
        producer: '制作商1',
        count: 10,
        createTime: '2024-01-01 12:00:00'
    }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const seriesForm = reactive({
    name: '',
    nameJp: '',
    producer: '',
    description: ''
})

// 方法
const handleSearch = () => {
    console.log('搜索', searchForm)
}

const resetSearch = () => {
    searchForm.name = ''
    searchForm.producer = ''
}

const handleAdd = () => {
    dialogType.value = 'add'
    Object.assign(seriesForm, {
        name: '',
        nameJp: '',
        producer: '',
        description: ''
    })
    dialogVisible.value = true
}

const handleEdit = (row: any) => {
    dialogType.value = 'edit'
    Object.assign(seriesForm, row)
    dialogVisible.value = true
}

const handleVideos = (row: any) => {
    console.log('查看视频列表', row)
}

const handleDelete = (row: any) => {
    console.log('删除', row)
}

const handleSubmit = () => {
    console.log('提交表单', seriesForm)
    dialogVisible.value = false
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}
</script>

<style scoped lang="scss">
.series-list {
    padding: 20px;

    .search-card {
        margin-bottom: 20px;
    }

    .card-header {
        display: flex;
        gap: 10px;
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style> 