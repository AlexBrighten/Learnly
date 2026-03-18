'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Pill } from '../../components/ui/pill'
import { topics } from '../../configs/languages'
import type { PillProps } from '../../components/ui/pill'

type PillVariant = PillProps['variant']

const variants: NonNullable<PillVariant>[] = [
  'secondary',
  'highlightOutline',
  'secondaryOutline',
  'primary',
  'highlight',
  'default',
  'primaryOutline',
]

const achievements = topics.map((t) => ({
  label: t.title,
  emoji: t.emoji,
  tagline: t.tagline,
}))

function AchievementPill({
  label,
  emoji,
  tagline,
  tilt = 0,
  variant = 'primary',
}: {
  label: string
  emoji: string
  tagline: string
  tilt?: -1 | 0 | 1
  variant?: PillVariant
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.5, 1, 1, 0.75])
  const rotate = useTransform(scrollYProgress, [0.2, 0.4], [0, 3 * tilt])
  const x = useTransform(scrollYProgress, [0.2, 0.4], ['0%', `${-50 * tilt}%`])
  const left = useTransform(scrollYProgress, [0.2, 0.4], ['0%', `${50 * tilt}%`])

  return (
    <motion.div ref={ref} className="relative" style={{ opacity, scale, rotate, x, left }}>
      <Pill variant={variant} className="gap-4 px-4 text-[7vw] shadow-2xl sm:pl-8 sm:text-[5vw] lg:text-[min(4vw,4rem)]">
        <span className="capitalize">{label}</span>
        <span className="rounded-full bg-white/20 p-[0.15em] text-[0.9em]">{emoji}</span>
      </Pill>
    </motion.div>
  )
}

export function Fluency() {
  return (
    <ul className="flex flex-col gap-8 px-[5%] lg:px-0">
      {achievements.map(({ label, emoji, tagline }, index) => (
        <li key={label} className="flex justify-center">
          <AchievementPill
            label={label}
            emoji={emoji}
            tagline={tagline}
            tilt={index % 2 === 0 ? -1 : 1}
            variant={variants[index % variants.length]}
          />
        </li>
      ))}
    </ul>
  )
}
