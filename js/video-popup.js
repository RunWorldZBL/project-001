/* ============================================================
   video-popup.js —— 通用视频弹窗（自包含、不依赖 Fancybox）

   功能：
   1. 自动绑定页面中所有 [data-video-popup] 元素
   2. 单视频弹窗：打开即播，无左右切换
   3. 右上角深色条：[下载] [关闭] 两个白色图标按钮
   4. 支持 ESC 键关闭、点击蒙层关闭
   5. caption 解析优先级与 image-popup 一致：
      data-caption  >  内/邻居 .xx_caption|.xx_label 文本  >  <img alt>

   使用示例：
   <a data-video-popup
      href="videos/project.mp4"
      data-caption="项目视频"
      class="leis_dtl_overview_play"
      aria-label="播放视频"></a>

   样式：css/video-popup.css
   ============================================================ */

(function () {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    /* ----------------------------------------------------------
       SVG 图标（与 image-popup 风格保持一致：白色描边 stroke）
    ---------------------------------------------------------- */
    var ICON_DOWNLOAD = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg>';
    var ICON_CLOSE    = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    /* ----------------------------------------------------------
       caption 解析（与 image-popup.js 保持一致）
    ---------------------------------------------------------- */
    function resolveCaption(trigger) {
        if (!trigger) return '';
        if (trigger.dataset && trigger.dataset.caption) return trigger.dataset.caption;

        var inner = trigger.querySelector('[class*="caption"], [class*="label"]');
        if (inner && inner.textContent.trim()) return inner.textContent.trim();

        var parent = trigger.parentElement;
        if (parent) {
            var sib = parent.querySelector('[class*="caption"], [class*="label"]');
            if (sib && sib !== trigger && !trigger.contains(sib) && sib.textContent.trim()) {
                return sib.textContent.trim();
            }
        }

        var img = trigger.querySelector('img');
        if (img && img.alt) return img.alt;

        return '';
    }

    /* ----------------------------------------------------------
       构建弹窗 DOM（仅一次，复用）
    ---------------------------------------------------------- */
    var $popup = null;
    var $video = null;
    var $caption = null;
    var $download = null;
    var $error = null;
    var bodyOverflow = '';

    function ensurePopup() {
        if ($popup) return $popup;

        $popup = document.createElement('div');
        $popup.className = 'video-popup';
        $popup.setAttribute('aria-hidden', 'true');
        $popup.innerHTML =
            '<div class="video-popup__overlay" data-vp-close></div>' +
            '<div class="video-popup__toolbar">' +
                '<a class="video-popup__btn" href="#" target="_blank" rel="noopener" download title="下载" data-vp-download>' + ICON_DOWNLOAD + '</a>' +
                '<button type="button" class="video-popup__btn" title="关闭" data-vp-close>' + ICON_CLOSE + '</button>' +
            '</div>' +
            '<div class="video-popup__stage">' +
                '<video class="video-popup__video" controls playsinline preload="metadata" controlsList="nodownload"></video>' +
                '<div class="video-popup__error" role="alert">' +
                    '<svg class="video-popup__error-icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' +
                    '<p class="video-popup__error-text">视频暂未上线，敬请期待</p>' +
                '</div>' +
                '<div class="video-popup__caption"></div>' +
            '</div>';

        document.body.appendChild($popup);

        $video    = $popup.querySelector('.video-popup__video');
        $caption  = $popup.querySelector('.video-popup__caption');
        $download = $popup.querySelector('[data-vp-download]');
        $error    = $popup.querySelector('.video-popup__error');

        $popup.addEventListener('click', function (e) {
            if (e.target.closest('[data-vp-close]')) {
                e.preventDefault();
                close();
            }
        });

        /* 视频加载失败 → 显示提示，隐藏视频与下载按钮 */
        $video.addEventListener('error', showError);
        $video.addEventListener('stalled', function () {
            /* 部分浏览器对 404 不触发 error 事件，stalled 兜底：
               若 networkState 为 NETWORK_NO_SOURCE，也按错误处理 */
            if ($video.networkState === 3) showError();
        });

        return $popup;
    }

    function showError() {
        if (!$popup) return;
        $popup.classList.add('has-error');
        try { $video.pause(); } catch (e) {}
    }

    function clearError() {
        if (!$popup) return;
        $popup.classList.remove('has-error');
    }

    /* ----------------------------------------------------------
       打开 / 关闭
    ---------------------------------------------------------- */
    function open(src, caption, filename) {
        if (!src) return;
        ensurePopup();
        clearError();

        $video.src = src;
        $download.href = src;
        if (filename) $download.setAttribute('download', filename);
        else $download.setAttribute('download', '');

        $caption.textContent = caption || '';
        $caption.style.display = caption ? '' : 'none';

        bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        $popup.classList.add('is-open');
        $popup.setAttribute('aria-hidden', 'false');

        /* 主动 HEAD 探测一次：直接被 404/不可达时，error 事件可能延迟或不触发，
           这里做一次轻量预检来保证 UX 一致 */
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', src, true);
            xhr.onload = function () {
                if (xhr.status >= 400) showError();
            };
            xhr.onerror = function () { showError(); };
            xhr.send();
        } catch (e) {}

        var p = $video.play();
        if (p && typeof p.catch === 'function') p.catch(function () {});

        document.addEventListener('keydown', onKeydown);
    }

    function close() {
        if (!$popup) return;
        try { $video.pause(); } catch (e) {}
        $video.removeAttribute('src');
        try { $video.load(); } catch (e) {}

        $popup.classList.remove('is-open');
        $popup.setAttribute('aria-hidden', 'true');

        document.body.style.overflow = bodyOverflow || '';
        document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
        if (e.key === 'Escape' || e.keyCode === 27) close();
    }

    /* ----------------------------------------------------------
       事件代理：点击任意 [data-video-popup] 触发
    ---------------------------------------------------------- */
    function onClick(e) {
        var trigger = e.target && e.target.closest && e.target.closest('[data-video-popup]');
        if (!trigger) return;

        var href = trigger.getAttribute('href') || trigger.getAttribute('data-src') || '';
        if (!href || href === '#' || href.indexOf('javascript:') === 0) return;

        e.preventDefault();
        open(href, resolveCaption(trigger), trigger.getAttribute('data-download-filename') || '');
    }

    function init() {
        document.addEventListener('click', onClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
