'use client'

import { useEffect, useRef } from 'react'

export default function AsciiTornado() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationFrameId: number
    let time = 0
    
    // ASCII characters for the tornado effect
    const chars = '░▒▓█▀▄■□▪▫●○◘◙◦∙·⋅⁘⁙⁚⁛⁜⁝⁞'.split('')
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    const drawTornado = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const baseY = canvas.height
      
      // Draw tornado vortex
      for (let layer = 0; layer < 50; layer++) {
        const y = baseY - layer * 15
        const progress = layer / 50
        
        // Tornado narrows as it goes up
        const radius = 300 * (1 - progress * 0.8) + 20
        const rotation = time * 2 + layer * 0.3
        
        // Number of particles in this ring
        const particles = Math.floor(30 - layer * 0.4)
        
        for (let i = 0; i < particles; i++) {
          const angle = (i / particles) * Math.PI * 2 + rotation
          const wobble = Math.sin(time * 3 + layer * 0.5 + i) * 10
          
          const x = centerX + Math.cos(angle) * (radius + wobble)
          const particleY = y + Math.sin(angle * 3 + time) * 5
          
          // Pick a random ASCII character
          const char = chars[Math.floor((time * 10 + i + layer) % chars.length)]
          
          // Opacity based on layer depth
          const opacity = 0.1 + progress * 0.3
          const size = 8 + (1 - progress) * 8
          
          ctx.font = `${size}px monospace`
          ctx.fillStyle = `rgba(100, 120, 180, ${opacity})`
          ctx.fillText(char, x, particleY)
        }
      }
      
      // Draw swirling particles around the tornado
      for (let i = 0; i < 100; i++) {
        const particleTime = time + i * 0.1
        const spiralRadius = 100 + Math.sin(particleTime * 0.5) * 200 + i * 2
        const spiralY = (canvas.height - (particleTime * 50 + i * 10) % canvas.height)
        const spiralAngle = particleTime * 2 + i * 0.5
        
        const x = centerX + Math.cos(spiralAngle) * spiralRadius
        const y = spiralY
        
        const char = chars[i % chars.length]
        const opacity = 0.05 + Math.sin(particleTime) * 0.05
        
        ctx.font = '6px monospace'
        ctx.fillStyle = `rgba(80, 100, 150, ${opacity})`
        ctx.fillText(char, x, y)
      }
      
      // Draw subtle vortex lines
      ctx.strokeStyle = 'rgba(60, 80, 120, 0.05)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        const startAngle = time + i * 0.3
        
        for (let j = 0; j < 100; j++) {
          const t = j / 100
          const angle = startAngle + t * Math.PI * 4
          const radius = 300 * (1 - t * 0.8) + 20
          
          const x = centerX + Math.cos(angle) * radius
          const y = baseY - t * canvas.height * 0.7
          
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.stroke()
      }
      
      time += 0.01
      animationFrameId = requestAnimationFrame(drawTornado)
    }
    
    resize()
    drawTornado()
    
    window.addEventListener('resize', resize)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-60"
    />
  )
}
