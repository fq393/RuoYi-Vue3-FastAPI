"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaptchaProps {
  onCaptchaChange: (captcha: string) => void;
  className?: string;
}

export function Captcha({ onCaptchaChange, className = "" }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // 生成随机验证码文本
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 绘制验证码
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const text = generateCaptchaText();
    setCaptchaText(text);
    onCaptchaChange(text);

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        1
      );
    }

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制文字
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (canvas.width / text.length) * i + (canvas.width / text.length) / 2;
      const y = canvas.height / 2;
      
      // 随机颜色
      ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 70%, 40%)`;
      
      // 随机旋转
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  // 刷新验证码
  const refreshCaptcha = () => {
    drawCaptcha();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      drawCaptcha();
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          className="w-24 h-11 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
        >
          <span className="text-xs text-slate-400">加载中...</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          className="h-11 px-3"
          title="刷新验证码"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <canvas
        ref={canvasRef}
        width={96}
        height={44}
        className="border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        onClick={refreshCaptcha}
        title="点击刷新验证码"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={refreshCaptcha}
        className="h-11 px-3"
        title="刷新验证码"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  );
}