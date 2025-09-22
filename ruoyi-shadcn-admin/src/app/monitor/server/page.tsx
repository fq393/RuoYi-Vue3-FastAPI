"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Network, 
  Server,
  Thermometer,
  Zap,
  Clock,
  Database
} from "lucide-react";

interface SystemInfo {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    temperature: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    upload: number;
    download: number;
    totalUpload: number;
    totalDownload: number;
  };
  system: {
    os: string;
    uptime: number;
    loadAverage: number[];
    processes: number;
  };
}

const mockSystemInfo: SystemInfo = {
  cpu: {
    usage: 45.2,
    cores: 8,
    model: "Intel Core i7-12700K",
    temperature: 52
  },
  memory: {
    total: 32768,
    used: 14336,
    free: 18432,
    usage: 43.75
  },
  disk: {
    total: 1024000,
    used: 512000,
    free: 512000,
    usage: 50.0
  },
  network: {
    upload: 1.2,
    download: 5.8,
    totalUpload: 1024.5,
    totalDownload: 8192.3
  },
  system: {
    os: "Ubuntu 22.04 LTS",
    uptime: 345600, // 4 days
    loadAverage: [1.2, 1.5, 1.8],
    processes: 156
  }
};

export default function ServerMonitorPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(mockSystemInfo);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟实时数据更新
      setSystemInfo(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(0, Math.min(100, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temperature: Math.max(30, Math.min(80, prev.cpu.temperature + (Math.random() - 0.5) * 5))
        },
        memory: {
          ...prev.memory,
          usage: Math.max(0, Math.min(100, prev.memory.usage + (Math.random() - 0.5) * 5))
        },
        network: {
          ...prev.network,
          upload: Math.max(0, prev.network.upload + (Math.random() - 0.5) * 2),
          download: Math.max(0, prev.network.download + (Math.random() - 0.5) * 3)
        }
      }));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return "bg-green-500";
    if (usage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 60) return "text-green-500";
    if (temp < 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">服务器监控</h2>
            <p className="text-muted-foreground">
              实时监控服务器性能和资源使用情况
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              最后更新: {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        {/* 系统概览 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU 使用率</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.cpu.usage.toFixed(1)}%</div>
              <Progress 
                value={systemInfo.cpu.usage} 
                className={`w-full mt-2 ${getUsageColor(systemInfo.cpu.usage)}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {systemInfo.cpu.cores} 核心 • {systemInfo.cpu.model}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.memory.usage.toFixed(1)}%</div>
              <Progress 
                value={systemInfo.memory.usage} 
                className={`w-full mt-2 ${getUsageColor(systemInfo.memory.usage)}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(systemInfo.memory.used * 1024 * 1024)} / {formatBytes(systemInfo.memory.total * 1024 * 1024)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">磁盘使用率</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.disk.usage.toFixed(1)}%</div>
              <Progress 
                value={systemInfo.disk.usage} 
                className={`w-full mt-2 ${getUsageColor(systemInfo.disk.usage)}`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(systemInfo.disk.used * 1024 * 1024)} / {formatBytes(systemInfo.disk.total * 1024 * 1024)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">网络流量</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ↑{systemInfo.network.upload.toFixed(1)} MB/s
              </div>
              <div className="text-lg text-muted-foreground">
                ↓{systemInfo.network.download.toFixed(1)} MB/s
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                总计: ↑{formatBytes(systemInfo.network.totalUpload * 1024 * 1024)} ↓{formatBytes(systemInfo.network.totalDownload * 1024 * 1024)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 详细信息 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>系统信息</span>
              </CardTitle>
              <CardDescription>服务器基本信息和运行状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">操作系统</span>
                <Badge variant="outline">{systemInfo.system.os}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">运行时间</span>
                <span className="text-sm">{formatUptime(systemInfo.system.uptime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">进程数量</span>
                <span className="text-sm">{systemInfo.system.processes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">负载平均</span>
                <div className="text-sm space-x-2">
                  <span>{systemInfo.system.loadAverage[0].toFixed(2)}</span>
                  <span>{systemInfo.system.loadAverage[1].toFixed(2)}</span>
                  <span>{systemInfo.system.loadAverage[2].toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>性能指标</span>
              </CardTitle>
              <CardDescription>实时性能监控数据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  CPU 温度
                </span>
                <span className={`text-sm font-bold ${getTemperatureColor(systemInfo.cpu.temperature)}`}>
                  {systemInfo.cpu.temperature}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  CPU 频率
                </span>
                <span className="text-sm">3.6 GHz</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  缓存命中率
                </span>
                <span className="text-sm">95.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  I/O 等待
                </span>
                <span className="text-sm">2.1%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 资源使用趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle>资源使用趋势</CardTitle>
            <CardDescription>
              过去24小时的系统资源使用情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>图表组件将在后续版本中实现</p>
                <p className="text-sm">可集成 Chart.js 或 Recharts 等图表库</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}