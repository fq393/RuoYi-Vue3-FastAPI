"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // 如果用户未登录且不在登录页面，重定向到登录页
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      }
      // 如果用户已登录且在登录页面，重定向到首页
      else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    );
  }

  // 如果在登录页面，直接显示内容
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // 如果用户已认证，显示内容
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 其他情况显示空内容（重定向中）
  return null;
}