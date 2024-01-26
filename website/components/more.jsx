"use client"

import { useEffect, useRef , useState} from "react"
import Link from "next/link"
import { useRect } from "@studio-freight/hamo"
import { useWindowSize } from "react-use"
import { useScroll } from 'hooks/use-scroll'
import { useStore } from '../lib/store'
import cn from 'clsx'
import { clamp, mapRange } from 'lib/maths'

import s from "./more.module.scss"
import {useControls , button} from 'leva'
const More = () => {
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const [hasScrolled, setHasScrolled] = useState()
  const addThreshold = useStore(({ addThreshold }) => addThreshold)
  const lenis = useStore(({ lenis }) => lenis)

  useControls(
    'lenis',
    () => ({
      stop: button(() => {
        lenis.stop()
      }),
      start: button(() => {
        lenis.start()
      }),
    }),
    [lenis]
  )

  useControls(
    'scrollTo',
    () => ({
      immediate: button(() => {
        lenis.scrollTo(30000, { immediate: true })
      }),
      smoothDuration: button(() => {
        lenis.scrollTo(30000, { lock: true, duration: 10 })
      }),
      smooth: button(() => {
        lenis.scrollTo(30000)
      }),
      forceScrollTo: button(() => {
        lenis.scrollTo(30000, { force: true })
      }),
    }),
    [lenis]
  )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])
  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    // setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })
  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: "light-start", value: top })
  }, [whiteRect])
  return (
    <div className={cn(s.home)}>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          //   @ts-ignore
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, "h1 vh")}>
              so we built <br />
              <span className="contrast">web scrolling</span>
            </h2>
            <h2 className={cn(s.enter, "h3 vh")}>
              Enter <br /> Lenis
            </h2>
            <h2 className={cn(s.second, "h1 vh")}>As it should be</h2>
          </div>
        </div>
      </section>
      <section className={cn("theme-light", s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn("layout-block", s.intro)}>
            <p className="p-l">
              Lenis is an{" "}
              <Link
                className="contrast semi-bold"
                href="https://github.com/studio-freight/lenis"
              >
                open-source library
              </Link>{" "}
              built to standardize scroll experiences and sauce up websites with
              butter-smooth navigation, all while using the platform and keeping
              it accessible.
            </p>
          </div>
        </div>
        {/* <section ref={featuresRectRef}>
          <FeatureCards />
        </section> */}
      </section>
    </div>
  )
}

export default More
