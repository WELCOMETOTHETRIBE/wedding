import { ImageResponse } from "next/og"

export const alt = "Wedding Invitation"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "#F9F4EC",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          color: "#1D3B2A",
        }}
      >
        <div style={{ display: "flex" }}>{process.env.COUPLE_NAME_1 || "Victoria"} & {process.env.COUPLE_NAME_2 || "Maximillion"}</div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 20, color: "#666" }}>
          Wedding Celebration
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

