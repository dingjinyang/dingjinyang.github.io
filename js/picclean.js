(() => {
  "use strict";

  const root = document.querySelector("[data-picclean]");
  if (!root) return;

  const isZh = root.dataset.locale === "zh";
  const text = isZh
    ? {
        reading: "正在读取图片和隐藏信息…",
        loadingHeic: "正在加载苹果照片解码器…",
        decodingHeic: "正在解码 HEIC/HEIF 图片…",
        ready: "检查完成，可以继续遮盖或下载。",
        exporting: "正在生成并复查干净副本…",
        exported: "干净副本已下载。",
        chooseAnother: "请选择另一张图片重试。",
        fileTooLarge: "文件超过 25 MB。请先缩小文件后再试。",
        pixelsTooLarge: "图片超过 30 MP，可能导致手机浏览器内存不足。请先降低分辨率后再试。",
        unsupported: "目前支持 JPG、PNG、WebP、HEIC 和 HEIF。",
        decodeFailed: "图片无法解码，文件可能已损坏或使用了暂不支持的编码。",
        metadataFailed: "图片可以编辑，但隐藏信息读取失败；下载前请更加谨慎。",
        exportFailed: "无法生成干净副本，请换一个浏览器或降低图片分辨率后再试。",
        verifyFailed: "导出结果仍包含可识别的隐私元数据，已停止下载。",
        highTitle: "发现高风险隐藏信息",
        highDescription: "这张图片包含定位、身份或嵌入缩略图等信息。",
        mediumTitle: "发现可识别的隐藏信息",
        mediumDescription: "这张图片包含拍摄时间、设备或软件信息。",
        lowTitle: "未发现可读的隐私元数据",
        lowDescription: "仍请检查画面里是否有姓名、号码、人脸或地址。",
        metadataUnavailableTitle: "隐藏信息读取不完整",
        metadataUnavailableDescription: "你仍可遮盖画面并导出，但不能依赖本次报告判断风险。",
        emptyMetadata: "没有发现需要列出的隐私元数据。",
        location: "位置与 GPS",
        identity: "作者与设备标识",
        thumbnail: "嵌入缩略图",
        time: "拍摄与修改时间",
        device: "相机与设备",
        software: "软件与处理记录",
        notes: "描述与备注",
        high: "高风险",
        medium: "注意",
        info: "信息",
        thumbnailValue: "文件中包含一张额外的预览缩略图",
        mapShow: "查看大致位置",
        mapHide: "收起地图",
        mapPrivacy: "点击后会将约百米精度的位置发送给 OpenStreetMap。",
        mapTitle: "照片的大致拍摄位置",
        mapExternal: "在 OpenStreetMap 中打开",
        maskAdded: "已添加遮盖。可用方向键移动，Shift 加方向键调整大小。",
        maskSelected: "已选中遮盖。",
        maskStyleChanged: "已更改遮盖样式。",
        masksCount: (count) => `当前有 ${count} 个遮盖区域。`,
        buttonDownload: "下载干净副本",
        buttonExporting: "正在生成…",
      }
    : {
        reading: "Reading the image and hidden data…",
        loadingHeic: "Loading the Apple photo decoder…",
        decodingHeic: "Decoding the HEIC/HEIF image…",
        ready: "Check complete. Add covers or download when ready.",
        exporting: "Creating and checking the clean copy…",
        exported: "Your clean copy has been downloaded.",
        chooseAnother: "Choose another image and try again.",
        fileTooLarge: "This file is larger than 25 MB. Reduce its size and try again.",
        pixelsTooLarge: "This image is over 30 MP and may exhaust mobile browser memory. Reduce its resolution and try again.",
        unsupported: "PicClean currently supports JPG, PNG, WebP, HEIC, and HEIF.",
        decodeFailed: "The image could not be decoded. It may be damaged or use an unsupported encoding.",
        metadataFailed: "The image can be edited, but hidden data could not be read. Be extra careful before downloading.",
        exportFailed: "A clean copy could not be created. Try another browser or reduce the image resolution.",
        verifyFailed: "The exported copy still contains recognizable private metadata, so the download was stopped.",
        highTitle: "High-risk hidden data found",
        highDescription: "This image contains location, identity, or embedded thumbnail data.",
        mediumTitle: "Identifying hidden data found",
        mediumDescription: "This image contains capture time, device, or software information.",
        lowTitle: "No readable private metadata found",
        lowDescription: "Still check the visible image for names, numbers, faces, or addresses.",
        metadataUnavailableTitle: "Hidden data check was incomplete",
        metadataUnavailableDescription: "You can still cover and export the image, but do not rely on this report to judge risk.",
        emptyMetadata: "No private metadata was found to list.",
        location: "Location and GPS",
        identity: "Author and device IDs",
        thumbnail: "Embedded thumbnail",
        time: "Capture and edit times",
        device: "Camera and device",
        software: "Software history",
        notes: "Descriptions and notes",
        high: "High risk",
        medium: "Review",
        info: "Info",
        thumbnailValue: "The file contains an additional preview thumbnail",
        mapShow: "View approximate location",
        mapHide: "Hide map",
        mapPrivacy: "Clicking sends a roughly 100-meter location to OpenStreetMap.",
        mapTitle: "Approximate photo location",
        mapExternal: "Open in OpenStreetMap",
        maskAdded: "Cover added. Use arrow keys to move it and Shift plus arrows to resize.",
        maskSelected: "Cover selected.",
        maskStyleChanged: "Cover style changed.",
        masksCount: (count) => `${count} cover area${count === 1 ? "" : "s"} on the image.`,
        buttonDownload: "Download clean copy",
        buttonExporting: "Creating copy…",
      };

  const fieldLabels = isZh
    ? {
        coordinates: "拍摄位置",
        gpsTime: "GPS 时间",
        localTime: "当地时间",
        altitude: "海拔",
        speed: "移动速度",
        place: "地点",
        author: "作者",
        owner: "所有者",
        serial: "设备序列号",
        takenAt: "拍摄时间",
        modifiedAt: "修改时间",
        digitizedAt: "数字化时间",
        exposure: "曝光时间",
        device: "设备",
        lens: "镜头",
        lensRange: "镜头范围",
        focalLength: "焦距",
        aperture: "光圈",
        computer: "处理设备",
        software: "软件",
        note: "内容",
        focusArea: "主体区域",
        included: "状态",
      }
    : {
        coordinates: "Photo location",
        gpsTime: "GPS time",
        localTime: "Local time",
        altitude: "Altitude",
        speed: "Speed",
        place: "Place",
        author: "Author",
        owner: "Owner",
        serial: "Device serial",
        takenAt: "Captured",
        modifiedAt: "Modified",
        digitizedAt: "Digitized",
        exposure: "Exposure",
        device: "Device",
        lens: "Lens",
        lensRange: "Lens range",
        focalLength: "Focal length",
        aperture: "Aperture",
        computer: "Processing device",
        software: "Software",
        note: "Details",
        focusArea: "Subject area",
        included: "Status",
      };

  const MAX_BYTES = 25 * 1024 * 1024;
  const MAX_PIXELS = 30 * 1000 * 1000;
  const MAX_PREVIEW_WIDTH = 1400;
  const MAX_PREVIEW_HEIGHT = 1000;
  const MIN_MASK_SIZE = 0.008;
  const DEFAULT_MASK_STYLE = "black";
  const MASK_STYLES = {
    black: { color: "#11100f" },
    white: { color: "#ffffff" },
    gray: { color: "#6b7280" },
    red: { color: "#d23c35" },
    blue: { color: "#2267b5" },
    mosaic: { effect: "mosaic" },
  };

  const elements = {
    dropzone: document.getElementById("picclean-dropzone"),
    fileInput: document.getElementById("picclean-file"),
    status: document.getElementById("picclean-status"),
    statusText: document.getElementById("picclean-status-text"),
    error: document.getElementById("picclean-error"),
    errorText: document.getElementById("picclean-error-text"),
    errorReset: document.getElementById("picclean-error-reset"),
    workspace: document.getElementById("picclean-workspace"),
    fileType: document.getElementById("picclean-file-type"),
    fileName: document.getElementById("picclean-file-name"),
    fileDetails: document.getElementById("picclean-file-details"),
    newFile: document.getElementById("picclean-new-file"),
    canvasShell: document.getElementById("picclean-canvas-shell"),
    canvas: document.getElementById("picclean-canvas"),
    addMask: document.getElementById("picclean-add-mask"),
    undo: document.getElementById("picclean-undo"),
    redo: document.getElementById("picclean-redo"),
    deleteMask: document.getElementById("picclean-delete-mask"),
    maskStyleButtons: Array.from(document.querySelectorAll("[data-mask-style]")),
    riskSummary: document.getElementById("picclean-risk-summary"),
    riskTitle: document.getElementById("picclean-risk-title"),
    riskDescription: document.getElementById("picclean-risk-description"),
    metadataList: document.getElementById("picclean-metadata-list"),
    download: document.getElementById("picclean-download"),
  };

  const context = elements.canvas.getContext("2d", { alpha: true });
  const mosaicCanvas = document.createElement("canvas");
  const mosaicContext = mosaicCanvas.getContext("2d", { alpha: true });

  const state = {
    file: null,
    source: null,
    sourceUrl: null,
    width: 0,
    height: 0,
    masks: [],
    history: [],
    future: [],
    selected: -1,
    activeMaskStyle: DEFAULT_MASK_STYLE,
    pointerAction: null,
    metadataGroups: [],
    metadataReadable: true,
    heicLibraryPromise: null,
    operationId: 0,
  };

  function announce(message) {
    elements.statusText.textContent = message;
    elements.status.hidden = false;
  }

  function hideStatus() {
    elements.status.hidden = true;
  }

  function showError(message) {
    hideStatus();
    elements.dropzone.hidden = true;
    elements.workspace.hidden = true;
    elements.errorText.textContent = message;
    elements.error.hidden = false;
  }

  function setProcessing(processing, message = "") {
    elements.dropzone.classList.toggle("is-processing", processing);
    elements.dropzone.setAttribute("aria-busy", String(processing));
    elements.download.disabled = processing;
    if (message) announce(message);
  }

  function cloneMasks(masks = state.masks) {
    return masks.map((mask) => ({ ...mask }));
  }

  function cleanupSource() {
    if (state.source && typeof state.source.close === "function") {
      state.source.close();
    }
    if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl);
    state.source = null;
    state.sourceUrl = null;
  }

  function reset({ openPicker = false } = {}) {
    state.operationId += 1;
    cleanupSource();
    state.file = null;
    state.width = 0;
    state.height = 0;
    state.masks = [];
    state.history = [];
    state.future = [];
    state.selected = -1;
    state.activeMaskStyle = DEFAULT_MASK_STYLE;
    state.pointerAction = null;
    state.metadataGroups = [];
    state.metadataReadable = true;

    elements.fileInput.value = "";
    elements.metadataList.replaceChildren();
    elements.canvas.width = 1;
    elements.canvas.height = 1;
    elements.dropzone.hidden = false;
    elements.dropzone.classList.remove("is-processing", "is-dragover");
    elements.dropzone.setAttribute("aria-busy", "false");
    elements.workspace.hidden = true;
    elements.error.hidden = true;
    elements.status.hidden = true;
    elements.download.disabled = false;
    elements.download.querySelector("span:last-child").textContent = text.buttonDownload;
    updateToolbar();
    updateMaskStyleControls();

    if (openPicker) elements.fileInput.click();
  }

  function bytesLabel(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function formatValue(value) {
    if (value == null) return "";
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return new Intl.DateTimeFormat(isZh ? "zh-CN" : "en", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(value);
    }
    if (Array.isArray(value)) return value.map(formatValue).filter(Boolean).join(", ");
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (_) {
        return String(value);
      }
    }
    return String(value).replace(/\s+/g, " ").trim();
  }

  function truncate(value, max = 220) {
    const formatted = formatValue(value);
    return formatted.length > max ? `${formatted.slice(0, max - 1)}…` : formatted;
  }

  function getExtension(name) {
    const match = /\.([a-z0-9]+)$/i.exec(name || "");
    return match ? match[1].toLowerCase() : "";
  }

  async function isHeicFile(file) {
    const ext = getExtension(file.name);
    if (["heic", "heif"].includes(ext) || /hei[cf]/i.test(file.type)) return true;
    const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
    const signature = String.fromCharCode(...bytes);
    return /ftyp(?:heic|heix|hevc|hevx|heim|heis|mif1|msf1)/i.test(signature);
  }

  function isAllowedFile(file, heic) {
    if (heic) return true;
    const ext = getExtension(file.name);
    const allowedExt = ["jpg", "jpeg", "png", "webp"];
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];
    return allowedExt.includes(ext) || allowedMime.includes(file.type);
  }

  function loadImageElement(blob) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(blob);
      image.onload = () => {
        state.sourceUrl = url;
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image decode failed"));
      };
      image.src = url;
    });
  }

  async function decodeBlob(blob) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(blob, { imageOrientation: "from-image" });
      } catch (_) {
        try {
          return await createImageBitmap(blob);
        } catch (_) {
          // Fall through to the image element decoder.
        }
      }
    }
    return loadImageElement(blob);
  }

  function loadHeicLibrary() {
    if (state.heicLibraryPromise) return state.heicLibraryPromise;

    announce(text.loadingHeic);
    state.heicLibraryPromise = import(root.dataset.heicSrc);
    return state.heicLibraryPromise;
  }

  async function decodeFile(file, heic) {
    if (!heic) return decodeBlob(file);

    // Safari may decode HEIC natively, avoiding the larger fallback library.
    try {
      return await decodeBlob(file);
    } catch (_) {
      const heicModule = await loadHeicLibrary();
      announce(text.decodingHeic);
      const converted = await heicModule.heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.95,
      });
      const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
      if (!(convertedBlob instanceof Blob)) throw new Error("HEIC conversion failed");
      return decodeBlob(convertedBlob);
    }
  }

  function metadataEntries(metadata) {
    return Object.entries(metadata || {}).filter(([, value]) => {
      if (value == null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });
  }

  function coordinateValue(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (Array.isArray(value) && value.length) {
      const parts = value.slice(0, 3).map(Number);
      if (parts.some((part) => !Number.isFinite(part))) return null;
      return Math.abs(parts[0]) + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
    }
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  function extractCoordinates(metadata) {
    const entries = Object.entries(metadata || {});
    const findValue = (...names) => {
      const normalizedNames = names.map((name) => name.toLowerCase());
      const match = entries.find(([key]) => normalizedNames.includes(key.toLowerCase()));
      return match ? match[1] : null;
    };

    let latitude = coordinateValue(findValue("latitude", "gpslatitude"));
    let longitude = coordinateValue(findValue("longitude", "gpslongitude"));
    if (latitude == null || longitude == null) return null;

    const latitudeRef = String(findValue("gpslatituderef", "latituderef") || "").toUpperCase();
    const longitudeRef = String(findValue("gpslongituderef", "longituderef") || "").toUpperCase();
    if (latitudeRef === "S") latitude = -Math.abs(latitude);
    if (longitudeRef === "W") longitude = -Math.abs(longitude);

    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
    return { latitude, longitude };
  }

  function metadataValue(entries, ...names) {
    const normalizedNames = names.map((name) => name.toLowerCase());
    const match = entries.find(([key]) => normalizedNames.includes(key.toLowerCase()));
    return match ? match[1] : null;
  }

  function roundedNumber(value, digits = 1) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "";
    return new Intl.NumberFormat(isZh ? "zh-CN" : "en", {
      maximumFractionDigits: digits,
    }).format(number);
  }

  function coordinateLabel({ latitude, longitude }) {
    const latitudeDirection = latitude >= 0 ? "N" : "S";
    const longitudeDirection = longitude >= 0 ? "E" : "W";
    return `${Math.abs(latitude).toFixed(4)}°${latitudeDirection} · ${Math.abs(longitude).toFixed(4)}°${longitudeDirection}`;
  }

  function gpsUtcDate(entries) {
    const dateValue = metadataValue(entries, "GPSDateStamp");
    const timeValue = metadataValue(entries, "GPSTimeStamp");
    if (!dateValue || !timeValue) return null;

    let dateParts;
    if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
      dateParts = [
        dateValue.getUTCFullYear(),
        dateValue.getUTCMonth() + 1,
        dateValue.getUTCDate(),
      ];
    } else {
      const matches = String(dateValue).match(/\d+/g);
      if (!matches || matches.length < 3) return null;
      dateParts = matches.slice(0, 3).map(Number);
    }

    let timeParts;
    if (Array.isArray(timeValue)) {
      timeParts = timeValue.slice(0, 3).map(Number);
    } else {
      const matches = String(timeValue).match(/\d+(?:\.\d+)?/g);
      if (!matches || matches.length < 3) return null;
      timeParts = matches.slice(0, 3).map(Number);
    }
    if ([...dateParts, ...timeParts].some((part) => !Number.isFinite(part))) return null;

    const [year, month, day] = dateParts;
    const [hour, minute, rawSecond] = timeParts;
    const second = Math.floor(rawSecond);
    const millisecond = Math.round((rawSecond - second) * 1000);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function timeZoneOffsetLabel(date, timeZone) {
    try {
      const parts = new Intl.DateTimeFormat("en", {
        timeZone,
        timeZoneName: "longOffset",
      }).formatToParts(date);
      const raw = parts.find((part) => part.type === "timeZoneName")?.value || "";
      if (raw === "GMT") return "UTC";
      return raw
        .replace(/^GMT/, "UTC")
        .replace(/([+-])0?(\d{1,2}):00$/, "$1$2");
    } catch (_) {
      return "";
    }
  }

  function localGpsTimeLabel(entries, coordinates) {
    if (!coordinates || typeof window.tzlookup !== "function") return null;
    const utcDate = gpsUtcDate(entries);
    if (!utcDate) return null;

    try {
      const timeZone = window.tzlookup(coordinates.latitude, coordinates.longitude);
      const formatted = new Intl.DateTimeFormat(isZh ? "zh-CN" : "en", {
        timeZone,
        year: "numeric",
        month: isZh ? "long" : "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).format(utcDate);
      const offset = timeZoneOffsetLabel(utcDate, timeZone);
      return {
        value: offset
          ? isZh ? `${formatted}（${offset}）` : `${formatted} (${offset})`
          : formatted,
        timeZone,
      };
    } catch (_) {
      return null;
    }
  }

  function dateLabel(value, offset = "") {
    const formatted = formatValue(value);
    if (!formatted) return "";
    const zone = String(offset || "").trim();
    if (!zone) return formatted;
    const normalizedZone = zone.startsWith("+") || zone.startsWith("-") ? `UTC${zone}` : zone;
    return isZh
      ? `${formatted}（${normalizedZone}）`
      : `${formatted} (${normalizedZone})`;
  }

  function exposureLabel(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds <= 0) return formatValue(value);
    if (seconds < 1) {
      const denominator = Math.round(1 / seconds);
      return isZh ? `1/${denominator} 秒` : `1/${denominator} sec`;
    }
    return isZh ? `${roundedNumber(seconds, 2)} 秒` : `${roundedNumber(seconds, 2)} sec`;
  }

  function lensInfoLabel(value) {
    if (!Array.isArray(value) || value.length < 4) return "";
    const [minFocal, maxFocal, minAperture, maxAperture] = value.map(Number);
    if ([minFocal, maxFocal, minAperture, maxAperture].some((part) => !Number.isFinite(part))) {
      return "";
    }
    const focal =
      Math.abs(minFocal - maxFocal) < 0.05
        ? `${roundedNumber(minFocal, 1)} mm`
        : `${roundedNumber(minFocal, 1)}–${roundedNumber(maxFocal, 1)} mm`;
    const aperture =
      Math.abs(minAperture - maxAperture) < 0.05
        ? `f/${roundedNumber(minAperture, 1)}`
        : `f/${roundedNumber(minAperture, 1)}–${roundedNumber(maxAperture, 1)}`;
    return `${focal} · ${aperture}`;
  }

  function lensModelLabel(make, model) {
    let readable = String(model || "").trim();
    const maker = String(make || "").trim();
    if (!readable) return "";
    if (maker && readable.toLowerCase().startsWith(`${maker.toLowerCase()} `)) {
      readable = readable.slice(maker.length).trim();
    }
    readable = readable.replace(/\s+\d+(?:\.\d+)?mm\s+f\/\d+(?:\.\d+)?\s*$/i, "");
    if (isZh) {
      readable = readable
        .replace(/\bback triple camera\b/i, "后置三摄")
        .replace(/\bback dual camera\b/i, "后置双摄")
        .replace(/\bback camera\b/i, "后置摄像头")
        .replace(/\bfront camera\b/i, "前置摄像头");
    } else {
      readable = readable
        .replace(/\bback triple camera\b/i, "rear triple camera")
        .replace(/\bback dual camera\b/i, "rear dual camera")
        .replace(/\bback camera\b/i, "rear camera");
    }
    return readable.trim();
  }

  function genericFieldLabel(key) {
    const known = {
      artist: fieldLabels.author,
      author: fieldLabels.author,
      creator: fieldLabels.author,
      ownername: fieldLabels.owner,
      cameraownername: fieldLabels.owner,
      bodyserialnumber: fieldLabels.serial,
      serialnumber: fieldLabels.serial,
      software: fieldLabels.software,
      imagemodel: fieldLabels.device,
      description: fieldLabels.note,
      imagedescription: fieldLabels.note,
      comment: fieldLabels.note,
      usercomment: fieldLabels.note,
      caption: fieldLabels.note,
      headline: fieldLabels.note,
      title: fieldLabels.note,
      subject: fieldLabels.note,
      keywords: fieldLabels.note,
    };
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (known[normalized]) return known[normalized];
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  function genericFieldValue(value) {
    if (value instanceof Date) return formatValue(value);
    if (Array.isArray(value)) {
      if (value.every((item) => typeof item === "number")) {
        return value.slice(0, 6).map((item) => roundedNumber(item, 2)).join(" · ");
      }
      return value.slice(0, 6).map(formatValue).filter(Boolean).join(isZh ? "、" : ", ");
    }
    if (typeof value === "object") {
      return isZh ? "包含结构化信息" : "Structured information present";
    }
    return truncate(value, 140);
  }

  function humanizeMetadataGroup(id, matching, allEntries, coordinates) {
    const items = [];
    const add = (label, value, kind = "") => {
      const formatted = String(value == null ? "" : value).trim();
      if (!formatted) return;
      if (items.some((item) => item.label === label && item.value === formatted)) return;
      items.push({ label, value: formatted, kind });
    };
    const find = (...names) => metadataValue(allEntries, ...names);

    if (id === "location") {
      if (coordinates) add(fieldLabels.coordinates, coordinateLabel(coordinates), "coordinates");

      const gpsDate = find("GPSDateStamp");
      const gpsTime = find("GPSTimeStamp");
      const localTime = localGpsTimeLabel(allEntries, coordinates);
      if (localTime) {
        add(fieldLabels.localTime, localTime.value, "local-time");
      } else if (gpsDate || gpsTime) {
        const timeValue = [formatValue(gpsDate), formatValue(gpsTime)].filter(Boolean).join(" ");
        add(fieldLabels.gpsTime, `${timeValue} UTC`);
      }

      const altitudeValue = find("GPSAltitude", "Altitude");
      const altitude = Number(altitudeValue);
      if (altitudeValue != null && Number.isFinite(altitude)) {
        add(fieldLabels.altitude, isZh ? `${roundedNumber(altitude, 1)} 米` : `${roundedNumber(altitude, 1)} m`);
      }

      const speedValue = find("GPSSpeed");
      const speed = Number(speedValue);
      if (speedValue != null && Number.isFinite(speed)) {
        const speedRef = String(find("GPSSpeedRef") || "").toUpperCase();
        const unit = speedRef === "M" ? "mph" : speedRef === "N" ? (isZh ? "节" : "kn") : "km/h";
        add(fieldLabels.speed, `${roundedNumber(speed, 1)} ${unit}`);
      }

      const place = [
        find("Sublocation", "Location"),
        find("City"),
        find("State", "Province"),
        find("Country", "CountryName"),
      ].map(formatValue).filter(Boolean);
      if (place.length) add(fieldLabels.place, [...new Set(place)].join(isZh ? "，" : ", "));
    }

    if (id === "identity") {
      matching.forEach(([key, value]) => {
        const normalized = key.toLowerCase();
        const label = /serial/.test(normalized)
          ? fieldLabels.serial
          : /owner/.test(normalized)
            ? fieldLabels.owner
            : fieldLabels.author;
        add(label, genericFieldValue(value));
      });
    }

    if (id === "time") {
      const original = find("DateTimeOriginal", "CreateDate", "DateCreated");
      const originalOffset = find("OffsetTimeOriginal", "OffsetTimeDigitized", "OffsetTime");
      const modified = find("ModifyDate", "ModificationDate");
      const modifiedOffset = find("OffsetTime");
      const digitized = find("DateTimeDigitized", "DigitizedDate");
      add(fieldLabels.takenAt, dateLabel(original, originalOffset));
      if (formatValue(modified) !== formatValue(original)) {
        add(fieldLabels.modifiedAt, dateLabel(modified, modifiedOffset));
      }
      if (
        formatValue(digitized) !== formatValue(original) &&
        formatValue(digitized) !== formatValue(modified)
      ) {
        add(fieldLabels.digitizedAt, dateLabel(digitized, find("OffsetTimeDigitized")));
      }
      const exposure = find("ExposureTime");
      if (exposure != null) add(fieldLabels.exposure, exposureLabel(exposure));
    }

    if (id === "device") {
      const make = formatValue(find("Make"));
      const model = formatValue(find("Model"));
      const device = [make, model].filter(Boolean);
      add(fieldLabels.device, [...new Set(device)].join(" "));

      const lensMake = formatValue(find("LensMake"));
      const lensModel = formatValue(find("LensModel"));
      add(fieldLabels.lens, lensModelLabel(lensMake, lensModel));
      add(fieldLabels.lensRange, lensInfoLabel(find("LensInfo")));

      const focalLength = find("FocalLength");
      if (focalLength != null) add(fieldLabels.focalLength, `${roundedNumber(focalLength, 1)} mm`);
      const aperture = find("FNumber", "ApertureValue");
      if (aperture != null) add(fieldLabels.aperture, `f/${roundedNumber(aperture, 1)}`);

      const computer = formatValue(find("HostComputer"));
      if (computer && !device.some((part) => part === computer)) add(fieldLabels.computer, computer);
    }

    if (id === "software") {
      matching.forEach(([key, value]) => add(genericFieldLabel(key), genericFieldValue(value)));
    }

    if (id === "notes") {
      matching.forEach(([key, value]) => {
        if (/subjectarea/i.test(key)) {
          add(
            fieldLabels.focusArea,
            isZh ? "照片中保存了对焦或主体区域信息" : "The photo stores focus or subject-area information"
          );
          return;
        }
        add(genericFieldLabel(key), genericFieldValue(value));
      });
    }

    if (!items.length) {
      matching.slice(0, 6).forEach(([key, value]) => {
        if (/ref$|offsettime|subsectime/i.test(key)) return;
        add(genericFieldLabel(key), genericFieldValue(value));
      });
    }
    return items.slice(0, 7);
  }

  function classifyMetadata(metadata, hasThumbnail = false) {
    const entries = metadataEntries(metadata);
    const groups = [];
    const coordinates = extractCoordinates(metadata);

    const addGroup = (id, level, label, patterns, itemsOverride) => {
      const matching = entries.filter(([key]) => patterns.some((pattern) => pattern.test(key)));
      const items = itemsOverride || humanizeMetadataGroup(id, matching, entries, coordinates);
      if (items.length) groups.push({ id, level, label, items });
    };

    addGroup("location", "high", text.location, [
      /^gps/i,
      /latitude/i,
      /longitude/i,
      /location/i,
      /sublocation/i,
      /^city$/i,
      /^country/i,
    ]);
    const locationGroup = groups.find((group) => group.id === "location");
    if (coordinates && locationGroup) {
      locationGroup.coordinates = {
        latitude: Number(coordinates.latitude.toFixed(3)),
        longitude: Number(coordinates.longitude.toFixed(3)),
      };
    }
    addGroup("identity", "high", text.identity, [
      /serial/i,
      /^artist$/i,
      /^author$/i,
      /owner/i,
      /^creator$/i,
      /^credit$/i,
      /^by-line$/i,
    ]);
    if (hasThumbnail) {
      groups.push({
        id: "thumbnail",
        level: "high",
        label: text.thumbnail,
        items: [{ label: fieldLabels.included, value: text.thumbnailValue }],
      });
    }
    addGroup("time", "medium", text.time, [
      /date/i,
      /time/i,
      /created/i,
      /modified/i,
      /digitized/i,
    ]);
    addGroup("device", "medium", text.device, [
      /^make$/i,
      /^model$/i,
      /lens/i,
      /camera/i,
      /hostcomputer/i,
      /focallength/i,
      /fnumber/i,
      /aperture/i,
    ]);
    addGroup("software", "medium", text.software, [
      /software/i,
      /history/i,
      /application/i,
      /producer/i,
      /processing/i,
    ]);
    addGroup("notes", "medium", text.notes, [
      /comment/i,
      /description/i,
      /caption/i,
      /headline/i,
      /subject/i,
      /keyword/i,
      /title/i,
    ]);

    return groups;
  }

  function mapEmbedUrl({ latitude, longitude }) {
    const url = new URL(root.dataset.mapEmbedBase);
    const latitudeSpan = 0.012;
    const longitudeSpan = 0.018;
    url.searchParams.set(
      "bbox",
      [
        (longitude - longitudeSpan).toFixed(3),
        (latitude - latitudeSpan).toFixed(3),
        (longitude + longitudeSpan).toFixed(3),
        (latitude + latitudeSpan).toFixed(3),
      ].join(",")
    );
    url.searchParams.set("layer", "mapnik");
    url.searchParams.set("marker", `${latitude.toFixed(3)},${longitude.toFixed(3)}`);
    return url.toString();
  }

  function mapViewUrl({ latitude, longitude }) {
    const url = new URL(root.dataset.mapViewBase);
    url.searchParams.set("mlat", latitude.toFixed(3));
    url.searchParams.set("mlon", longitude.toFixed(3));
    url.hash = `map=13/${latitude.toFixed(3)}/${longitude.toFixed(3)}`;
    return url.toString();
  }

  function createMapDisclosure(group, index) {
    const disclosure = document.createElement("div");
    disclosure.className = "metadata-map";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "metadata-map-button";
    button.setAttribute("aria-expanded", "false");
    const mapId = `picclean-map-${index}`;
    button.setAttribute("aria-controls", mapId);

    const icon = document.createElement("span");
    icon.className = "metadata-map-icon";
    icon.setAttribute("aria-hidden", "true");
    const buttonLabel = document.createElement("span");
    buttonLabel.textContent = text.mapShow;
    button.append(icon, buttonLabel);

    const privacy = document.createElement("p");
    privacy.className = "metadata-map-privacy";
    privacy.textContent = text.mapPrivacy;

    const mapShell = document.createElement("div");
    mapShell.className = "metadata-map-shell";
    mapShell.id = mapId;
    mapShell.hidden = true;

    let frame = null;
    button.addEventListener("click", () => {
      if (!frame) {
        frame = document.createElement("iframe");
        frame.title = text.mapTitle;
        frame.loading = "lazy";
        frame.src = mapEmbedUrl(group.coordinates);
        frame.setAttribute("allowfullscreen", "");

        const externalLink = document.createElement("a");
        externalLink.href = mapViewUrl(group.coordinates);
        externalLink.target = "_blank";
        externalLink.rel = "noopener";
        externalLink.textContent = text.mapExternal;
        mapShell.append(frame, externalLink);
      }

      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      buttonLabel.textContent = expanded ? text.mapShow : text.mapHide;
      mapShell.hidden = expanded;
    });

    disclosure.append(button, privacy, mapShell);
    return disclosure;
  }

  async function inspectMetadata(file) {
    if (!window.exifr) throw new Error("Metadata reader unavailable");

    const [metadataResult, thumbnailResult] = await Promise.allSettled([
      window.exifr.parse(file, {
        tiff: true,
        ifd1: true,
        exif: true,
        gps: true,
        interop: false,
        makerNote: false,
        userComment: true,
        xmp: true,
        iptc: true,
        icc: false,
        jfif: false,
        ihdr: false,
        sanitize: true,
        mergeOutput: true,
      }),
      window.exifr.thumbnail(file),
    ]);

    if (metadataResult.status === "rejected") throw metadataResult.reason;
    const metadata = metadataResult.value || {};
    const hasThumbnail =
      thumbnailResult.status === "fulfilled" &&
      thumbnailResult.value &&
      thumbnailResult.value.byteLength > 0;
    return classifyMetadata(metadata, hasThumbnail);
  }

  function renderMetadataReport() {
    elements.metadataList.replaceChildren();
    elements.riskSummary.classList.remove("risk-high", "risk-medium", "risk-low");

    if (!state.metadataReadable) {
      elements.riskSummary.classList.add("risk-medium");
      elements.riskTitle.textContent = text.metadataUnavailableTitle;
      elements.riskDescription.textContent = text.metadataUnavailableDescription;
    } else {
      const hasHigh = state.metadataGroups.some((group) => group.level === "high");
      const hasMedium = state.metadataGroups.some((group) => group.level === "medium");
      if (hasHigh) {
        elements.riskSummary.classList.add("risk-high");
        elements.riskTitle.textContent = text.highTitle;
        elements.riskDescription.textContent = text.highDescription;
      } else if (hasMedium) {
        elements.riskSummary.classList.add("risk-medium");
        elements.riskTitle.textContent = text.mediumTitle;
        elements.riskDescription.textContent = text.mediumDescription;
      } else {
        elements.riskSummary.classList.add("risk-low");
        elements.riskTitle.textContent = text.lowTitle;
        elements.riskDescription.textContent = text.lowDescription;
      }
    }

    if (!state.metadataGroups.length) {
      const empty = document.createElement("li");
      empty.className = "metadata-empty";
      empty.textContent = text.emptyMetadata;
      elements.metadataList.appendChild(empty);
      return;
    }

    state.metadataGroups.forEach((group, index) => {
      const item = document.createElement("li");
      item.className = "metadata-item";

      const heading = document.createElement("div");
      const label = document.createElement("strong");
      label.textContent = group.label;
      const level = document.createElement("span");
      level.className = `metadata-level ${group.level}`;
      level.textContent = text[group.level];
      heading.append(label, level);

      const facts = document.createElement("dl");
      facts.className = "metadata-facts";
      group.items.forEach((fact) => {
        const row = document.createElement("div");
        row.className = "metadata-fact";
        if (fact.kind) row.classList.add(`metadata-fact-${fact.kind}`);
        const term = document.createElement("dt");
        term.textContent = fact.label;
        const description = document.createElement("dd");
        description.textContent = fact.value;
        row.append(term, description);
        facts.appendChild(row);
      });
      item.append(heading, facts);
      if (group.id === "location" && group.coordinates) {
        item.appendChild(createMapDisclosure(group, index));
      }
      elements.metadataList.appendChild(item);
    });
  }

  function sourceDimensions(source) {
    return {
      width: source.width || source.naturalWidth,
      height: source.height || source.naturalHeight,
    };
  }

  function configureCanvas() {
    const scale = Math.min(
      1,
      MAX_PREVIEW_WIDTH / state.width,
      MAX_PREVIEW_HEIGHT / state.height
    );
    elements.canvas.width = Math.max(1, Math.round(state.width * scale));
    elements.canvas.height = Math.max(1, Math.round(state.height * scale));
    elements.canvas.style.aspectRatio = `${state.width} / ${state.height}`;
    renderCanvas();
  }

  function maskCanvasRect(mask, canvas = elements.canvas) {
    return {
      x: mask.x * canvas.width,
      y: mask.y * canvas.height,
      w: mask.w * canvas.width,
      h: mask.h * canvas.height,
    };
  }

  function drawMosaic(targetContext, rect) {
    if (!mosaicContext || rect.w <= 0 || rect.h <= 0) return;
    const canvas = targetContext.canvas;
    const blockSize = Math.max(10, Math.round(Math.min(canvas.width, canvas.height) * 0.018));
    const columns = Math.max(1, Math.ceil(rect.w / blockSize));
    const rows = Math.max(1, Math.ceil(rect.h / blockSize));

    mosaicCanvas.width = columns;
    mosaicCanvas.height = rows;
    mosaicContext.imageSmoothingEnabled = true;
    mosaicContext.clearRect(0, 0, columns, rows);
    mosaicContext.drawImage(
      canvas,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      columns,
      rows
    );

    targetContext.save();
    targetContext.imageSmoothingEnabled = false;
    targetContext.drawImage(
      mosaicCanvas,
      0,
      0,
      columns,
      rows,
      rect.x,
      rect.y,
      rect.w,
      rect.h
    );
    targetContext.restore();
  }

  function drawMaskEffect(targetContext, mask, canvas = targetContext.canvas) {
    const rect = maskCanvasRect(mask, canvas);
    const style = MASK_STYLES[mask.style] || MASK_STYLES[DEFAULT_MASK_STYLE];
    if (style.effect === "mosaic") {
      drawMosaic(targetContext, rect);
    } else {
      targetContext.save();
      targetContext.fillStyle = style.color;
      targetContext.fillRect(rect.x, rect.y, rect.w, rect.h);
      targetContext.restore();
    }
    return rect;
  }

  function renderCanvas() {
    if (!state.source || !elements.canvas.width || !elements.canvas.height) return;
    context.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    context.drawImage(state.source, 0, 0, elements.canvas.width, elements.canvas.height);

    state.masks.forEach((mask, index) => {
      const rect = drawMaskEffect(context, mask);
      context.save();

      if (index === state.selected) {
        const lineWidth = Math.max(2, elements.canvas.width / 700);
        context.strokeStyle = "#ff7849";
        context.lineWidth = lineWidth;
        context.setLineDash([lineWidth * 4, lineWidth * 2]);
        context.strokeRect(rect.x - lineWidth, rect.y - lineWidth, rect.w + lineWidth * 2, rect.h + lineWidth * 2);
        context.setLineDash([]);
        const handle = Math.max(10, elements.canvas.width / 75);
        context.fillStyle = "#ff7849";
        context.fillRect(rect.x + rect.w - handle / 2, rect.y + rect.h - handle / 2, handle, handle);
        context.fillStyle = "#fff";
        context.fillRect(
          rect.x + rect.w - handle / 6,
          rect.y + rect.h - handle / 6,
          handle / 3,
          handle / 3
        );
      }
      context.restore();
    });
  }

  function updateToolbar() {
    elements.undo.disabled = state.history.length === 0;
    elements.redo.disabled = state.future.length === 0;
    elements.deleteMask.disabled = state.selected < 0;
  }

  function updateMaskStyleControls() {
    elements.maskStyleButtons.forEach((button) => {
      const active = button.dataset.maskStyle === state.activeMaskStyle;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function syncMaskStyleFromSelection() {
    if (state.selected < 0 || !state.masks[state.selected]) return;
    state.activeMaskStyle = state.masks[state.selected].style || DEFAULT_MASK_STYLE;
    updateMaskStyleControls();
  }

  function selectMaskStyle(style) {
    if (!MASK_STYLES[style]) return;
    state.activeMaskStyle = style;
    updateMaskStyleControls();

    if (state.selected >= 0 && state.masks[state.selected]) {
      const currentStyle = state.masks[state.selected].style || DEFAULT_MASK_STYLE;
      if (currentStyle !== style) {
        const before = cloneMasks();
        state.masks[state.selected] = { ...state.masks[state.selected], style };
        commitChange(before);
        renderCanvas();
        announce(text.maskStyleChanged);
      }
    }
  }

  function commitChange(before) {
    state.history.push(before);
    if (state.history.length > 60) state.history.shift();
    state.future = [];
    updateToolbar();
    announce(text.masksCount(state.masks.length));
  }

  function addCenteredMask() {
    const before = cloneMasks();
    state.masks.push({
      x: 0.3,
      y: 0.4,
      w: 0.4,
      h: 0.16,
      style: state.activeMaskStyle,
    });
    state.selected = state.masks.length - 1;
    commitChange(before);
    renderCanvas();
    elements.canvas.focus();
    announce(text.maskAdded);
  }

  function deleteSelectedMask() {
    if (state.selected < 0) return;
    const before = cloneMasks();
    state.masks.splice(state.selected, 1);
    state.selected = Math.min(state.selected, state.masks.length - 1);
    syncMaskStyleFromSelection();
    commitChange(before);
    renderCanvas();
  }

  function undo() {
    if (!state.history.length) return;
    state.future.push(cloneMasks());
    state.masks = state.history.pop();
    state.selected = Math.min(state.selected, state.masks.length - 1);
    syncMaskStyleFromSelection();
    updateToolbar();
    renderCanvas();
    announce(text.masksCount(state.masks.length));
  }

  function redo() {
    if (!state.future.length) return;
    state.history.push(cloneMasks());
    state.masks = state.future.pop();
    state.selected = Math.min(state.selected, state.masks.length - 1);
    syncMaskStyleFromSelection();
    updateToolbar();
    renderCanvas();
    announce(text.masksCount(state.masks.length));
  }

  function pointerPosition(event) {
    const rect = elements.canvas.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  }

  function findMaskAt(point) {
    const rect = elements.canvas.getBoundingClientRect();
    const handleX = 18 / Math.max(1, rect.width);
    const handleY = 18 / Math.max(1, rect.height);

    for (let index = state.masks.length - 1; index >= 0; index -= 1) {
      const mask = state.masks[index];
      const nearHandle =
        Math.abs(point.x - (mask.x + mask.w)) <= handleX &&
        Math.abs(point.y - (mask.y + mask.h)) <= handleY;
      if (nearHandle) return { index, mode: "resize" };
      const inside =
        point.x >= mask.x &&
        point.x <= mask.x + mask.w &&
        point.y >= mask.y &&
        point.y <= mask.y + mask.h;
      if (inside) return { index, mode: "move" };
    }
    return { index: -1, mode: "draw" };
  }

  function normalizeMask(mask) {
    let { x, y, w, h } = mask;
    if (w < 0) {
      x += w;
      w = Math.abs(w);
    }
    if (h < 0) {
      y += h;
      h = Math.abs(h);
    }
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    w = Math.max(MIN_MASK_SIZE, Math.min(1 - x, w));
    h = Math.max(MIN_MASK_SIZE, Math.min(1 - y, h));
    return {
      ...mask,
      x,
      y,
      w,
      h,
      style: MASK_STYLES[mask.style] ? mask.style : DEFAULT_MASK_STYLE,
    };
  }

  function onPointerDown(event) {
    if (!state.source || event.button > 0) return;
    const point = pointerPosition(event);
    const hit = findMaskAt(point);
    const before = cloneMasks();

    if (hit.index >= 0) {
      state.selected = hit.index;
      syncMaskStyleFromSelection();
      state.pointerAction = {
        mode: hit.mode,
        start: point,
        original: { ...state.masks[hit.index] },
        before,
      };
      announce(text.maskSelected);
    } else {
      state.masks.push({
        x: point.x,
        y: point.y,
        w: 0,
        h: 0,
        style: state.activeMaskStyle,
      });
      state.selected = state.masks.length - 1;
      state.pointerAction = { mode: "draw", start: point, before };
    }

    elements.canvas.setPointerCapture(event.pointerId);
    elements.canvas.classList.toggle("is-moving", state.pointerAction.mode === "move");
    elements.canvas.classList.toggle("is-resizing", state.pointerAction.mode === "resize");
    updateToolbar();
    renderCanvas();
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!state.pointerAction || state.selected < 0) return;
    const point = pointerPosition(event);
    const action = state.pointerAction;
    let mask;

    if (action.mode === "draw") {
      mask = {
        x: action.start.x,
        y: action.start.y,
        w: point.x - action.start.x,
        h: point.y - action.start.y,
        style: state.activeMaskStyle,
      };
    } else if (action.mode === "move") {
      const dx = point.x - action.start.x;
      const dy = point.y - action.start.y;
      mask = {
        ...action.original,
        x: Math.max(0, Math.min(1 - action.original.w, action.original.x + dx)),
        y: Math.max(0, Math.min(1 - action.original.h, action.original.y + dy)),
      };
    } else {
      mask = {
        ...action.original,
        w: Math.max(MIN_MASK_SIZE, Math.min(1 - action.original.x, action.original.w + point.x - action.start.x)),
        h: Math.max(MIN_MASK_SIZE, Math.min(1 - action.original.y, action.original.h + point.y - action.start.y)),
      };
    }

    state.masks[state.selected] = action.mode === "draw" ? mask : normalizeMask(mask);
    renderCanvas();
    event.preventDefault();
  }

  function finishPointerAction(event) {
    if (!state.pointerAction) return;
    const action = state.pointerAction;
    const current = state.masks[state.selected];
    if (action.mode === "draw") {
      const normalized = normalizeMask(current);
      if (Math.abs(current.w) < MIN_MASK_SIZE || Math.abs(current.h) < MIN_MASK_SIZE) {
        state.masks.splice(state.selected, 1);
        state.selected = -1;
      } else {
        state.masks[state.selected] = normalized;
      }
    }
    state.pointerAction = null;
    elements.canvas.classList.remove("is-moving", "is-resizing");
    if (event && elements.canvas.hasPointerCapture(event.pointerId)) {
      elements.canvas.releasePointerCapture(event.pointerId);
    }
    commitChange(action.before);
    renderCanvas();
  }

  function onCanvasKeyDown(event) {
    if (state.selected < 0) {
      if (event.key === "Enter" || event.key === " ") {
        addCenteredMask();
        event.preventDefault();
      }
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      deleteSelectedMask();
      event.preventDefault();
      return;
    }

    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const before = cloneMasks();
    const mask = { ...state.masks[state.selected] };
    const stepX = Math.max(1 / elements.canvas.width, 0.0025);
    const stepY = Math.max(1 / elements.canvas.height, 0.0025);

    if (event.shiftKey) {
      if (event.key === "ArrowLeft") mask.w -= stepX;
      if (event.key === "ArrowRight") mask.w += stepX;
      if (event.key === "ArrowUp") mask.h -= stepY;
      if (event.key === "ArrowDown") mask.h += stepY;
    } else {
      if (event.key === "ArrowLeft") mask.x -= stepX;
      if (event.key === "ArrowRight") mask.x += stepX;
      if (event.key === "ArrowUp") mask.y -= stepY;
      if (event.key === "ArrowDown") mask.y += stepY;
    }

    state.masks[state.selected] = normalizeMask(mask);
    commitChange(before);
    renderCanvas();
    event.preventDefault();
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
        type,
        quality
      );
    });
  }

  function outputSettings(file) {
    const ext = getExtension(file.name);
    if (ext === "png" || file.type === "image/png") {
      return { type: "image/png", extension: "png", quality: undefined };
    }
    if (ext === "webp" || file.type === "image/webp") {
      return { type: "image/webp", extension: "webp", quality: 0.95 };
    }
    return { type: "image/jpeg", extension: "jpg", quality: 0.95 };
  }

  function cleanFileName(file, extension) {
    const original = (file.name || "image").replace(/\.[^.]+$/, "");
    const safe = original.replace(/[\\/:*?"<>|]+/g, "-").trim() || "image";
    return `${safe}-clean.${extension}`;
  }

  async function exportImage() {
    if (!state.source || !state.file) return;
    const originalLabel = elements.download.querySelector("span:last-child");
    elements.download.disabled = true;
    originalLabel.textContent = text.buttonExporting;
    announce(text.exporting);

    let exportCanvas;
    try {
      exportCanvas = document.createElement("canvas");
      exportCanvas.width = state.width;
      exportCanvas.height = state.height;
      const exportContext = exportCanvas.getContext("2d", { alpha: true });
      if (!exportContext) throw new Error("Canvas unavailable");

      exportContext.drawImage(state.source, 0, 0, state.width, state.height);
      state.masks.forEach((mask) => {
        drawMaskEffect(exportContext, mask, exportCanvas);
      });

      const settings = outputSettings(state.file);
      const blob = await canvasToBlob(exportCanvas, settings.type, settings.quality);
      const verifiedGroups = await inspectMetadata(blob);
      if (verifiedGroups.some((group) => group.level === "high" || group.level === "medium")) {
        throw new Error("VERIFY_FAILED");
      }

      const actualType = blob.type || settings.type;
      const extension =
        actualType === "image/png" ? "png" : actualType === "image/webp" ? "webp" : "jpg";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanFileName(state.file, extension);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      announce(text.exported);
    } catch (error) {
      const message = error && error.message === "VERIFY_FAILED" ? text.verifyFailed : text.exportFailed;
      showError(message);
    } finally {
      if (exportCanvas) {
        exportCanvas.width = 1;
        exportCanvas.height = 1;
      }
      elements.download.disabled = false;
      originalLabel.textContent = text.buttonDownload;
    }
  }

  async function processFile(file) {
    if (!(file instanceof File) && !(file instanceof Blob)) return;
    const operationId = ++state.operationId;
    elements.error.hidden = true;
    elements.workspace.hidden = true;
    elements.dropzone.hidden = true;
    setProcessing(true, text.reading);

    if (file.size > MAX_BYTES) {
      showError(text.fileTooLarge);
      return;
    }

    let source;
    try {
      const heic = await isHeicFile(file);
      if (!isAllowedFile(file, heic)) {
        showError(text.unsupported);
        return;
      }

      const [sourceResult, metadataResult] = await Promise.allSettled([
        decodeFile(file, heic),
        inspectMetadata(file),
      ]);

      if (operationId !== state.operationId) {
        if (sourceResult.status === "fulfilled" && typeof sourceResult.value.close === "function") {
          sourceResult.value.close();
        }
        return;
      }

      if (sourceResult.status === "rejected") {
        throw sourceResult.reason;
      }
      source = sourceResult.value;
      const dimensions = sourceDimensions(source);
      if (!dimensions.width || !dimensions.height) throw new Error("Invalid dimensions");
      if (dimensions.width * dimensions.height > MAX_PIXELS) {
        if (typeof source.close === "function") source.close();
        showError(text.pixelsTooLarge);
        return;
      }

      cleanupSource();
      state.file = file;
      state.source = source;
      state.width = dimensions.width;
      state.height = dimensions.height;
      state.masks = [];
      state.history = [];
      state.future = [];
      state.selected = -1;
      state.activeMaskStyle = DEFAULT_MASK_STYLE;
      state.metadataReadable = metadataResult.status === "fulfilled";
      state.metadataGroups =
        metadataResult.status === "fulfilled" ? metadataResult.value : [];

      const ext = getExtension(file.name) || (heic ? "heic" : "img");
      elements.fileType.textContent = ext.slice(0, 4).toUpperCase();
      elements.fileName.textContent = file.name || `image.${ext}`;
      elements.fileDetails.textContent =
        `${dimensions.width.toLocaleString()} × ${dimensions.height.toLocaleString()} px · ${bytesLabel(file.size)}`;

      configureCanvas();
      renderMetadataReport();
      updateToolbar();
      updateMaskStyleControls();

      elements.dropzone.hidden = true;
      elements.error.hidden = true;
      elements.workspace.hidden = false;
      setProcessing(false);
      announce(metadataResult.status === "fulfilled" ? text.ready : text.metadataFailed);
      window.setTimeout(() => {
        if (elements.statusText.textContent === text.ready) hideStatus();
      }, 3200);
    } catch (_) {
      if (source && typeof source.close === "function") source.close();
      showError(text.decodeFailed);
    }
  }

  function imageFromClipboard(event) {
    const items = Array.from(event.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (!imageItem) return null;
    const blob = imageItem.getAsFile();
    if (!blob) return null;
    if (blob.name) return blob;
    const extension = blob.type.split("/")[1] || "png";
    return new File([blob], `pasted-image.${extension}`, { type: blob.type });
  }

  elements.dropzone.addEventListener("click", () => elements.fileInput.click());
  elements.dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      elements.fileInput.click();
      event.preventDefault();
    }
  });
  elements.fileInput.addEventListener("change", () => {
    if (elements.fileInput.files?.[0]) processFile(elements.fileInput.files[0]);
  });

  ["dragenter", "dragover"].forEach((type) => {
    elements.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      if (!elements.dropzone.hidden) elements.dropzone.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach((type) => {
    elements.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      elements.dropzone.classList.remove("is-dragover");
    });
  });
  elements.dropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (file) processFile(file);
  });

  document.addEventListener("paste", (event) => {
    if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const file = imageFromClipboard(event);
    if (file) {
      event.preventDefault();
      processFile(file);
    }
  });

  elements.errorReset.addEventListener("click", () => reset({ openPicker: true }));
  elements.newFile.addEventListener("click", () => reset({ openPicker: true }));
  elements.addMask.addEventListener("click", addCenteredMask);
  elements.deleteMask.addEventListener("click", deleteSelectedMask);
  elements.undo.addEventListener("click", undo);
  elements.redo.addEventListener("click", redo);
  elements.download.addEventListener("click", exportImage);
  elements.maskStyleButtons.forEach((button) => {
    button.addEventListener("click", () => selectMaskStyle(button.dataset.maskStyle));
  });

  elements.canvas.addEventListener("pointerdown", onPointerDown);
  elements.canvas.addEventListener("pointermove", onPointerMove);
  elements.canvas.addEventListener("pointerup", finishPointerAction);
  elements.canvas.addEventListener("pointercancel", finishPointerAction);
  elements.canvas.addEventListener("keydown", onCanvasKeyDown);

  window.addEventListener("beforeunload", cleanupSource);
  reset();
})();
