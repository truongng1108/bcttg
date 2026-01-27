"use client"

/**
 * Hoa văn trống đồng Đông Sơn
 * Dùng làm watermark nền với opacity thấp
 */
export function BronzeDrumPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vòng tròn đồng tâm - đặc trưng trống đồng */}
      <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
      
      {/* Ngôi sao trung tâm - mặt trời Đông Sơn */}
      <g transform="translate(200, 200)">
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="-35"
            stroke="currentColor"
            strokeWidth="2"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle cx="0" cy="0" r="8" fill="currentColor" />
      </g>
      
      {/* Hoa văn hình học vòng ngoài */}
      <g transform="translate(200, 200)">
        {[...Array(16)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 22.5})`}>
            {/* Hình tam giác cách điệu */}
            <path
              d="M 0,-175 L 8,-155 L -8,-155 Z"
              fill="currentColor"
              opacity="0.6"
            />
            {/* Đường kẻ trang trí */}
            <line
              x1="0"
              y1="-150"
              x2="0"
              y2="-125"
              stroke="currentColor"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
      
      {/* Hoa văn chim Lạc - đặc trưng văn hóa Đông Sơn */}
      <g transform="translate(200, 200)">
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            {/* Chim Lạc cách điệu */}
            <path
              d="M -12,-95 Q -8,-105 0,-100 Q 8,-105 12,-95 L 8,-92 Q 4,-98 0,-96 Q -4,-98 -8,-92 Z"
              fill="currentColor"
              opacity="0.5"
            />
          </g>
        ))}
      </g>
      
      {/* Hoa văn răng cưa vòng trong */}
      <g transform="translate(200, 200)">
        {[...Array(24)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 15})`}>
            <rect
              x="-2"
              y="-75"
              width="4"
              height="10"
              fill="currentColor"
              opacity="0.4"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
