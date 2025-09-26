"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const moonRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const moonEl = moonRef.current
    const sunEl = sunRef.current

    if (!moonEl || !sunEl) return

    const pauseAllAnimations = () => {
      if (moonEl) moonEl.style.animationPlayState = "paused";
      if (sunEl) sunEl.style.animationPlayState = "paused";
      const moonBefore = getComputedStyle(moonEl, '::before');
      // This is a bit of a hack, as we can't directly modify pseudo-elements
      // but pausing the main animation should pause the pseudo-element's animation too.
    }

    const runAllAnimations = () => {
      if (moonEl) moonEl.style.animationPlayState = "running";
      if (sunEl) sunEl.style.animationPlayState = "running";
    }
    
    // Set initial state based on theme
    pauseAllAnimations();
    if (theme === 'dark') {
        moonEl.style.backgroundPosition = '50% 50%';
        sunEl.style.transform = 'translate(0px, 0) scale(0.9)';
    } else {
        moonEl.style.backgroundPosition = '100% 50%';
        sunEl.style.transform = 'translate(85px, 0) scale(0.9)';
    }


    const handleClick = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      
      if (currentTheme === 'light') {
        // Light to Dark
        runAllAnimations();
        waitForEclipseThenPause();
      } else {
        // Dark to Light
        runAllAnimations();
        waitForEndThenPause();
      }
    }

    const isNearEclipse = () => {
      if (!moonEl) return false;
      const progress = parseInt(window.getComputedStyle(moonEl).getPropertyValue("background-position-x"));
      return (progress >= 48 && progress <= 52);  
    }

    const isNearStartingPosition = () => {
      if (!moonEl) return false;
      const progress = parseInt(window.getComputedStyle(moonEl).getPropertyValue("background-position-x"));
      return (progress >= 99 || progress <= 1);
    }

    const waitForEclipseThenPause = () => {
      const checkEclipse = () => {
        if (isNearEclipse()) {
          pauseAllAnimations();
          setTheme('dark');
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        } else {
          animationFrameRef.current = requestAnimationFrame(checkEclipse);
        }
      }
      checkEclipse();
    }

    const waitForEndThenPause = () => {
      const checkEnd = () => {
        if (isNearStartingPosition()) {
          pauseAllAnimations();
          setTheme('light');
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        } else {
          animationFrameRef.current = requestAnimationFrame(checkEnd);
        }
      }
      checkEnd();
    }

    moonEl.addEventListener("click", handleClick)

    return () => {
      moonEl.removeEventListener("click", handleClick)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [theme, setTheme])


  return (
    <>
      <div className="eclipse-elements">
        <div ref={sunRef} className="sun four move"></div>
        <div ref={moonRef} className="moon one"></div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display: 'none'}}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </>
  )
}
