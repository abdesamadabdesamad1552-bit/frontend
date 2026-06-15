import { mkdir, writeFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";
import { EdgeTTS } from "node-edge-tts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");
const SLIDES_DIR = join(__dirname, "slides");
const VOICE_DIR = join(__dirname, "voice");
const PRODUCT_IMG = join(__dirname, "product.png").replace(/\\/g, "/");

// Creative Brief v3 — 30s GCC luxury ad (full script, timed)
const SCENES = [
  {
    time: "0:00–0:03",
    targetDuration: 3,
    hook: "لون بشرتك يستحق أكثر",
    main: "كل صباح… نفس السؤال",
    sub: "ليش لون بشرتي مو موحّد؟",
    showProduct: false,
    badge: "",
    voiceover: "كل صباح… ليش لون بشرتي مو موحّد؟",
  },
  {
    time: "0:03–0:07",
    targetDuration: 4,
    hook: "",
    main: "تصبّغات · بقع · هالات",
    sub: "جربنا كريمات كثيرة — بدون نتيجة",
    showProduct: false,
    badge: "",
    voiceover: "تصبّغات وبقع وهالات — جربنا كثير وما في نتيجة تثقين فيها.",
  },
  {
    time: "0:07–0:11",
    targetDuration: 4,
    hook: "الحل؟",
    main: "نقاء سيروم الإشراق",
    sub: "فيتامين سي مستقر — مصمّم للخليج",
    showProduct: true,
    badge: "الأكثر مبيعاً",
    voiceover: "الحل؟ نقاء سيروم الإشراق — فيتامين سي مستقر للخليج.",
  },
  {
    time: "0:11–0:18",
    targetDuration: 7,
    hook: "تركيزات حقيقية",
    main: "10% · 5% · 2%",
    sub: "Vit C · Niacinamide · Alpha Arbutin",
    showProduct: false,
    badge: "",
    ingredients: true,
    voiceover:
      "تركيزات حقيقية: فيتامين سي 10%، نياسيناميد 5%، وألفا أربوتين 2% — مع حمض الهيالورونيك.",
  },
  {
    time: "0:18–0:23",
    targetDuration: 5,
    hook: "النتيجة",
    main: "بشرة أوضح وأكثر توحّداً",
    sub: "3 قطرات · صباح ومساء",
    showProduct: true,
    beforeAfter: true,
    badge: "بعد 4 أسابيع",
    voiceover:
      "خفيف ويُمتَص — ثلاث قطرات. والنتيجة؟ بشرة أوضح وأكثر توحّداً.",
  },
  {
    time: "0:23–0:27",
    targetDuration: 4,
    hook: "ثقة حقيقية",
    main: "+2,347 عميلة",
    sub: "مكونات مثبتة علمياً",
    showProduct: true,
    badge: "نتائج مرئية ✨",
    voiceover: "أكثر من ألفين عميلة — مكونات مثبتة علمياً.",
  },
  {
    time: "0:27–0:30",
    targetDuration: 3,
    hook: "اطلبي الحين",
    main: "199 ر.س · توصيل مجاني",
    sub: "تدفعين لما يوصل · COD",
    showProduct: true,
    badge: "naqabeauty.store",
    cta: true,
    voiceover: "199 ريال — توصيل مجاني — تدفعين لما يوصل.",
  },
];

function slideHtml(scene) {
  const ingredientsBlock = scene.ingredients
    ? `
      <div class="ingredients">
        <div class="pill">Ethyl Ascorbic Acid 10%</div>
        <div class="pill">Niacinamide 5%</div>
        <div class="pill">Alpha Arbutin 2%</div>
        <div class="pill">Hyaluronic Acid</div>
      </div>`
    : "";

  const beforeAfterBlock = scene.beforeAfter
    ? `
      <div class="ba-wrap">
        <div class="ba-panel before">
          <span class="ba-label">قبل</span>
          <div class="ba-skin uneven"></div>
        </div>
        <div class="ba-divider"></div>
        <div class="ba-panel after">
          <span class="ba-label">بعد</span>
          <div class="ba-skin even"></div>
        </div>
      </div>
      <div class="ba-disclaimer">نتائج فردية — قد تختلف</div>`
    : "";

  const productBlock =
    scene.showProduct && !scene.beforeAfter
      ? `<img class="product" src="file:///${PRODUCT_IMG}" alt="نقاء سيروم الإشراق" />`
      : scene.showProduct && scene.beforeAfter
        ? `<img class="product small" src="file:///${PRODUCT_IMG}" alt="نقاء سيروم الإشراق" />`
        : "";

  const badge = scene.badge
    ? `<div class="badge ${scene.cta ? "cta" : ""}">${scene.badge}</div>`
    : "";

  const baStyles = scene.beforeAfter
    ? `
    .ba-wrap {
      display: flex;
      width: 100%;
      max-width: 860px;
      height: 320px;
      margin: 28px 0 12px;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(212, 165, 90, 0.35);
      box-shadow: 0 16px 48px rgba(0,0,0,0.35);
    }
    .ba-panel {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .ba-panel.before { background: rgba(0,0,0,0.25); }
    .ba-panel.after { background: rgba(212, 165, 90, 0.08); }
    .ba-label {
      position: absolute;
      top: 16px;
      font-size: 28px;
      font-weight: 700;
      color: #f0c987;
      background: rgba(0,0,0,0.45);
      padding: 6px 18px;
      border-radius: 999px;
    }
    .ba-skin {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      margin-top: 24px;
    }
    .ba-skin.uneven {
      background:
        radial-gradient(circle at 35% 40%, rgba(90, 55, 30, 0.55) 0%, transparent 28%),
        radial-gradient(circle at 65% 55%, rgba(80, 48, 28, 0.45) 0%, transparent 22%),
        radial-gradient(circle at 50% 70%, rgba(70, 42, 24, 0.4) 0%, transparent 20%),
        linear-gradient(145deg, #c4956a 0%, #a67c52 50%, #8b6344 100%);
      filter: saturate(0.85);
    }
    .ba-skin.even {
      background: linear-gradient(145deg, #d4a574 0%, #c4956a 50%, #b8875e 100%);
      box-shadow: 0 0 40px rgba(212, 165, 90, 0.35);
    }
    .ba-divider {
      width: 3px;
      background: linear-gradient(180deg, transparent, #d4a55a, transparent);
    }
    .ba-disclaimer {
      font-size: 22px;
      color: rgba(255, 247, 237, 0.45);
      margin-bottom: 8px;
    }
    .product.small {
      width: 220px;
      margin: 16px 0 8px;
    }
    .main { font-size: 56px; }
    .sub { font-size: 36px; }`
    : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      background:
        radial-gradient(circle at 50% 0%, rgba(212, 165, 90, 0.22) 0%, transparent 42%),
        radial-gradient(circle at 20% 80%, rgba(180, 83, 9, 0.12) 0%, transparent 35%),
        linear-gradient(165deg, #120c08 0%, #1a120b 45%, #0d0907 100%);
      color: #fff7ed;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 96px 72px;
      overflow: hidden;
      position: relative;
    }
    body::after {
      content: "";
      position: absolute;
      inset: 48px;
      border: 1px solid rgba(212, 165, 90, 0.18);
      border-radius: 32px;
      pointer-events: none;
    }
    .brand {
      position: absolute;
      top: 88px;
      font-size: 30px;
      letter-spacing: 4px;
      color: #d4a55a;
      font-weight: 700;
    }
    .hook {
      font-size: 40px;
      color: #f0c987;
      margin-bottom: 24px;
      font-weight: 600;
      text-align: center;
      min-height: 48px;
    }
    .main {
      font-size: 78px;
      line-height: 1.18;
      font-weight: 800;
      text-align: center;
      max-width: 920px;
      text-shadow: 0 8px 32px rgba(0,0,0,0.45);
    }
    .sub {
      margin-top: 32px;
      font-size: 42px;
      line-height: 1.4;
      text-align: center;
      color: rgba(255, 247, 237, 0.78);
      max-width: 900px;
      min-height: 58px;
    }
    .product {
      width: 560px;
      height: auto;
      margin: 44px 0 20px;
      filter: drop-shadow(0 28px 60px rgba(212, 165, 90, 0.35));
    }
    .badge {
      margin-top: 24px;
      background: rgba(212, 165, 90, 0.12);
      color: #f0c987;
      border: 1px solid rgba(212, 165, 90, 0.35);
      padding: 16px 34px;
      border-radius: 999px;
      font-size: 32px;
      font-weight: 700;
    }
    .badge.cta {
      background: linear-gradient(135deg, #b45309, #d97706);
      color: white;
      border-color: transparent;
      box-shadow: 0 12px 40px rgba(180, 83, 9, 0.35);
    }
    .ingredients {
      margin-top: 36px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      max-width: 860px;
    }
    .pill {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(212, 165, 90, 0.22);
      border-radius: 20px;
      padding: 20px 26px;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      color: #fff7ed;
    }
    .timecode {
      position: absolute;
      bottom: 88px;
      left: 72px;
      font-size: 26px;
      color: rgba(212, 165, 90, 0.55);
      letter-spacing: 1px;
    }
    ${baStyles}
  </style>
</head>
<body>
  <div class="brand">نقاء · Naqa Beauty</div>
  <div class="hook">${scene.hook || "&nbsp;"}</div>
  <div class="main">${scene.main}</div>
  <div class="sub">${scene.sub || "&nbsp;"}</div>
  ${beforeAfterBlock}
  ${productBlock}
  ${ingredientsBlock}
  ${badge}
  ${scene.time ? `<div class="timecode">${scene.time}</div>` : ""}
</body>
</html>`;
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
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        `"${file}"`,
      ],
      { shell: true },
    );
    let out = "";
    proc.stdout.on("data", (chunk) => {
      out += chunk;
    });
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(`ffprobe failed for ${file}`));
      else resolve(parseFloat(out.trim()));
    });
  });
}

async function renderSlides() {
  await rm(SLIDES_DIR, { recursive: true, force: true });
  await mkdir(SLIDES_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  for (let i = 0; i < SCENES.length; i++) {
    const htmlPath = join(SLIDES_DIR, `scene-${i}.html`);
    await writeFile(htmlPath, slideHtml(SCENES[i]), "utf8");
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, {
      waitUntil: "networkidle0",
    });
    await page.screenshot({
      path: join(SLIDES_DIR, `slide-${String(i).padStart(2, "0")}.png`),
      type: "png",
    });
    console.log(`Rendered slide ${i + 1}/${SCENES.length}`);
  }

  await browser.close();
}

async function generateVoiceovers() {
  await rm(VOICE_DIR, { recursive: true, force: true });
  await mkdir(VOICE_DIR, { recursive: true });

  const tts = new EdgeTTS({
    voice: "ar-SA-ZariyahNeural",
    lang: "ar-SA",
    rate: "+10%",
    pitch: "+1%",
    volume: "+8%",
    outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  });

  for (let i = 0; i < SCENES.length; i++) {
    const out = join(VOICE_DIR, `voice-${String(i).padStart(2, "0")}.mp3`);
    await tts.ttsPromise(SCENES[i].voiceover, out);
    console.log(`Voice ${i + 1}/${SCENES.length}`);
  }
}

async function buildVideo() {
  await mkdir(OUT_DIR, { recursive: true });

  const clipPaths = [];
  for (let i = 0; i < SCENES.length; i++) {
    const scene = SCENES[i];
    const slide = join(SLIDES_DIR, `slide-${String(i).padStart(2, "0")}.png`);
    const voice = join(VOICE_DIR, `voice-${String(i).padStart(2, "0")}.mp3`);
    const clip = join(OUT_DIR, `clip-${String(i).padStart(2, "0")}.mp4`);

    const audioDur = await probeDuration(voice);
    const target = scene.targetDuration ?? audioDur;
    const clipDur = target.toFixed(2);
    const fadeOutStart = Math.max(0, target - 0.35);
    const frames = Math.ceil(target * 30);

    // Speed up voice slightly if it runs long, keep within natural range
    const tempo = Math.min(1.35, Math.max(1, audioDur / target));
    const audioFilter =
      tempo > 1.01
        ? `-filter:a "atempo=${tempo.toFixed(3)}"`
        : "";

    const ffmpegArgs = [
      "-y",
      "-loop",
      "1",
      "-i",
      `"${slide}"`,
      "-i",
      `"${voice}"`,
      ...(tempo > 1.01 ? ["-filter:a", `atempo=${tempo.toFixed(3)}`] : []),
      "-t",
      clipDur,
      "-vf",
      `"zoompan=z='min(1.04,zoom+0.00045)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920,fade=t=in:st=0:d=0.3,fade=t=out:st=${fadeOutStart.toFixed(2)}:d=0.3"`,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      `"${clip}"`,
    ];

    await run("ffmpeg", ffmpegArgs);
    clipPaths.push(clip);
    console.log(
      `Built clip ${i + 1}/${SCENES.length} (${clipDur}s, tempo ${tempo.toFixed(2)}x)`,
    );
  }

  const listPath = join(OUT_DIR, "clips.txt");
  await writeFile(
    listPath,
    clipPaths.map((clip) => `file '${clip.replace(/\\/g, "/")}'`).join("\n"),
    "utf8",
  );

  const mergedVideo = join(OUT_DIR, "merged.mp4");
  const finalVideo = join(OUT_DIR, "radiance-serum-creative-brief.mp4");

  await run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    `"${listPath}"`,
    "-c",
    "copy",
    `"${mergedVideo}"`,
  ]);

  const mergedDur = await probeDuration(mergedVideo);

  await run("ffmpeg", [
    "-y",
    "-i",
    `"${mergedVideo}"`,
    "-f",
    "lavfi",
    "-i",
    `"anoisesrc=color=pink:amplitude=0.008:duration=${mergedDur.toFixed(2)}"`,
    "-filter_complex",
    `"[1:a]highpass=f=120,lowpass=f=8000,volume=0.08[bed];[0:a][bed]amix=inputs=2:duration=first:dropout_transition=2[aout]"`,
    "-map",
    "0:v",
    "-map",
    "[aout]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-movflags",
    "+faststart",
    `"${finalVideo}"`,
  ]);

  console.log(`\n✅ Video ready: ${finalVideo}`);
}

await renderSlides();
await generateVoiceovers();
await buildVideo();
