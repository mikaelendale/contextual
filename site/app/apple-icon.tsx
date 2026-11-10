import { ImageResponse } from "next/og"

import { ART, MarkArt } from "@/components/brand-art"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** Home screen icon. iOS rounds the corners itself, so the tile is full bleed. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(180deg, #ff6a1f, ${ART.brandDeep})`,
        }}
      >
        <MarkArt size={120} ink="#ffd3b5" top={ART.white} knockout={ART.brand} stroke={1.1} />
      </div>
    ),
    size,
  )
}
