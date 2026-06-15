import { mkdir, writeFile, rm, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");
const SLIDES_DIR = join(__dirname, "slides");
const AVATAR_DIR = join(__dirname, "avatar-assets");
const VOICE_DIR = join(__dirname, "voice");

const SCENES = [
  { targetDuration: 3, avatarPos: "hero" },
  { targetDuration: 4, avatarPos: "left" },
  { targetDuration: 4, avatarPos: "hero" },
  { targetDuration: 7, avatarPos: "bl" },
  { targetDuration: 5, avatarPos: "top" },
  { targetDuration: 4, avatarPos: "hero" },
  { targetDuration: 3, avatarPos: "top-sm" },
];

const AVATAR_POSITIONS = {
  hero: { x: 370, y: 200, scale: 1.0 },
  left: { x: 60, y: 380, scale: 0.82 },
  bl: { x: 60, y: 1380, scale: 0.58 },
  top: { x: 400, y: 130, scale: 0.72 },
  "top-sm": { x: 430, y: 110, scale: 0.55 },
};

function avatarOnlyHtml() {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:400px; height:520px;
    background: transparent;
    display:flex; align-items:center; justify-content:center;
  }
</style></head>
<body>
<svg viewBox="0 0 400 520" width="400" height="520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="rgba(212,165,90,0.4)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a574"/><stop offset="100%" stop-color="#b8875e"/>
    </linearGradient>
    <linearGradient id="hijab" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5efe6"/><stop offset="100%" stop-color="#d9cfc0"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="260" rx="170" ry="200" fill="url(#glow)"/>
  <path d="M 60 340 Q 200 300 340 340 L 360 520 L 40 520 Z" fill="#1a1510"/>
  <path d="M 100 340 Q 200 320 300 340 L 310 480 L 90 480 Z" fill="#2a2218"/>
  <ellipse cx="200" cy="175" rx="115" ry="120" fill="url(#hijab)"/>
  <path d="M 85 175 Q 200 90 315 175 L 330 280 Q 200 250 70 280 Z" fill="#ebe3d6"/>
  <ellipse cx="200" cy="195" rx="72" ry="82" fill="url(#skin)"/>
  <ellipse class="eye-l" cx="172" cy="188" rx="14" ry="10" fill="#3d2a1f"/>
  <ellipse class="eye-r" cx="228" cy="188" rx="14" ry="10" fill="#3d2a1f"/>
  <circle cx="175" cy="185" r="4" fill="#fff"/>
  <circle cx="231" cy="185" r="4" fill="#fff"/>
  <path d="M 155 168 Q 172 160 188 168" stroke="#6b4423" stroke-width="3" fill="none"/>
  <path d="M 212 168 Q 228 160 245 168" stroke="#6b4423" stroke-width="3" fill="none"/>
  <path d="M 200 195 L 195 215 L 205 215" stroke="#a67c52" stroke-width="2" fill="none"/>
  <g class="avatar-mouth">
    <ellipse cx="200" cy="235" rx="22" ry="10" fill="#c4756a"/>
    <ellipse cx="200" cy="232" rx="18" ry="5" fill="#d4847a" opacity="0.6"/>
  </g>
  <path d="M 168 248 Q 200 258 232 248" stroke="#a67c52" stroke-width="2" fill="none" opacity="0.5"/>
</svg>
</body></html>`;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: "inherit", shell: true });
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

function probeDuration(file) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", `"${file}"`],
      { shell: true },
    );
    let out = "";
    proc.stdout.on("data", (c) => { out += c; });
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error("ffprobe failed"));
      else resolve(parseFloat(out.trim()));
    });
  });
}

async function ensureAssets() {
  await access(join(VOICE_DIR, "voice-00.mp3"));
  await access(join(SLIDES_DIR, "slide-00.png"));
}

async function renderAvatarLoop() {
  await rm(AVATAR_DIR, { recursive: true, force: true });
  await mkdir(AVATAR_DIR, { recursive: true });

  const htmlPath = join(AVATAR_DIR, "avatar.html");
  await writeFile(htmlPath, avatarOnlyHtml(), "utf8");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 520, deviceScaleFactor: 2 });
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle0" });

  const fps = 15;
  const loopSec = 2;
  const frames = fps * loopSec;

  for (let f = 0; f < frames; f++) {
    const t = f / fps;
    const talk = 0.4 + 0.6 * Math.abs(Math.sin(t * 14));
    const nod = Math.sin(t * 2.5) * 1.5;
    const blink = Math.sin(t * 0.9) > 0.93 ? 0.12 : 1;

    await page.evaluate(({ talk, nod, blink }) => {
      const mouth = document.querySelector(".avatar-mouth");
      if (mouth) mouth.setAttribute("transform", `translate(0 ${nod}) scale(1 ${talk})`);
      document.querySelectorAll(".eye-l,.eye-r").forEach((e) => {
        e.setAttribute("ry", String(10 * blink));
      });
    }, { talk, nod, blink });

    await page.screenshot({
      path: join(AVATAR_DIR, `af-${String(f).padStart(3, "0")}.png`),
      type: "png",
      omitBackground: true,
    });
  }

  await browser.close();

  const loopVideo = join(AVATAR_DIR, "avatar-loop.mp4");
  await run("ffmpeg", [
    "-y", "-framerate", String(fps),
    "-i", `"${join(AVATAR_DIR, "af-%03d.png")}"`,
    "-vf", "format=yuva420p",
    "-c:v", "libx264", "-pix_fmt", "yuva420p", "-t", String(loopSec),
    `"${loopVideo}"`,
  ]);

  console.log(`Avatar loop ready (${frames} frames)`);
  return loopVideo;
}

async function buildAvatarClips(loopVideo) {
  await mkdir(OUT_DIR, { recursive: true });
  const clipPaths = [];

  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    const slide = join(SLIDES_DIR, `slide-${String(i).padStart(2, "0")}.png`);
    const voice = join(VOICE_DIR, `voice-${String(i).padStart(2, "0")}.mp3`);
    const clip = join(OUT_DIR, `avatar-clip-${String(i).padStart(2, "0")}.mp4`);
    const pos = AVATAR_POSITIONS[scene.avatarPos];

    const audioDur = await probeDuration(voice);
    const target = scene.targetDuration;
    const tempo = Math.min(1.35, Math.max(1, audioDur / target));
    const fadeOut = Math.max(0, target - 0.3);
    const frames = Math.ceil(target * 30);
    const aw = Math.round(400 * pos.scale);
    const ah = Math.round(520 * pos.scale);

    const filter = [
      `[0:v]zoompan=z='min(1.04,zoom+0.00045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920,fade=t=in:st=0:d=0.25,fade=t=out:st=${fadeOut.toFixed(2)}:d=0.25[bg]`,
      `[1:v]scale=${aw}:${ah}[av]`,
      `[bg][av]overlay=${pos.x}:${pos.y}:shortest=1[out]`,
    ].join(";");

    await run("ffmpeg", [
      "-y", "-loop", "1", "-i", `"${slide}"`,
      "-stream_loop", "-1", "-i", `"${loopVideo}"`,
      "-i", `"${voice}"`,
      ...(tempo > 1.01 ? ["-filter:a", `atempo=${tempo.toFixed(3)}`] : []),
      "-t", target.toFixed(2),
      "-filter_complex", `"${filter}"`,
      "-map", "[out]", "-map", "2:a",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
      "-c:a", "aac", "-b:a", "128k", "-shortest",
      `"${clip}"`,
    ]);

    clipPaths.push(clip);
    console.log(`Avatar clip ${i + 1}/${SCENES.length} (${target}s)`);
  }

  return clipPaths;
}

async function mergeFinal(clipPaths) {
  const listPath = join(OUT_DIR, "avatar-clips.txt");
  await writeFile(
    listPath,
    clipPaths.map((c) => `file '${c.replace(/\\/g, "/")}'`).join("\n"),
    "utf8",
  );

  const merged = join(OUT_DIR, "avatar-merged.mp4");
  const finalVideo = join(OUT_DIR, "radiance-serum-ad-avatar.mp4");

  await run("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", `"${listPath}"`, "-c", "copy", `"${merged}"`,
  ]);

  const dur = await probeDuration(merged);

  await run("ffmpeg", [
    "-y", "-i", `"${merged}"`,
    "-f", "lavfi", "-i", `"anoisesrc=color=pink:amplitude=0.008:duration=${dur.toFixed(2)}"`,
    "-filter_complex",
    `"[1:a]highpass=f=120,lowpass=f=8000,volume=0.08[bed];[0:a][bed]amix=inputs=2:duration=first:dropout_transition=2[aout]"`,
    "-map", "0:v", "-map", "[aout]",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
    `"${finalVideo}"`,
  ]);

  console.log(`\n✅ Avatar video ready: ${finalVideo}`);
}

await ensureAssets();
const loop = await renderAvatarLoop();
const clips = await buildAvatarClips(loop);
await mergeFinal(clips);
