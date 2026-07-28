(() => {
  "use strict";

  const root = document.querySelector("[data-speedtest]");
  if (!root) return;

  const isZh = root.dataset.locale === "zh";
  const endpoint = root.dataset.endpoint.replace(/\/$/, "");
  const ui = {
    start: document.getElementById("speedtest-start"),
    idleLabel: document.querySelector(".speedtest-start-idle"),
    activeLabel: document.querySelector(".speedtest-start-active"),
    status: document.getElementById("speedtest-status"),
    phase: document.getElementById("speedtest-phase"),
    liveValue: document.getElementById("speedtest-live-value"),
    liveUnit: document.getElementById("speedtest-live-unit"),
    gauge: document.getElementById("speedtest-gauge"),
    ping: document.getElementById("speedtest-ping"),
    jitter: document.getElementById("speedtest-jitter"),
    download: document.getElementById("speedtest-download"),
    upload: document.getElementById("speedtest-upload"),
    node: document.getElementById("speedtest-node"),
    connection: document.getElementById("speedtest-connection"),
    time: document.getElementById("speedtest-time"),
  };

  const copy = isZh
    ? {
        ready: "准备就绪",
        starting: "正在连接测速节点…",
        ping: "正在测试延迟",
        download: "正在测试下载",
        upload: "正在测试上传",
        complete: "测试完成",
        stopped: "测试已停止，点击可重新开始。",
        failed: "测速未能完成。请检查网络、代理或内容拦截设置后重试。",
        offline: "设备当前处于离线状态。",
        saveData: "已开启省流量模式；测速仍会消耗较多流量。",
        runningPing: "正在发送多次小请求，计算延迟与抖动…",
        runningDownload: "正在通过多连接下载测试数据…",
        runningUpload: "正在上传测试数据…",
        done: "完成。结果反映此刻到 Cloudflare 边缘节点的网络表现。",
        unknown: "已联网",
      }
    : {
        ready: "Ready",
        starting: "Connecting to a test node…",
        ping: "Testing latency",
        download: "Testing download",
        upload: "Testing upload",
        complete: "Test complete",
        stopped: "Test stopped. Start again when ready.",
        failed: "The test could not finish. Check your network, proxy, or content-blocking settings and try again.",
        offline: "This device appears to be offline.",
        saveData: "Data Saver is on; this test can still use significant data.",
        runningPing: "Sending several small requests to calculate latency and jitter…",
        runningDownload: "Downloading test data over multiple connections…",
        runningUpload: "Uploading test data…",
        done: "Done. Results reflect the current route to a Cloudflare edge.",
        unknown: "Online",
      };

  const state = {
    running: false,
    controller: null,
    uploadRequests: new Set(),
    results: { ping: null, jitter: null, download: null, upload: null },
  };

  function formatNumber(value, digits = 1) {
    if (!Number.isFinite(value)) return "—";
    if (value >= 100) return Math.round(value).toLocaleString(isZh ? "zh-CN" : "en-US");
    if (value >= 10) return value.toFixed(1);
    return value.toFixed(digits);
  }

  function setProgress(value) {
    const clamped = Math.max(0, Math.min(1, value));
    ui.gauge.style.setProperty("--speed-progress", `${clamped * 270}deg`);
  }

  function setLive(phase, value = null, unit = "Mbps") {
    ui.phase.textContent = phase;
    ui.liveValue.textContent = value === null ? "—" : formatNumber(value);
    ui.liveUnit.textContent = unit;
  }

  function setMetric(name, value, max) {
    state.results[name] = value;
    ui[name].textContent = formatNumber(value);
    const line = document.getElementById(`speedtest-${name}-line`);
    line.style.width = `${Math.max(4, Math.min(100, (value / max) * 100))}%`;
    line.closest(".speedtest-result").classList.add("has-result");
  }

  function resetResults() {
    Object.keys(state.results).forEach((name) => {
      state.results[name] = null;
      ui[name].textContent = "—";
      const line = document.getElementById(`speedtest-${name}-line`);
      line.style.width = "0%";
      line.closest(".speedtest-result").classList.remove("has-result", "is-active");
    });
    ui.time.textContent = "—";
    setProgress(0);
    setLive(copy.ready);
  }

  function setActiveMetric(name) {
    document.querySelectorAll(".speedtest-result").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.metric === name);
    });
  }

  function updateConnectionLabel() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const parts = [];
    if (connection && connection.effectiveType) parts.push(connection.effectiveType.toUpperCase());
    if (connection && Number.isFinite(connection.downlink)) parts.push(`≈ ${connection.downlink} Mbps`);
    ui.connection.textContent = parts.join(" · ") || copy.unknown;
    return connection;
  }

  function abortAll() {
    if (state.controller) state.controller.abort();
    state.uploadRequests.forEach((request) => request.abort());
    state.uploadRequests.clear();
  }

  function setRunning(running) {
    state.running = running;
    ui.start.classList.toggle("is-running", running);
    ui.idleLabel.hidden = running;
    ui.activeLabel.hidden = !running;
  }

  function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  }

  function trimmedMean(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const trim = sorted.length >= 6 ? 1 : 0;
    const kept = sorted.slice(trim, sorted.length - trim || undefined);
    return kept.reduce((sum, value) => sum + value, 0) / kept.length;
  }

  function wait(ms, signal) {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true }
      );
    });
  }

  async function timedFetch(url, options, parentSignal, timeoutMs = 8000) {
    const controller = new AbortController();
    let timedOut = false;
    const relayAbort = () => controller.abort();
    if (parentSignal.aborted) controller.abort();
    else parentSignal.addEventListener("abort", relayAbort, { once: true });
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      if (timedOut && !parentSignal.aborted) throw new Error("Network request timed out");
      throw error;
    } finally {
      window.clearTimeout(timer);
      parentSignal.removeEventListener("abort", relayAbort);
    }
  }

  async function pingOnce(signal, exposeNode = false) {
    const started = performance.now();
    const response = await timedFetch(
      `${endpoint}/__down?bytes=0&r=${Math.random()}`,
      { cache: "no-store" },
      signal
    );
    if (!response.ok) throw new Error(`Ping failed: ${response.status}`);
    await response.arrayBuffer();
    if (exposeNode) {
      const colo = response.headers.get("cf-meta-colo");
      if (colo) ui.node.textContent = colo.toUpperCase();
    }
    return performance.now() - started;
  }

  async function measurePing(signal) {
    const samples = [];
    await pingOnce(signal, true);
    for (let index = 0; index < 9; index += 1) {
      samples.push(await pingOnce(signal, index === 0));
      setProgress(0.05 + ((index + 1) / 9) * 0.2);
      setLive(copy.ping, median(samples), "ms");
      if (index < 8) await wait(90, signal);
    }
    const latency = median(samples);
    const differences = samples.slice(1).map((value, index) => Math.abs(value - samples[index]));
    return { latency, jitter: trimmedMean(differences) };
  }

  async function downloadWorker(shared, signal, stopAt) {
    while (!signal.aborted && performance.now() < stopAt && shared.bytes < shared.budget) {
      const remaining = shared.budget - shared.bytes;
      const size = Math.min(20 * 1024 * 1024, Math.max(512 * 1024, remaining));
      const response = await fetch(`${endpoint}/__down?bytes=${size}&r=${Math.random()}`, {
        cache: "no-store",
        signal,
      });
      if (!response.ok || !response.body) throw new Error(`Download failed: ${response.status}`);
      const reader = response.body.getReader();
      while (!signal.aborted && shared.bytes < shared.budget) {
        const { done, value } = await reader.read();
        if (done) break;
        shared.bytes += value.byteLength;
        if (shared.bytes >= shared.budget || performance.now() >= stopAt) {
          await reader.cancel();
          break;
        }
      }
    }
  }

  async function measureDownload(signal, onUpdate) {
    await timedFetch(
      `${endpoint}/__down?bytes=100000&r=${Math.random()}`,
      { cache: "no-store" },
      signal
    );

    const shared = { bytes: 0, budget: 180 * 1024 * 1024 };
    const started = performance.now();
    const stopAt = started + 8000;
    const controller = new AbortController();
    const relayAbort = () => controller.abort();
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", relayAbort, { once: true });
    const deadline = window.setTimeout(() => controller.abort(), 8000);
    const ticker = window.setInterval(() => {
      const elapsed = (performance.now() - started) / 1000;
      if (elapsed > 0.2) onUpdate((shared.bytes * 8) / elapsed / 1e6, elapsed / 8);
    }, 180);

    try {
      await Promise.all(
        Array.from({ length: 4 }, () => downloadWorker(shared, controller.signal, stopAt))
      );
    } catch (error) {
      if (signal.aborted || (error && error.name !== "AbortError")) throw error;
    } finally {
      window.clearInterval(ticker);
      window.clearTimeout(deadline);
      signal.removeEventListener("abort", relayAbort);
    }
    const elapsed = Math.max(0.001, (performance.now() - started) / 1000);
    return (shared.bytes * 8) / elapsed / 1e6;
  }

  function uploadOnce(payload, shared, signal, stopAt) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      state.uploadRequests.add(request);
      let reported = 0;
      request.open("POST", `${endpoint}/__up?r=${Math.random()}`);
      request.timeout = Math.max(1000, stopAt - performance.now() + 1500);
      request.upload.onprogress = (event) => {
        const delta = Math.max(0, event.loaded - reported);
        reported = event.loaded;
        shared.bytes += delta;
      };
      request.onload = () => {
        state.uploadRequests.delete(request);
        request.status >= 200 && request.status < 300
          ? resolve()
          : reject(new Error(`Upload failed: ${request.status}`));
      };
      request.onerror = () => {
        state.uploadRequests.delete(request);
        reject(new Error("Upload failed"));
      };
      request.ontimeout = () => {
        state.uploadRequests.delete(request);
        resolve();
      };
      request.onabort = () => {
        state.uploadRequests.delete(request);
        signal.aborted ? reject(new DOMException("Aborted", "AbortError")) : resolve();
      };
      signal.addEventListener("abort", () => request.abort(), { once: true });
      request.send(payload);
    });
  }

  async function uploadWorker(payload, shared, signal, stopAt) {
    while (!signal.aborted && performance.now() < stopAt && shared.bytes < shared.budget) {
      await uploadOnce(payload, shared, signal, stopAt);
    }
  }

  async function measureUpload(signal, onUpdate) {
    const payload = new Blob([new Uint8Array(8 * 1024 * 1024)], { type: "application/octet-stream" });
    const shared = { bytes: 0, budget: 48 * 1024 * 1024 };
    const started = performance.now();
    const stopAt = started + 7000;
    const ticker = window.setInterval(() => {
      const elapsed = (performance.now() - started) / 1000;
      if (elapsed > 0.2) onUpdate((shared.bytes * 8) / elapsed / 1e6, elapsed / 7);
    }, 180);
    const deadline = window.setTimeout(() => {
      state.uploadRequests.forEach((request) => request.abort());
    }, 7000);

    try {
      await Promise.all(Array.from({ length: 2 }, () => uploadWorker(payload, shared, signal, stopAt)));
    } finally {
      window.clearInterval(ticker);
      window.clearTimeout(deadline);
    }
    const elapsed = Math.max(0.001, (performance.now() - started) / 1000);
    return (shared.bytes * 8) / elapsed / 1e6;
  }

  async function runTest() {
    if (state.running) {
      abortAll();
      return;
    }
    if (!navigator.onLine) {
      ui.status.textContent = copy.offline;
      return;
    }

    resetResults();
    setRunning(true);
    state.controller = new AbortController();
    const { signal } = state.controller;
    const connection = updateConnectionLabel();
    ui.status.textContent = connection && connection.saveData ? copy.saveData : copy.starting;

    try {
      setActiveMetric("ping");
      setLive(copy.ping, null, "ms");
      ui.status.textContent = copy.runningPing;
      const ping = await measurePing(signal);
      setMetric("ping", ping.latency, 180);
      setMetric("jitter", ping.jitter, 60);

      setActiveMetric("download");
      setLive(copy.download);
      ui.status.textContent = copy.runningDownload;
      const download = await measureDownload(signal, (value, progress) => {
        setLive(copy.download, value);
        setProgress(0.25 + Math.min(1, progress) * 0.4);
      });
      setMetric("download", download, 1000);

      setActiveMetric("upload");
      setLive(copy.upload);
      ui.status.textContent = copy.runningUpload;
      const upload = await measureUpload(signal, (value, progress) => {
        setLive(copy.upload, value);
        setProgress(0.65 + Math.min(1, progress) * 0.35);
      });
      setMetric("upload", upload, 500);

      setProgress(1);
      setLive(copy.complete);
      ui.liveValue.textContent = "✓";
      ui.liveUnit.textContent = isZh ? "四项完成" : "4 METRICS";
      ui.status.textContent = copy.done;
      ui.time.textContent = new Intl.DateTimeFormat(isZh ? "zh-CN" : "en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date());
    } catch (error) {
      if (error && error.name === "AbortError") {
        ui.status.textContent = copy.stopped;
        setLive(copy.ready);
      } else {
        console.error(error);
        ui.status.textContent = copy.failed;
        setLive(copy.ready);
      }
    } finally {
      abortAll();
      state.controller = null;
      setActiveMetric("");
      setRunning(false);
    }
  }

  ui.start.addEventListener("click", runTest);
  window.addEventListener("offline", updateConnectionLabel);
  window.addEventListener("online", updateConnectionLabel);
  updateConnectionLabel();
})();
