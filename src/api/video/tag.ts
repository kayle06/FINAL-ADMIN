import request from '@/utils/request'

export interface Tag {
    id?: number
    name: string
    parentId?: number | null
    sort?: number
    children?: Tag[]  // 用于树形结构
}

export interface TagQueryDTO {
    keyword?: string
}

// 创建标签
export function createTag(data: Tag) {
    return request({
        url: '/tags',
        method: 'post',
        data
    })
}

// 更新标签
export function updateTag(id: number, data: Tag) {
    return request({
        url: `/tags/${id}`,
        method: 'put',
        data
    })
}

// 删除标签
export function deleteTag(id: number) {
    return request({
        url: `/tags/${id}`,
        method: 'delete'
    })
}

// 获取标签详情
export function getTag(id: number) {
    return request({
        url: `/tags/${id}`,
        method: 'get'
    })
}

// 分页查询标签列表
export function listTags(params: {
    pageNum: number
    pageSize: number
    keyword?: string
}) {
    return request({
        url: '/tags',
        method: 'get',
        params
    })
}

// 获取所有标签
export function listAllTags() {
    return request({
        url: '/tags/all',
        method: 'get'
    })
} 