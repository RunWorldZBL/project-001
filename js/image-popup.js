/* ============================================================
   image-popup.js —— 通用图集弹窗（基于 Fancybox v5）

   功能：
   1. 自动绑定页面中所有 [data-fancybox] 元素
   2. 顶部 toolbar 仅保留：左侧计数器（X / Y） + 右侧 [下载] [关闭]
   3. caption 自动解析优先级：
      data-caption  >  内/邻居 .xx_caption|.xx_label 节点文本  >  <img alt>
   4. 隐藏 slide 内置的小关闭按钮（视觉上只保留右上角深色条内的关闭）

   依赖：jQuery 非必需；要求 Fancybox v5 (js/fancybox.umd.js) 已先于本文件加载。
   样式：css/image-popup.css（须在 css/fancybox.css 之后引入）
   ============================================================ */

(function () {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    /**
     * 解析触发元素对应的 caption 文本
     * @param {Object} slide  Fancybox slide 对象
     * @returns {string}
     */
    function resolveCaption(slide) {
        var trigger = slide && slide.triggerEl;
        if (!trigger) return '';

        // 1) 触发元素自身的 data-caption
        if (trigger.dataset && trigger.dataset.caption) {
            return trigger.dataset.caption;
        }

        // 2) 触发元素内部的 *_caption / *_label 文本
        var inner = trigger.querySelector('[class*="caption"], [class*="label"]');
        if (inner && inner.textContent.trim()) {
            return inner.textContent.trim();
        }

        // 3) 触发元素同级的 *_caption / *_label 文本
        var parent = trigger.parentElement;
        if (parent) {
            var sib = parent.querySelector('[class*="caption"], [class*="label"]');
            if (sib && sib !== trigger && !trigger.contains(sib) && sib.textContent.trim()) {
                return sib.textContent.trim();
            }
        }

        // 4) 内部 img 的 alt 文本
        var img = trigger.querySelector('img');
        if (img && img.alt) return img.alt;

        return '';
    }

    // 全量中文本地化：覆盖按钮 tooltip、状态提示、错误文案
    var ZH_CN = {
        CLOSE:             '关闭',
        NEXT:              '下一张',
        PREV:              '上一张',
        GOTO:              '前往第 %d 张',
        MODAL:             '可以按 ESC 键关闭此窗口',
        ERROR:             '加载出错，请稍后重试',
        IMAGE_ERROR:       '图片未找到',
        ELEMENT_NOT_FOUND: '未找到 HTML 元素',
        AJAX_NOT_FOUND:    '加载失败：未找到资源',
        AJAX_FORBIDDEN:    '加载失败：访问被拒绝',
        IFRAME_ERROR:      '页面加载失败',
        TOGGLE_ZOOM:       '切换缩放',
        TOGGLE_THUMBS:     '切换缩略图',
        TOGGLE_SLIDESHOW:  '切换幻灯片播放',
        TOGGLE_FULLSCREEN: '切换全屏',
        DOWNLOAD:          '下载',
        PANUP:             '向上平移',
        PANDOWN:           '向下平移',
        PANLEFT:           '向左平移',
        PANRIGHT:          '向右平移'
    };

    function init() {
        if (typeof Fancybox === 'undefined') return;

        Fancybox.bind('[data-fancybox]', {
            // 中文本地化
            l10n: ZH_CN,

            // 自定义工具栏：左计数器、右下载+关闭
            Toolbar: {
                display: {
                    left:   ['infobar'],
                    middle: [],
                    right:  ['download', 'close']
                }
            },

            // 关闭缩略图条（设计稿没有缩略图）
            Thumbs: false,

            // 键盘快捷键
            keyboard: {
                Escape: 'close',
                Delete: 'close',
                Backspace: 'close',
                PageUp: 'next',
                PageDown: 'prev',
                ArrowUp: 'next',
                ArrowDown: 'prev',
                ArrowRight: 'next',
                ArrowLeft: 'prev'
            },

            // 隐藏 slide 自带的右上角 close 按钮（统一只用 toolbar 里的关闭）
            closeButton: false,

            // 通用 caption 解析
            caption: function (fancybox, slide) {
                return resolveCaption(slide);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
