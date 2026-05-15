(function () {
    if (window.AOS) {
        AOS.init({
            delay: 300,
            duration: 1200,
            once: false
        });
    }

    // 由 initAgricultureFilters 赋值，供 initCategorySwiper 调用
    var updateSelectedTags;

    function getCategoryText() {
        var cur = document.querySelector('.agri_category_swiper .agri_category.cur');
        if (!cur) return '';
        var h2 = cur.querySelector('h2');
        return h2 ? h2.textContent.trim() : '';
    }

    function initHeroSwiper() {
        var heroEl = document.querySelector('.agri_hero_swiper');
        if (!heroEl || !window.Swiper) return;

        new Swiper('.agri_hero_swiper', {
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: '.agri_hero_prev',
                nextEl: '.agri_hero_next'
            }
        });
    }

    function initCategorySwiper() {
        var catEl = document.querySelector('.agri_category_swiper');
        if (!catEl || !window.Swiper) return;

        function getRem() {
            return parseFloat(getComputedStyle(document.documentElement).fontSize);
        }

        function getW1480Offset() {
            var rem = getRem();
            var w1480px = 14.8 * rem;
            var maxW = window.innerWidth * 0.9;
            var contentW = Math.min(w1480px, maxW);
            return Math.max(0, (window.innerWidth - contentW) / 2);
        }

        var categorySwiper = new Swiper('.agri_category_swiper', {
            slidesPerView: 'auto',
            freeMode: {
                enabled: true,
                momentum: true
            },
            grabCursor: true,
            spaceBetween: Math.round(getRem() * 0.4),
            slidesOffsetBefore: getW1480Offset(),
            slidesOffsetAfter: getW1480Offset(),
            resistance: true,
            resistanceRatio: 0.6
        });

        // 把当前选中的分类滑入可视区域，靠左对齐
        function scrollToCurrent(speed) {
            var curLink = catEl.querySelector('.agri_category.cur');
            if (!curLink) return;
            var curSlide = curLink.closest('.swiper-slide');
            if (!curSlide) return;
            var slides = Array.prototype.slice.call(catEl.querySelectorAll('.swiper-slide'));
            var idx = slides.indexOf(curSlide);
            if (idx >= 0 && categorySwiper && !categorySwiper.destroyed) {
                categorySwiper.slideTo(idx, typeof speed === 'number' ? speed : 0);
            }
        }

        scrollToCurrent(0);

        var catLinks = document.querySelectorAll('.agri_category_swiper .agri_category');
        catLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                catLinks.forEach(function(l) { l.classList.remove('cur'); });
                link.classList.add('cur');
                if (updateSelectedTags) updateSelectedTags();
                scrollToCurrent(500);
            });
        });

        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (categorySwiper && !categorySwiper.destroyed) {
                    categorySwiper.params.spaceBetween = Math.round(getRem() * 0.4);
                    categorySwiper.params.slidesOffsetBefore = getW1480Offset();
                    categorySwiper.params.slidesOffsetAfter = getW1480Offset();
                    categorySwiper.update();
                }
            }, 100);
        });
    }

    function initAgricultureFilters() {
        var filter = document.querySelector('.agri_filter');
        if (!filter) return;

        var selectedList = filter.querySelector('.selected_tag_list');
        var selectedTitle = filter.querySelector('.selected_tit');
        var clearBtn = filter.querySelector('.clear_btn');

        // removable=false 时不添加关闭按钮（用于分类标签）
        function addTag(text, removable) {
            if (!selectedList || !text || text === '不限') return;
            var tag = document.createElement('div');
            tag.className = 'selected_tag';
            if (removable === false) {
                tag.innerHTML = text;
            } else {
                tag.innerHTML = text + '<img class="close" src="images/express/close-icon.svg" alt="">';
            }
            selectedList.appendChild(tag);
        }

        updateSelectedTags = function() {
            if (!selectedList || !selectedTitle) return;
            selectedList.innerHTML = '';
            var count = 0;

            // 分类标签：始终显示，不可关闭
            var catText = getCategoryText();
            if (catText) {
                addTag(catText, false);
                count += 1;
            }

            // 区域 / 乡镇等筛选行条件标签
            filter.querySelectorAll('.filter_row').forEach(function (row) {
                var current = row.querySelector('.filter_option.cur');
                if (current && current.textContent.trim() !== '不限') {
                    addTag(current.textContent.trim(), true);
                    count += 1;
                }
            });

            selectedTitle.textContent = '已选择（' + count + '）';
        };

        filter.querySelectorAll('.filter_option').forEach(function (option) {
            option.addEventListener('click', function () {
                var row = option.closest('.filter_row');
                if (!row) return;
                row.querySelectorAll('.filter_option').forEach(function (item) {
                    item.classList.remove('cur');
                });
                option.classList.add('cur');
                updateSelectedTags();
            });
        });

        // 点击筛选标签上的 × 关闭按钮（分类标签无此按钮，无需特殊处理）
        filter.addEventListener('click', function (event) {
            if (!event.target.classList.contains('close')) return;
            var tag = event.target.closest('.selected_tag');
            var tagText = tag ? tag.textContent.trim() : '';

            filter.querySelectorAll('.filter_option').forEach(function (option) {
                if (option.textContent.trim() === tagText) {
                    option.classList.remove('cur');
                    var row = option.closest('.filter_row');
                    var unlimited = row ? row.querySelector('.filter_option') : null;
                    if (unlimited) unlimited.classList.add('cur');
                }
            });

            updateSelectedTags();
        });

        // 清除选择：只重置区域/乡镇筛选行，不影响分类
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                filter.querySelectorAll('.filter_row').forEach(function (row) {
                    row.querySelectorAll('.filter_option').forEach(function (option) {
                        option.classList.remove('cur');
                    });
                    var first = row.querySelector('.filter_option');
                    if (first) first.classList.add('cur');
                });
                updateSelectedTags();
            });
        }

        updateSelectedTags();
    }

    function initSliderBg() {
        var bgLeft  = document.querySelector('.slider_bg_left');
        var bgRight = document.querySelector('.slider_bg_right');
        if (!bgLeft || !bgRight) return;

        var container = bgLeft.closest('.agri_body');
        if (!container) return;

        var rem      = parseFloat(getComputedStyle(document.documentElement).fontSize);
        var itemH    = 4  * rem;   // 每个背景图高度
        var gapH     = 10 * rem;   // 两图之间的间隔
        var cycle    = itemH + gapH;
        var leftTop  = 5.85 * rem; // 左侧第一个起始位置
        var rightTop = 7.85 * rem; // 右侧第一个起始位置（左 + 2rem）

        function getLimit() {
            var scene = container.querySelector('.agri_bottom_scene_bg');
            if (scene) {
                return scene.offsetTop;
            }
            return container.offsetHeight;
        }

        function populate(el, startPx) {
            el.innerHTML = '';
            var limit = getLimit();
            for (var top = startPx; top + itemH <= limit; top += cycle) {
                var div = document.createElement('div');
                div.className = 'slider_bg';
                div.style.top = top + 'px';
                el.appendChild(div);
            }
        }

        function refresh() {
            rem      = parseFloat(getComputedStyle(document.documentElement).fontSize);
            itemH    = 4  * rem;
            gapH     = 10 * rem;
            cycle    = itemH + gapH;
            leftTop  = 5.85 * rem;
            rightTop = 7.85 * rem;
            populate(bgLeft,  leftTop);
            populate(bgRight, rightTop);
        }

        refresh();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refresh, 200);
        });
    }

    function initAll() {
        initHeroSwiper();
        initAgricultureFilters();
        initCategorySwiper();
        initSliderBg();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
