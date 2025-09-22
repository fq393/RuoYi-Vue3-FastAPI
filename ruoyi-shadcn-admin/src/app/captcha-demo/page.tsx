"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Captcha } from "@/components/captcha";
import { toast } from "sonner";

export default function CaptchaDemo() {
  const [userInput, setUserInput] = useState("");
  const [correctCaptcha, setCorrectCaptcha] = useState("");

  const handleVerify = () => {
    if (!userInput) {
      toast.error("请输入验证码");
      return;
    }

    if (userInput.toUpperCase() === correctCaptcha.toUpperCase()) {
      toast.success("验证码正确！");
      setUserInput("");
    } else {
      toast.error("验证码错误，请重新输入");
      setUserInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">验证码演示</CardTitle>
          <CardDescription>
            测试动态验证码功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="captcha-input" className="text-sm font-medium">
              验证码
            </Label>
            <div className="flex gap-2">
              <Input
                id="captcha-input"
                type="text"
                placeholder="请输入验证码"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="h-11"
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Captcha onCaptchaChange={setCorrectCaptcha} />
            </div>
          </div>

          <Button onClick={handleVerify} className="w-full h-11">
            验证
          </Button>

          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>• 点击验证码图片或刷新按钮可以重新生成</p>
            <p>• 验证码不区分大小写</p>
            <p>• 当前正确答案：<span className="font-mono font-bold">{correctCaptcha}</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}