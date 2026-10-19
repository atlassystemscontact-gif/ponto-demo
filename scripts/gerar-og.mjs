// Recorta as fotos de fundo das imagens de compartilhamento (Open Graph / Twitter) em 1200x630 JPG.
// O gerador (src/lib/og.tsx, next/og) lê JPG/PNG; as fotos do site são .webp, por isso este passo.
// Uso: node scripts/gerar-og.mjs   (rode de novo se trocar as fotos abaixo)
//
// `direita`: em vez de cobrir tudo, a foto encosta à direita sobre fundo escuro, para o assunto
// não ficar escondido sob o texto (a metade esquerda da imagem é escurecida pelo degradê).
// `recorte`: trecho da foto original a usar (em pixels), opcional.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const out = "assets/og";
mkdirSync(out, { recursive: true });
const ESCURO = "#120c09";

const fotos = {
  // páginas em geral: o copinho de espresso fica no terço esquerdo da foto original
  home: { src: "public/fotos/hero-espresso.webp", direita: true, recorte: { left: 0, top: 0, width: 1000, height: 1067 } },
  // /encomendas
  encomendas: { src: "public/fotos/enc-bolo-natal.webp" },
};

for (const [nome, f] of Object.entries(fotos)) {
  let img = sharp(f.src);
  if (f.recorte) img = img.extract(f.recorte);
  if (f.direita) {
    const parte = await img.resize({ height: 630 }).toBuffer({ resolveWithObject: true });
    const esquerda = Math.max(0, 1200 - parte.info.width);
    img = sharp(parte.data).extend({ left: esquerda, background: ESCURO }).resize(1200, 630, { fit: "cover", position: "right" });
  } else {
    img = img.resize(1200, 630, { fit: "cover", position: "attention" });
  }
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${nome}.jpg`);
  console.log("ok", nome);
}
