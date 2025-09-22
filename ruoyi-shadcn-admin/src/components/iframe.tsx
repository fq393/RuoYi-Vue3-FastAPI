"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IFrameProps {
  src: string;
  title?: string;
  height?: string;
  className?: string;
}

export default function IFrame({ 
  src, 
  title = "外部页面", 
  height = "600px",
  className = "" 
}: IFrameProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    // 强制刷新iframe
    setCurrentSrc("");
    setTimeout(() => {
      setCurrentSrc(src);
    }, 100);
  };

  const openInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              新窗口打开
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative" style={{ height }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm text-muted-foreground">加载中...</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="text-center space-y-4">
                <div className="text-red-500">
                  <ExternalLink className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">页面加载失败</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    重试
                  </Button>
                  <Button variant="outline" size="sm" onClick={openInNewTab}>
                    新窗口打开
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentSrc && (
            <iframe
              src={currentSrc}
              className="w-full h-full border-0 rounded-b-lg"
              onLoad={handleLoad}
              onError={handleError}
              title={title}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}