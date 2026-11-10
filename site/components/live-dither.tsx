"use client"

import { useSyncExternalStore } from "react"
import { ShaderMount } from "@paper-design/shaders-react"
import {
  DitheringTypes,
  ShaderFitOptions,
  defaultObjectSizing,
  getShaderColorFromString,
  imageDitheringFragmentShader,
} from "@paper-design/shaders"

/*
 * Paper's image dithering shader, patched in two ways:
 *  1. True stochastic dithering. Paper's "random" mode nudges a pixel up with
 *     probability equal to its brightness, which draws a hard ring at every
 *     colour level once there are several. Uniform noise mixes neighbouring
 *     levels in proportion, so gradients stay smooth: grain, no pattern.
 *  2. A three-stop colour ramp (back → front → highlight) across brightness,
 *     instead of Paper's jump to the highlight colour, so shading survives.
 * For a live feel, each grain pixel re-rolls about every two seconds at its own
 * random moment, so only a few change on any frame: a slow shimmer, not
 * static, and the grain never pulses. The shader mount pauses on its own
 * when the tab is hidden or the canvas is off screen.
 */

/** Re-rolls per pixel per second. */
const GRAIN_RATE = 0.45

const RAMP = `
    // Gradient map across brightness: back -> front -> highlight.
    float rampMid = clamp(u_rampMid, 0.01, 0.99);
    color = quantLum < rampMid
      ? mix(u_colorBack.rgb, u_colorFront.rgb, quantLum / rampMid)
      : mix(u_colorFront.rgb, u_colorHighlight.rgb, (quantLum - rampMid) / (1. - rampMid));
    opacity = 1.;`

const LIVE_SHADER = (() => {
  const src = imageDitheringFragmentShader
  const grain = "dithering = step(hash21(ditheringNoiseUV), lum);"
  const paletteStart = "vec3 fgColor = u_colorFront.rgb * u_colorFront.a;"
  const paletteEnd = "opacity += bgOpacity * (1.0 - opacity);"
  const start = src.indexOf(paletteStart)
  const end = src.indexOf(paletteEnd)
  // Pinned to @paper-design/shaders 0.0.82; if its source moves, fall back to the original.
  if (!src.includes(grain) || start < 0 || end < start) return src
  return (src.slice(0, start) + RAMP.trim() + src.slice(end + paletteEnd.length))
    .replace(
      grain,
      [
        `float grainPhase = hash21(ditheringNoiseUV * 1.37 + vec2(11.1, 7.7));`,
        `float grainRoll = floor(u_time * ${GRAIN_RATE.toFixed(2)} + grainPhase);`,
        `dithering = hash21(ditheringNoiseUV + grainRoll * vec2(61.7, 27.3));`,
      ].join("\n      "),
    )
    .replace(
      "uniform vec2 u_resolution;",
      "uniform vec2 u_resolution;\nuniform float u_time;\nuniform float u_rampMid;",
    )
})()

const REDUCED = "(prefers-reduced-motion: reduce)"
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}
const prefersReduced = () => window.matchMedia(REDUCED).matches

export type LiveDitherProps = {
  image: string
  /** Darkest colour of the ramp. */
  colorBack: string
  /** Middle colour of the ramp, at `rampMid` brightness. */
  colorFront: string
  /** Brightest colour of the ramp. */
  colorHighlight: string
  /** Where the middle colour sits along brightness, 0 to 1. */
  rampMid?: number
  /** Fewer steps, bolder grain: each pixel jumps a whole step. */
  colorSteps?: number
  /** Grain cell size in CSS pixels; keep it a whole number so cells stay even. */
  size?: number
  fit?: keyof typeof ShaderFitOptions
  originX?: number
  originY?: number
  /** Re-roll the grain over time. Off under reduced motion. */
  live?: boolean
  className?: string
}

export function LiveDither({
  image,
  colorBack,
  colorFront,
  colorHighlight,
  rampMid = 0.5,
  colorSteps = 4,
  size = 2,
  fit = "cover",
  originX = defaultObjectSizing.originX,
  originY = defaultObjectSizing.originY,
  live = true,
  className,
}: LiveDitherProps) {
  const reduced = useSyncExternalStore(subscribeReduced, prefersReduced, () => false)
  return (
    <ShaderMount
      aria-hidden="true"
      className={className}
      fragmentShader={LIVE_SHADER}
      speed={live && !reduced ? 1 : 0}
      frame={0}
      uniforms={{
        u_image: image,
        u_colorFront: getShaderColorFromString(colorFront),
        u_colorBack: getShaderColorFromString(colorBack),
        u_colorHighlight: getShaderColorFromString(colorHighlight),
        u_rampMid: rampMid,
        u_type: DitheringTypes.random,
        u_pxSize: size,
        u_colorSteps: colorSteps,
        u_originalColors: false,
        u_inverted: false,
        u_fit: ShaderFitOptions[fit],
        u_rotation: defaultObjectSizing.rotation,
        u_scale: defaultObjectSizing.scale,
        u_offsetX: defaultObjectSizing.offsetX,
        u_offsetY: defaultObjectSizing.offsetY,
        u_originX: originX,
        u_originY: originY,
        u_worldWidth: defaultObjectSizing.worldWidth,
        u_worldHeight: defaultObjectSizing.worldHeight,
      }}
    />
  )
}
