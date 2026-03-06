"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
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
  useFormState,
} from "react-hook-form"
import { z } from "zod"

type FieldType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "date"
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

// Helper function to check if a field is required in Zod schema
function isFieldRequired<T extends FieldValues>(
  control: Control<T>,
  fieldName: string
): boolean {
  try {
    // Access the resolver from control's internal options
    const controlInternal = control as any
    const resolver = controlInternal._options?.resolver
    
    if (!resolver) return false

    // Try to get schema from zodResolver
    // zodResolver stores schema in _def.schema
    const resolverDef = resolver._def
    if (!resolverDef) return false

    const schema = resolverDef.schema
    if (!schema || !(schema instanceof z.ZodObject)) return false

    const shape = schema.shape
    if (!shape || typeof shape !== "object") return false

    const fieldSchema = shape[fieldName]
    if (!fieldSchema) return false

    // Check if field is optional or nullable
    let currentSchema: z.ZodTypeAny = fieldSchema

    // Unwrap optional/nullable/default wrappers
    while (currentSchema) {
      // If it's optional, the field is not required
      if (currentSchema instanceof z.ZodOptional) {
        return false
      }
      
      // If it's nullable (but not optional), continue unwrapping
      if (currentSchema instanceof z.ZodNullable) {
        currentSchema = currentSchema._def.innerType
        continue
      }
      
      // If it's default, continue unwrapping
      if (currentSchema instanceof z.ZodDefault) {
        currentSchema = currentSchema._def.innerType
        continue
      }
      
      // If we get here, it's a base type and required
      break
    }

    // If we successfully unwrapped and didn't find optional, it's required
    return true
  } catch {
    // If anything fails, default to false (not required)
    return false
  }
}

export function FormFieldRHF<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required: requiredProp,
  disabled = false,
  helpText,
  options,
  rows = 4,
  accept,
  className,
}: FormFieldRHFProps<T>) {
  const inputId = `field-${String(name)}`
  
  // Auto-detect required from schema if not explicitly provided
  const fieldName = String(name)
  const isRequiredFromSchema = isFieldRequired(control, fieldName)
  const required = requiredProp !== undefined ? requiredProp : isRequiredFromSchema

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
          type === "password" ? (
            <PasswordInput
              id={inputId}
              name={String(name)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              value={stringValue}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className={cn(errorMessage && "border-destructive")}
            />
          ) : (
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
                {options?.map((option, index) => (
                  <SelectItem key={`${option.value}-${index}`} value={option.value}>
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

