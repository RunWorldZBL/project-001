/* ============================================================
   property-detail.js — property_management_detail.html 专用脚本
   依赖：jQuery 3.6, Swiper, AOS, Fancybox, my.js, platform-pages.js
   ============================================================ */

$(function () {

    function propRem(value) {
        var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;
        return Math.round(value * fs);
    }

    /* ----------------------------------------------------------
       项目详情：主图 Swiper + 右侧缩略图 Swiper
    ---------------------------------------------------------- */
    if ($('.prop_dtl_detail_main').length && $('.prop_dtl_detail_thumbs').length) {

        /* 从主图 slides 收集数据，动态生成缩略图 slides（Swiper init 前执行） */
        var $thumbWrapper = $('.prop_dtl_detail_thumbs .swiper-wrapper');
        $('.prop_dtl_detail_main .swiper-slide img').each(function (i) {
            var src = $(this).attr('src');
            var alt = $(this).attr('alt') || '';
            $thumbWrapper.append(
                '<div class="prop_dtl_detail_thumb swiper-slide' + (i === 0 ? ' prop_dtl_detail_thumb--active' : '') + '">'
                + '<img src="' + src + '" alt="' + alt + '">'
                + '</div>'
            );
        });

        var detailThumbSwiper = new Swiper('.prop_dtl_detail_thumbs', {
            direction: 'vertical',
            slidesPerView: 'auto',
            spaceBetween: propRem(0.16),
            watchSlidesProgress: true,
            grabCursor: true,
            on: {
                resize: function () {
                    this.params.spaceBetween = propRem(0.16);
                    this.update();
                }
            }
        });

        var detailMainSwiper = new Swiper('.prop_dtl_detail_main', {
            slidesPerView: 1,
            speed: 500,
            on: {
                slideChange: function () {
                    var index = this.activeIndex;
                    $('.prop_dtl_detail_thumb').removeClass('prop_dtl_detail_thumb--active').eq(index).addClass('prop_dtl_detail_thumb--active');
                    detailThumbSwiper.slideTo(index);
                }
            }
        });

        $(document).on('click', '.prop_dtl_detail_thumb', function () {
            var index = $(this).index();
            detailMainSwiper.slideTo(index);
            detailThumbSwiper.slideTo(index);
        });

        $('.prop_dtl_detail_arrow--prev').on('click', function () {
            detailMainSwiper.slidePrev();
        });

        $('.prop_dtl_detail_arrow--next').on('click', function () {
            detailMainSwiper.slideNext();
        });
    }

    /* ----------------------------------------------------------
       项目图集弹窗：统一由 js/image-popup.js 自动绑定
       所有 [data-fancybox] 元素共享通用 toolbar / caption / 样式
    ---------------------------------------------------------- */

    /* ----------------------------------------------------------
       收藏按钮：点击切换激活状态
    ---------------------------------------------------------- */
    $(document).on('click', '.prop_dtl_fav_btn', function () {
        $(this).toggleClass('cur');
    });

    /* ----------------------------------------------------------
       招商条件：通栏 Swiper + 进度条
    ---------------------------------------------------------- */
    function calcInvestOffset() {
        var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;
        var contentWidth = Math.min(14.8 * fs, window.innerWidth * 0.9);
        return Math.max(0, (window.innerWidth - contentWidth) / 2);
    }

    function setInvestCardActive($card, active) {
        var $icon = $card.find('.prop_dtl_invest_icon img');
        var normalSrc = $icon.attr('data-normal-src') || $icon.attr('src');
        var activeSrc = $icon.attr('data-active-src') || normalSrc.replace(/\.svg(\?.*)?$/, '-act.svg$1');

        $icon.attr({
            'data-normal-src': normalSrc,
            'data-active-src': activeSrc,
            src: active ? activeSrc : normalSrc
        });
        $card.toggleClass('prop_dtl_invest_card--primary', active);
    }

    if ($('.prop_dtl_invest_swiper').length) {
        new Swiper('.prop_dtl_invest_swiper', {
            slidesPerView: 'auto',
            spaceBetween: propRem(0.4),
            slidesOffsetBefore: calcInvestOffset(),
            slidesOffsetAfter: calcInvestOffset(),
            watchSlidesProgress: true,
            freeMode: { enabled: true, momentum: true },
            grabCursor: true,
            pagination: {
                el: '.prop_dtl_invest_progress',
                type: 'progressbar'
            },
            on: {
                resize: function () {
                    var offset = calcInvestOffset();
                    this.params.spaceBetween = propRem(0.4);
                    this.params.slidesOffsetBefore = offset;
                    this.params.slidesOffsetAfter = offset;
                    this.update();
                }
            }
        });
    }

    $(document)
        .on('mouseenter', '.prop_dtl_invest_card', function () {
            var $card = $(this);
            $card.siblings('.prop_dtl_invest_card').each(function () {
                setInvestCardActive($(this), false);
            });
            setInvestCardActive($card, true);
        })
        .on('mouseleave', '.prop_dtl_invest_card', function () {
            setInvestCardActive($(this), false);
        });

    /* ----------------------------------------------------------
       特色优势：两列 Swiper（每页 2 卡）+ 进度条 + 上下箭头
    ---------------------------------------------------------- */
    var $advFill = $('.prop_dtl_adv_fill');

    function setAdvProgress(progress) {
        var pct = Math.max(8, Math.min(100, Math.round(progress * 100)));
        $advFill.css('width', pct + '%');
    }

    var advSwiper = new Swiper('.prop_dtl_adv_swiper', {
        slidesPerView: 'auto',
        spaceBetween: propRem(0.4),
        slidesOffsetBefore: calcInvestOffset(),
        slidesOffsetAfter: calcInvestOffset(),
        watchSlidesProgress: true,
        freeMode: { enabled: true, momentum: true },
        grabCursor: true,
        navigation: {
            nextEl: '.prop_dtl_adv_arrow--next',
            prevEl: '.prop_dtl_adv_arrow--prev'
        },
        on: {
            init: function () { setAdvProgress(this.progress || 0); },
            progress: function () { setAdvProgress(this.progress); },
            slideChange: function () { setAdvProgress(this.progress); },
            resize: function () {
                var offset = calcInvestOffset();
                this.params.spaceBetween = propRem(0.4);
                this.params.slidesOffsetBefore = offset;
                this.params.slidesOffsetAfter = offset;
                this.update();
            }
        }
    });

    /* ----------------------------------------------------------
       项目图集：中间主图轮播 + 进度条
       ⚠ Swiper 10 的 loop 算法要求 slides 数量 > slidesPerView 才能正常克隆缓冲位。
       本节只有 3 张原图、slidesPerView 也是 3，会出现“右侧到头不循环 / 左侧 wrapper
       先闪到最左再滚回”的 bug。解决办法：在初始化前把原 slide 物理复制 2 份（共 9 张），
       让 loop 有足够素材。复制片剥掉 data-fancybox，并把点击转发到原图，避免图集重复。
    ---------------------------------------------------------- */
    var $photosFill = $('.prop_dtl_photos_fill');
    var $photosWrapper = $('.prop_dtl_photos_swiper .swiper-wrapper');
    var $photosOrigSlides = $photosWrapper.children('.swiper-slide');
    var photosTotal = $photosOrigSlides.length;

    function setPhotosProgressByIndex(index) {
        var progress = photosTotal > 1 ? index / (photosTotal - 1) : 1;
        var pct = Math.max(8, Math.min(100, Math.round(progress * 100)));
        $photosFill.css('width', pct + '%');
    }

    if ($('.prop_dtl_photos_swiper').length && photosTotal > 0) {

        if (photosTotal < 7) {
            for (var dupRound = 0; dupRound < 2; dupRound++) {
                $photosOrigSlides.each(function () {
                    var $clone = $(this).clone();
                    $clone.addClass('prop_dtl_photo_card--dup');
                    $clone.find('[data-fancybox]').removeAttr('data-fancybox');
                    $photosWrapper.append($clone);
                });
            }
        }

        $(document).on('click', '.prop_dtl_photo_card--dup a', function (e) {
            e.preventDefault();
            var $clone = $(this).closest('.prop_dtl_photo_card--dup');
            var dupIdx = $photosWrapper.children('.prop_dtl_photo_card--dup').index($clone);
            var origIdx = ((dupIdx % photosTotal) + photosTotal) % photosTotal;
            var origLink = $photosOrigSlides.eq(origIdx).find('a[data-fancybox]')[0];
            if (origLink) origLink.click();
        });

        new Swiper('.prop_dtl_photos_swiper', {
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            spaceBetween: propRem(0.4),
            speed: 500,
            watchSlidesProgress: true,
            grabCursor: true,
            navigation: {
                nextEl: '.prop_dtl_photos_arrow--next',
                prevEl: '.prop_dtl_photos_arrow--prev'
            },
            on: {
                init: function () {
                    var realIdx = ((this.realIndex || 0) % photosTotal + photosTotal) % photosTotal;
                    setPhotosProgressByIndex(realIdx);
                },
                slideChange: function () {
                    var realIdx = ((this.realIndex || 0) % photosTotal + photosTotal) % photosTotal;
                    setPhotosProgressByIndex(realIdx);
                },
                resize: function () {
                    this.params.spaceBetween = propRem(0.4);
                    this.update();
                }
            }
        });
    }

    /* ----------------------------------------------------------
       Hero 主图轮播（Swiper：slide 横滑切换）
       - loop: true 循环，箭头不会变 disabled
       - 大箭头通过 navigation 绑定 prev / next
       - allowTouchMove: false 因为 swiper 在最底层，避免与上层内容拖拽冲突
    ---------------------------------------------------------- */
    if ($('.prop_dtl_hero_bg.swiper').length) {
        new Swiper('.prop_dtl_hero_bg.swiper', {
            loop: true,
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 0,
            allowTouchMove: false,
            navigation: {
                prevEl: '.prop_dtl_arrow_prev',
                nextEl: '.prop_dtl_arrow_next'
            }
        });
    }

    /* ----------------------------------------------------------
       周边配套：两层 Tab 切换（与 agri 详情页一致的数据结构）
    ---------------------------------------------------------- */
    var poiData = {
        '交通': {
            '地铁': [
                { name: '苹果园站',     dist: 549,  dec: '地铁1号线 / 6号线' },
                { name: '杨庄站',       dist: 1259, dec: '地铁6号线' },
                { name: '西黄村站',     dist: 1579, dec: '地铁6号线' },
                { name: '福寿岭站',     dist: 1854, dec: '地铁1号线（在建）' }
            ],
            '公交': [
                { name: '石景山区委站', dist: 320,  dec: '337路 / 489路 / 597路' },
                { name: '科技园南门',   dist: 760,  dec: '运通101 / 941路' },
                { name: '科技园北门',   dist: 1120, dec: '370路 / 597路' },
                { name: '京原路口东站', dist: 1480, dec: '337路 / 921路' }
            ]
        },
        '教育': {
            '幼儿园': [
                { name: '石景山区机关幼儿园', dist: 480,  dec: '公办示范园' },
                { name: '北大附属实验幼儿园', dist: 920,  dec: '一级一类' }
            ],
            '小学': [
                { name: '石景山实验小学',     dist: 690,  dec: '市重点公办' },
                { name: '景山学校远洋分校',   dist: 1260, dec: '九年一贯制' }
            ],
            '中学': [
                { name: '北京九中',           dist: 1120, dec: '市示范高中' },
                { name: '景山远洋分校（中学部）', dist: 1480, dec: '九年一贯制' }
            ]
        },
        '医疗': {
            '综合医院': [
                { name: '首钢医院',        dist: 1450, dec: '三级综合医院' },
                { name: '石景山区医院',    dist: 2100, dec: '二级甲等医院' }
            ],
            '社区诊所': [
                { name: '老山街道社区卫生服务中心', dist: 380, dec: '社区卫生服务' }
            ],
            '药店': [
                { name: '老百姓大药房',   dist: 260, dec: '24小时营业' }
            ]
        },
        '购物': {
            '商场': [
                { name: '远洋·乐堤港',    dist: 820,  dec: '区域购物中心' },
                { name: '万达广场',      dist: 1980, dec: '综合购物中心' }
            ],
            '超市': [
                { name: '物美超市',      dist: 420,  dec: '大型综合超市' },
                { name: '京客隆',        dist: 760,  dec: '生鲜+百货' }
            ]
        },
        '生活': {
            '银行': [
                { name: '中国工商银行',  dist: 360,  dec: '储蓄/信贷' },
                { name: '中国建设银行',  dist: 580,  dec: '储蓄/信贷' }
            ],
            '美食': [
                { name: '海底捞火锅',    dist: 1120, dec: '川菜·火锅' },
                { name: '星巴克咖啡',    dist: 280,  dec: '咖啡饮品' }
            ]
        },
        '娱乐': {
            '电影院': [
                { name: '万达影城',      dist: 1820, dec: 'IMAX影厅' }
            ],
            '健身': [
                { name: '威尔士健身',    dist: 860,  dec: '综合健身房' }
            ]
        }
    };

    var $poiCatHead = $('.prop_dtl_surroundings_sec .agri_dtl_poi_tab_head');
    var $poiSubTabs = $('.prop_dtl_surroundings_sec .agri_dtl_poi_sub_tabs');
    var $poiList    = $('.prop_dtl_surroundings_sec .agri_dtl_poi_list');

    function formatDist(meters) {
        if (meters >= 1000) {
            return (meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 2) + '公里';
        }
        return meters + '米';
    }

    function renderPoiList(cat, sub) {
        var list = (poiData[cat] && poiData[cat][sub]) || [];
        var html = '';
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            html += ''
                + '<li class="agri_dtl_poi_wrap">'
                +   '<div class="agri_dtl_poi_item">'
                +     '<div class="agri_dtl_poi_icon"><img src="images/agri-detail/icon-map1.svg" alt=""></div>'
                +     '<div class="agri_dtl_poi_info"><strong>' + item.name + '</strong></div>'
                +     '<div class="agri_dtl_poi_dist"><img src="images/agri-detail/icon-map2.svg" alt="">' + formatDist(item.dist) + '</div>'
                +   '</div>'
                +   (item.dec ? '<div class="agri_dtl_poi_dec">' + item.dec + '</div>' : '')
                + '</li>';
        }
        $poiList.html(html);
    }

    function renderSubTabs(cat) {
        var subs = poiData[cat] ? Object.keys(poiData[cat]) : [];
        var html = '';
        for (var i = 0; i < subs.length; i++) {
            html += '<button class="agri_dtl_poi_sub' + (i === 0 ? ' agri_dtl_poi_sub--active' : '') + '" data-sub="' + subs[i] + '">' + subs[i] + '</button>';
        }
        $poiSubTabs.attr('data-cat', cat).html(html);
        if (subs[0]) renderPoiList(cat, subs[0]);
    }

    function renderCatTabs() {
        if (!$poiCatHead.length) return;
        var cats = Object.keys(poiData);
        var html = '';
        for (var i = 0; i < cats.length; i++) {
            html += '<button class="agri_dtl_poi_cat' + (i === 0 ? ' agri_dtl_poi_cat--active' : '') + '" data-cat="' + cats[i] + '">' + cats[i] + '</button>';
        }
        $poiCatHead.html(html);
        if (cats[0]) renderSubTabs(cats[0]);
    }

    renderCatTabs();

    $(document).on('click', '.prop_dtl_surroundings_sec .agri_dtl_poi_cat', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_cat--active')) return;
        $btn.addClass('agri_dtl_poi_cat--active').siblings().removeClass('agri_dtl_poi_cat--active');
        renderSubTabs($btn.data('cat'));
    });

    $(document).on('click', '.prop_dtl_surroundings_sec .agri_dtl_poi_sub', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_sub--active')) return;
        $btn.addClass('agri_dtl_poi_sub--active').siblings().removeClass('agri_dtl_poi_sub--active');
        var cat = $poiSubTabs.attr('data-cat');
        renderPoiList(cat, $btn.data('sub'));
    });

    /* ----------------------------------------------------------
       相关推荐项目 —— 手风琴开合
       1. 桌面端 (>=1025px)：鼠标悬停切换展开项，点击同样可触发；
          始终保证有且仅有一项展开（互斥）。
       2. 移动端 (<1025px)：全部展开，无交互。
       3. 开合通过 .is-open 类切换，配合 CSS 过渡完成动画。
    ---------------------------------------------------------- */
    (function initCaseAccordion() {
        var $list = $('.prop_dtl_case_list');
        if (!$list.length) return;

        var $items = $list.find('.prop_dtl_case_item');

        function openItem($target) {
            if (!$target || !$target.length) return;
            if ($target.hasClass('is-open')) return;
            $items.removeClass('is-open');
            $target.addClass('is-open');
        }

        // 默认确保首项展开
        if (!$items.filter('.is-open').length) {
            $items.eq(0).addClass('is-open');
        }

        var isDesktop = function () { return window.matchMedia('(min-width: 1025px)').matches; };

        $items.on('mouseenter', function () {
            if (!isDesktop()) return;
            openItem($(this));
        });

        $items.on('click', function (e) {
            if ($(e.target).closest('.prop_dtl_case_btn').length) return;
            openItem($(this));
        });
    })();

    /* ----------------------------------------------------------
       物业概况 - 查看更多 弹窗
       打开方式：点击 #prop_dtl_overview_more_btn
       关闭方式：点击遮罩 / 关闭按钮 / ESC
    ---------------------------------------------------------- */
    (function initOverviewPopup() {
        var $popup = $('#prop_overview_popup');
        var $trigger = $('#prop_dtl_overview_more_btn');
        if (!$popup.length || !$trigger.length) return;

        function openPopup() {
            $popup.addClass('is-open').attr('aria-hidden', 'false');
            $('body').addClass('prop_overview_popup_open');
        }

        function closePopup() {
            $popup.removeClass('is-open').attr('aria-hidden', 'true');
            $('body').removeClass('prop_overview_popup_open');
        }

        $trigger.on('click', function (e) {
            e.preventDefault();
            openPopup();
        });

        $popup.on('click', '[data-popup-close]', function () {
            closePopup();
        });

        $(document).on('keydown.propOverviewPopup', function (e) {
            if (e.key === 'Escape' && $popup.hasClass('is-open')) {
                closePopup();
            }
        });
    })();

});
