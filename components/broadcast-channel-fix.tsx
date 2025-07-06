"use client"

import { useEffect } from "react"

/**
 * Silently guards against libraries that call `new BroadcastChannel()` without
 * a channel name – a pattern that throws `DOMException: name is missing`.
 */
export function BroadcastChannelFix() {
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return

    const OriginalBC = window.BroadcastChannel
    // Prevent double-patching.
    // @ts-ignore
    if (window.__bcPatched) return
    // @ts-ignore
    window.__bcPatched = true

    // Override global constructor.
    // eslint-disable-next-line func-names
    // @ts-ignore
    window.BroadcastChannel = (name?: string) => new OriginalBC(name || "nyancat-dashboard")
    // Preserve prototype chain.
    // @ts-ignore
    window.BroadcastChannel.prototype = OriginalBC.prototype
  }, [])

  return null
}
