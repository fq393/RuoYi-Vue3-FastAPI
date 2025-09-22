"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// 模拟图表数据
const chartData = {
  revenue: [
    { month: "1月", value: 4000 },
    { month: "2月", value: 3000 },
    { month: "3月", value: 5000 },
    { month: "4月", value: 4500 },
    { month: "5月", value: 6000 },
    { month: "6月", value: 5500 },
  ],
  userGrowth: [
    { month: "1月", users: 400 },
    { month: "2月", users: 300 },
    { month: "3月", users: 500 },
    { month: "4月", users: 450 },
    { month: "5月", users: 600 },
    { month: "6月", users: 550 },
  ],
  topProducts: [
    { name: "产品 A", sales: 234, percentage: 45 },
    { name: "产品 B", sales: 187, percentage: 36 },
    { name: "产品 C", sales: 98, percentage: 19 },
  ]
};

export function RevenueChart() {
  const maxValue = Math.max(...chartData.revenue.map(item => item.value));
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>收入趋势</CardTitle>
        <CardDescription>
          过去6个月的收入变化
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="space-y-4">
          {chartData.revenue.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-muted-foreground">
                {item.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">¥{item.value.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((item.value / maxValue) * 100)}%
                  </span>
                </div>
                <Progress value={(item.value / maxValue) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UserGrowthChart() {
  const maxUsers = Math.max(...chartData.userGrowth.map(item => item.users));
  
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>用户增长</CardTitle>
        <CardDescription>
          新用户注册趋势
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.userGrowth.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-muted-foreground">
                {item.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.users} 用户</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((item.users / maxUsers) * 100)}%
                  </span>
                </div>
                <Progress value={(item.users / maxUsers) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopProductsChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>热门产品</CardTitle>
        <CardDescription>
          销量排行榜
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} 销量</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{product.percentage}%</p>
                <Progress value={product.percentage} className="w-16 h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}