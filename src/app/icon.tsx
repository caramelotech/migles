import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "#ce8534",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fefcf5",
        fontSize: 20,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      M
    </div>,
    { ...size },
  );
}
