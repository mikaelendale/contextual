import { ImageResponse } from "next/og"

import { ART, MarkArt } from "@/components/brand-art"

export const size = { width: 64, height: 64 }
export const contentType = "image/png"

/** The browser tab icon: the mark on an orange tile, so it reads on any tab colour. */
export default function Icon() {
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
          borderRadius: 15,
        }}
      >
        <MarkArt size={52} ink="#ffd3b5" top={ART.white} knockout={ART.brand} stroke={1.5} />
      </div>
    ),
    size,
  )
}
