<template>
    <div class="dashboard-container">
        <el-row :gutter="20">
            <el-col :span="6" v-for="card in cards" :key="card.title">
                <el-card shadow="hover" class="dashboard-card">
                    <template #header>
                        <div class="card-header">
                            <span>{{ card.title }}</span>
                            <el-icon><component :is="card.icon" /></el-icon>
                        </div>
                    </template>
                    <div class="card-body">
                        <div class="card-value">{{ card.value }}</div>
                        <div class="card-compare">
                            {{ card.compareText }}
                            <span :class="card.trend">{{ card.compareValue }}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mt-4">
            <el-col :span="16">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>访问趋势</span>
                        </div>
                    </template>
                    <div style="height: 300px;">
                        <!-- 这里可以放图表组件 -->
                        图表区域
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>快捷操作</span>
                        </div>
                    </template>
                    <div class="quick-actions">
                        <el-button type="primary" plain>添加用户</el-button>
                        <el-button type="success" plain>发布文章</el-button>
                        <el-button type="warning" plain>系统设置</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
const cards = [
    {
        title: '访问量',
        icon: 'View',
        value: '12,345',
        compareText: '较昨日',
        compareValue: '+10%',
        trend: 'up'
    },
    {
        title: '用户数',
        icon: 'User',
        value: '1,234',
        compareText: '较上月',
        compareValue: '+5%',
        trend: 'up'
    },
    {
        title: '订单数',
        icon: 'ShoppingCart',
        value: '891',
        compareText: '较上周',
        compareValue: '-2%',
        trend: 'down'
    },
    {
        title: '收入',
        icon: 'Money',
        value: '¥23,456',
        compareText: '较上月',
        compareValue: '+15%',
        trend: 'up'
    }
]
</script>

<style scoped lang="scss">
.dashboard-container {
    padding: 20px;

    .dashboard-card {
        margin-bottom: 20px;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            color: #303133;
        }

        .card-body {
            text-align: center;
            padding: 20px 0;

            .card-value {
                font-size: 28px;
                font-weight: bold;
                color: #303133;
                margin-bottom: 10px;
            }

            .card-compare {
                font-size: 14px;
                color: #909399;

                .up {
                    color: #67c23a;
                }

                .down {
                    color: #f56c6c;
                }
            }
        }
    }

    .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .el-button {
            width: 100%;
        }
    }
}

.mt-4 {
    margin-top: 20px;
}
</style> 