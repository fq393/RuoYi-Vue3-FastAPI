"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield, User, Lock, Loader2, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Captcha } from "@/components/captcha";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captcha: "",
    rememberMe: false,
  });
  const [correctCaptcha, setCorrectCaptcha] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.captcha) {
      toast.error("请填写完整的登录信息");
      return;
    }

    // 验证码验证（不区分大小写）
    if (formData.captcha.toUpperCase() !== correctCaptcha.toUpperCase()) {
      toast.error("验证码错误，请重新输入");
      setFormData(prev => ({ ...prev, captcha: "" }));
      return;
    }

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        // 设置登录成功状态
        setLoginSuccess(true);
        
        // 显示登录成功提示
        toast.success("登录成功！正在跳转...", {
          duration: 2000,
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            fontSize: "14px",
            fontWeight: "500"
          }
        });
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error("登录失败，请检查用户名和密码");
      }
    } catch (error) {
      toast.error("登录失败，请检查用户名和密码");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:via-slate-950 dark:to-slate-900 p-4">
      {/* 主题切换按钮 */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 dark:bg-black/90 dark:border dark:border-slate-800/50 backdrop-blur-sm relative">
        {/* Loading 覆盖层 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-lg flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
            <div className="flex flex-col items-center space-y-6">
              {/* 主要loading图标 */}
              <div className="relative">
                {loginSuccess ? (
                  // 登录成功图标
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 animate-in zoom-in duration-300 delay-200" />
                  </div>
                ) : (
                  // 登录中图标
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-slate-100" />
                  </div>
                )}
                {/* 外圈动画 */}
                <div className={`absolute inset-0 w-16 h-16 border-2 rounded-full ${
                  loginSuccess 
                    ? 'border-green-200 dark:border-green-700 animate-ping opacity-30' 
                    : 'border-slate-200 dark:border-slate-700 animate-ping opacity-20'
                }`}></div>
              </div>
              
              {/* 文字信息 */}
              <div className="text-center space-y-2">
                {loginSuccess ? (
                  <>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 animate-in slide-in-from-bottom duration-300">
                      登录成功！
                    </p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      正在跳转到首页，请稍候...
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 animate-pulse">登录中...</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">正在验证您的身份信息，请稍候</p>
                  </>
                )}
              </div>
              
              {/* 进度条动画 */}
              <div className="w-32 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${
                  loginSuccess 
                    ? 'bg-green-500 dark:bg-green-400 w-full' 
                    : 'bg-slate-900 dark:bg-slate-100 animate-pulse w-3/4'
                }`}></div>
              </div>
            </div>
          </div>
        )}

        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white dark:text-slate-900" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">
            若依管理系统
          </CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-300">
            请输入您的账号信息进行登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入 */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                用户名
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="pl-10 h-11 border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600"
                  required
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                密码
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 h-11 border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* 验证码输入 */}
            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-sm font-medium">
                验证码
              </Label>
              <div className="flex gap-2">
                <Input
                  id="captcha"
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.captcha}
                  onChange={(e) => handleInputChange("captcha", e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600"
                  required
                />
                <Captcha onCaptchaChange={setCorrectCaptcha} />
              </div>
            </div>

            {/* 记住我 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked: boolean) => handleInputChange("rememberMe", checked)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                记住我
              </Label>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          {/* 底部链接 */}
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <span>还没有账号？</span>
            <Button variant="link" className="p-0 h-auto font-medium text-slate-900 dark:text-slate-100">
              立即注册
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}