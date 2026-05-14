(function () {
    if (window.AOS) {
        AOS.init({
            delay: 300,
            duration: 1200,
            once: false
        });
    }

    function initAgricultureFilters() {
        var filter = document.querySelector('.agri_filter');
        if (!filter) return;

        var selectedList = filter.querySelector('.selected_tag_list');
        var selectedTitle = filter.querySelector('.selected_tit');
        var clearBtn = filter.querySelector('.clear_btn');

        function addTag(text) {
            if (!selectedList || !text || text === '不限') return;
            var tag = document.createElement('div');
            tag.className = 'selected_tag';
            tag.innerHTML = text + '<img class="close" src="images/express/close-icon.svg" alt="">';
            selectedList.appendChild(tag);
        }

        function updateSelectedTags() {
            if (!selectedList || !selectedTitle) return;
            selectedList.innerHTML = '';
            var count = 0;

            filter.querySelectorAll('.filter_row').forEach(function (row) {
                var current = row.querySelector('.filter_option.cur');
                if (current && current.textContent.trim() !== '不限') {
                    addTag(current.textContent.trim());
                    count += 1;
                }
            });

            selectedTitle.textContent = '已选择（' + count + '）';
        }

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAgricultureFilters);
    } else {
        initAgricultureFilters();
    }
})();
