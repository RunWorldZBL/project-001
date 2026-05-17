/* ============================================================
   leisure-detail.js — leisure_agriculture_detail.html 专用脚本
   依赖：jQuery 3.6, Swiper, AOS, Fancybox, my.js, platform-pages.js
   ============================================================ */

$(function () {

    /* ----------------------------------------------------------
       Hero 主图轮播（Swiper：slide 横滑切换）
       - loop: true 循环切换，箭头不会变 disabled
       - navigation 绑定 CTA 下方的左右切换按钮
       - allowTouchMove: false：swiper 处于背景层，避免与上层内容拖拽冲突
    ---------------------------------------------------------- */
    if ($('.leis_dtl_hero_bg.swiper').length) {
        new Swiper('.leis_dtl_hero_bg.swiper', {
            loop: true,
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 0,
            allowTouchMove: false,
            navigation: {
                prevEl: '.leis_dtl_hero_arrow_prev',
                nextEl: '.leis_dtl_hero_arrow_next'
            }
        });
    }

    /* ----------------------------------------------------------
       项目图集弹窗：统一由 js/image-popup.js 自动绑定
       所有 [data-fancybox] 元素共享通用 toolbar / caption / 样式
    ---------------------------------------------------------- */

    /* ----------------------------------------------------------
       收藏按钮：切换激活状态
    ---------------------------------------------------------- */
    $(document).on('click', '.leis_dtl_fav_btn', function () {
        $(this).toggleClass('cur');
    });

    /* ----------------------------------------------------------
       招商条件：手风琴展开/收起
       点击 head 切换 --active，并切换图标 src（普通 / -act 版本）
    ---------------------------------------------------------- */
    $(document).on('click', '.leis_dtl_invest_head', function () {
        var $item = $(this).closest('.leis_dtl_invest_item');
        if ($item.hasClass('leis_dtl_invest_item--active')) return;

        var $list = $item.closest('.leis_dtl_invest_list');

        // 收起所有项，恢复普通图标
        $list.find('.leis_dtl_invest_item--active').each(function () {
            var $prev = $(this);
            var idx = $prev.data('idx');
            $prev.find('.leis_dtl_invest_icon img')
                 .attr('src', 'images/leisure-detail/icon-' + idx + '.svg');
            $prev.removeClass('leis_dtl_invest_item--active');
        });

        // 激活当前项，切换激活图标
        var idx = $item.data('idx');
        $item.find('.leis_dtl_invest_icon img')
             .attr('src', 'images/leisure-detail/icon-' + idx + '-act.svg');
        $item.addClass('leis_dtl_invest_item--active');
    });

    /* ----------------------------------------------------------
       项目详情：纵向滚动区域（CSS scroll-snap 实现，无需 Swiper）
       .leis_dtl_detail_scroll 容器高 15.4rem，每张图 8.5rem，间距 0.35rem
       鼠标悬停后滚轮自动逐张吸附切换
    ---------------------------------------------------------- */

    /* ----------------------------------------------------------
       特色优势：通栏 Swiper + 自定义页码
    ---------------------------------------------------------- */
    var $advCurrent = $('.leis_dtl_advantage_page .current');
    var $advTotal   = $('.leis_dtl_advantage_page .total');

    var advSwiper = new Swiper('.leis_dtl_advantage_swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 500,
        navigation: {
            nextEl: '.leis_dtl_advantage_arrow--next',
            prevEl: '.leis_dtl_advantage_arrow--prev'
        },
        on: {
            init: function () {
                $advCurrent.text(this.realIndex + 1);
                $advTotal.text(this.slides.length);
            },
            slideChange: function () {
                $advCurrent.text(this.realIndex + 1);
            }
        }
    });

    /* ----------------------------------------------------------
       项目图集：Swiper 轮播（每页并排 2 张）
       pagination 交由 Swiper 内置管理，bulletClass 复用现有 dot 样式
    ---------------------------------------------------------- */
    var photoFs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100;

    new Swiper('.leis_dtl_photos_swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: Math.round(0.3 * photoFs),
        loop: false,
        watchOverflow: false,
        navigation: {
            prevEl: '.leis_dtl_photos_arrow--prev',
            nextEl: '.leis_dtl_photos_arrow--next',
            disabledClass: 'leis_dtl_photos_arrow--disabled'
        },
        pagination: {
            el: '.leis_dtl_photos_dots',
            clickable: true,
            bulletClass: 'leis_dtl_photos_dot',
            bulletActiveClass: 'leis_dtl_photos_dot--active'
        },
        breakpoints: {
            // ≥ 768px：恢复每屏两张并排
            768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: Math.round(0.6 * photoFs)
            }
        }
    });

    /* ----------------------------------------------------------
       周边配套：复用 agri 详情页同款 POI Tab 数据
    ---------------------------------------------------------- */
    var poiData = {
        '交通': {
            '地铁': [
                { name: '平谷线·大华山站',   dist: 549,  dec: '北京地铁平谷线（在建）' },
                { name: '大华山公交场站',     dist: 1259, dec: '852路 / 平16路' }
            ],
            '公交': [
                { name: '小峪子村口站',       dist: 320,  dec: '平16路 / 平38路' },
                { name: '大华山镇政府站',     dist: 760,  dec: '852路 / 平16路' }
            ]
        },
        '教育': {
            '幼儿园': [
                { name: '大华山中心幼儿园',   dist: 480,  dec: '公办示范园' }
            ],
            '小学': [
                { name: '大华山中心小学',     dist: 690,  dec: '镇中心校' }
            ],
            '中学': [
                { name: '平谷区第三中学',     dist: 1120, dec: '区重点中学' }
            ]
        },
        '医疗': {
            '综合医院': [
                { name: '平谷区医院',         dist: 6450, dec: '三级综合医院' },
                { name: '大华山卫生院',       dist: 880,  dec: '一级综合医院' }
            ],
            '社区诊所': [
                { name: '小峪子村卫生室',     dist: 280, dec: '社区卫生服务' }
            ]
        },
        '购物': {
            '商场': [
                { name: '万德福购物广场',     dist: 6420, dec: '综合购物中心' }
            ],
            '超市': [
                { name: '大华山供销社',       dist: 420,  dec: '镇综合超市' }
            ]
        },
        '生活': {
            '银行': [
                { name: '北京农商银行',       dist: 360,  dec: '储蓄/信贷' }
            ],
            '美食': [
                { name: '老象峰生态饭庄',     dist: 220,  dec: '农家菜·特色餐饮' }
            ]
        },
        '娱乐': {
            '景区': [
                { name: '老象峰景区',         dist: 0,    dec: '4A 级风景区' },
                { name: '京东大溶洞',         dist: 8600, dec: '国家 4A 级景区' }
            ]
        }
    };

    var $poiCatHead = $('.leis_dtl_surroundings_sec .agri_dtl_poi_tab_head');
    var $poiSubTabs = $('.leis_dtl_surroundings_sec .agri_dtl_poi_sub_tabs');
    var $poiList    = $('.leis_dtl_surroundings_sec .agri_dtl_poi_list');

    function formatDist(meters) {
        if (meters === 0) return '园区内';
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

    $(document).on('click', '.leis_dtl_surroundings_sec .agri_dtl_poi_cat', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_cat--active')) return;
        $btn.addClass('agri_dtl_poi_cat--active').siblings().removeClass('agri_dtl_poi_cat--active');
        renderSubTabs($btn.data('cat'));
    });

    $(document).on('click', '.leis_dtl_surroundings_sec .agri_dtl_poi_sub', function () {
        var $btn = $(this);
        if ($btn.hasClass('agri_dtl_poi_sub--active')) return;
        $btn.addClass('agri_dtl_poi_sub--active').siblings().removeClass('agri_dtl_poi_sub--active');
        var cat = $poiSubTabs.attr('data-cat');
        renderPoiList(cat, $btn.data('sub'));
    });

});
