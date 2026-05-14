

// 封装处理函数
function handleNavInteraction() {
  // 移除之前绑定的事件，避免重复绑定
  $('.headR .navApp').off('click');

    if ($(window).width() < 1200) {
        // 窗口宽度小于1300px时绑定点击事件
        $('.headR .navApp').click(function(){ 
            $(this).toggleClass('cur');
            // 查找兄弟元素中的下拉菜单并切换显示状态
            $(this).siblings('.downMenu').stop().slideToggle();
        });
    } 
}

// 移动端菜单逻辑 - 兼容 Safari
function initMobileMenu() {

    // 移动端菜单逻辑
    if ($(window).width() < 1200) {
            // 先清空所有旧事件，防止 Safari 重复触发
            $('.menu-handler').off('click');
            //$(window).off('scroll');

        // 菜单展开折叠
        $('.menu-handler').on('click', function (e) {
            e.preventDefault(); // 阻止 Safari 默认事件冒泡
            $(this).toggleClass('active');
            let isActive = $(this).hasClass('active');
            let hasHeaderBlack = $('.header').hasClass('headerBlack');
            let hasHeaderBlue = $('.header').hasClass('headerBlue'); // 新增判断
            if (isActive) {
                // 菜单展开
                $('.headR').animate({ 'right': 0 }, 300);
                $('.header').addClass('headerBlack');
                document.documentElement.style.overflowY = "hidden";
            } else {
                // 菜单关闭
                $('.headR').animate({ right: '-100%' }, 300);
                        
                // ==============================================
                // 核心修复：如果原本有 headerBlue，关闭后保留它
                // ==============================================
                if (hasHeaderBlue) {
                    // 有 headerBlue：只移除菜单打开时加的 headerBlack
                    $('.header').removeClass('headerBlack');
                } else {
                    // 没有 headerBlue：走原来的逻辑
                    if (!hasHeaderBlack) {
                        if ($(window).scrollTop() < 5) {
                            $('.header').removeClass('headerBlack');
                        }
                    }
                }

                document.documentElement.style.overflowY = "scroll"; 
                return false;
            }
        });

        // 页面滚动监听
        $(window).scroll(function () {
            let scrollTop = $(this).scrollTop();
            let menuIsOpen = $('.menu-handler').hasClass('active');
            let hasHeaderBlack = $('.header').hasClass('headerBlack');
            if (scrollTop >= 5) {
                // 滚动时：强制加黑（优先级最高）
                $('.header').addClass('headerBlack');
            } else {
                // 滚到顶部：只有菜单关闭时才取消黑
                if (!menuIsOpen && !hasHeaderBlack) {
                    $('.header').removeClass('headerBlack');
                }
            }
        });
    }
}
// 电脑端导航
function handleHeaderScroll() {
    $(window).on('scroll', function() {
        // 每次滚动都判断窗口宽度（实时生效）
        if ($(window).width() > 1200) {
            if ($(window).scrollTop()>= 100) {
                $('.header').addClass('headerBlack2'); 
            } else {
                $('.header').removeClass('headerBlack2');  
            }
        } 
    });
}  


$(function() { 
    handleHeaderScroll();
    initMobileMenu();
    handleNavInteraction();
}); 

// 窗口尺寸改变时执行
$(window).resize(function() {
    handleHeaderScroll();
    initMobileMenu();
    handleNavInteraction();
});