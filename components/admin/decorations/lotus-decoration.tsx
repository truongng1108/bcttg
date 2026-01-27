"use client"

/**
 * Hoa sen cách điệu - Quốc hoa Việt Nam
 * Dùng trang trí vùng footer / divider
 */
export function LotusDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hoa sen trung tâm */}
      <g transform="translate(100, 85)">
        {/* Cánh sen sau */}
        <ellipse cx="-25" cy="-35" rx="12" ry="30" fill="currentColor" opacity="0.3" transform="rotate(-20)" />
        <ellipse cx="25" cy="-35" rx="12" ry="30" fill="currentColor" opacity="0.3" transform="rotate(20)" />
        
        {/* Cánh sen giữa */}
        <ellipse cx="-15" cy="-40" rx="10" ry="35" fill="currentColor" opacity="0.5" transform="rotate(-10)" />
        <ellipse cx="15" cy="-40" rx="10" ry="35" fill="currentColor" opacity="0.5" transform="rotate(10)" />
        
        {/* Cánh sen trước - trung tâm */}
        <ellipse cx="0" cy="-45" rx="10" ry="40" fill="currentColor" opacity="0.7" />
        
        {/* Nhụy hoa */}
        <circle cx="0" cy="-50" r="4" fill="currentColor" opacity="0.9" />
        
        {/* Đài hoa */}
        <ellipse cx="0" cy="0" rx="20" ry="8" fill="currentColor" opacity="0.4" />
      </g>
      
      {/* Lá sen bên trái */}
      <g transform="translate(30, 90)">
        <ellipse cx="0" cy="-15" rx="25" ry="15" fill="currentColor" opacity="0.2" transform="rotate(-10)" />
      </g>
      
      {/* Lá sen bên phải */}
      <g transform="translate(170, 90)">
        <ellipse cx="0" cy="-15" rx="25" ry="15" fill="currentColor" opacity="0.2" transform="rotate(10)" />
      </g>
      
      {/* Đường trang trí */}
      <line x1="0" y1="95" x2="60" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="140" y1="95" x2="200" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

/**
 * Dải hoa sen ngang - dùng làm divider
 */
export function LotusDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      <LotusDecoration className="h-8 w-16 text-primary opacity-30" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
    </div>
  )
}
