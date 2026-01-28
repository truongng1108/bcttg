import { loginLogsData, systemLogsData } from "@/lib/data/mock/logs"
import type { LoginLog, SystemLog } from "@/lib/data/types"

export class LogsService {
  static async getLoginLogs(): Promise<LoginLog[]> {
    return Promise.resolve(loginLogsData)
  }

  static async getSystemLogs(): Promise<SystemLog[]> {
    return Promise.resolve(systemLogsData)
  }
}
