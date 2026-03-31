'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  size: number
  opacity: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationFrameId: number
    let stars: Star[] = []
    const numStars = 200
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    const initStars = () => {
      stars = []
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 1000,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }
    
    const drawStar = (star: Star) => {
      const perspective = 500 / (500 + star.z)
      const x = star.x * perspective + centerX
      const y = star.y * perspective + centerY
      const size = star.size * perspective
      
      // Draw star with glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
      gradient.addColorStop(0.5, `rgba(200, 200, 255, ${star.opacity * 0.5})`)
      gradient.addColorStop(1, 'rgba(100, 100, 200, 0)')
      
      ctx.beginPath()
      ctx.arc(x, y, size * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Core of star
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      ctx.fill()
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach((star) => {
        // Move stars toward viewer
        star.z -= 0.5
        
        // Reset star if it's too close
        if (star.z <= 0) {
          star.z = 1000
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }
        
        // Twinkle effect
        star.opacity = 0.3 + Math.sin(Date.now() * 0.001 + star.z) * 0.3
        
        drawStar(star)
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    resize()
    initStars()
    animate()
    
    window.addEventListener('resize', () => {
      resize()
      initStars()
    })
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #000000, #050510, #000000)' }}
    />
  )
}
