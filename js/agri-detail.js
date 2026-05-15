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
       项目详情 图集 Swiper（中心放大式）
    ---------------------------------------------------------- */
    var detailGallerySwiper = new Swiper('.agri_dtl_gallery_swiper', {
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        loopAdditionalSlides: 3,
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
            init: function () {
                updateGalleryLayerClasses(this);
            },
            slideChange: function () {
                updateGalleryLayerClasses(this);
            },
            loopFix: function () {
                updateGalleryLayerClasses(this);
            },
            transitionEnd: function () {
                updateGalleryLayerClasses(this);
            }
        }
    });

    /* 给当前 active 前后第二位的 slide 加上第三层 class */
    function updateGalleryLayerClasses(swiper) {
        var slides = swiper && swiper.slides ? swiper.slides : [];
        if (!slides.length) return;

        for (var i = 0; i < slides.length; i++) {
            slides[i].classList.remove('agri_dtl_slide_prev2', 'agri_dtl_slide_next2');
        }

        var activeIdx = swiper.activeIndex;
        var prev2Idx = activeIdx - 2;
        var next2Idx = activeIdx + 2;

        if (prev2Idx >= 0 && slides[prev2Idx]) {
            slides[prev2Idx].classList.add('agri_dtl_slide_prev2');
        }
        if (next2Idx < slides.length && slides[next2Idx]) {
            slides[next2Idx].classList.add('agri_dtl_slide_next2');
        }
    }

    /* ----------------------------------------------------------
       Fancybox
    ---------------------------------------------------------- */
    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind('[data-fancybox="detail-gallery"]', {
            Toolbar: { display: ['close', 'counter', 'fullscreen'] }
        });
        Fancybox.bind('[data-fancybox="adv-gallery"]', {
            Toolbar: { display: ['close', 'counter', 'fullscreen'] }
        });
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
       特色优势：进度条滚动动画
    ---------------------------------------------------------- */
    function updateAdvFill() {
        var $fill = $('.agri_dtl_advantage_fill');
        if (!$fill.length) return;
        var top  = $('.agri_dtl_advantage').offset().top;
        var h    = $('.agri_dtl_advantage').outerHeight();
        var sy   = $(window).scrollTop() + $(window).height() * 0.6;
        if (sy > top && sy < top + h) {
            var pct = Math.min(100, Math.round((sy - top) / h * 120));
            $fill.css('width', pct + '%');
        }
    }
    $(window).on('scroll.advFill', updateAdvFill);
    updateAdvFill();

});
