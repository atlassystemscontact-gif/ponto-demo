// Aplica o MESMO tratamento em todas as fotos para parecerem da mesma cafeteria.
// Uso: node scripts/tratar-fotos.mjs <pasta-com-jpgs-originais>
import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { join, parse } from "node:path";

const src = process.argv[2];
const out = "public/fotos";
mkdirSync(out, { recursive: true });

for (const f of readdirSync(src).filter((f) => f.endsWith(".jpg"))) {
  const { name } = parse(f);
  await sharp(join(src, f))
    .resize({ width: 1600, withoutEnlargement: true })
    .recomb([
      [1.05, 0.02, 0],
      [0.01, 1.0, 0],
      [0, 0, 0.92],
    ]) // puxa para o quente (luz de manhã/lâmpada)
    .modulate({ saturation: 0.88, brightness: 0.98 }) // tira o "saturado de banco de imagem"
    .linear(1.05, -5) // contraste leve, pretos mais densos
    .webp({ quality: 78 })
    .toFile(join(out, name + ".webp"));
  console.log("ok", name);
}
