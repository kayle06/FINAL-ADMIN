<template>
    <div class="user-container">
        <!-- 搜索区域 -->
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="用户名">
                    <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option label="启用" value="1" />
                        <el-option label="禁用" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="table-card">
            <template #header>
                <div class="card-header">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon><Plus /></el-icon>新增用户
                    </el-button>
                </div>
            </template>

            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="nickname" label="昵称" />
                <el-table-column prop="role" label="角色" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                            {{ scope.row.status === '1' ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="success" link @click="handleAssignRole(scope.row)">分配角色</el-button>
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getUserList, addUser, updateUser, deleteUser } from '@/api/user/user'

// 搜索表单
const searchForm = reactive({
    username: '',
    status: ''
})

// 表格数据
const tableData = ref([
    {
        username: 'admin',
        nickname: '管理员',
        role: '超级管理员',
        status: '1',
        createTime: '2024-01-01 12:00:00'
    }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 方法
const handleSearch = () => {
    console.log('搜索', searchForm)
}

const resetSearch = () => {
    searchForm.username = ''
    searchForm.status = ''
}

const handleAdd = () => {
    console.log('新增用户')
}

const handleEdit = (row: any) => {
    console.log('编辑用户', row)
}

const handleAssignRole = (row: any) => {
    console.log('分配角色', row)
}

const handleDelete = (row: any) => {
    console.log('删除用户', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}
</script>

<style scoped lang="scss">
.user-container {
    padding: 20px;

    .search-card {
        margin-bottom: 20px;
    }

    .table-card {
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style> 