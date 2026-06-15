import { mkdir, writeFile, rm, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";
import { EdgeTTS } from "node-edge-tts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");
const UGC_DIR = join(__dirname, "ugc-assets");
const PRODUCT_IMG = join(__dirname, "product.png").replace(/\\/g, "/");
const PORTRAIT = join(__dirname, "ugc-avatar-portrait.png");

// UGC — خليجي طبيعي، كأنها صديقة تتكلم (مو إعلان رسمي)
const SEGMENTS = [
  {
    type: "avatar",
    voiceover:
      "قسم بالله… كنت أعاني من التصبّغات. كل صباح أشوف في المرآة ونفس المشكلة.",
  },
  {
    type: "broll",
    template: "vanity",
    voiceover: "بقع من الشمس، لون مو موحّد — تعبت منها صراحة.",
  },
  {
    type: "avatar",
    voiceover: "جربت كريمات كثير… والله ما في شيء أثبت معي.",
  },
  {
    type: "broll",
    template: "dropper",
    voiceover: "لحد ما جربت نقاء سيروم الإشراق — وفرق معي.",
  },
  {
    type: "avatar",
    voiceover: "يعني… بشرتي صارت أوضح وأكثر توحّداً. حسيت فرق حقيقي.",
  },
  {
    type: "broll",
    template: "ingredients",
    voiceover:
      "فيتامين سي عشرة بالمئة، نياسيناميد خمسة — تركيزات حقيقية مو بس كلام.",
  },
  {
    type: "avatar",
    voiceover: "خفيف، ما يدهن، ثلاث قطرات صباح ومساء — بسيط.",
  },
  {
    type: "broll",
    template: "texture",
    voiceover: "يُمتَص بسرعة… وما يحسس بشرتك.",
  },
  {
    type: "avatar",
    voiceover:
      "199 ريال وتوصيل مجاني — جربيه وقولي لي وش رأيك. أنا عن نفسي مبسوطة.",
  },
];

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
      [
        "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", `"${file}"`,
      ],
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

function brollHtml(template) {
  const templates = {
    vanity: `
      <div class="scene vanity">
        <div class="mirror-glow"></div>
        <img class="product hero" src="file:///${PRODUCT_IMG}" alt="" />
        <div class="caption">روتيني الصباحي ✨</div>
      </div>`,
    dropper: `
      <div class="scene dropper">
        <img class="product large" src="file:///${PRODUCT_IMG}" alt="" />
        <div class="drop d1"></div><div class="drop d2"></div><div class="drop d3"></div>
        <div class="caption">نقاء · سيروم الإشراق</div>
      </div>`,
    ingredients: `
      <div class="scene ingredients">
        <img class="product mid" src="file:///${PRODUCT_IMG}" alt="" />
        <div class="tags">
          <span>Vit C 10%</span><span>Niacinamide 5%</span><span>Alpha Arbutin 2%</span>
        </div>
      </div>`,
    texture: `
      <div class="scene texture">
        <div class="skin"></div>
        <div class="serum-line"></div>
        <img class="product small" src="file:///${PRODUCT_IMG}" alt="" />
        <div class="caption">يُمتَص في ثوانٍ</div>
      </div>`,
  };

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1080px; height:1920px; overflow:hidden;
    font-family: "Segoe UI", Tahoma, sans-serif;
    background: #0a0806;
  }
  .scene {
    width:100%; height:100%; position:relative;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  /* vanity */
  .vanity {
    background:
      radial-gradient(ellipse at 50% 20%, rgba(255,240,220,0.15) 0%, transparent 50%),
      linear-gradient(180deg, #1a1510 0%, #0d0a08 100%);
  }
  .mirror-glow {
    position:absolute; top:180px; width:600px; height:600px; border-radius:50%;
    background: radial-gradient(circle, rgba(212,165,90,0.2) 0%, transparent 70%);
    border: 2px solid rgba(212,165,90,0.15);
  }
  .vanity .hero { width:420px; margin-top:80px; filter: drop-shadow(0 40px 80px rgba(212,165,90,0.4)); }
  /* dropper */
  .dropper {
    background: radial-gradient(circle at 50% 30%, rgba(212,165,90,0.25) 0%, #0a0806 60%);
  }
  .dropper .large { width:680px; filter: drop-shadow(0 50px 100px rgba(0,0,0,0.6)); }
  .drop { position:absolute; width:24px; height:36px; background:linear-gradient(180deg,#f0c987,#d4a55a);
    border-radius:50% 50% 50% 50% / 30% 30% 70% 70%; opacity:0.9; }
  .d1 { top:42%; left:48%; animation: drip 1.2s ease-in infinite; }
  .d2 { top:44%; left:52%; animation: drip 1.2s ease-in 0.4s infinite; }
  .d3 { top:46%; left:50%; animation: drip 1.2s ease-in 0.8s infinite; }
  @keyframes drip { 0% { transform:translateY(0) scale(1); opacity:0.9; } 100% { transform:translateY(120px) scale(0.6); opacity:0; } }
  /* ingredients */
  .ingredients {
    background: linear-gradient(165deg, #120c08, #0d0907);
  }
  .ingredients .mid { width:480px; margin-bottom:48px; filter: drop-shadow(0 30px 60px rgba(212,165,90,0.35)); }
  .tags { display:flex; flex-direction:column; gap:16px; }
  .tags span {
    background:rgba(255,255,255,0.06); border:1px solid rgba(212,165,90,0.3);
    padding:18px 36px; border-radius:16px; font-size:34px; font-weight:700; color:#fff7ed;
  }
  /* texture */
  .texture {
    background: linear-gradient(180deg, #1a120b, #0a0806);
  }
  .skin {
    position:absolute; top:200px; width:700px; height:900px; border-radius:40px;
    background: linear-gradient(145deg, #c4956a, #a67c52);
    opacity:0.35;
  }
  .serum-line {
    position:absolute; top:480px; width:400px; height:8px; border-radius:4px;
    background: linear-gradient(90deg, transparent, rgba(240,201,135,0.8), transparent);
    box-shadow: 0 0 30px rgba(212,165,90,0.5);
  }
  .texture .small { width:280px; position:absolute; bottom:280px; right:120px;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)); }
  .caption {
    position:absolute; bottom:200px; font-size:38px; color:rgba(255,247,237,0.75); font-weight:600;
  }
</style></head>
<body>${templates[template]}</body></html>`;
}

async function generateVoices() {
  const voiceDir = join(UGC_DIR, "voice");
  await mkdir(voiceDir, { recursive: true });

  try {
    await access(join(voiceDir, "seg-00.mp3"));
    console.log("Reusing existing UGC voice files…");
    return;
  } catch { /* generate */ }

  const tts = new EdgeTTS({
    voice: "ar-SA-ZariyahNeural",
    lang: "ar-SA",
    rate: "+2%",
    pitch: "-2%",
    volume: "+5%",
    outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  });

  for (let i = 0; i < SEGMENTS.length; i++) {
    const out = join(voiceDir, `seg-${String(i).padStart(2, "0")}.mp3`);
    await tts.ttsPromise(SEGMENTS[i].voiceover, out);
    console.log(`Voice ${i + 1}/${SEGMENTS.length}`);
  }
}

async function renderBrollClip(index, template, duration) {
  const htmlPath = join(UGC_DIR, `broll-${index}.html`);
  await writeFile(htmlPath, brollHtml(template), "utf8");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle0" });

  const slide = join(UGC_DIR, `broll-${String(index).padStart(2, "0")}.png`);
  await page.screenshot({ path: slide, type: "png" });
  await browser.close();

  const fadeOut = Math.max(0, duration - 0.15);
  const out = join(UGC_DIR, `broll-v-${String(index).padStart(2, "0")}.mp4`);

  await run("ffmpeg", [
    "-y", "-loop", "1", "-i", `"${slide}"`,
    "-t", duration.toFixed(2),
    "-vf",
    `"scale=1080:1920,crop=1080:1920,noise=alls=3:allf=t+u,fade=t=in:st=0:d=0.1,fade=t=out:st=${fadeOut.toFixed(2)}:d=0.1"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    `"${out}"`,
  ]);
  return out;
}

async function buildAvatarClip(index, voicePath, duration) {
  const out = join(UGC_DIR, `avatar-${String(index).padStart(2, "0")}.mp4`);

  // Static portrait + grain/vignette — fast encode, UGC selfie feel
  const vf = [
    "scale=1080:1920:force_original_aspect_ratio=increase",
    "crop=1080:1920",
    "noise=alls=5:allf=t+u",
    "vignette=PI/4.5",
    "eq=brightness=0.01:saturation=1.04",
  ].join(",");

  await run("ffmpeg", [
    "-y", "-loop", "1", "-i", `"${PORTRAIT}"`,
    "-i", `"${voicePath}"`,
    "-t", duration.toFixed(2),
    "-vf", `"${vf}"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "128k", "-shortest",
    `"${out}"`,
  ]);
  return out;
}

async function muxBrollWithVoice(brollVideo, voicePath, duration, index) {
  const out = join(UGC_DIR, `broll-${String(index).padStart(2, "0")}.mp4`);
  const fadeOut = Math.max(0, duration - 0.15);
  await run("ffmpeg", [
    "-y", "-i", `"${brollVideo}"`, "-i", `"${voicePath}"`,
    "-t", duration.toFixed(2),
    "-vf", `"eq=brightness=0.02:saturation=1.08,noise=alls=4:allf=t+u,fade=t=in:st=0:d=0.12,fade=t=out:st=${fadeOut.toFixed(2)}:d=0.12"`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-shortest",
    `"${out}"`,
  ]);
  return out;
}

async function tryHeyGenClip(voiceover, index) {
  const key = process.env.HEYGEN_API_KEY;
  if (!key) return null;

  const clipPath = join(UGC_DIR, `heygen-${String(index).padStart(2, "0")}.mp4`);
  try {
    await access(clipPath);
    console.log(`  Using cached HeyGen clip ${index}`);
    return clipPath;
  } catch { /* generate */ }

  console.log(`  HeyGen: generating avatar clip ${index}…`);
  // Upload portrait as asset then create video — simplified: use image_url via public path won't work
  // User drops HEYGEN_API_KEY in env; full upload flow needs asset API
  return null;
}

async function buildAllClips() {
  await mkdir(UGC_DIR, { recursive: true });
  await access(PORTRAIT);

  const voiceDir = join(UGC_DIR, "voice");
  const clipPaths = [];

  for (let i = 0; i < SEGMENTS.length; i++) {
    const seg = SEGMENTS[i];
    const voicePath = join(voiceDir, `seg-${String(i).padStart(2, "0")}.mp3`);
    let audioDur = await probeDuration(voicePath);
    const duration = audioDur + 0.25;

    if (seg.type === "avatar") {
      const heygen = await tryHeyGenClip(seg.voiceover, i);
      if (heygen) {
        clipPaths.push(heygen);
      } else {
        const clip = await buildAvatarClip(i, voicePath, duration);
        clipPaths.push(clip);
      }
      console.log(`Avatar clip ${i + 1} (${duration.toFixed(1)}s)`);
    } else {
      const brollV = await renderBrollClip(i, seg.template, duration);
      const clip = await muxBrollWithVoice(brollV, voicePath, duration, i);
      clipPaths.push(clip);
      console.log(`B-roll clip ${i + 1} [${seg.template}] (${duration.toFixed(1)}s)`);
    }
  }
  return clipPaths;
}

async function mergeUgc(clipPaths) {
  const listPath = join(OUT_DIR, "ugc-clips.txt");
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    listPath,
    clipPaths.map((c) => `file '${c.replace(/\\/g, "/")}'`).join("\n"),
    "utf8",
  );

  const merged = join(OUT_DIR, "ugc-merged.mp4");
  const finalVideo = join(OUT_DIR, "radiance-serum-ugc.mp4");

  // Hard cuts (no crossfade) — UGC jump-cut feel
  await run("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", `"${listPath}"`,
    "-c", "copy", `"${merged}"`,
  ]);

  const dur = await probeDuration(merged);

  // Light room tone + normalize — hides AI voice edges
  await run("ffmpeg", [
    "-y", "-i", `"${merged}"`,
    "-f", "lavfi", "-i", `"anoisesrc=color=pink:amplitude=0.004:duration=${dur.toFixed(2)}"`,
    "-filter_complex",
    `"[1:a]highpass=f=200,lowpass=f=6000,volume=0.04[room];[0:a][room]amix=inputs=2:duration=first[aout];[0:v]eq=contrast=1.02:saturation=1.03[outv]"`,
    "-map", "[outv]", "-map", "[aout]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
    `"${finalVideo}"`,
  ]);

  console.log(`\n✅ UGC video ready: ${finalVideo}`);
  return finalVideo;
}

await generateVoices();
const clips = await buildAllClips();
await mergeUgc(clips);
