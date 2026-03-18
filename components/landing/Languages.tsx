import type { Variants } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { AnimatedTitle } from '../../components/motion/AnimatedTitle'
import { AnimatedList, AnimatedListItem } from '../../components/motion/AnimatedList'

import { topics } from '../../configs/languages'

const list = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  hidden: { opacity: 0 },
} satisfies Variants

const item = {
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hidden: { opacity: 0, scale: 0.4 },
} satisfies Variants

export function Languages() {
  return (
    <section className="space-y-20 px-4 py-8 sm:px-[10%] md:py-20">
      <AnimatedTitle>
        <h2 className="heading-section">
          I want to <span className="text-highlight-depth">learn ...</span>
        </h2>
      </AnimatedTitle>
      <div className="mx-auto max-w-screen-lg">
        <AnimatedList
          className="flex flex-wrap justify-center gap-2 text-center lg:gap-4"
          variants={list}
        >
          {topics.map(({ emoji, title, tagline }) => (
            <AnimatedListItem key={title} className="basis-28 md:basis-40" variants={item}>
              <Button
                variant="ghost"
                size="lg"
                className="size-full flex-col gap-2 bg-secondary/10 px-2 py-4 transition active:scale-95 lg:text-base"
              >
                <span className="text-4xl">{emoji}</span>
                <span className="font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground font-normal leading-tight">{tagline}</span>
              </Button>
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </div>
    </section>
  )
}
