'use client'
import { useEffect, useRef } from 'react'

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }
const COLORS = ['rgba(0,212,255,','rgba(124,58,237,','rgba(16,185,129,']

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    function resize() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const count = Math.min(60, Math.floor(window.innerWidth/24))
    particles.current = Array.from({ length: count }, () => ({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx: (Math.random()-0.5)*0.3, vy: -0.1-Math.random()*0.3, size: 0.8+Math.random()*1.4, opacity: 0.15+Math.random()*0.4, color: COLORS[Math.floor(Math.random()*COLORS.length)] }))
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) { p.y = canvas.height+10; p.x = Math.random()*canvas.width }
        if (p.x < -10) p.x = canvas.width+10
        if (p.x > canvas.width+10) p.x = -10
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fillStyle = p.color+p.opacity+')'; ctx.fill()
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.7 }} aria-hidden />
}
