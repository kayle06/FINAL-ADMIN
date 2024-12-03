// 分页请求参数
export interface PageParams {
    pageNum: number
    pageSize: number
    keyword?: string
}

// 分页响应结果
export interface PageResult<T> {
    records: T[]
    total: number
    pages: number
    current: number
    size: number
}

// API 响应结果
export interface Result<T> {
    code: number
    message: string
    data: T
} 