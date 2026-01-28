"use client"

import { useState, useEffect } from "react"
import { 
  History, 
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Monitor
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AdminPagination } from "@/components/admin/shared/admin-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import type { LoginLog, SystemLog } from "@/lib/data/types"
import { LogsService } from "@/lib/services/logs.service"
import { PageHeader } from "@/components/admin/shared/page-header"
import { actionIcons } from "@/lib/constants/actions"
import { levelStyles } from "@/lib/constants/status"
import { AdminStatsGrid, type AdminStatsItem } from "@/components/admin/shared/admin-stats-grid"
import { AdminSection } from "@/components/admin/shared/admin-section"

export function SystemLogsContent() {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([])

  useEffect(() => {
    Promise.all([
      LogsService.getLoginLogs(),
      LogsService.getSystemLogs(),
    ]).then(([loginData, systemData]) => {
      setLoginLogs(loginData)
      setSystemLogs(systemData)
    })
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("today")
  const [levelFilter, setLevelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const todayLogins = loginLogs.filter(l => l.status === "success").length
  const failedLogins = loginLogs.filter(l => l.status === "failed").length
  const totalActions = systemLogs.length
  const errorCount = systemLogs.filter(l => l.level === "error").length

  const statsItems: AdminStatsItem[] = [
    {
      id: "today-logins",
      value: todayLogins,
      label: "Đăng nhập thành công",
      icon: CheckCircle,
      variant: "success",
    },
    {
      id: "failed-logins",
      value: failedLogins,
      label: "Đăng nhập thất bại",
      icon: XCircle,
      variant: "error",
    },
    {
      id: "total-actions",
      value: totalActions,
      label: "Thao tác hệ thống",
      icon: Edit,
      variant: "accent",
    },
    {
      id: "error-count",
      value: errorCount,
      label: "Cảnh báo / Lỗi",
      icon: AlertTriangle,
      variant: "warning",
    },
  ]

  return (
    <AdminSection
      header={
        <PageHeader
          icon={History}
          title="Nhật Ký Hệ Thống"
          description="Theo dõi hoạt động đăng nhập và thao tác trên hệ thống"
          actions={
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Xuất nhật ký
            </Button>
          }
        />
      }
    >
      <AdminStatsGrid items={statsItems} columns={4} />

      <Tabs defaultValue="login" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LogIn className="mr-2 h-4 w-4" />
            Nhật ký đăng nhập
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="mr-2 h-4 w-4" />
            Nhật ký hệ thống
          </TabsTrigger>
        </TabsList>

        {/* Login Logs Tab */}
        <TabsContent value="login" className="space-y-4">
          {/* Filters */}
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, đơn vị, IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Login Logs Table */}
          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                  <TableHead>Địa chỉ IP</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginLogs.map((log, index) => {
                  const ActionIcon = log.action === "login" ? LogIn : LogOut
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.unit}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={log.action === "login" ? "text-[#2E7D32]" : "text-muted-foreground"}>
                          <ActionIcon className="mr-1 h-3 w-3" />
                          {log.action === "login" ? "Đăng nhập" : "Đăng xuất"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Monitor className="h-3 w-3" />
                          {log.device}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{log.time}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={log.status === "success" ? "default" : "destructive"}
                          className={log.status === "success" 
                            ? "bg-[#2E7D32] text-white" 
                            : ""
                          }
                        >
                          {log.status === "success" ? "Thành công" : "Thất bại"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {/* Filters */}
          <Card className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm nhật ký..."
                  className="pl-10"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="info">Thông tin</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                  <SelectItem value="error">Lỗi</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="today">
                <SelectTrigger className="w-40">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="w-20">Mức độ</TableHead>
                  <TableHead className="w-28">Hành động</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Người thực hiện</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemLogs.map((log, index) => {
                  const ActionIcon = actionIcons[log.action] || Edit
                  let levelLabel = "ERROR"
                  if (log.level === "info") {
                    levelLabel = "INFO"
                  } else if (log.level === "warning") {
                    levelLabel = "WARN"
                  }
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={levelStyles[log.level] || levelStyles.info}
                        >
                          {levelLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <ActionIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{log.action}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {log.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-sm">{log.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.time}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <AdminPagination
        currentPage={currentPage}
        totalPages={Math.ceil(loginLogs.length / pageSize)}
        totalItems={loginLogs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </AdminSection>
  )
}
