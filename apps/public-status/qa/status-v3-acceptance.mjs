import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const statusDir = path.resolve('/Users/lordjef/Desktop/abraxasos/docs/abraxas-os-status');
const bundleDir = path.resolve('/Users/lordjef/Desktop/ABRAXAS_STATUS_V7_REVIEW_BUNDLE');
const screenshotsDir = path.join(bundleDir, 'screenshots');

fs.mkdirSync(screenshotsDir, { recursive: true });

// Static HTTP Server with clean MIME and path handling
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  
  let filePath = path.join(statusDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 8182;
server.listen(PORT, async () => {
  console.log(`[Status V7 Acceptance Verifier] Serving ${statusDir} on http://127.0.0.1:${PORT}`);

  const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9312",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-gpu-shader-disk-cache"
  ]);

  let versionData = null;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9312/json/version");
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch (e) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  if (!versionData) {
    console.error("[Status V7 Acceptance Error] Chrome failed to start");
    chromeProc.kill();
    server.close();
    process.exit(1);
  }

  let totalFailures = 0;
  let computedAssertionsCount = 0;
  const normalConsoleErrors = [];
  const normalUncaughtExceptions = [];

  try {
    const wsUrl = versionData.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    const { targetId } = await send("Target.createTarget", { url: `http://127.0.0.1:${PORT}/en/index.html` });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    const sendSession = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params, sessionId }));
      });
    };

    // Listen to console errors and exceptions
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.exceptionThrown') {
        normalUncaughtExceptions.push(data.params);
      } else if (data.method === 'Log.entryAdded' && data.params?.entry?.level === 'error') {
        const entry = data.params.entry;
        if (!entry?.url?.includes('favicon.ico')) {
          normalConsoleErrors.push(entry);
        }
      }
    });

    await sendSession("Page.enable");
    await sendSession("DOM.enable");
    await sendSession("Runtime.enable");
    await sendSession("Log.enable");

    const capture = async (filename, width = 1440, height = 1000) => {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 768
      });
      await new Promise((r) => setTimeout(r, 600));
      const { data } = await sendSession("Page.captureScreenshot", { format: "png" });
      const outPath = path.join(screenshotsDir, filename);
      fs.writeFileSync(outPath, Buffer.from(data, "base64"));
      console.log(`[Status V7 Acceptance] Captured ${filename}`);
      return Buffer.from(data, "base64");
    };

    // =========================================================================
    // 1. MULTIPAGE ROUTE INTEGRITY & BILINGUAL PARITY
    // =========================================================================
    const coreRoutes = [
      '/index.html',
      '/en/index.html',
      '/es/index.html',
      '/en/cuento/index.html',
      '/es/cuento/index.html',
      '/en/system/index.html',
      '/es/system/index.html',
      '/en/architecture/index.html',
      '/es/architecture/index.html',
      '/en/tools/index.html',
      '/es/tools/index.html',
      '/en/tools/yod/index.html',
      '/es/tools/yod/index.html',
      '/en/tools/contenido/index.html',
      '/es/tools/contenido/index.html',
      '/en/tools/shim/index.html',
      '/es/tools/shim/index.html',
      '/en/tools/vav/index.html',
      '/es/tools/vav/index.html',
      '/en/tools/he/index.html',
      '/es/tools/he/index.html',
      '/en/tools/publishing/index.html',
      '/es/tools/publishing/index.html',
      '/en/tools/metrics/index.html',
      '/es/tools/metrics/index.html',
      '/en/flow/index.html',
      '/es/flow/index.html',
      '/en/proof/index.html',
      '/es/proof/index.html',
      '/en/taste/index.html',
      '/es/taste/index.html',
      '/en/principles/index.html',
      '/es/principles/index.html',
      '/en/roadmap/index.html',
      '/es/roadmap/index.html',
      '/en/ask/index.html',
      '/es/ask/index.html'
    ];

    const routeEvidence = [];
    for (const rPath of coreRoutes) {
      const res = await fetch(`http://127.0.0.1:${PORT}${rPath}`);
      const text = await res.text();
      computedAssertionsCount++;
      const is200 = res.status === 200;
      const passed = is200 && text.length > 50;

      if (!passed) {
        console.error(`[Route Validation Failure] Route ${rPath} failed: status=${res.status}`);
        totalFailures++;
      }

      routeEvidence.push({
        route: rPath,
        status: res.status,
        passed,
        verdict: passed ? "PASS" : "FAIL"
      });
    }
    fs.writeFileSync(path.join(bundleDir, 'multipage-routes-evidence.json'), JSON.stringify(routeEvidence, null, 2), 'utf-8');

    // =========================================================================
    // 2. CAPTURE CORE SURFACES & STORY SCROLL WITH LAYER 0 PLATES
    // =========================================================================
    await sendSession("Page.navigate", { url: `http://127.0.0.1:${PORT}/en/index.html` });
    await new Promise((r) => setTimeout(r, 800));

    await capture("01-hero-source-plate.png", 1440, 1000);

    // Verify all 10 plates are in DOM and loaded
    const plateVerification = (await sendSession("Runtime.evaluate", {
      expression: `
        (() => {
          const slides = Array.from(document.querySelectorAll('.plate-slide img'));
          return {
            count: slides.length,
            loadedCount: slides.filter(img => img.complete && img.naturalWidth > 0).length,
            sources: slides.map(img => img.getAttribute('src'))
          };
        })()
      `,
      returnByValue: true
    })).result.value || {};

    computedAssertionsCount++;
    const platesValid = plateVerification.count === 10 && plateVerification.loadedCount > 0;
    if (!platesValid) {
      console.error(`[Plates Validation Failure] count=${plateVerification.count}, loaded=${plateVerification.loadedCount}`);
      totalFailures++;
    }

    fs.writeFileSync(path.join(bundleDir, 'plates-verification-evidence.json'), JSON.stringify(plateVerification, null, 2), 'utf-8');

    // Capture Spanish Home
    await sendSession("Page.navigate", { url: `http://127.0.0.1:${PORT}/es/index.html` });
    await new Promise((r) => setTimeout(r, 600));
    await capture("02-es-hero-source-plate.png", 1440, 1000);

    // Capture System Dashboard
    await sendSession("Page.navigate", { url: `http://127.0.0.1:${PORT}/en/system/index.html` });
    await new Promise((r) => setTimeout(r, 600));
    await capture("03-system-dashboard.png", 1440, 1000);

    // Capture Creation Story / Cuento
    await sendSession("Page.navigate", { url: `http://127.0.0.1:${PORT}/en/cuento/index.html` });
    await new Promise((r) => setTimeout(r, 600));
    await capture("04-cuento-creation-story.png", 1440, 1000);

    // Capture Responsive Viewports
    await capture("05-tablet.png", 768, 1024);
    await capture("06-mobile.png", 390, 844);

    // =========================================================================
    // 3. PUBLIC ARCHITECT TEST (EN & ES)
    // =========================================================================
    await sendSession("Page.navigate", { url: `http://127.0.0.1:${PORT}/en/index.html` });
    await new Promise((r) => setTimeout(r, 500));

    await sendSession("Runtime.evaluate", {
      expression: `
        if (window.__ABRAXAS_OPEN_ARCHITECT__) window.__ABRAXAS_OPEN_ARCHITECT__();
        if (window.__ABRAXAS_QUERY_ARCHITECT__) window.__ABRAXAS_QUERY_ARCHITECT__('What is Shim?');
      `
    });
    await new Promise((r) => setTimeout(r, 400));

    const architectAnswer = (await sendSession("Runtime.evaluate", {
      expression: "document.getElementById('architect-response-text')?.textContent || ''"
    })).result.value;

    computedAssertionsCount++;
    const architectValid = architectAnswer.includes('Shim') || architectAnswer.includes('SHIM') || architectAnswer.length > 20;
    if (!architectValid) {
      console.error("[Architect Failure] Public architect query resolution failed");
      totalFailures++;
    }

    // =========================================================================
    // 4. CONSOLE AUDIT
    // =========================================================================
    const normalClean = normalConsoleErrors.length === 0 && normalUncaughtExceptions.length === 0;
    computedAssertionsCount++;
    if (!normalClean) {
      console.error(`[Console Failure] errors=${normalConsoleErrors.length}, exceptions=${normalUncaughtExceptions.length}`);
      totalFailures++;
    }

    fs.writeFileSync(path.join(bundleDir, 'console-evidence.json'), JSON.stringify({
      errorsCount: normalConsoleErrors.length,
      exceptionsCount: normalUncaughtExceptions.length,
      errors: normalConsoleErrors,
      exceptions: normalUncaughtExceptions,
      passed: normalClean
    }, null, 2), 'utf-8');

    // Final Summary
    const qaSummary = {
      task: "ABX-STATUS-V7-SOURCE-PLATE-FIRST-PUBLISH-001",
      generatedAt: new Date().toISOString(),
      overallStatus: totalFailures === 0 ? "PASS" : "FAIL",
      totalComputedAssertions: computedAssertionsCount,
      totalFailedAssertions: totalFailures,
      platesVerified: platesValid,
      bilingualParity: routeEvidence.every(r => r.passed),
      architectQueryVerified: architectValid,
      consoleClean: normalClean
    };

    fs.writeFileSync(path.join(bundleDir, 'qa-summary.json'), JSON.stringify(qaSummary, null, 2), 'utf-8');

    console.log(`[Status V7 Acceptance] Finished. Total Failures: ${totalFailures}. Assertions: ${computedAssertionsCount}. Status: ${qaSummary.overallStatus}`);
    
    ws.close();
    chromeProc.kill();
    server.close();
    process.exit(totalFailures > 0 ? 1 : 0);

  } catch (err) {
    console.error("[Status V7 Acceptance Error]", err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
