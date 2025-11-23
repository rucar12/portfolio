'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type CircleColor = 'blue' | 'purple' | 'pink'

interface Circle {
  size: number
  top: string
  left: string
  delay: number
  color: CircleColor
}

const circles: Circle[] = [
  { size: 200, top: '15%', left: '8%', delay: 0, color: 'blue' },
  { size: 180, top: '25%', left: '82%', delay: 1.5, color: 'purple' },
  { size: 220, top: '55%', left: '12%', delay: 3, color: 'pink' },
  { size: 190, top: '65%', left: '88%', delay: 2, color: 'blue' },
  { size: 210, top: '85%', left: '20%', delay: 4, color: 'purple' },
  { size: 175, top: '35%', left: '65%', delay: 1, color: 'pink' },
]

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const [hasMouse, setHasMouse] = useState(false)
  const rafRef = useRef<number>()
  const transformsRef = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    let lastUpdate = 0
    const throttleDelay = 50

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastUpdate < throttleDelay) {
        return
      }
      lastUpdate = now

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        setHasMouse(true)
      })
    }

    const handleMouseLeave = () => {
      setHasMouse(false)
      setMousePosition(null)
      transformsRef.current.clear()
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const transforms = useMemo(() => {
    if (!hasMouse || !mousePosition) {
      return new Map<number, string>()
    }

    const newTransforms = new Map<number, string>()

    circles.forEach((circle, index) => {
      const baseTop = parseFloat(circle.top)
      const baseLeft = parseFloat(circle.left)
      const circleX = (window.innerWidth * baseLeft) / 100
      const circleY = (window.innerHeight * baseTop) / 100

      const dx = mousePosition.x - circleX
      const dy = mousePosition.y - circleY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 600
      const minDistance = 200

      if (distance < maxDistance && distance > 0) {
        const force =
          distance < minDistance
            ? 1
            : Math.max(0, (maxDistance - distance) / (maxDistance - minDistance))
        const moveX = (-dx / distance) * force * 50
        const moveY = (-dy / distance) * force * 50

        newTransforms.set(index, `translate(${moveX}px, ${moveY}px)`)
      }
    })

    return newTransforms
  }, [hasMouse, mousePosition])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />

      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 dark:opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />

      {circles.map((circle, index) => {
        const colorClasses = {
          blue: 'bg-blue-500/50 dark:bg-blue-700/30',
          purple: 'bg-purple-500/50 dark:bg-purple-700/30',
          pink: 'bg-pink-500/50 dark:bg-pink-700/30',
        }

        const transform = transforms.get(index) || ''

        return (
          <div
            key={index}
            className={`absolute rounded-full ${colorClasses[circle.color]} ${hasMouse ? '' : 'animate-float'} pointer-events-none`}
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              top: circle.top,
              left: circle.left,
              transform: transform || undefined,
              transition: hasMouse
                ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : undefined,
              animationDelay: hasMouse ? undefined : `${circle.delay}s`,
              animationDuration: hasMouse ? undefined : `${4 + circle.delay}s`,
            }}
          />
        )
      })}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  )
}
