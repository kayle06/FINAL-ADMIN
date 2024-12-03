import request from '@/utils/request'

export interface Actress {
    id?: number
    name: string
    nameCn: string
    avatarUrl: string
    remark?: string
    works?: number
}

// 获取女优列表
export function getActressList(params: {
    pageNum: number
    pageSize: number
    keyword?: string
}) {
    return request({
        url: '/actresses',
        method: 'get',
        params
    })
}

// 获取所有女优
export function listAllActresses() {
    return request({
        url: '/actresses/all',
        method: 'get'
    })
}

// 新增女优
export function addActress(data: Actress) {
    return request({
        url: '/actresses',
        method: 'post',
        data
    })
}

// 更新女优信息
export function updateActress(id: number, data: Actress) {
    return request({
        url: `/actresses/${id}`,
        method: 'put',
        data
    })
}

// 删除女优
export function deleteActress(id: number) {
    return request({
        url: `/actresses/${id}`,
        method: 'delete'
    })
} 