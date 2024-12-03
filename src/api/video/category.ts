import request from '@/utils/request'

export interface Category {
    id?: number
    name: string
    sort?: number
}

export interface CategoryQueryDTO {
    keyword?: string
}

// 创建分类
export function createCategory(data: Category) {
    return request({
        url: '/categories',
        method: 'post',
        data
    })
}

// 更新分类
export function updateCategory(id: number, data: Category) {
    return request({
        url: `/categories/${id}`,
        method: 'put',
        data
    })
}

// 删除分类
export function deleteCategory(id: number) {
    return request({
        url: `/categories/${id}`,
        method: 'delete'
    })
}

// 获取分类详情
export function getCategory(id: number) {
    return request({
        url: `/categories/${id}`,
        method: 'get'
    })
}

// 分页查询分类列表
export function listCategories(params: {
    pageNum: number
    pageSize: number
    keyword?: string
}) {
    return request({
        url: '/categories',
        method: 'get',
        params
    })
}

// 获取所有分类
export function listAllCategories() {
    return request({
        url: '/categories/all',
        method: 'get'
    })
} 