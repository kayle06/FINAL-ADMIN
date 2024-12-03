import request from '@/utils/request'
import type { PageResult } from '@/api/types'

export interface Video {
    id?: number
    title: string
    code: string
    duration?: string
    releaseDate?: string
    coverUrl?: string
    seriesId?: number
    seriesName?: string
    watchStatus?: 0 | 1  // 0-未看，1-已看
    rating?: number      // 0-10分
    remark?: string
    categoryId?: number
    categoryName?: string
    actressIds?: number[]
    actresses?: Array<{ id: number; name: string; nameCn: string }>
    tagIds?: number[]
    tags?: Array<{ id: number; name: string }>
}

export interface VideoQueryDTO {
    keyword?: string
    categoryId?: number
    actressId?: number
    tagId?: number
}

// 创建视频
export function createVideo(data: Video) {
    return request({
        url: '/videos',
        method: 'post',
        data
    })
}

// 更新视频
export function updateVideo(id: number, data: Video) {
    return request({
        url: `/videos/${id}`,
        method: 'put',
        data
    })
}

// 删除视频
export function deleteVideo(id: number) {
    return request({
        url: `/videos/${id}`,
        method: 'delete'
    })
}

// 获取视频详情
export function getVideo(id: number) {
    return request({
        url: `/videos/${id}`,
        method: 'get'
    })
}

// 分页查询视频列表
export function listVideos(params: {
    pageNum: number
    pageSize: number
    keyword?: string
    categoryId?: number
    actressId?: number
    tagId?: number
}) {
    return request<PageResult<Video>>({
        url: '/videos',
        method: 'get',
        params
    })
}

// 通过编号获取视频信息
export function fetchVideoInfo(code: string) {
    return request<Video>({
        url: `/videos/fetch/${code}`,
        method: 'get'
    })
} 