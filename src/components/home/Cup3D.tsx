"use client";

// Xícara 3D feita em código (Three.js + React Three Fiber): cerâmica, pires, café com crema
// desenhada em canvas e vapor animado. Gira com a rolagem dos capítulos (efeito Morpho).
// Sem arquivos externos: ambiente gerado com RoomEnvironment, funciona offline.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = { progresso: MotionValue<number>; capitulo: number; parado?: boolean; ativo?: boolean };

export default function Cup3D(props: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [0, 2.6, 7.4], fov: 26 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.debug.checkShaderErrors = false; // compila shaders sem travar a página
      }}
    >
      <Ambiente />
      <Mira />
      <ambientLight intensity={0.18} color="#ffe2c4" />
      <directionalLight position={[-3.5, 5, 2.5]} intensity={2.4} color="#ffd8a8" />
      <directionalLight position={[3, 2.5, -3]} intensity={1.6} color="#ff9e5e" />
      <Xicara {...props} />
      <Relogio ativo={props.ativo !== false} parado={props.parado} progresso={props.progresso} />
    </Canvas>
  );
}

// Renderiza a ~30 qps só enquanto a seção está perto da tela (economiza bateria e GPU fraca);
// parado (reduced-motion) só redesenha quando a rolagem muda.
function Relogio({ ativo, parado, progresso }: { ativo: boolean; parado?: boolean; progresso: MotionValue<number> }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!ativo) return;
    const off = progresso.on("change", () => invalidate());
    if (parado) {
      invalidate();
      return off;
    }
    let raf = 0;
    let ultimo = 0;
    const loop = (t: number) => {
      if (t - ultimo > 32) {
        ultimo = t;
        invalidate();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      off();
    };
  }, [ativo, parado, progresso, invalidate]);
  return null;
}

// Enquadramento: em telas estreitas (retrato) a câmera se afasta para a xícara caber na largura.
function Mira() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspecto = size.width / Math.max(1, size.height);
    const k = aspecto < 0.8 ? Math.min(2.4, 1.15 / aspecto) : 1;
    camera.position.set(0, 2.6 * k, 7.4 * k);
    camera.lookAt(0, 0.15, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Ambiente() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.32;
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

// ---------- geometrias ----------
function perfilXicara() {
  // perfil (raio, altura): fundo estreito, boca larga; parede com espessura
  const ext: [number, number][] = [
    [0, 0.02],
    [0.5, 0.02],
    [0.56, 0.0],
    [0.6, 0.05],
    [0.7, 0.32],
    [0.82, 0.68],
    [0.9, 0.98],
    [0.93, 1.1],
  ];
  const int: [number, number][] = [
    [0.885, 1.11],
    [0.86, 0.98],
    [0.78, 0.68],
    [0.66, 0.34],
    [0.56, 0.12],
    [0, 0.1],
  ];
  const pts = [...ext, ...int].map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(pts, 96);
}

function perfilPires() {
  const p: [number, number][] = [
    [0, 0.0],
    [0.78, 0.0],
    [1.08, 0.03],
    [1.3, 0.1],
    [1.36, 0.15],
    [1.32, 0.17],
    [1.25, 0.13],
    [1.05, 0.08],
    [0.7, 0.06],
    [0.6, 0.075],
    [0, 0.075],
  ];
  return new THREE.LatheGeometry(
    p.map(([r, y]) => new THREE.Vector2(r, y)),
    96,
  );
}

// ---------- superfície do café (canvas) ----------
type Estilo = { base: string; crema: string; borda: string; arte: "nenhuma" | "coracao" | "rosetta" };
const ESTILOS: Estilo[] = [
  { base: "#2a140a", crema: "#8a4f22", borda: "#c58a4c", arte: "nenhuma" }, // espresso
  { base: "#24120a", crema: "#6b3a18", borda: "#a8693a", arte: "nenhuma" }, // coado
  { base: "#a5734a", crema: "#c99c6e", borda: "#7a4a26", arte: "coracao" }, // pingado
  { base: "#7a4322", crema: "#b9784a", borda: "#5a2c12", arte: "rosetta" }, // cappuccino
];

function texturaCafe(e: Estilo) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const r = 256;
  const grad = g.createRadialGradient(r, r, 10, r, r, r);
  grad.addColorStop(0, e.crema);
  grad.addColorStop(0.72, e.base);
  grad.addColorStop(0.94, e.borda);
  grad.addColorStop(1, e.base);
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  // manchas de crema
  g.filter = "blur(10px)";
  for (let i = 0; i < 90; i++) {
    const a = (i * 137.5 * Math.PI) / 180;
    const d = Math.sqrt(i / 90) * 220;
    g.fillStyle = `rgba(255,214,160,${0.03 + (i % 4) * 0.008})`;
    g.beginPath();
    g.arc(r + Math.cos(a) * d, r + Math.sin(a) * d, 14 + (i % 9) * 2, 0, Math.PI * 2);
    g.fill();
  }
  g.filter = "blur(2px)";
  g.fillStyle = "rgba(246,232,212,0.94)";
  if (e.arte === "coracao") {
    g.beginPath();
    g.moveTo(r, r + 95);
    g.bezierCurveTo(r - 160, r - 10, r - 70, r - 140, r, r - 60);
    g.bezierCurveTo(r + 70, r - 140, r + 160, r - 10, r, r + 95);
    g.fill();
  }
  if (e.arte === "rosetta") {
    for (let i = 0; i < 7; i++) {
      const y = r - 140 + i * 34;
      const w = 120 - i * 13;
      g.beginPath();
      g.ellipse(r, y, w, 16, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.fillRect(r - 3, r - 150, 6, 280);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

const vaporVert = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.x += sin(uv.y * 5.0 + uTime * 1.2 + uSeed) * 0.12 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const vaporFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  uniform float uForca;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  void main() {
    vec2 uv = vUv;
    float n = noise(vec2(uv.x * 3.0 + uSeed, uv.y * 2.5 - uTime * 0.45));
    n += 0.5 * noise(vec2(uv.x * 6.0 - uSeed, uv.y * 5.0 - uTime * 0.7));
    float sx = sin(3.14159 * uv.x);
    float mask = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.4, uv.y) * sx * sx * sx;
    float a = smoothstep(0.75, 1.25, n) * mask * 0.3 * uForca;
    gl_FragColor = vec4(vec3(1.0, 0.95, 0.88), a);
  }
`;

function Xicara({ progresso, capitulo, parado }: Props) {
  const grupo = useRef<THREE.Group>(null);
  const cafeA = useRef<THREE.MeshStandardMaterial>(null);
  const cafeB = useRef<THREE.MeshStandardMaterial>(null);
  const vapores = useRef<THREE.ShaderMaterial[]>([]);
  const atual = useRef(capitulo);
  const fade = useRef(1);

  const xic = useMemo(perfilXicara, []);
  const pires = useMemo(perfilPires, []);
  const texturas = useMemo(() => ESTILOS.map(texturaCafe), []);
  const ceramica = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f1e9dd",
        roughness: 0.28,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const uniformsVapor = useMemo(() => [0, 1, 2].map((i) => ({ uTime: { value: 0 }, uSeed: { value: i * 3.1 }, uForca: { value: 1 } })), []);

  useEffect(() => () => texturas.forEach((t) => t.dispose()), [texturas]);

  // troca de bebida por capítulo com fade
  useEffect(() => {
    if (!cafeA.current || !cafeB.current) return;
    cafeB.current.map = texturas[atual.current];
    cafeB.current.needsUpdate = true;
    cafeA.current.map = texturas[capitulo];
    cafeA.current.needsUpdate = true;
    atual.current = capitulo;
    fade.current = 0;
  }, [capitulo, texturas]);

  const [estreito, setEstreito] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const on = () => setEstreito(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const g = grupo.current;
    if (!g) return;
    const p = progresso.get();
    const t = state.clock.elapsedTime;
    const alvoY = p * Math.PI * 2.2 + (parado ? 0 : Math.sin(t * 0.4) * 0.08);
    g.rotation.y += (alvoY - g.rotation.y) * Math.min(1, dt * 6);
    const alvoX = 0.12 + Math.sin(p * Math.PI) * 0.22;
    g.rotation.x += (alvoX - g.rotation.x) * Math.min(1, dt * 4);
    g.position.y = (estreito ? 1.55 : -0.3) + (parado ? 0 : Math.sin(t * 0.9) * 0.03);
    fade.current = Math.min(1, fade.current + dt * 2.2);
    if (cafeA.current) cafeA.current.opacity = fade.current;
    vapores.current.forEach((m) => {
      if (!m) return;
      m.uniforms.uTime.value = parado ? 0 : t;
    });
  });


  return (
    <group ref={grupo} position={[0, -0.55, 0]} scale={estreito ? 1 : 0.8}>
      <mesh geometry={pires} material={ceramica} position={[0, -0.02, 0]} />
      <mesh geometry={xic} material={ceramica} position={[0, 0.06, 0]} />
      {/* asa */}
      <mesh material={ceramica} position={[0.93, 0.66, 0]} rotation={[0, 0, -0.18]}>
        <torusGeometry args={[0.27, 0.065, 24, 64, Math.PI * 1.25]} />
      </mesh>
      {/* café: duas camadas para a troca suave entre bebidas */}
      <mesh position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.865, 96]} />
        <meshStandardMaterial ref={cafeB} map={texturas[capitulo]} roughness={0.25} metalness={0} />
      </mesh>
      <mesh position={[0, 1.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.865, 96]} />
        <meshStandardMaterial ref={cafeA} map={texturas[capitulo]} roughness={0.25} metalness={0} transparent />
      </mesh>
      {/* vapor */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 0.28, 1.95, (i % 2) * 0.1]} rotation={[0, (i - 1) * 0.5, 0]}>
          <planeGeometry args={[0.9, 1.8, 1, 24]} />
          <shaderMaterial
            ref={(m) => {
              if (m) vapores.current[i] = m;
            }}
            vertexShader={vaporVert}
            fragmentShader={vaporFrag}
            uniforms={uniformsVapor[i]}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
