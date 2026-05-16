/* ============================================================
   agri-detail.js — agriculture_project_detail.html 专用脚本
   依赖：jQuery 3.6, Swiper, AOS, Fancybox, my.js, platform-pages.js
   ============================================================ */

$(function () {

    /* ----------------------------------------------------------
       Hero 主图 Swiper（fade 切换）
    ---------------------------------------------------------- */
    var heroMainSwiper = new Swiper('.agri_dtl_main_swiper', {
        loop: true,
        effect: 'slide',
        speed: 500,
        navigation: {
            nextEl: '#heroImgNext',
            prevEl: '#heroImgPrev'
        },
        on: {
            slideChange: function () {
                syncThumb(this.realIndex);
            }
        }
    });

    /* 同步缩略图激活状态 */
    function syncThumb(realIdx) {
        var $thumbs = $('.agri_dtl_thumb');
        $thumbs.removeClass('agri_dtl_thumb--active');
        $thumbs.eq(realIdx).addClass('agri_dtl_thumb--active');
    }

    /* 点击缩略图切换主图 */
    $(document).on('click', '.agri_dtl_thumb', function () {
        var idx = parseInt($(this).data('idx'), 10);
        heroMainSwiper.slideToLoop(idx);
        syncThumb(idx);
    });

    /* ----------------------------------------------------------
       项目详情 图集 Swiper（中心放大 + 两侧层叠）
       通过给 active 前后第二位的 slide 加 prev2/next2 类
       由 CSS 静态控制三层位置/缩放，远处 slide opacity:0 隐藏
    ---------------------------------------------------------- */
    var detailGallerySwiper = new Swiper('.agri_dtl_gallery_swiper', {
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        loopAdditionalSlides: 5,
        speed: 500,
        allowTouchMove: false,
        simulateTouch: false,
        navigation: {
            nextEl: '.agri_dtl_detail_sec .agri_dtl_gallery_arrow--next',
            prevEl: '.agri_dtl_detail_sec .agri_dtl_gallery_arrow--prev'
        },
        pagination: {
            el: '.agri_dtl_detail_sec .agri_dtl_gallery_dots',
            clickable: true,
            bulletClass: 'agri_dtl_dot',
            bulletActiveClass: 'agri_dtl_dot--active'
        },
        on: {
            init: function () { updateGalleryLayerClasses(this); },
            slideChange: function () { updateGalleryLayerClasses(this); },
            slideChangeTransitionStart: function () { updateGalleryLayerClasses(this); },
            loopFix: function () { updateGalleryLayerClasses(this); },
            transitionEnd: function () { updateGalleryLayerClasses(this); }
        }
    });

    function updateGalleryLayerClasses(swiper) {
        var slides = swiper && swiper.slides ? swiper.slides : [];
        if (!slides.length) return;

        for (var i = 0; i < slides.length; i++) {
            slides[i].classList.remove('agri_dtl_slide_prev2', 'agri_dtl_slide_next2');
        }

        var a = swiper.activeIndex;
        if (a - 2 >= 0 && slides[a - 2]) {
            slides[a - 2].classList.add('agri_dtl_slide_prev2');
        }
        if (a + 2 < slides.length && slides[a + 2]) {
            slides[a + 2].classList.add('agri_dtl_slide_next2');
        }
    }

    /* ----------------------------------------------------------
       Fancybox
    ---------------------------------------------------------- */
    if (typeof Fancybox !== 'undefined') {

        Fancybox.bind('[data-fancybox="photos-gallery"]', {
            Toolbar: { display: ['close', 'counter', 'fullscreen'] }
        });
    }

    /* ----------------------------------------------------------
       收藏按钮：点击切换激活状态
    ---------------------------------------------------------- */
    $(document).on('click', '.agri_dtl_fav_btn', function () {
        $(this).toggleClass('cur');
    });

    /* ----------------------------------------------------------
       周边配套：两层 Tab 切换（主分类 → 子分类 → POI 列表）
       数据结构：poiData[主分类][子分类] = [ { name, dist, dec? }, ... ]
       dist 为数字（米），dec 为可选描述
    ---------------------------------------------------------- */
    var poiData = {
        '交通': {
            '地铁': [
                { name: '顺义地铁站', dist: 549,  dec: '地铁12号线：地铁16号线' },
                { name: '石门站',     dist: 1259, dec: '地铁12号线：地铁16号线' },
                { name: '后沙峪站',   dist: 1579, dec: '地铁12号线：地铁16号线' },
                { name: '密云站',     dist: 1654, dec: '地铁12号线：地铁16号线' }
            ],
            '公交': [
                { name: '顺义南法信公交站',  dist: 320,  dec: '848路：915快路：918路' },
                { name: '石门村东口',        dist: 760,  dec: '942路：顺52路' },
                { name: '后沙峪商业中心站',  dist: 1120, dec: '915路：顺18路' },
                { name: '裕民大街北口',      dist: 1480, dec: '942路：顺38路' }
            ]
        },
        '教育': {
            '幼儿园': [
                { name: '顺义区第一幼儿园', dist: 480,  dec: '公办示范园' },
                { name: '红黄蓝亲子园',     dist: 920,  dec: '亲子早教' },
                { name: '北京顺义国际幼儿园', dist: 1380, dec: '国际双语' }
            ],
            '小学': [
                { name: '顺义区第二实验小学', dist: 690,  dec: '公办市重点' },
                { name: '空港新都市小学',     dist: 1260, dec: '公办示范' }
            ],
            '中学': [
                { name: '顺义区第一中学',     dist: 1120, dec: '北京市示范高中' },
                { name: '牛栏山第一中学',     dist: 2480, dec: '北京市示范高中' }
            ],
            '大学': [
                { name: '北京电影学院（怀柔校区）', dist: 6800, dec: '本科院校' },
                { name: '北京工业大学（顺义校区）', dist: 4200, dec: '本科院校' }
            ]
        },
        '医疗': {
            '综合医院': [
                { name: '北京顺义区医院',         dist: 1450, dec: '三级甲等综合医院' },
                { name: '空港医院',               dist: 2100, dec: '二级综合医院' }
            ],
            '社区诊所': [
                { name: '南法信社区卫生服务中心', dist: 380,  dec: '社区卫生服务' },
                { name: '后沙峪社区卫生服务站',   dist: 1180, dec: '社区卫生服务' }
            ],
            '药店': [
                { name: '老百姓大药房（顺义店）', dist: 260,  dec: '24小时营业' },
                { name: '同仁堂药店',             dist: 540,  dec: '中医药店' }
            ]
        },
        '购物': {
            '商场': [
                { name: '顺义祥云小镇',     dist: 1820, dec: '大型购物中心' },
                { name: '华联商厦顺义店',   dist: 980,  dec: '综合百货商场' },
                { name: '罗马湖商业街',     dist: 2450, dec: '主题街区' }
            ],
            '超市': [
                { name: '物美大卖场',       dist: 420,  dec: '大型连锁超市' },
                { name: '永辉超市',         dist: 760,  dec: '生鲜超市' }
            ],
            '便利店': [
                { name: '7-ELEVEN',         dist: 180,  dec: '24小时便利店' },
                { name: '便利蜂',           dist: 320,  dec: '24小时便利店' }
            ]
        },
        '生活': {
            '银行': [
                { name: '中国工商银行',     dist: 360,  dec: '储蓄/信贷' },
                { name: '中国建设银行',     dist: 580,  dec: '储蓄/信贷' },
                { name: '招商银行',         dist: 920,  dec: '储蓄/信贷' }
            ],
            '邮局': [
                { name: '中国邮政顺义支局', dist: 760,  dec: '寄递/储蓄' }
            ],
            '美食': [
                { name: '海底捞火锅',       dist: 1120, dec: '川菜·火锅' },
                { name: '西贝莜面村',       dist: 980,  dec: '西北菜' },
                { name: '星巴克咖啡',       dist: 280,  dec: '咖啡饮品' }
            ]
        },
        '娱乐': {
            'KTV': [
                { name: '麦乐迪KTV',        dist: 1320, dec: '量贩式KTV' },
                { name: '钱柜KTV',          dist: 1980, dec: '量贩式KTV' }
            ],
            '电影院': [
                { name: '万达影城（顺义店）', dist: 1820, dec: 'IMAX影厅' },
                { name: '金逸影城',           dist: 2240, dec: '杜比全景声' }
            ],
            '健身': [
                { name: '威尔士健身',         dist: 860,  dec: '综合健身房' },
                { name: '乐刻运动',           dist: 540,  dec: '24小时健身房' }
            ]
        }
    };

    var $poiCatHead  = $('.agri_dtl_poi_tab_head');
    var $poiSubTabs  = $('.agri_dtl_poi_sub_tabs');
    var $poiList     = $('.agri_dtl_poi_list');

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
        var cats = Object.keys(poiData);
        var html = '';
        for (var i = 0; i < cats.length; i++) {
            html += '<button class="agri_dtl_poi_cat' + (i === 0 ? ' agri_dtl_poi_cat--active' : '') + '" data-cat="' + cats[i] + '">' + cats[i] + '</button>';
        }
        $poiCatHead.html(html);
        if (cats[0]) renderSubTabs(cats[0]);
    }

    renderCatTabs();

    $(document).on('click', '.agri_dtl_poi_cat', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_cat--active')) return;
        $btn.addClass('agri_dtl_poi_cat--active').siblings().removeClass('agri_dtl_poi_cat--active');
        renderSubTabs($btn.data('cat'));
    });

    $(document).on('click', '.agri_dtl_poi_sub', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_sub--active')) return;
        $btn.addClass('agri_dtl_poi_sub--active').siblings().removeClass('agri_dtl_poi_sub--active');
        var cat = $poiSubTabs.attr('data-cat');
        renderPoiList(cat, $btn.data('sub'));
    });

    /* ----------------------------------------------------------
       相关推荐项目：响应式轮播 + 可点击分页器
       PC ≥1201px : 3 列
       平板 768~1200px: 2 列
       手机 ≤767px : 1 列
    ---------------------------------------------------------- */
    new Swiper('.agri_dtl_related_swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        grabCursor: true,
        pagination: {
            el: '.agri_dtl_related_pagination',
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1201: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });

    /* ----------------------------------------------------------
       特色优势：通栏滑动轮播 + 进度条
    ---------------------------------------------------------- */
    var $advFill = $('.agri_dtl_advantage_fill');

    function setAdvProgress(progress) {
        var pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
        $advFill.css('width', pct + '%');
    }

    /* 计算首张 slide 与 w1480 左边对齐所需的偏移量（px） */
    function calcAdvOffset() {
        var fs   = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;
        var w    = Math.min(14.8 * fs, window.innerWidth * 0.9);
        return Math.max(0, (window.innerWidth - w) / 2);
    }

    var advSwiper = new Swiper('.agri_dtl_adv_swiper', {
        slidesPerView: 'auto',
        spaceBetween: (function () {
            var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;
            return Math.round(0.4 * fs);
        }()),
        slidesOffsetBefore: calcAdvOffset(),
        slidesOffsetAfter: calcAdvOffset(),
        watchSlidesProgress: true,
        freeMode: { enabled: true, momentum: true },
        grabCursor: true,
        on: {
            init: function () {
                setAdvProgress(this.progress);
            },
            progress: function () {
                setAdvProgress(this.progress);
            }
        }
    });

});
