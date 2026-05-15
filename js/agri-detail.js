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
       周边配套：分类/子分类切换
    ---------------------------------------------------------- */
    $(document).on('click', '.agri_dtl_poi_cat', function () {
        $(this).addClass('agri_dtl_poi_cat--active').siblings().removeClass('agri_dtl_poi_cat--active');
    });
    $(document).on('click', '.agri_dtl_poi_sub', function () {
        $(this).addClass('agri_dtl_poi_sub--active').siblings().removeClass('agri_dtl_poi_sub--active');
    });

    /* ----------------------------------------------------------
       相关推荐项目：3列轮播 + 可点击分页器
    ---------------------------------------------------------- */
    new Swiper('.agri_dtl_related_swiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        grabCursor: true,
        pagination: {
            el: '.agri_dtl_related_pagination',
            clickable: true
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
