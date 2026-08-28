// $q.platform — détection de plateforme (API groupée sous `is`)
// + breakpoints réactifs (VueUse useBreakpoints, tailles Quasar).
import { useBreakpoints } from "@vueuse/core"

export interface QPlatformIs {
  /** appareil mobile (web) */
  mobile: boolean
  tablet: boolean
  desktop: boolean
  /** mobile ET Capacitor/Cordova (app native) */
  nativeMobile: boolean
  ios: boolean
  android: boolean
  iphone: boolean
  ipad: boolean
  ipod: boolean
  mac: boolean
  win: boolean
  linux: boolean
  chrome: boolean
  edge: boolean
  firefox: boolean
  opera: boolean
  safari: boolean
  ie: boolean
  cordova: boolean
  capacitor: boolean
  electron: boolean
  touch: boolean
  mouse: boolean
}

export interface QPlatform {
  userAgent: string
  /** navigator.platform ("iPhone", "Linux armv81", …) */
  platform: string
  isServer: boolean
  isClient: boolean
  /** booléens de détection groupés : $q.platform.is.mobile, is.ios, … */
  is: QPlatformIs
  within: { iframe: boolean }
}

function detect(): QPlatform {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    const empty = Object.fromEntries(
      [
        "mobile", "tablet", "desktop", "nativeMobile", "ios", "android", "iphone",
        "ipad", "ipod", "mac", "win", "linux", "chrome", "edge", "firefox",
        "opera", "safari", "ie", "cordova", "capacitor", "electron", "touch", "mouse",
      ].map((k) => [k, false]),
    ) as unknown as QPlatformIs

    return {
      userAgent: "",
      platform: "",
      isServer: true,
      isClient: false,
      is: empty,
      within: { iframe: false },
    }
  }

  const ua = navigator.userAgent
  const nav = navigator as Navigator & { maxTouchPoints?: number; platform?: string }
  const platform = nav.platform ?? ""

  const ios = /iphone|ipad|ipod/i.test(ua)
  const iphone = /iphone/i.test(ua)
  const ipod = /ipod/i.test(ua)
  // iPad modernes : MacIntel + écran tactile multi-points
  const ipad = /ipad/i.test(ua) || (/macintosh|macintel/i.test(platform) && (nav.maxTouchPoints ?? 0) > 1)
  const android = /android/i.test(ua)

  const touch = "ontouchstart" in window || (nav.maxTouchPoints ?? 0) > 0
  const mobileUA = /mobile|iphone|ipod|android|windows phone|blackberry/i.test(ua)
  const tablet = ipad || (android && !mobileUA)
  const mobile = mobileUA || (tablet ? false : touch && /android|ipad|iphone/i.test(ua))

  const is: QPlatformIs = {
    mobile,
    tablet,
    desktop: !mobileUA && !tablet,
    nativeMobile: false, // affiné après (Capacitor/Cordova)
    ios,
    android,
    iphone,
    ipad,
    ipod,
    mac: /mac|iphone|ipad|ipod/i.test(ua),
    win: /win/i.test(ua),
    linux: /linux/i.test(platform),
    chrome: /chrome|crios/i.test(ua) && !/edg/i.test(ua),
    edge: /edg/i.test(ua),
    firefox: /firefox|fxios/i.test(ua),
    opera: /opr|opera/i.test(ua),
    safari: /safari/i.test(ua) && !/chrome|crios|edg|opr/i.test(ua),
    ie: /msie|trident/i.test(ua),
    cordova: typeof window !== "undefined" && "cordova" in window,
    capacitor: typeof window !== "undefined" && !!(window as any).Capacitor?.isNativePlatform?.(),
    electron: /electron/i.test(ua),
    touch,
    mouse: typeof window.matchMedia === "function" && window.matchMedia("(pointer: fine)").matches,
  }

  // nativeMobile : mobile + Capacitor/Cordova
  is.nativeMobile = is.mobile && (is.capacitor || is.cordova)

  return {
    userAgent: ua,
    platform,
    isServer: false,
    isClient: true,
    is,
    within: { iframe: window.self !== window.top },
  }
}

/** Détection statique par session (l'UA ne change pas) — SSR-safe */
export const platform: QPlatform = detect()

// — Breakpoints réactifs (tailles Quasar) —
const QUASAR_BREAKPOINTS = { xs: 0, sm: 600, md: 1024, lg: 1440, xl: 1920 }

export const breakpoints = useBreakpoints(QUASAR_BREAKPOINTS)

export const qBreakpoints = {
  /** ref réactives : true quand la largeur ≥ le seuil */
  isXs: breakpoints.xs,
  isSm: breakpoints.sm,
  isMd: breakpoints.md,
  isLg: breakpoints.lg,
  isXl: breakpoints.xl,
  /** comparaisons */
  isBelowSm: breakpoints.isSmaller("sm"),
  isBelowMd: breakpoints.isSmaller("md"),
  isBelowLg: breakpoints.isSmaller("lg"),
  isBelowXl: breakpoints.isSmaller("xl"),
  isAboveSm: breakpoints.isGreaterOrEqual("sm"),
  isAboveMd: breakpoints.isGreaterOrEqual("md"),
  isAboveLg: breakpoints.isGreaterOrEqual("lg"),
  isAboveXl: breakpoints.isGreaterOrEqual("xl"),
  between: breakpoints.between.bind(breakpoints),
  /** largeur de fenêtre (pixels) */
  width: breakpoints.current,
}
