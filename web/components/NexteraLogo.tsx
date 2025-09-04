import React from 'react'
import Image from 'next/image'

interface NexteraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  priority?: boolean
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const sizePixels = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64
}

export default function NexteraLogo({ 
  size = 'md', 
  className = '',
  priority = false
}: NexteraLogoProps) {
  return (
    <div className={`${sizeClasses[size]} ${className} relative flex-shrink-0`}>
      <Image
        src="/nextera-logo.png"
        alt="NexteraEstate Logo"
        width={sizePixels[size]}
        height={sizePixels[size]}
        priority={priority}
        className="object-contain w-full h-full"
        style={{
          imageRendering: 'crisp-edges',
        }}
        quality={100}
      />
    </div>
  )
}