"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {changeType === "increase" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={changeType === "increase" ? "text-green-500" : "text-red-500"}>
            {change}
          </span>
          <span>较上月</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: "总用户数",
      value: "2,350",
      change: "+20.1%",
      changeType: "increase" as const,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "总订单数",
      value: "1,234",
      change: "+15.3%",
      changeType: "increase" as const,
      icon: <ShoppingCart className="h-4 w-4" />
    },
    {
      title: "总收入",
      value: "¥45,231",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "活跃用户",
      value: "573",
      change: "-2.1%",
      changeType: "decrease" as const,
      icon: <Activity className="h-4 w-4" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}