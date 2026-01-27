'use client';

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "tel" | "textarea" | "select" | "file"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
  helpText?: string
  options?: { value: string; label: string }[]
  rows?: number
  accept?: string
  className?: string
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  value,
  onChange,
  error,
  helpText,
  options,
  rows = 4,
  accept,
  className,
}: FormFieldProps) {
  const inputId = `field-${name}`

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={inputId}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={rows}
            className={cn(error && "border-destructive")}
          />
        )

      case "select":
        return (
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={inputId}
              className={cn(error && "border-destructive")}
            >
              <SelectValue placeholder={placeholder || "Chọn..."} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "file":
        return (
          <div className="flex items-center gap-2">
            <Input
              id={inputId}
              name={name}
              type="file"
              required={required}
              disabled={disabled}
              accept={accept}
              onChange={(e) => onChange?.(e.target.files?.[0]?.name ?? "")}
              className={cn(
                "cursor-pointer file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground",
                error && "border-destructive"
              )}
            />
          </div>
        )

      default:
        return (
          <Input
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(error && "border-destructive")}
          />
        )
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {renderInput()}
      {helpText && !error && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
