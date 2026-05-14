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
        effect: 'fade',
        fadeEffect: { crossFade: true },
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
        spaceBetween: 28,
        loop: true,
        speed: 500,
        navigation: {
            nextEl: '.agri_dtl_detail_sec .agri_dtl_arrow_next',
            prevEl: '.agri_dtl_detail_sec .agri_dtl_arrow_prev'
        },
        on: {
            slideChange: function () {
                syncGalleryDots(this.realIndex);
            }
        }
    });

    function syncGalleryDots(idx) {
        var $dots = $('.agri_dtl_gallery_dots .agri_dtl_dot');
        $dots.removeClass('agri_dtl_dot--active');
        $dots.eq(idx % $dots.length).addClass('agri_dtl_dot--active');
    }

    $(document).on('click', '.agri_dtl_gallery_dots .agri_dtl_dot', function () {
        var idx = $(this).index();
        detailGallerySwiper.slideToLoop(idx);
        syncGalleryDots(idx);
    });

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
