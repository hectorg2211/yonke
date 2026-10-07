import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Yonke El Cuñado · Tractopartes en Garita de Otay, Tijuana";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/assets/logo-long.png"),
  );
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#f3efe6",
          padding: "56px 72px 48px",
        }}
      >
        <img src={src} height={68} width={285} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 0.9,
              color: "#16181d",
              letterSpacing: "-0.02em",
            }}
          >
            TRACTO PARTES
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#2f6494",
            }}
          >
            Garita de Otay, Tijuana · Envíos a toda la República
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#5c6570",
          }}
        >
          Yonke El Cuñado · Solo refacción, sin taller
        </div>
      </div>
    ),
    { ...size },
  );
}
