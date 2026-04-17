import React, { useEffect, useId, useRef } from 'react'
import { animate } from 'animejs'
import header from '../assets/header.png'

const Header = () => {
  const turbulenceRef = useRef(null)
  const displacementMapRef = useRef(null)
  const polygonRef = useRef(null)
  const uid = useId().replace(/:/g, '')
  const filterId = `displacementFilter-${uid}`
  const patternId = `headerPattern-${uid}`

  useEffect(() => {
    if (!turbulenceRef.current || !displacementMapRef.current || !polygonRef.current) {
      return
    }

    const turbulenceAnimation = animate(turbulenceRef.current, {
      baseFrequency: [0, 0.05],
      alternate: true,
      loop: true,
      duration: 2200,
      ease: 'inOutSine',
    })

    const displacementAnimation = animate(displacementMapRef.current, {
      scale: [1, 15],
      alternate: true,
      loop: true,
      duration: 2200,
      ease: 'inOutSine',
    })

    const polygonAnimation = animate(polygonRef.current, {
      points: '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100',
      alternate: true,
      loop: true,
      duration: 2600,
      ease: 'inOutSine',
    })

    return () => {
      turbulenceAnimation.revert()
      displacementAnimation.revert()
      polygonAnimation.revert()
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', gap: '1rem', padding: '2rem' }}>
      <svg width="220" height="220" viewBox="0 0 128 128" aria-label="Animated logo">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbulenceRef}
              type="turbulence"
              numOctaves="2"
              baseFrequency="0"
              result="turbulence"
            />
            <feDisplacementMap
              ref={displacementMapRef}
              in2="turbulence"
              in="SourceGraphic"
              scale="1"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="128" height="128">
            <image href={header} x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        <polygon
          ref={polygonRef}
          points="64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96"
          fill={`url(#${patternId})`}
          filter={`url(#${filterId})`}
        />
      </svg>
      <h3>Hey Developer 🙌</h3>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>Welcome to our product</h1>
      <p style={{ maxWidth: '560px', color: '#444', lineHeight: 1.6, margin: 0 }}>
        Let's start with a quick product tour and you can setup
        the authentication in no time!
      </p>
      <button style={{ padding: '0.9rem 2rem', border: '1px solid #333', borderRadius: '999px', background: '#fff', cursor: 'pointer', marginTop: '1rem' }}>
        Get Started
      </button>
    </div>
  )
}

export default Header
