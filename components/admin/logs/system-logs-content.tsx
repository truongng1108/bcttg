"use client"

import { useState } from "react"
import { 
  History, 
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Monitor,
  Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

// Mock data - Nhật ký đăng nhập
const loginLogsData = [
  {
    id: 1,
    user: "Đại úy Nguyễn Văn A",
    unit: "Phòng Chính trị",
    action: "login",
    ip: "192.168.1.100",
    device: "Windows 11 / Chrome",
    time: "27/01/2026 14:30:25",
    status: "success",
  },
  {
    id: 2,
    user: "Trung úy Trần Văn B",
    unit: "Phòng Kỹ thuật",
    action: "logout",
    ip: "192.168.1.101",
    device: "Windows 10 / Firefox",
    time: "27/01/2026 14:15:10",
    status: "success",
  },
  {
    id: 3,
    user: "Thiếu tá Lê Văn C",
    unit: "Ban Chỉ huy",
    action: "login",
    ip: "192.168.1.102",
    device: "MacOS / Safari",
    time: "27/01/2026 13:45:00",
    status: "success",
  },
  {
    id: 4,
    user: "admin_test",
    unit: "Không xác định",
    action: "login",
    ip: "103.45.67.89",
    device: "Linux / Chrome",
    time: "27/01/2026 12:30:15",
    status: "failed",
  },
  {
    id: 5,
    user: "Thượng úy Phạm Văn D",
    unit: "Phòng Hậu cần",
    action: "login",
    ip: "192.168.1.105",
    device: "Windows 10 / Edge",
    time: "27/01/2026 11:20:30",
    status: "success",
  },
]

// Mock data - Nhật ký hệ thống
const systemLogsData = [
  {
    id: 1,
    action: "create",
    module: "Hồ sơ Chiến sĩ",
    description: "Thêm mới hồ sơ chiến sĩ: Binh nhì Hoàng Văn E",
    user: "Đại úy Nguyễn Văn A",
    time: "27/01/2026 14:25:00",
    level: "info",
  },
  {
    id: 2,
    action: "update",
    module: "CMS Nội dung",
    description: "Cập nhật bài viết: Lịch sử Binh chủng Tăng Thiết Giáp",
    user: "Trung úy Trần Văn B",
    time: "27/01/2026 14:10:30",
    level: "info",
  },
  {
    id: 3,
    action: "delete",
    module: "Ca khúc",
    description: "Xóa ca khúc: [Bản nháp] Test audio",
    user: "Đại úy Nguyễn Văn A",
    time: "27/01/2026 13:55:20",
    level: "warning",
  },
  {
    id: 4,
    action: "view",
    module: "Báo cáo",
    description: "Xuất báo cáo thống kê tháng 01/2026",
    user: "Thiếu tá Lê Văn C",
    time: "27/01/2026 13:40:15",
    level: "info",
  },
  {
    id: 5,
    action: "error",
    module: "Hệ thống",
    description: "Lỗi kết nối database - Đã tự động khôi phục",
    user: "System",
    time: "27/01/2026 12:00:00",
    level: "error",
  },
  {
    id: 6,
    action: "security",
    module: "Bảo mật",
    description: "Phát hiện 3 lần đăng nhập sai từ IP: 103.45.67.89",
    user: "System",
    time: "27/01/2026 12:30:20",
    level: "error",
  },
]

const actionIcons = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  error: AlertTriangle,
  security: Shield,
}

const levelStyles = {
  info: "bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]/20",
  warning: "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
}

export function SystemLogsContent() {
  const [loginLogs] = useState(loginLogsData)
  const [systemLogs] = useState(systemLogsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("today")
  const [levelFilter, setLevelFilter] = useState("all")

  const todayLogins = loginLogs.filter(l => l.status === "success").length
  const failedLogins = loginLogs.filter(l => l.status === "failed").length
  const totalActions = systemLogs.length
  const errorCount = systemLogs.filter(l => l.level === "error").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <History className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Nhật Ký Hệ Thống
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi hoạt động đăng nhập và thao tác trên hệ thống
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Xuất nhật ký
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D32]/10">
              <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2E7D32]">{todayLogins}</p>
              <p className="text-xs text-muted-foreground">Đăng nhập thành công</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{failedLogins}</p>
              <p className="text-xs text-muted-foreground">Đăng nhập thất bại</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Edit className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{totalActions}</p>
              <p className="text-xs text-muted-foreground">Thao tác hệ thống</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#F57C00]/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F57C00]/10">
              <AlertTriangle className="h-6 w-6 text-[#F57C00]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F57C00]">{errorCount}</p>
              <p className="text-xs text-muted-foreground">Cảnh báo / Lỗi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
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

        {/* System Logs Tab */}
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

          {/* System Logs Table */}
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
                  const ActionIcon = actionIcons[log.action as keyof typeof actionIcons] || Edit
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={levelStyles[log.level as keyof typeof levelStyles]}
                        >
                          {log.level === "info" ? "INFO" : log.level === "warning" ? "WARN" : "ERROR"}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị 1 - 10 / 156 bản ghi
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Trang trước
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  )
}
