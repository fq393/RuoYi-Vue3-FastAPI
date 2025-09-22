"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Code, 
  Download, 
  Play,
  FileText,
  Database,
  Settings,
  Zap,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface TableColumn {
  name: string;
  type: string;
  comment: string;
  nullable: boolean;
  primaryKey: boolean;
}

interface GeneratorConfig {
  tableName: string;
  className: string;
  packageName: string;
  author: string;
  description: string;
  columns: TableColumn[];
  features: {
    crud: boolean;
    search: boolean;
    export: boolean;
    import: boolean;
    validation: boolean;
  };
}

export default function CodeGeneratorPage() {
  const [config, setConfig] = useState<GeneratorConfig>({
    tableName: "sys_user",
    className: "User",
    packageName: "com.ruoyi.system",
    author: "ruoyi",
    description: "用户信息表",
    columns: [
      { name: "id", type: "bigint", comment: "用户ID", nullable: false, primaryKey: true },
      { name: "username", type: "varchar(50)", comment: "用户名", nullable: false, primaryKey: false },
      { name: "email", type: "varchar(100)", comment: "邮箱", nullable: true, primaryKey: false },
      { name: "phone", type: "varchar(20)", comment: "手机号", nullable: true, primaryKey: false },
      { name: "status", type: "tinyint", comment: "状态", nullable: false, primaryKey: false },
      { name: "created_at", type: "datetime", comment: "创建时间", nullable: false, primaryKey: false },
      { name: "updated_at", type: "datetime", comment: "更新时间", nullable: false, primaryKey: false }
    ],
    features: {
      crud: true,
      search: true,
      export: true,
      import: false,
      validation: true
    }
  });

  const [generatedCode, setGeneratedCode] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState("config");
  const [copiedCode, setCopiedCode] = useState<string>("");

  const handleColumnChange = (index: number, field: keyof TableColumn, value: string | boolean) => {
    const newColumns = [...config.columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setConfig({ ...config, columns: newColumns });
  };

  const addColumn = () => {
    setConfig({
      ...config,
      columns: [
        ...config.columns,
        { name: "", type: "varchar(255)", comment: "", nullable: true, primaryKey: false }
      ]
    });
  };

  const removeColumn = (index: number) => {
    const newColumns = config.columns.filter((_, i) => i !== index);
    setConfig({ ...config, columns: newColumns });
  };

  const generateCode = () => {
    // 模拟代码生成
    const entityCode = `package ${config.packageName}.domain;

import java.time.LocalDateTime;
import javax.validation.constraints.*;

/**
 * ${config.description}
 * 
 * @author ${config.author}
 * @date ${new Date().toISOString().split('T')[0]}
 */
public class ${config.className} {
${config.columns.map(col => {
  const javaType = getJavaType(col.type);
  const fieldName = toCamelCase(col.name);
  return `    /** ${col.comment} */
    ${col.nullable ? '' : '@NotNull'}
    private ${javaType} ${fieldName};`;
}).join('\n\n')}

    // Getters and Setters
${config.columns.map(col => {
  const javaType = getJavaType(col.type);
  const fieldName = toCamelCase(col.name);
  const methodName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  return `    public ${javaType} get${methodName}() {
        return ${fieldName};
    }

    public void set${methodName}(${javaType} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }`;
}).join('\n\n')}
}`;

    const mapperCode = `package ${config.packageName}.mapper;

import java.util.List;
import ${config.packageName}.domain.${config.className};

/**
 * ${config.description}Mapper接口
 * 
 * @author ${config.author}
 * @date ${new Date().toISOString().split('T')[0]}
 */
public interface ${config.className}Mapper {
    /**
     * 查询${config.description}
     */
    public ${config.className} select${config.className}ById(Long id);

    /**
     * 查询${config.description}列表
     */
    public List<${config.className}> select${config.className}List(${config.className} ${config.className.toLowerCase()});

    /**
     * 新增${config.description}
     */
    public int insert${config.className}(${config.className} ${config.className.toLowerCase()});

    /**
     * 修改${config.description}
     */
    public int update${config.className}(${config.className} ${config.className.toLowerCase()});

    /**
     * 删除${config.description}
     */
    public int delete${config.className}ById(Long id);

    /**
     * 批量删除${config.description}
     */
    public int delete${config.className}ByIds(Long[] ids);
}`;

    const serviceCode = `package ${config.packageName}.service;

import java.util.List;
import ${config.packageName}.domain.${config.className};

/**
 * ${config.description}Service接口
 * 
 * @author ${config.author}
 * @date ${new Date().toISOString().split('T')[0]}
 */
public interface I${config.className}Service {
    /**
     * 查询${config.description}
     */
    public ${config.className} select${config.className}ById(Long id);

    /**
     * 查询${config.description}列表
     */
    public List<${config.className}> select${config.className}List(${config.className} ${config.className.toLowerCase()});

    /**
     * 新增${config.description}
     */
    public int insert${config.className}(${config.className} ${config.className.toLowerCase()});

    /**
     * 修改${config.description}
     */
    public int update${config.className}(${config.className} ${config.className.toLowerCase()});

    /**
     * 批量删除${config.description}
     */
    public int delete${config.className}ByIds(Long[] ids);

    /**
     * 删除${config.description}信息
     */
    public int delete${config.className}ById(Long id);
}`;

    const controllerCode = `package ${config.packageName}.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ${config.packageName}.domain.${config.className};
import ${config.packageName}.service.I${config.className}Service;

/**
 * ${config.description}Controller
 * 
 * @author ${config.author}
 * @date ${new Date().toISOString().split('T')[0]}
 */
@RestController
@RequestMapping("/${config.className.toLowerCase()}")
public class ${config.className}Controller {
    @Autowired
    private I${config.className}Service ${config.className.toLowerCase()}Service;

    /**
     * 查询${config.description}列表
     */
    @GetMapping("/list")
    public List<${config.className}> list(${config.className} ${config.className.toLowerCase()}) {
        return ${config.className.toLowerCase()}Service.select${config.className}List(${config.className.toLowerCase()});
    }

    /**
     * 获取${config.description}详细信息
     */
    @GetMapping("/{id}")
    public ${config.className} getInfo(@PathVariable("id") Long id) {
        return ${config.className.toLowerCase()}Service.select${config.className}ById(id);
    }

    /**
     * 新增${config.description}
     */
    @PostMapping
    public int add(@RequestBody ${config.className} ${config.className.toLowerCase()}) {
        return ${config.className.toLowerCase()}Service.insert${config.className}(${config.className.toLowerCase()});
    }

    /**
     * 修改${config.description}
     */
    @PutMapping
    public int edit(@RequestBody ${config.className} ${config.className.toLowerCase()}) {
        return ${config.className.toLowerCase()}Service.update${config.className}(${config.className.toLowerCase()});
    }

    /**
     * 删除${config.description}
     */
    @DeleteMapping("/{ids}")
    public int remove(@PathVariable Long[] ids) {
        return ${config.className.toLowerCase()}Service.delete${config.className}ByIds(ids);
    }
}`;

    setGeneratedCode({
      entity: entityCode,
      mapper: mapperCode,
      service: serviceCode,
      controller: controllerCode
    });

    setActiveTab("preview");
    toast.success("代码生成成功！");
  };

  const getJavaType = (sqlType: string): string => {
    if (sqlType.includes("varchar") || sqlType.includes("text")) return "String";
    if (sqlType.includes("int")) return "Integer";
    if (sqlType.includes("bigint")) return "Long";
    if (sqlType.includes("decimal") || sqlType.includes("float")) return "BigDecimal";
    if (sqlType.includes("datetime") || sqlType.includes("timestamp")) return "LocalDateTime";
    if (sqlType.includes("date")) return "LocalDate";
    if (sqlType.includes("tinyint")) return "Boolean";
    return "String";
  };

  const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  };

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(type);
      toast.success("代码已复制到剪贴板");
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      toast.error("复制失败");
    }
  };

  const downloadCode = () => {
    Object.entries(generatedCode).forEach(([type, code]) => {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.className}${type.charAt(0).toUpperCase() + type.slice(1)}.java`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    toast.success("代码文件下载完成");
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">代码生成器</h2>
            <p className="text-muted-foreground">
              基于数据表结构自动生成后端代码
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">
              <Settings className="mr-2 h-4 w-4" />
              配置信息
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Code className="mr-2 h-4 w-4" />
              代码预览
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>配置代码生成的基本参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tableName">表名</Label>
                    <Input
                      id="tableName"
                      value={config.tableName}
                      onChange={(e) => setConfig({...config, tableName: e.target.value})}
                      placeholder="数据表名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="className">类名</Label>
                    <Input
                      id="className"
                      value={config.className}
                      onChange={(e) => setConfig({...config, className: e.target.value})}
                      placeholder="Java类名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packageName">包名</Label>
                    <Input
                      id="packageName"
                      value={config.packageName}
                      onChange={(e) => setConfig({...config, packageName: e.target.value})}
                      placeholder="Java包名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">作者</Label>
                    <Input
                      id="author"
                      value={config.author}
                      onChange={(e) => setConfig({...config, author: e.target.value})}
                      placeholder="代码作者"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig({...config, description: e.target.value})}
                      placeholder="功能描述"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>生成选项</CardTitle>
                  <CardDescription>选择要生成的功能模块</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="crud"
                      checked={config.features.crud}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config, 
                          features: {...config.features, crud: checked as boolean}
                        })
                      }
                    />
                    <Label htmlFor="crud">CRUD操作</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="search"
                      checked={config.features.search}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config, 
                          features: {...config.features, search: checked as boolean}
                        })
                      }
                    />
                    <Label htmlFor="search">搜索功能</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export"
                      checked={config.features.export}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config, 
                          features: {...config.features, export: checked as boolean}
                        })
                      }
                    />
                    <Label htmlFor="export">导出功能</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="import"
                      checked={config.features.import}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config, 
                          features: {...config.features, import: checked as boolean}
                        })
                      }
                    />
                    <Label htmlFor="import">导入功能</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="validation"
                      checked={config.features.validation}
                      onCheckedChange={(checked) => 
                        setConfig({
                          ...config, 
                          features: {...config.features, validation: checked as boolean}
                        })
                      }
                    />
                    <Label htmlFor="validation">数据验证</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>字段配置</span>
                  <Button onClick={addColumn} size="sm">
                    添加字段
                  </Button>
                </CardTitle>
                <CardDescription>配置数据表字段信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {config.columns.map((column, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>字段名</Label>
                        <Input
                          value={column.name}
                          onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                          placeholder="字段名"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>类型</Label>
                        <Select
                          value={column.type}
                          onValueChange={(value) => handleColumnChange(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="varchar(50)">varchar(50)</SelectItem>
                            <SelectItem value="varchar(100)">varchar(100)</SelectItem>
                            <SelectItem value="varchar(255)">varchar(255)</SelectItem>
                            <SelectItem value="text">text</SelectItem>
                            <SelectItem value="int">int</SelectItem>
                            <SelectItem value="bigint">bigint</SelectItem>
                            <SelectItem value="decimal(10,2)">decimal(10,2)</SelectItem>
                            <SelectItem value="datetime">datetime</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                            <SelectItem value="tinyint">tinyint</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>注释</Label>
                        <Input
                          value={column.comment}
                          onChange={(e) => handleColumnChange(index, 'comment', e.target.value)}
                          placeholder="字段注释"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={column.nullable}
                          onCheckedChange={(checked) => handleColumnChange(index, 'nullable', checked)}
                        />
                        <Label>可空</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={column.primaryKey}
                          onCheckedChange={(checked) => handleColumnChange(index, 'primaryKey', checked)}
                        />
                        <Label>主键</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeColumn(index)}
                        disabled={config.columns.length <= 1}
                      >
                        删除
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={generateCode} size="lg" className="px-8">
                <Zap className="mr-2 h-4 w-4" />
                生成代码
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {Object.keys(generatedCode).length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">生成的代码文件</h3>
                  <Button onClick={downloadCode}>
                    <Download className="mr-2 h-4 w-4" />
                    下载全部
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {Object.entries(generatedCode).map(([type, code]) => (
                    <Card key={type}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{config.className}{type.charAt(0).toUpperCase() + type.slice(1)}.java</span>
                            <Badge variant="outline">{type}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(code, type)}
                          >
                            {copiedCode === type ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{code}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">请先配置信息并生成代码</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}