// 收集页面中需要交互的节点：
// 复制按钮、可放大的图片、灯箱容器、灯箱图片和关闭按钮。
const copyButtons = document.querySelectorAll(".copy-button");
const galleryImages = document.querySelectorAll(".image-card img");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");

// 负责把任意文本复制到剪贴板。
// 优先使用现代浏览器的 Clipboard API；
// 如果当前环境不支持，就退回到隐藏 textarea + execCommand("copy") 的兼容方案。
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // 兼容旧环境：动态创建一个不可见输入框，选中文本后执行复制。
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

// 打开图片灯箱：
// 1. 把被点击图片的 src/alt 复制到灯箱里
// 2. 给灯箱添加 open 类，让它显示出来
// 3. 更新 aria-hidden，方便辅助技术识别当前状态
// 4. 给 body 加类名，阻止背景滚动
function openLightbox(image) {
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

// 关闭图片灯箱：
// 1. 隐藏灯箱
// 2. 清空图片地址，避免保留上一张图
// 3. 恢复页面滚动
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.classList.remove("lightbox-open");
}

// 给每一个复制按钮绑定点击事件。
// 点击后读取按钮上的 data-copy 文本并复制，
// 同时短暂显示“已复制”或“复制失败”的状态提示。
copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy || "";
    const label = button.querySelector(".copy-text");
    const original = label ? label.textContent : "复制";

    try {
      await copyText(text);
      if (label) label.textContent = "已复制";
      button.classList.add("copied");
    } catch (error) {
      if (label) label.textContent = "复制失败";
    }

    // 1400ms 后恢复按钮原始文案和样式。
    window.setTimeout(() => {
      if (label) label.textContent = original;
      button.classList.remove("copied");
    }, 1400);
  });
});

// 给每张缩略图绑定点击事件，点击后用当前图片打开灯箱。
galleryImages.forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
});

// 点击右上角关闭按钮时关闭灯箱。
lightboxClose.addEventListener("click", closeLightbox);

// 只有在点击灯箱背景遮罩时才关闭；
// 如果点的是灯箱中的图片本身，则不关闭。
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// 监听全局键盘事件：
// 当灯箱处于打开状态并且用户按下 Esc 时，关闭灯箱。
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
