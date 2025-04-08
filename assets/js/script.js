document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.swiper-container').forEach(container => {
        const swiper = new Swiper(container, {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 10,
            loop: false,
            autoplay: {
                delay: 10000,
                disableOnInteraction: false,
            },
            pagination: {
                el: container.querySelector('.custom-pagination'),
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                1036: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                },
                633: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                },
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
            },
            on: {
                init: function () {
                    startProgressAnimation(this);
                },
                slideChange: function () {
                    resetProgressAnimation(this);
                    startProgressAnimation(this);
                },
            }
        });
    });

    function startProgressAnimation(swiper) {
        const bullets = swiper.pagination.bullets;
        const activeIndex = Math.floor(swiper.realIndex / swiper.params.slidesPerGroup);

        bullets.forEach(bullet => {
            bullet.classList.remove('active');
            bullet.style.animation = 'none';
        });

        if (bullets[activeIndex]) {
            bullets[activeIndex].classList.add('active');
            bullets[activeIndex].style.animation = `progress ${swiper.params.autoplay.delay}ms linear`;
        }
    }

    function resetProgressAnimation(swiper) {
        swiper.pagination.bullets.forEach(bullet => {
            bullet.classList.remove('active');
            bullet.style.animation = 'none';
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const slider = new Swiper('.swiper-container-img', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,

        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },

        pagination: {
            el: '.custom-pagination',
            type: 'bullets',
            clickable: true,
        },


        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        on: {
            init: function () {
                startProgressAnimation(this);
            },
            slideChange: function () {
                resetProgressAnimation(this);
                startProgressAnimation(this);
            },
        }
    });

    function startProgressAnimation(swiper) {
        const bullets = swiper.pagination.bullets;
        const activeIndex = swiper.realIndex;

        bullets.forEach(bullet => {
            bullet.classList.remove('active');
            bullet.style.animation = 'none';
        });

        if (bullets[activeIndex]) {
            bullets[activeIndex].classList.add('active');
            bullets[activeIndex].style.animation = `progress ${swiper.params.autoplay.delay}ms linear`;
        }
    }

    function resetProgressAnimation(swiper) {
        swiper.pagination.bullets.forEach(bullet => {
            bullet.classList.remove('active');
            bullet.style.animation = 'none';
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const element = document.querySelector('.js-choice');
    const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: '',
    });
});

window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

"use strict";
function DynamicAdapt(type) {
    this.type = type;
}
DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");
    // наполнение оbjects объектами
    for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(",");
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
        оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
        return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
    });
    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];
        // массив объектов с подходящим брейкпоинтом
        const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
            return item.breakpoint === mediaBreakpoint;
        });
        matchMedia.addListener(function () {
            _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
    }
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
    } else {
        //for (let i = 0; i < оbjects.length; i++) {
        for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
                this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        }
    }
};
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
    }
    if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
        parent.insertAdjacentElement('beforeend', element);
    }
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
};
// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === "first" || b.place === "last") {
                    return -1;
                }

                if (a.place === "last" || b.place === "first") {
                    return 1;
                }

                return a.place - b.place;
            }

            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === "first" || b.place === "last") {
                    return 1;
                }

                if (a.place === "last" || b.place === "first") {
                    return -1;
                }

                return b.place - a.place;
            }

            return b.breakpoint - a.breakpoint;
        });
        return;
    }
};
const da = new DynamicAdapt("max");
da.init();

/*Loading================================================================================*/
window.addEventListener('load', function () {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
});

/*Content_download================================================================================*/
let wrapper = document.querySelector('.wrapper');
window.addEventListener('load', (event) => {
    wrapper.classList.add('loaded');
});

//burger=====================================================================================================================================================
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.header__body');
const body = document.querySelector('body');

if (iconMenu) {
    iconMenu.addEventListener('click',
        function clickButtonBurger(event) {
            iconMenu.classList.toggle('active');
            menuBody.classList.toggle('active');
            body.classList.toggle('lock');
        });
}


ymaps.ready(init);
function init() {
    var kazanCoords = [55.78794306894016, 49.13017450000001];

    var myMap = new ymaps.Map("map", {
        center: kazanCoords, 
        zoom: 17,
        controls: ['zoomControl']
    });

    myMap.options.set('filter', {
        applyTo: 'map',
        type: 'grayscale',
        value: 100
    });

    var myPlacemark = new ymaps.Placemark(
        kazanCoords,
        {
            hintContent: 'ул. Бутлерова, 21',
            balloonContent: 'Казань, ул. Бутлерова, 21'
        },
        {
            preset: 'islands#redIcon',
            iconColor: '#ff0000',
            iconShadow: true
        }
    );

    myMap.geoObjects.add(myPlacemark);

    // myMap.behaviors.disable('scrollZoom');
}