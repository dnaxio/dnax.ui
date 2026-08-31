// $q.platform — détection de plateforme (API groupée sous `is`)
// + breakpoints réactifs (VueUse useBreakpoints, tailles Quasar).
// API alignée sur Quasar : https://quasar.dev/options/platform-detection
import { useBreakpoints } from "@vueuse/core"

export interface QPlatformIs {
  /** appareil mobile (web) */
  mobile: boolean
  tablet: boolean
  desktop: boolean
  /** mobile ET Capacitor/Cordova (app native) */
  nativeMobile: boolean
  /** nom du wrapper natif : 'cordova' | 'capacitor' | undefined */
  nativeMobileWrapper?: "cordova" | "capacitor"
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
  vivaldi: boolean
  ie: boolean
  /** moteur WebKit (Safari, Chrome, Edge…) */
  webkit: boolean
  /** extension navigateur (BEX — Chrome/Firefox) */
  bex: boolean
  /** Chrome OS (Chromebook) */
  cros: boolean
  blackberry: boolean
  winphone: boolean
  /** Amazon Silk (Kindle) */
  silk: boolean
  cordova: boolean
  capacitor: boolean
  electron: boolean
  /** écran tactile */
  touch: boolean
  /** pointeur précis (souris) disponible */
  mouse: boolean
  /** nom du navigateur : 'chrome' | 'firefox' | 'safari' | … | 'generic' */
  name: string
  /** version complète du navigateur ('70.0.3538.110') */
  version: string
  /** version majeure du navigateur (70, ou -1 si inconnue) */
  versionNumber: number
  /** nom de l'OS : 'mac' | 'win' | 'linux' | 'ios' | 'android' | 'cros' | … */
  platform: string
}

export interface QPlatformHas {
  /** écran tactile capable */
  touch: boolean
  /** localStorage / sessionStorage disponibles */
  webStorage: boolean
}

export interface QPlatform {
  userAgent: string
  /** navigator.platform ("iPhone", "Linux armv81", …) */
  platform: string
  isServer: boolean
  isClient: boolean
  /** booléens de détection groupés : $q.platform.is.mobile, is.ios, … */
  is: QPlatformIs
  /** capacités : has.touch, has.webStorage */
  has: QPlatformHas
  within: { iframe: boolean }
}

function emptyIs(): QPlatformIs {
  return {
    mobile: false,
    tablet: false,
    desktop: false,
    nativeMobile: false,
    nativeMobileWrapper: undefined,
    ios: false,
    android: false,
    iphone: false,
    ipad: false,
    ipod: false,
    mac: false,
    win: false,
    linux: false,
    chrome: false,
    edge: false,
    firefox: false,
    opera: false,
    safari: false,
    vivaldi: false,
    ie: false,
    webkit: false,
    bex: false,
    cros: false,
    blackberry: false,
    winphone: false,
    silk: false,
    cordova: false,
    capacitor: false,
    electron: false,
    touch: false,
    mouse: false,
    name: "",
    version: "",
    versionNumber: -1,
    platform: "",
  }
}

/** Nom + version du navigateur depuis l'UA (ordre = spécificité) */
function detectBrowser(ua: string) {
  const m = (re: RegExp) => ua.match(re)?.[1] ?? ""
  let name = "generic"
  let version = ""

  if (/vivaldi\/([\d.]+)/i.test(ua)) {
    name = "vivaldi"
    version = m(/vivaldi\/([\d.]+)/i)
  }
  else if (/edg\/([\d.]+)/i.test(ua)) {
    name = "edge"
    version = m(/edg\/([\d.]+)/i)
  }
  else if (/edge\/([\d.]+)/i.test(ua)) {
    name = "edge"
    version = m(/edge\/([\d.]+)/i)
  }
  else if (/opr\/([\d.]+)/i.test(ua)) {
    name = "opera"
    version = m(/opr\/([\d.]+)/i)
  }
  else if (/opera\/([\d.]+)/i.test(ua)) {
    name = "opera"
    version = m(/opera\/([\d.]+)/i)
  }
  else if (/(?:chrome|crios)\/([\d.]+)/i.test(ua)) {
    name = "chrome"
    version = m(/(?:chrome|crios)\/([\d.]+)/i)
  }
  else if (/(?:firefox|fxios)\/([\d.]+)/i.test(ua)) {
    name = "firefox"
    version = m(/(?:firefox|fxios)\/([\d.]+)/i)
  }
  else if (/msie ([\d.]+)/i.test(ua)) {
    name = "ie"
    version = m(/msie ([\d.]+)/i)
  }
  else if (/trident\/.*rv:([\d.]+)/i.test(ua)) {
    name = "ie"
    version = m(/trident\/.*rv:([\d.]+)/i)
  }
  else if (/version\/([\d.]+)/i.test(ua)) {
    name = "safari"
    version = m(/version\/([\d.]+)/i)
  }

  const versionNumber = version ? parseInt(version.split(".")[0]!, 10) || -1 : -1
  return { name, version, versionNumber }
}

function detect(): QPlatform {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      userAgent: "",
      platform: "",
      isServer: true,
      isClient: false,
      is: emptyIs(),
      has: { touch: false, webStorage: false },
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
  const blackberry = /blackberry/i.test(ua)
  const winphone = /windows phone/i.test(ua)
  // Chromebooks : navigator.platform vaut "CrOS x86_64" (ou "Linux x86_64" ancien)
  const cros = /cros/i.test(platform)
  const silk = /silk/i.test(ua)

  const touch = "ontouchstart" in window || (nav.maxTouchPoints ?? 0) > 0
  const mobileUA = /mobile|iphone|ipod|android|windows phone|blackberry/i.test(ua)
  const tablet = ipad || (android && !mobileUA)
  const mobile = mobileUA || (tablet ? false : touch && /android|ipad|iphone/i.test(ua))

  const cordova = "cordova" in window
  const capacitor = !!(window as any).Capacitor?.isNativePlatform?.()
  const nativeMobileWrapper: "cordova" | "capacitor" | undefined = capacitor
    ? "capacitor"
    : cordova
      ? "cordova"
      : undefined

  // nom de l'OS (miroir de l'API Quasar : is.platform)
  let osName = "generic"
  if (android) osName = "android"
  else if (ios) osName = "ios"
  else if (blackberry) osName = "blackberry"
  else if (winphone) osName = "winphone"
  else if (cros) osName = "cros"
  else if (silk) osName = "silk"
  else if (/mac|iphone|ipad|ipod/i.test(ua)) osName = "mac"
  else if (/win/i.test(ua)) osName = "win"
  else if (/linux/i.test(platform)) osName = "linux"

  let webStorage = false
  try {
    webStorage = typeof window.localStorage !== "undefined"
  }
  catch {
    webStorage = false
  }

  const browser = detectBrowser(ua)
  const notChromium = !/(edg|opr|vivaldi)/i.test(ua)

  const is: QPlatformIs = {
    mobile,
    tablet,
    desktop: !mobileUA && !tablet,
    nativeMobile: mobile && (capacitor || cordova),
    nativeMobileWrapper,
    ios,
    android,
    iphone,
    ipad,
    ipod,
    mac: /mac|iphone|ipad|ipod/i.test(ua),
    win: /win/i.test(ua),
    linux: /linux/i.test(platform),
    chrome: /chrome|crios/i.test(ua) && notChromium,
    edge: /edg|edge/i.test(ua),
    firefox: /firefox|fxios/i.test(ua),
    opera: /opr|opera/i.test(ua),
    safari: /safari/i.test(ua) && notChromium && !/chrome|crios/i.test(ua),
    vivaldi: /vivaldi/i.test(ua),
    ie: /msie|trident/i.test(ua),
    webkit: /applewebkit/i.test(ua),
    bex:
      typeof window !== "undefined" &&
      !!((window as any).chrome?.runtime?.id || (globalThis as any).browser?.runtime?.id),
    cros,
    blackberry,
    winphone,
    silk,
    cordova,
    capacitor,
    electron: /electron/i.test(ua),
    touch,
    mouse:
      typeof window.matchMedia === "function" && window.matchMedia("(pointer: fine)").matches,
    name: browser.name,
    version: browser.version,
    versionNumber: browser.versionNumber,
    platform: osName,
  }

  return {
    userAgent: ua,
    platform,
    isServer: false,
    isClient: true,
    is,
    has: { touch, webStorage },
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
