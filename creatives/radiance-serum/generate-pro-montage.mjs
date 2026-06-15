/**
 * Montage pro UGC — 3 مشاهد · 30 ثانية
 *  0-5s   Avatar Hook
 *  5-20s  B-roll (منتج → قبل → بعد) + Voiceover
 *  20-30s Avatar CTA
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";
import { EdgeTTS } from "node-edge-tts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FOOTAGE_DIR = join(__dirname, "footage");
const WORK_DIR = join(__dirname, "montage-work");
const OUT_DIR = join(__dirname, "output");
const PORTRAIT = join(__dirname, "ugc-avatar-portrait.png");
const PRODUCT_IMG = join(__dirname, "product.png");

const W = 1080;
const H = 1920;
const FPS = 30;
const XFADE = 0.5;

const TIMING = { hook: 5, broll: 15, cta: 10 };

const SCRIPT = {
  hook: "قسم بالله… كنت أعاني من التصبّغات. كل صباح نفس السؤال: ليش لون بشرتي مو موحّد؟",
  broll:
    "نقاء سيروم الإشراق غيّر لي كل شي. فيتامين سي عشرة بالمئة ونياسيناميد خمسة — تركيزات حقيقية. خفيف، ما يدهن، ويُمتَص بسرعة. شوفي الفرق بنفسك.",
  cta: "199 ريال وتوصيل مجاني — اطلبي دابا من naqabeauty.store. جربيه وقولي لي وش رأيك.",
};

const FOOTAGE = {
  avatarHook: join(FOOTAGE_DIR, "avatar-hook.mp4"),
  avatarCta: join(FOOTAGE_DIR, "avatar-cta.mp4"),
  product: join(FOOTAGE_DIR, "broll-product.mp4"),
  before: join(FOOTAGE_DIR, "broll-before.mp4"),
  after: join(FOOTAGE_DIR, "broll-after.mp4"),
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: "inherit", shell: true });
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });
}

function probe(path, field = "format=duration") {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "ffprobe",
      ["-v", "error", "-show_entries", field, "-of", "json", `"${path}"`],
      { shell: true },
    );
    let out = "";
    proc.stdout.on("data", (c) => { out += c; });
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(`ffprobe failed: ${path}`));
      else resolve(JSON.parse(out));
    });
  });
}

async function getDuration(path) {
  const j = await probe(path);
  return parseFloat(j.format.duration);
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function normalizeVideo(input, output, duration, extraVf = "") {
  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=increase`,
    `crop=${W}:${H}`,
    "fps=30",
    "format=yuv420p",
    extraVf,
  ].filter(Boolean).join(",");

  await run("ffmpeg", [
    "-y", "-i", `"${input}"`,
    "-t", String(duration),
    "-vf", `"${vf}"`,
    "-an",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "-crf", "18",
    `"${output}"`,
  ]);
}

async function normalizeWithAudio(input, output, duration, extraVf = "") {
  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=increase`,
    `crop=${W}:${H}`,
    "fps=30",
    "format=yuv420p",
    extraVf,
  ].filter(Boolean).join(",");

  await run("ffmpeg", [
    "-y", "-i", `"${input}"`,
    "-t", String(duration),
    "-vf", `"${vf}"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
    "-crf", "18", "-shortest",
    `"${output}"`,
  ]);
}

async function generateTts(text, outPath) {
  const tts = new EdgeTTS({
    voice: "ar-SA-ZariyahNeural",
    lang: "ar-SA",
    rate: "+3%",
    pitch: "-1%",
    volume: "+5%",
    outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  });
  await tts.ttsPromise(text, outPath);
}

async function buildAvatarFallback(text, outPath, duration) {
  const voice = outPath.replace(".mp4", ".mp3");
  await generateTts(text, voice);

  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=increase`,
    `crop=${W}:${H}`,
    "noise=alls=4:allf=t+u",
    "vignette=PI/4.5",
    "eq=brightness=0.01:saturation=1.03",
  ].join(",");

  await run("ffmpeg", [
    "-y", "-loop", "1", "-i", `"${PORTRAIT}"`,
    "-i", `"${voice}"`,
    "-t", String(duration),
    "-vf", `"${vf}"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "160k", "-shortest",
    "-crf", "18",
    `"${outPath}"`,
  ]);
}

async function overlayHtml(text, subtext = "") {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${W}px; height:${H}px;
    background: transparent;
    display:flex; flex-direction:column;
    align-items:center; justify-content:flex-end;
    padding-bottom: 160px;
  }
  .label {
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(212,165,90,0.45);
    color: #fff7ed;
    font-family: "Segoe UI", Tahoma, sans-serif;
    font-size: 42px; font-weight: 700;
    padding: 16px 40px; border-radius: 999px;
    text-shadow: 0 2px 12px rgba(0,0,0,0.5);
  }
  .sub {
    margin-top: 12px;
    font-size: 26px; color: rgba(255,247,237,0.65);
    font-family: "Segoe UI", Tahoma, sans-serif;
  }
</style></head>
<body>
  <div class="label">${text}</div>
  ${subtext ? `<div class="sub">${subtext}</div>` : ""}
</body></html>`;
}

async function renderOverlayPng(text, subtext, outPath) {
  const html = await overlayHtml(text, subtext);
  const htmlPath = outPath.replace(".png", ".html");
  await writeFile(htmlPath, html, "utf8");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: outPath, type: "png", omitBackground: true });
  await browser.close();
}

async function buildBrollFallback(type, outPath, duration) {
  const slidePath = join(WORK_DIR, `fallback-${type}.png`);
  const htmlPath = join(WORK_DIR, `fallback-${type}.html`);

  const content =
    type === "product"
      ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(165deg,#120c08,#0d0907)">
           <img src="file:///${PRODUCT_IMG.replace(/\\/g, "/")}" style="width:560px;filter:drop-shadow(0 40px 80px rgba(212,165,90,0.4))"/>
         </div>`
      : type === "before"
        ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1510">
             <div style="width:500px;height:500px;border-radius:50%;background:linear-gradient(145deg,#c4956a,#8b6344);
               filter:saturate(0.85);box-shadow:inset 0 0 80px rgba(0,0,0,0.3)"></div>
           </div>`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1510">
             <div style="width:500px;height:500px;border-radius:50%;background:linear-gradient(145deg,#d4a574,#b8875e);
               box-shadow:0 0 60px rgba(212,165,90,0.3)"></div>
           </div>`;

  await writeFile(htmlPath, `<!DOCTYPE html><html><body style="margin:0;width:${W}px;height:${H}px">${content}</body></html>`, "utf8");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H });
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle0" });
  await page.screenshot({ path: slidePath, type: "png" });
  await browser.close();

  await run("ffmpeg", [
    "-y", "-loop", "1", "-i", `"${slidePath}"`,
    "-t", String(duration),
    "-vf", `"scale=${W}:${H},format=yuv420p"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18",
    `"${outPath}"`,
  ]);
}

async function applyOverlay(input, overlayPng, output, duration) {
  await run("ffmpeg", [
    "-y", "-i", `"${input}"`, "-i", `"${overlayPng}"`,
    "-t", String(duration),
    "-filter_complex", `"[0:v][1:v]overlay=0:0:format=auto,format=yuv420p[v]"`,
    "-map", "[v]", "-an",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18",
    `"${output}"`,
  ]);
}

async function resolveClip(name, srcPath, fallbackFn, duration) {
  const out = join(WORK_DIR, `${name}.mp4`);

  if (await exists(srcPath)) {
    console.log(`  ✓ ${name}: ${srcPath}`);
    await normalizeWithAudio(srcPath, out, duration);
    return out;
  }

  console.log(`  ⚠ ${name}: ملف مفقود — fallback`);
  await fallbackFn(out, duration);
  return out;
}

async function resolveBrollClip(name, srcPath, fallbackFn, duration) {
  const out = join(WORK_DIR, `${name}.mp4`);

  if (await exists(srcPath)) {
    console.log(`  ✓ ${name}: ${srcPath}`);
    await normalizeVideo(srcPath, out, duration);
    return out;
  }

  console.log(`  ⚠ ${name}: ملف مفقود — fallback`);
  const fb = join(WORK_DIR, `${name}-fb.mp4`);
  await fallbackFn(fb, duration);
  await normalizeVideo(fb, out, duration);
  return out;
}

async function buildBrollScene() {
  const segDur = TIMING.broll / 3;
  const xfadeInner = 0.35;

  const product = await resolveBrollClip("product", FOOTAGE.product, (o, d) => buildBrollFallback("product", o, d), segDur);
  const beforeRaw = await resolveBrollClip("before", FOOTAGE.before, (o, d) => buildBrollFallback("before", o, d), segDur);
  const afterRaw = await resolveBrollClip("after", FOOTAGE.after, (o, d) => buildBrollFallback("after", o, d), segDur);

  const beforeOverlay = join(WORK_DIR, "overlay-before.png");
  const afterOverlay = join(WORK_DIR, "overlay-after.png");
  await renderOverlayPng("قبل الاستعمال", "نتائج فردية — قد تختلف", beforeOverlay);
  await renderOverlayPng("بعد شهر من الاستعمال", "نتائج فردية — قد تختلف", afterOverlay);

  const before = join(WORK_DIR, "before-tagged.mp4");
  const after = join(WORK_DIR, "after-tagged.mp4");
  await applyOverlay(beforeRaw, beforeOverlay, before, segDur);
  await applyOverlay(afterRaw, afterOverlay, after, segDur);

  const brollVo = join(WORK_DIR, "broll-vo.mp3");
  await generateTts(SCRIPT.broll, brollVo);

  const brollOut = join(WORK_DIR, "scene-broll.mp4");
  const offset1 = segDur - xfadeInner;
  const offset2 = segDur * 2 - xfadeInner * 2;

  await run("ffmpeg", [
    "-y",
    "-i", `"${product}"`,
    "-i", `"${before}"`,
    "-i", `"${after}"`,
    "-i", `"${brollVo}"`,
    "-filter_complex", `"\
[0:v][1:v]xfade=transition=fadeblack:duration=${xfadeInner}:offset=${offset1.toFixed(2)}[v01];\
[v01][2:v]xfade=transition=fadeblack:duration=${xfadeInner}:offset=${offset2.toFixed(2)}[vout];\
[vout]eq=contrast=1.02:saturation=1.04[outv];\
[3:a]afade=t=in:st=0:d=0.3,afade=t=out:st=${(TIMING.broll - 0.4).toFixed(2)}:d=0.4,aresample=48000[aout]"`,
    "-map", "[outv]", "-map", "[aout]",
    "-t", String(TIMING.broll),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18",
    "-c:a", "aac", "-b:a", "160k",
    `"${brollOut}"`,
  ]);

  return brollOut;
}

async function mergeThreeScenes(hookPath, brollPath, ctaPath) {
  const final = join(OUT_DIR, "radiance-serum-pro-montage.mp4");
  const totalDur = TIMING.hook + TIMING.broll + TIMING.cta - XFADE * 2;
  const offset1 = TIMING.hook - XFADE;
  const offset2 = TIMING.hook + TIMING.broll - XFADE * 2;

  await run("ffmpeg", [
    "-y",
    "-i", `"${hookPath}"`,
    "-i", `"${brollPath}"`,
    "-i", `"${ctaPath}"`,
    "-filter_complex", `"\
[0:v]setpts=PTS-STARTPTS[v0];\
[1:v]setpts=PTS-STARTPTS[v1];\
[2:v]setpts=PTS-STARTPTS[v2];\
[0:a]asetpts=PTS-STARTPTS[a0];\
[1:a]asetpts=PTS-STARTPTS[a1];\
[2:a]asetpts=PTS-STARTPTS[a2];\
[v0][v1]xfade=transition=fade:duration=${XFADE}:offset=${offset1.toFixed(2)}[v01];\
[v01][v2]xfade=transition=fade:duration=${XFADE}:offset=${offset2.toFixed(2)}[vout];\
[vout]noise=alls=3:allf=t+u,eq=contrast=1.02:saturation=1.03[outv];\
[a0][a1]acrossfade=d=${XFADE}:c1=tri:c2=tri[a01];\
[a01][a2]acrossfade=d=${XFADE}:c1=tri:c2=tri[aout]"`,
    "-map", "[outv]", "-map", "[aout]",
    "-t", String(totalDur),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-crf", "18",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
    `"${final}"`,
  ]);

  return final;
}

async function main() {
  await mkdir(FOOTAGE_DIR, { recursive: true });
  await mkdir(WORK_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log("\n🎬 Montage Pro — 3 مشاهد / 30 ثانية\n");

  const hookPath = await resolveClip(
    "scene-hook",
    FOOTAGE.avatarHook,
    (o, d) => buildAvatarFallback(SCRIPT.hook, o, d),
    TIMING.hook,
  );

  const ctaPath = await resolveClip(
    "scene-cta",
    FOOTAGE.avatarCta,
    (o, d) => buildAvatarFallback(SCRIPT.cta, o, d),
    TIMING.cta,
  );

  console.log("\n📹 المشهد 2 — B-roll + Voiceover…");
  const brollPath = await buildBrollScene();

  console.log("\n🔗 دمج المشاهد + transitions…");
  const final = await mergeThreeScenes(hookPath, brollPath, ctaPath);

  const dur = await getDuration(final);
  console.log(`\n✅ الفيديو جاهز: ${final}`);
  console.log(`   المدة: ${dur.toFixed(1)}s`);

  const hasAll = await Promise.all(Object.values(FOOTAGE).map(exists));
  if (hasAll.some((v) => !v)) {
    console.log("\n💡 حطّي ملفاتك فـ footage/ باش تستبدل fallbacks:");
    console.log("   avatar-hook.mp4 · avatar-cta.mp4 · broll-product.mp4 · broll-before.mp4 · broll-after.mp4");
    console.log("   (HeyGen lip-sync: صوّري avatar-hook و avatar-cta بنفس النص ديال SCRIPT)");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
