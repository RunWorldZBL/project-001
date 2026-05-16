/* ============================================================
   property-detail.js — property_management_detail.html 专用脚本
   依赖：jQuery 3.6, Swiper, AOS, Fancybox, my.js, platform-pages.js
   ============================================================ */

$(function () {

    /* ----------------------------------------------------------
       项目详情：右侧缩略图点击切换主图
    ---------------------------------------------------------- */
    $(document).on('click', '.prop_dtl_detail_thumb', function () {
        var $thumb = $(this);
        var src = $thumb.find('img').attr('src');
        $('.prop_dtl_detail_main img').attr('src', src);
        $('.prop_dtl_detail_thumb').removeClass('prop_dtl_detail_thumb--active');
        $thumb.addClass('prop_dtl_detail_thumb--active');
    });

    /* ----------------------------------------------------------
       Fancybox 项目图集弹窗
    ---------------------------------------------------------- */
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox="prop-gallery"]', {
            Toolbar: { display: ['close', 'counter', 'fullscreen'] }
        });
    }

    /* ----------------------------------------------------------
       收藏按钮：点击切换激活状态
    ---------------------------------------------------------- */
    $(document).on('click', '.prop_dtl_fav_btn', function () {
        $(this).toggleClass('cur');
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
        spaceBetween: (function () {
            var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;
            return Math.round(0.4 * fs);
        }()),
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
            slideChange: function () { setAdvProgress(this.progress); }
        }
    });

    /* ----------------------------------------------------------
       项目图集：进度条 + 翻页（暂时静态展示，箭头点击为占位）
    ---------------------------------------------------------- */
    $('.prop_dtl_photos_arrow').on('click', function () {
        var $arrow = $(this);
        var $fill = $('.prop_dtl_photos_fill');
        var current = parseInt($fill[0].style.width || '30', 10);
        if ($arrow.hasClass('prop_dtl_photos_arrow--next')) {
            current = Math.min(100, current + 20);
        } else {
            current = Math.max(20, current - 20);
        }
        $fill.css('width', current + '%');
    });

    /* ----------------------------------------------------------
       Hero 主图左右切换按钮（占位：切换主图与缩略图同步演示）
    ---------------------------------------------------------- */
    var heroBgImages = [
        'images/agri-detail/hero-main.jpg',
        'images/agri-detail/thumb1.jpg',
        'images/agri-detail/thumb2.jpg',
        'images/agri-detail/thumb3.jpg'
    ];
    var heroBgIndex = 0;
    function showHeroBg(idx) {
        idx = (idx + heroBgImages.length) % heroBgImages.length;
        heroBgIndex = idx;
        $('.prop_dtl_hero_bg .bg_img').attr('src', heroBgImages[idx]);
    }
    $(document).on('click', '.prop_dtl_arrow_prev', function () { showHeroBg(heroBgIndex - 1); });
    $(document).on('click', '.prop_dtl_arrow_next', function () { showHeroBg(heroBgIndex + 1); });

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

});
