// Imagem de compartilhamento (Open Graph e Twitter), 1200x630, gerada no build com next/og.
// Foto do site ao fundo (recortada por scripts/gerar-og.mjs), marca "ponto." e título no padrão
// da casa: sans fino + parte em serif itálico. Usada por app/(opengraph|twitter)-image.tsx e
// app/encomendas/(opengraph|twitter)-image.tsx.
// Sai em JPEG (~100 KB): o PNG do next/og passava de 500 KB a 1,2 MB, e o WhatsApp descarta a
// miniatura da prévia quando a imagem é pesada. sharp vem com o próprio Next (dependência opcional).
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOGO_GRAO, LOGO_LETRAS, LOGO_VIEWBOX } from "@/components/Logo";
import { DEMO, loja } from "./data";

const raiz = (...p: string[]) => join(process.cwd(), "assets", "og", ...p);

// lidos uma vez por build
const fontes = Promise.all([
  readFile(raiz("fontes", "hanken-grotesk-latin-300-normal.ttf")),
  readFile(raiz("fontes", "hanken-grotesk-latin-500-normal.ttf")),
  readFile(raiz("fontes", "fraunces-latin-400-italic.ttf")),
]);
const foto = async (nome: "home" | "encomendas") => `data:image/jpeg;base64,${(await readFile(raiz(`${nome}.jpg`))).toString("base64")}`;

// marca exata do site (mesmos caminhos de Logo.tsx), letras claras e grão vermelho
const logo = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}"><path fill="#f4ede1" d="${LOGO_LETRAS}"/><path fill="#c8432b" fill-rule="evenodd" d="${LOGO_GRAO}"/></svg>`,
).toString("base64")}`;

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TIPO = "image/jpeg";

export async function imagemOg({ fundo, titulo, sub }: { fundo: "home" | "encomendas"; titulo: [string, string]; sub: string }) {
  const [leve, media, italico] = await fontes;
  const src = await foto(fundo);
  const png = new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: "#120c09", fontFamily: "Hanken" }}>
        {/* o motor do next/og (Satori) não aplica `inset`: posição e tamanho explícitos */}
        <img src={src} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        {/* escurece da esquerda para o texto ler bem sobre qualquer foto */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background: "linear-gradient(90deg, rgba(18,12,9,0.94) 0%, rgba(18,12,9,0.82) 42%, rgba(18,12,9,0.15) 78%, rgba(18,12,9,0) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 760, height: "100%" }}>
          <img src={logo} width={250} height={80} />
          <div style={{ display: "flex", flexDirection: "column", color: "#f4ede1" }}>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 300, lineHeight: 1, letterSpacing: "-0.035em" }}>{titulo[0]}</div>
            <div style={{ display: "flex", fontFamily: "Fraunces", fontStyle: "italic", fontSize: 92, lineHeight: 1.08, letterSpacing: "-0.02em" }}>{titulo[1]}</div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 28, fontWeight: 300, lineHeight: 1.35, color: "rgba(244,237,225,0.78)", maxWidth: 600 }}>{sub}</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d9a441" }}>
            {DEMO ? "Site de demonstração · Atlas Systems" : loja.bairro}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Hanken", data: leve, weight: 300, style: "normal" },
        { name: "Hanken", data: media, weight: 500, style: "normal" },
        { name: "Fraunces", data: italico, weight: 400, style: "italic" },
      ],
    },
  );
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": OG_TIPO } });
}
