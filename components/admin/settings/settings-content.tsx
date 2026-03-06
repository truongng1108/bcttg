"use client"

import { Controller, useForm } from "react-hook-form"
import { 
  Settings, 
  Save,
  Shield,
  Bell,
  Database,
  Globe,
  Clock,
  Mail,
  Server,
  HardDrive,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingsFormSchema, type SettingsFormData } from "@/lib/schemas/settings.schema"
import { useEffect, useState } from "react"
import type { SettingsStatusCard } from "@/lib/data/types"
import { SettingsService } from "@/lib/services/settings.service"
import { AdminStatsGrid, type AdminStatsItem } from "@/components/admin/shared/admin-stats-grid"

export function SettingsContent() {
  const [systemVersion, setSystemVersion] = useState("")
  const [systemStatusCards, setSystemStatusCards] = useState<SettingsStatusCard[]>([])
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      systemName: "",
      systemDescription: "",
      timezone: "asia-ho_chi_minh",
      language: "vi",
      recordsPerPage: "20",
      showAvatar: false,
      compactMode: false,

      passwordMinLength: "8",
      requireUppercase: false,
      requireNumber: false,
      requireSpecialChar: false,
      sessionTimeout: "30",
      maxLoginAttempts: "5",
      require2fa: false,

      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      emailFrom: "",
      notifyNewLogin: false,
      notifyPendingContent: false,
      notifySecurityAlerts: false,
      notifyPeriodicReports: false,

      autoBackupEnabled: false,
      backupFrequency: "daily",
      backupRetention: "7",
    },
    mode: "onChange",
  })

  useEffect(() => {
    Promise.all([
      SettingsService.getSettings(),
      SettingsService.getSystemStatusCards(),
      SettingsService.getVersion(),
    ]).then(([settings, statusCards, version]) => {
      form.reset(settings)
      setSystemStatusCards(statusCards)
      setSystemVersion(version)
    })
  }, [form])

  const handleSave = (values: SettingsFormData) => {
    const parsed = SettingsFormSchema.parse(values)
    form.reset(parsed)
  }

  const statusIconMap = {
    server: Server,
    database: Database,
    storage: HardDrive,
    uptime: Clock,
  }

  const statusItems: AdminStatsItem[] = systemStatusCards.map((card) => {
    const Icon = statusIconMap[card.iconKey]
    return {
      id: card.id,
      value: card.value,
      label: card.title,
      icon: Icon,
      variant: card.variant,
    }
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Settings className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Cấu Hình Hệ Thống
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các thiết lập và cấu hình chung của hệ thống
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {form.formState.isDirty && (
            <Badge variant="outline" className="border-[#F57C00] text-[#F57C00]">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Có thay đổi chưa lưu
            </Badge>
          )}
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!form.formState.isDirty}
            onClick={form.handleSubmit(handleSave)}
          >
            <Save className="mr-2 h-4 w-4" />
            Lưu cấu hình
          </Button>
        </div>
      </div>

      <AdminStatsGrid items={statusItems} columns={4} />

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="mr-2 h-4 w-4" />
            Cài đặt chung
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Database className="mr-2 h-4 w-4" />
            Sao lưu
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Thông tin hệ thống</CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Tên hệ thống</Label>
                  <Controller
                    control={form.control}
                    name="systemName"
                    render={({ field }) => (
                      <Input
                        id="system-name"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-version">Phiên bản</Label>
                  <Input id="system-version" value={systemVersion} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-desc">Mô tả hệ thống</Label>
                <Controller
                  control={form.control}
                  name="systemDescription"
                  render={({ field }) => (
                    <Textarea
                      id="system-desc"
                      rows={3}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Controller
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-ho_chi_minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                  <Controller
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Cài đặt hiển thị</CardTitle>
              <CardDescription>Tùy chỉnh giao diện và hiển thị</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Số bản ghi mỗi trang</p>
                  <p className="text-sm text-muted-foreground">Số lượng bản ghi hiển thị trong bảng dữ liệu</p>
                </div>
                <Controller
                  control={form.control}
                  name="recordsPerPage"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Hiển thị avatar</p>
                  <p className="text-sm text-muted-foreground">Hiển thị ảnh đại diện trong danh sách</p>
                </div>
                <Controller
                  control={form.control}
                  name="showAvatar"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chế độ compact</p>
                  <p className="text-sm text-muted-foreground">Thu gọn khoảng cách giữa các phần tử</p>
                </div>
                <Controller
                  control={form.control}
                  name="compactMode"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Chính sách mật khẩu</CardTitle>
              <CardDescription>Cấu hình yêu cầu mật khẩu cho người dùng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Độ dài tối thiểu</p>
                  <p className="text-sm text-muted-foreground">Số ký tự tối thiểu của mật khẩu</p>
                </div>
                <Controller
                  control={form.control}
                  name="passwordMinLength"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu chữ hoa</p>
                  <p className="text-sm text-muted-foreground">Mật khẩu phải có ít nhất 1 chữ hoa</p>
                </div>
                <Controller
                  control={form.control}
                  name="requireUppercase"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu số</p>
                  <p className="text-sm text-muted-foreground">Mật khẩu phải có ít nhất 1 chữ số</p>
                </div>
                <Controller
                  control={form.control}
                  name="requireNumber"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu ký tự đặc biệt</p>
                  <p className="text-sm text-muted-foreground">Mật khẩu phải có ít nhất 1 ký tự đặc biệt</p>
                </div>
                <Controller
                  control={form.control}
                  name="requireSpecialChar"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Phiên đăng nhập</CardTitle>
              <CardDescription>Cấu hình thời gian và bảo mật phiên đăng nhập</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thời gian hết hạn phiên</p>
                  <p className="text-sm text-muted-foreground">Tự động đăng xuất sau khoảng thời gian không hoạt động</p>
                </div>
                <Controller
                  control={form.control}
                  name="sessionTimeout"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 phút</SelectItem>
                        <SelectItem value="30">30 phút</SelectItem>
                        <SelectItem value="60">1 giờ</SelectItem>
                        <SelectItem value="120">2 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Số lần đăng nhập sai tối đa</p>
                  <p className="text-sm text-muted-foreground">Khóa tài khoản sau số lần đăng nhập sai</p>
                </div>
                <Controller
                  control={form.control}
                  name="maxLoginAttempts"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 lần</SelectItem>
                        <SelectItem value="5">5 lần</SelectItem>
                        <SelectItem value="10">10 lần</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xác thực 2 yếu tố (2FA)</p>
                  <p className="text-sm text-muted-foreground">Bắt buộc xác thực 2 yếu tố cho tất cả người dùng</p>
                </div>
                <Controller
                  control={form.control}
                  name="require2fa"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Cấu hình email</CardTitle>
              <CardDescription>Thiết lập SMTP để gửi thông báo qua email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Controller
                    control={form.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <Input
                        id="smtp-host"
                        placeholder="smtp.example.com"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Controller
                    control={form.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <Input
                        id="smtp-port"
                        placeholder="587"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Username</Label>
                  <Controller
                    control={form.control}
                    name="smtpUser"
                    render={({ field }) => (
                      <Input
                        id="smtp-user"
                        placeholder="user@example.com"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-pass">Password</Label>
                  <Controller
                    control={form.control}
                    name="smtpPass"
                    render={({ field }) => (
                      <PasswordInput
                        id="smtp-pass"
                        placeholder="••••••••"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-from">Email gửi đi</Label>
                <Controller
                  control={form.control}
                  name="emailFrom"
                  render={({ field }) => (
                    <Input
                      id="email-from"
                      placeholder="noreply@ttg.vn"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
              <Button variant="outline" className="border-primary/30 text-primary bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Gửi email thử nghiệm
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Loại thông báo</CardTitle>
              <CardDescription>Bật/tắt các loại thông báo hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo đăng nhập mới</p>
                  <p className="text-sm text-muted-foreground">Gửi email khi có đăng nhập từ thiết bị mới</p>
                </div>
                <Controller
                  control={form.control}
                  name="notifyNewLogin"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo nội dung chờ duyệt</p>
                  <p className="text-sm text-muted-foreground">Thông báo khi có nội dung mới cần duyệt</p>
                </div>
                <Controller
                  control={form.control}
                  name="notifyPendingContent"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cảnh báo bảo mật</p>
                  <p className="text-sm text-muted-foreground">Thông báo khi phát hiện hoạt động đáng ngờ</p>
                </div>
                <Controller
                  control={form.control}
                  name="notifySecurityAlerts"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Báo cáo định kỳ</p>
                  <p className="text-sm text-muted-foreground">Gửi báo cáo thống kê hàng tuần</p>
                </div>
                <Controller
                  control={form.control}
                  name="notifyPeriodicReports"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Sao lưu tự động</CardTitle>
              <CardDescription>Cấu hình lịch sao lưu dữ liệu tự động</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bật sao lưu tự động</p>
                  <p className="text-sm text-muted-foreground">Tự động sao lưu dữ liệu theo lịch</p>
                </div>
                <Controller
                  control={form.control}
                  name="autoBackupEnabled"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tần suất sao lưu</p>
                  <p className="text-sm text-muted-foreground">Khoảng thời gian giữa các lần sao lưu</p>
                </div>
                <Controller
                  control={form.control}
                  name="backupFrequency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Mỗi giờ</SelectItem>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Số bản sao lưu giữ lại</p>
                  <p className="text-sm text-muted-foreground">Số lượng bản sao lưu tối đa được lưu trữ</p>
                </div>
                <Controller
                  control={form.control}
                  name="backupRetention"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 bản</SelectItem>
                        <SelectItem value="7">7 bản</SelectItem>
                        <SelectItem value="14">14 bản</SelectItem>
                        <SelectItem value="30">30 bản</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base text-primary">Lịch sử sao lưu</CardTitle>
              <CardDescription>Danh sách các bản sao lưu gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "27/01/2026 02:00", size: "2.3 GB", status: "success" },
                  { date: "26/01/2026 02:00", size: "2.2 GB", status: "success" },
                  { date: "25/01/2026 02:00", size: "2.2 GB", status: "success" },
                  { date: "24/01/2026 02:00", size: "2.1 GB", status: "success" },
                ].map((backup) => (
                  <div key={backup.date} className="flex items-center justify-between rounded-md border border-border p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#2E7D32]" />
                      <div>
                        <p className="font-medium">{backup.date}</p>
                        <p className="text-sm text-muted-foreground">Kích thước: {backup.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Tải xuống
                      </Button>
                      <Button variant="outline" size="sm" className="text-primary hover:bg-primary/10 bg-transparent">
                        Khôi phục
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Vùng nguy hiểm</CardTitle>
              <CardDescription>Các thao tác không thể hoàn tác</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xóa tất cả dữ liệu cache</p>
                  <p className="text-sm text-muted-foreground">Xóa toàn bộ dữ liệu tạm thời của hệ thống</p>
                </div>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
                  Xóa cache
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset cấu hình về mặc định</p>
                  <p className="text-sm text-muted-foreground">Khôi phục tất cả cài đặt về giá trị ban đầu</p>
                </div>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
                  Reset cấu hình
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
