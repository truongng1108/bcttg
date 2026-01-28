"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

type FieldType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "file"
  | "switch"

interface FormFieldRHFProps<T extends FieldValues> {
  readonly control: Control<T>
  readonly name: FieldPath<T>
  readonly label: string
  readonly type?: FieldType
  readonly placeholder?: string
  readonly required?: boolean
  readonly disabled?: boolean
  readonly helpText?: string
  readonly options?: readonly { value: string; label: string }[]
  readonly rows?: number
  readonly accept?: string
  readonly className?: string
}

export function FormFieldRHF<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  helpText,
  options,
  rows = 4,
  accept,
  className,
}: FormFieldRHFProps<T>) {
  const inputId = `field-${String(name)}`

  if (type === "file") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message
          return (
            <div className={cn("space-y-2", className)}>
              <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              <Input
                id={inputId}
                name={String(name)}
                type="file"
                required={required}
                disabled={disabled}
                accept={accept}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  field.onChange(file)
                }}
                className={cn(
                  "cursor-pointer file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground",
                  errorMessage && "border-destructive"
                )}
              />
              {helpText && !errorMessage && (
                <p className="text-xs text-muted-foreground">{helpText}</p>
              )}
              {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
            </div>
          )
        }}
      />
    )
  }

  if (type === "switch") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message
          return (
            <div className={cn("space-y-2", className)}>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
                  {label}
                  {required && <span className="ml-1 text-destructive">*</span>}
                </Label>
                <Switch
                  id={inputId}
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  disabled={disabled}
                />
              </div>
              {helpText && !errorMessage && (
                <p className="text-xs text-muted-foreground">{helpText}</p>
              )}
              {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
            </div>
          )
        }}
      />
    )
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message
        const stringValue = typeof field.value === "string" ? field.value : ""

        let fieldNode = (
            <Input
              id={inputId}
              name={String(name)}
              type={type}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              value={stringValue}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className={cn(errorMessage && "border-destructive")}
            />
          )

        if (type === "textarea") {
          fieldNode = (
            <Textarea
              id={inputId}
              name={String(name)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              value={stringValue}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              rows={rows}
              className={cn(errorMessage && "border-destructive")}
            />
          )
        }

        if (type === "select") {
          fieldNode = (
            <Select
              value={stringValue}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
            >
              <SelectTrigger id={inputId} className={cn(errorMessage && "border-destructive")}>
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
        }

        return (
          <div className={cn("space-y-2", className)}>
            <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
              {label}
              {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {fieldNode}
            {helpText && !errorMessage && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
          </div>
        )
      }}
    />
  )
}

