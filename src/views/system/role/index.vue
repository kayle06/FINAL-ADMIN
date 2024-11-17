<template>
    <div class="role-container">
        <!-- 搜索区域 -->
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="角色名称">
                    <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
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
                        <el-icon><Plus /></el-icon>新增角色
                    </el-button>
                </div>
            </template>

            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="roleName" label="角色名称" />
                <el-table-column prop="roleKey" label="角色标识" />
                <el-table-column prop="sort" label="排序" width="80" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                            {{ scope.row.status === '1' ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="success" link @click="handlePermission(scope.row)">权限分配</el-button>
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

// 搜索表单
const searchForm = reactive({
    roleName: '',
    status: ''
})

// 表格数据
const tableData = ref([
    {
        roleName: '超级管理员',
        roleKey: 'admin',
        sort: 1,
        status: '1',
        remark: '系统最高权限',
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
    searchForm.roleName = ''
    searchForm.status = ''
}

const handleAdd = () => {
    console.log('新增角色')
}

const handleEdit = (row: any) => {
    console.log('编辑角色', row)
}

const handlePermission = (row: any) => {
    console.log('分配权限', row)
}

const handleDelete = (row: any) => {
    console.log('删除角色', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}
</script>

<style scoped lang="scss">
.role-container {
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