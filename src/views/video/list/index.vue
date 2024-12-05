<template>
    <div class="video-list">
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="left">
                        <el-input
                            v-model="searchForm.keyword"
                            placeholder="请输入视频标题或番号搜索"
                            clearable
                            @keyup.enter="handleSearch"
                            class="search-input"
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                        <el-select
                            v-model="searchForm.categoryId"
                            placeholder="请选择分类"
                            clearable
                            class="filter-select"
                        >
                            <el-option
                                v-for="item in categoryOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                        <el-button type="primary" @click="handleSearch">
                            <el-icon><Search /></el-icon>搜索
                        </el-button>
                        <el-button @click="resetSearch">
                            <el-icon><Refresh /></el-icon>重置
                        </el-button>
                    </div>
                    <div class="right">
                        <el-button type="primary" @click="handleAdd">
                            <el-icon><Plus /></el-icon>新增视频
                        </el-button>
                        <el-button type="success" @click="handleBatchAdd">
                            <el-icon><Plus /></el-icon>批量新增
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
                    label="封面" 
                    width="160" 
                    align="center"
                >
                    <template #default="{ row }">
                        <el-image 
                            :src="row.coverUrl" 
                            :preview-src-list="[row.coverUrl]"
                            fit="contain"
                            style="width: 100px; height: 150px"
                            :preview-teleported="true"
                        >
                            <template #error>
                                <div class="image-error">
                                    <el-icon><Picture-Failed /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="code" 
                    label="番号" 
                    width="120"
                />
                <el-table-column 
                    prop="title" 
                    label="标题" 
                    min-width="200"
                    show-overflow-tooltip
                />
                <el-table-column 
                    label="女优" 
                    width="200"
                    show-overflow-tooltip
                >
                    <template #default="{ row }">
                        <el-tag 
                            v-for="actress in row.actresses" 
                            :key="actress.id"
                            size="small"
                            class="tag-item"
                        >
                            {{ actress.nameCn }}
                        </el-tag>
                        <span v-if="!row.actresses?.length">-</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="标签" 
                    width="200"
                    show-overflow-tooltip
                >
                    <template #default="{ row }">
                        <el-tag 
                            v-for="tag in row.tags" 
                            :key="tag.id"
                            type="info"
                            size="small"
                            class="tag-item"
                        >
                            {{ tag.name }}
                        </el-tag>
                        <span v-if="!row.tags?.length">-</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="观看状态" 
                    width="100"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-tag :type="row.watchStatus === 1 ? 'success' : 'info'">
                            {{ row.watchStatus === 1 ? '已看' : '未看' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="评分" 
                    width="80"
                    align="center"
                >
                    <template #default="{ row }">
                        <span class="rating-value">{{ row.rating || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="180" 
                    fixed="right" 
                    align="center"
                >
                    <template #default="scope">
                        <el-button 
                            type="success" 
                            link 
                            @click="handleDetail(scope.row)"
                        >
                            详情
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
            :title="dialogType === 'add' ? '新增视频' : '编辑视频'"
            width="700px"
            :top="'50px'"
            :destroy-on-close="true"
            :close-on-click-modal="false"
        >
            <el-scrollbar height="calc(100vh - 300px)">
                <el-form 
                    :model="videoForm" 
                    :rules="formRules" 
                    ref="formRef" 
                    label-width="100px"
                    class="dialog-form"
                >
                    <el-form-item label="番号" prop="code">
                        <el-input v-model="videoForm.code" placeholder="请输入番号">
                            <template #append>
                                <el-button @click="handleFetch">获取信息</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="videoForm.title" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="封面" prop="coverUrl">
                        <el-input v-model="videoForm.coverUrl" placeholder="请输入封面图片链接" />
                        <div class="cover-preview" v-if="videoForm.coverUrl">
                            <el-image
                                :src="videoForm.coverUrl"
                                fit="cover"
                                style="width: 80px; height: 120px"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="分类" prop="categoryId">
                        <el-select v-model="videoForm.categoryId" placeholder="请选择分类">
                            <el-option
                                v-for="item in categoryOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="系列" prop="seriesId">
                        <el-select v-model="videoForm.seriesId" placeholder="请选择系列" clearable>
                            <el-option
                                v-for="item in seriesOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签" prop="tagIds">
                        <el-select
                            v-model="videoForm.tagIds"
                            multiple
                            filterable
                            collapse-tags
                            collapse-tags-tooltip
                            placeholder="请选择标签"
                        >
                            <el-option
                                v-for="item in tagOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="女优" prop="actressIds">
                        <el-select
                            v-model="videoForm.actressIds"
                            multiple
                            filterable
                            collapse-tags
                            collapse-tags-tooltip
                            placeholder="请选择女优"
                        >
                            <el-option
                                v-for="item in actressOptions"
                                :key="item.id"
                                :label="item.nameCn"
                                :value="item.id"
                            >
                                <span>{{ item.nameCn }}</span>
                                <span class="actress-name-jp">({{ item.name }})</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发行日期" prop="releaseDate">
                        <el-date-picker
                            v-model="videoForm.releaseDate"
                            type="date"
                            placeholder="请选择发行日期"
                        />
                    </el-form-item>
                    <el-form-item label="观看状态" prop="watchStatus">
                        <el-radio-group v-model="videoForm.watchStatus">
                            <el-radio :label="1">已看</el-radio>
                            <el-radio :label="0">未看</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="评分" prop="rating">
                        <el-rate
                            v-model="videoForm.rating"
                            :max="10"
                            :allow-half="true"
                            :texts="['极差', '失望', '较差', '一般', '尚可', '满意', '推荐', '很棒', '精彩', '完美']"
                            show-text
                        />
                    </el-form-item>
                    <el-form-item label="时长" prop="duration">
                        <el-input 
                            v-model="videoForm.duration" 
                            placeholder="请输入视频时长（分钟）"
                        >
                            <template #append>分钟</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            v-model="videoForm.remark"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入备注信息"
                        />
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 详情对话框 -->
        <el-dialog
            v-model="detailVisible"
            title="视频详情"
            width="800px"
            :top="'50px'"
            :destroy-on-close="true"
        >
            <el-scrollbar height="calc(100vh - 300px)">
                <div class="video-detail">
                    <div class="detail-header">
                        <div class="cover">
                            <el-image
                                :src="detailData.coverUrl"
                                fit="contain"
                                :preview-src-list="[detailData.coverUrl]"
                                :preview-teleported="true"
                                class="cover-image"
                            >
                                <template #error>
                                    <div class="image-error">
                                        <el-icon><Picture-Failed /></el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                        <div class="info">
                            <h2 class="title">{{ detailData.title }}</h2>
                            <div class="meta">
                                <div class="meta-item">
                                    <span class="label">番号：</span>
                                    <span class="value">{{ detailData.code }}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="label">时长：</span>
                                    <span class="value">{{ detailData.duration }}分钟</span>
                                </div>
                                <div class="meta-item">
                                    <span class="label">发行日期：</span>
                                    <span class="value">{{ detailData.releaseDate }}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="label">观看状态：</span>
                                    <el-tag :type="detailData.watchStatus === 1 ? 'success' : 'info'">
                                        {{ detailData.watchStatus === 1 ? '已看' : '未看' }}
                                    </el-tag>
                                </div>
                                <div class="meta-item">
                                    <span class="label">评分：</span>
                                    <el-rate
                                        v-model="detailData.rating"
                                        :max="10"
                                        disabled
                                        show-score
                                        text-color="#ff9900"
                                        score-template="{value}"
                                    />
                                </div>
                            </div>
                            <div class="actresses" v-if="detailData.actresses?.length">
                                <span class="label">女优：</span>
                                <el-tag
                                    v-for="actress in detailData.actresses"
                                    :key="actress.id"
                                    class="tag-item"
                                >
                                    {{ actress.nameCn }}({{ actress.name }})
                                </el-tag>
                            </div>
                            <div class="tags" v-if="detailData.tags?.length">
                                <span class="label">标签：</span>
                                <el-tag
                                    v-for="tag in detailData.tags"
                                    :key="tag.id"
                                    type="info"
                                    class="tag-item"
                                >
                                    {{ tag.name }}
                                </el-tag>
                            </div>
                            <div class="remark" v-if="detailData.remark">
                                <span class="label">备注：</span>
                                <p class="value">{{ detailData.remark }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </el-dialog>

        <!-- 批量新增对话框 -->
        <el-dialog
            v-model="batchDialogVisible"
            title="批量新增视频"
            width="500px"
        >
            <el-form>
                <el-form-item label="番号列表">
                    <el-input
                        v-model="batchCodes"
                        type="textarea"
                        :rows="10"
                        placeholder="请输入番号列表，每行一个番号"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="batchDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleBatchSubmit" :loading="batchLoading">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createVideo, updateVideo, deleteVideo, listVideos, fetchVideoInfo, type Video } from '@/api/video'
import { listAllCategories, type Category } from '@/api/video/category'
import { listAllTags, type Tag } from '@/api/video/tag'
import { listAllActresses, type Actress } from '@/api/video/actress'

// 搜索表单
const searchForm = reactive({
    keyword: '',
    categoryId: undefined as number | undefined
})

// 表格数据
const tableData = ref<Video[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 分类选项
const categoryOptions = ref<Category[]>([])

// 标签选项
const tagOptions = ref<Tag[]>([])

// 系列选项
const seriesOptions = ref([])

// 女优选项
const actressOptions = ref<Actress[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const videoForm = reactive<Video>({
    id: undefined,
    title: '',
    code: '',
    duration: '',
    coverUrl: '',
    releaseDate: '',
    categoryId: undefined,
    seriesId: undefined,
    actressIds: [],
    watchStatus: 1,
    rating: 0,
    tagIds: [],
    remark: ''
})

// 表单验证规则
const formRules: FormRules = {
    code: [
        { required: true, message: '请输入番号', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'change' }
    ],
    duration: [
        { pattern: /^\d+$/, message: '请输入正确的时长（分钟）', trigger: 'blur' }
    ]
}

// 详情对话框
const detailVisible = ref(false)
const detailData = ref<Video>({} as Video)

// 批量新增相关
const batchDialogVisible = ref(false)
const batchCodes = ref('')
const batchLoading = ref(false)

// 打开批量新增对话框
const handleBatchAdd = () => {
    batchDialogVisible.value = true
    batchCodes.value = ''
}

// 处理批量提交
const handleBatchSubmit = async () => {
    if (!batchCodes.value.trim()) {
        ElMessage.warning('请输入番号列表')
        return
    }

    try {
        batchLoading.value = true
        // 将输入的文本分割成番号数组
        const codes = batchCodes.value
            .split('\n')
            .map(code => code.trim())
            .filter(code => code) // 过滤空行

        // 批量获取视频信息
        const promises = codes.map(async (code) => {
            try {
                const res = await fetchVideoInfo(code)
                // 设置为未观看状态
                return {
                    ...res.data,
                    watchStatus: 0
                }
            } catch (error) {
                console.error(`获取视频 ${code} 信息失败:`, error)
                return null
            }
        })

        const results = await Promise.all(promises)
        const successVideos = results.filter(video => video !== null)

        // 批量创建视频
        const createPromises = successVideos.map(video => createVideo(video))
        await Promise.all(createPromises)

        ElMessage.success(`成功添加 ${successVideos.length} 个视频`)
        batchDialogVisible.value = false
        getList() // 刷新列表
    } catch (error) {
        console.error('批量添加失败:', error)
        ElMessage.error('批量添加失败')
    } finally {
        batchLoading.value = false
    }
}

// 获取分类列表
const getCategories = async () => {
    try {
        const res = await listAllCategories()
        categoryOptions.value = res.data
    } catch (error) {
        console.error('获取分类列表失败:', error)
    }
}

// 获取标签列表
const getTags = async () => {
    try {
        const res = await listAllTags()
        tagOptions.value = res.data.filter((tag: { parentId: number | null }) => tag.parentId !== null)
    } catch (error) {
        console.error('获取标签列表失败:', error)
    }
}

// 获取女优列表
const getActresses = async () => {
    try {
        const res = await listAllActresses()
        actressOptions.value = res.data
    } catch (error) {
        console.error('获取女优列表失败:', error)
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
            categoryId: searchForm.categoryId
        }
        const res = await listVideos(params)
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
    searchForm.categoryId = undefined
    handleSearch()
}

// 新增
const handleAdd = () => {
    dialogType.value = 'add'
    initForm()
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Video) => {
    dialogType.value = 'edit'
    Object.assign(videoForm, {
        id: row.id,
        title: row.title,
        code: row.code,
        duration: row.duration,
        coverUrl: row.coverUrl,
        releaseDate: row.releaseDate,
        categoryId: row.categoryId,
        seriesId: row.seriesId,
        watchStatus: row.watchStatus,
        rating: row.rating,
        remark: row.remark,
        actressIds: row.actresses?.map(item => item.id) || [],
        tagIds: row.tags?.map(item => item.id) || []
    })
    dialogVisible.value = true
}

// 详情
const handleDetail = (row: Video) => {
    detailData.value = { ...row }
    detailVisible.value = true
}

// 删除
const handleDelete = async (row: Video) => {
    try {
        await ElMessageBox.confirm('确认删除该视频吗？', '提示', {
            type: 'warning'
        })
        await deleteVideo(row.id!)
        ElMessage.success('删除成功')
        getList()
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 获取视频信息
const handleFetch = async () => {
    if (!videoForm.code) {
        ElMessage.warning('请先输入番号')
        return
    }
    try {
        const res = await fetchVideoInfo(videoForm.code)
        Object.assign(videoForm, res.data)
    } catch (error) {
        console.error('获取视频信息失败:', error)
        ElMessage.error('获取视频信息失败')
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
        if (dialogType.value === 'add') {
            await createVideo(videoForm)
            ElMessage.success('添加成功')
            dialogVisible.value = false
            getList()
        } else {
            await updateVideo(videoForm.id!, videoForm)
            ElMessage.success('修改成功')
            dialogVisible.value = false
            getList()
        }
    } catch (error) {
        console.error('提交失败:', error)
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

// 初始化表单
const initForm = () => {
    Object.assign(videoForm, {
        id: undefined,
        title: '',
        code: '',
        duration: '',
        coverUrl: '',
        releaseDate: '',
        categoryId: undefined,
        seriesId: undefined,
        actressIds: [],
        watchStatus: 1,
        rating: 0,
        tagIds: [],
        remark: ''
    })
}

onMounted(() => {
    getCategories()
    getTags()
    getActresses()
    getList()
})
</script>

<style scoped lang="scss">
.video-list {
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
            }

            .filter-select {
                width: 200px;
            }
        }

        .right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }

    .image-error {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);

        .el-icon {
            font-size: 24px;
        }
    }

    .cover-preview {
        margin-top: 8px;
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    .tag-item {
        margin-right: 4px;
        margin-bottom: 4px;
    }

    :deep(.el-rate) {
        display: inline-flex;
        
        .el-rate__text {
            color: #ff9900;
        }
    }

    .dialog-form {
        padding: 20px 20px 0;
    }

    :deep(.el-dialog) {
        margin-top: 8vh !important;
        
        .el-dialog__body {
            padding: 0;
        }
        
        .el-dialog__footer {
            padding: 20px;
            border-top: 1px solid var(--el-border-color-lighter);
        }
    }

    .video-detail {
        padding: 20px;

        .detail-header {
            display: flex;
            gap: 24px;

            .cover {
                width: 240px;
                flex-shrink: 0;

                .cover-image {
                    width: 100%;
                    height: 360px;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                    :deep(.el-image__inner) {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
            }

            .info {
                flex: 1;
                min-width: 0;

                .title {
                    margin: 0 0 20px;
                    font-size: 20px;
                    line-height: 1.4;
                    color: var(--el-text-color-primary);
                    word-break: break-all;
                }

                .meta {
                    margin-bottom: 16px;

                    .meta-item {
                        margin-bottom: 8px;
                        line-height: 24px;

                        .label {
                            color: var(--el-text-color-secondary);
                            margin-right: 8px;
                        }
                    }
                }

                .actresses,
                .tags {
                    margin-bottom: 16px;

                    .label {
                        color: var(--el-text-color-secondary);
                        margin-right: 8px;
                    }

                    .tag-item {
                        margin-right: 8px;
                        margin-bottom: 8px;
                    }
                }

                .remark {
                    .label {
                        color: var(--el-text-color-secondary);
                        margin-right: 8px;
                    }

                    .value {
                        margin: 8px 0 0;
                        line-height: 1.6;
                        white-space: pre-wrap;
                    }
                }
            }
        }
    }

    .rating-value {
        font-weight: 500;
        color: #ff9900;
    }
}

.actress-name-jp {
    color: #909399;
    font-size: 13px;
    margin-left: 8px;
}
</style> 