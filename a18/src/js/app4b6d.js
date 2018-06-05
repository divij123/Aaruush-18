//# Application object
//
//*

/*global
    TweenLite,
    TimelineLite,
    TimelineMax,
    CustomEase,
    PerfectScrollbar,
    _
*/

'use strict';

var App = {
    $win: $(window),
    $doc: $(document),
    $html: $('html'),
    $body: $('body'),

    browser: false,

    $startBtn: $('.js-start-btn'),
    $loader: $('.js-loader'),

    $logo: $('.js-logo'),
    $logoLetter: $('.js-logo .letter'),

    $socialItems: $('.js-footer-social__item'),
    $socialMusicItems: $('.js-footer-music__item'),

    $hamburgerLink: $('.js-banner-hamburger__link'),
    $hamburgerText: $(
        '.js-banner-hamburger__link .c-banner-hamburger__text'
    ),
    $hamburgerIcon: $(
        '.js-banner-hamburger__link .c-banner-hamburger__icon'
    ),

    $album: $('.js-album'),
    $albumWrap: $('.c-album-wrap'),
    $albumInfo: $('.js-album-info'),
    $albumTitle: $('.js-album-title'),
    $albumTitleLetter: $('.js-album-title .letter'),
    $albumTitlePattern: $('.js-album-title .pattern'),
    $albumControl: $('.js-album-control'),

    $mosaics: $('.js-mosaics'),
    $mosaicsWrap: $('.js-album-list__img'),
    mosaicsPosition: {},
    $mosaicsElements: $('.js-mosaics .svg-mosaics__element'),
    $mosaicsElementsHover: $('.js-mosaics [data-hover=true]'),
    $mosaicsElementsStatic: $('.js-mosaics .svg-mosaics__element-static'),
    $mosaicsElementsShadow: $('.js-mosaics .svg-mosaics__element-shadow'),

    $listSongsTitle: $('.js-album-list__song-item'),

    $songTitle: $('.js-album-info__title-item'),
    $infoAuthor: $('.js-album-info__author-item'),
    $infoText: $('.js-album-info__text-item'),
    $infoMobileToggle: $('.js-album-info__top-toggle'),

    $closeBtn: $('.js-album-info__close'),

    $playBtn: $('.js-album-control__btn.t-play'),
    $changeBtn: $(
        '.js-album-control__btn.t-next, .js-album-control__btn.t-prev,' +
        '.js-album-info__top-btn.t-next, .js-album-info__top-btn.t-prev'),

    $navLink: $('.js-sidebar-nav__link'),
    $scrollEl: $('.js-scroll'),
    psInfoScroll: false,
    psSidebarScroll: false,
    psTourScroll: false,

    hoverIndex: false,
    activeIndex: false,
    firstSong: true,
    currentPage: false,

    sidebarOpen: false,
    mobileInfoOpen: false
};

App.pages = {
    tour: $('.js-tour'),
    album: App.$album
};

App.music = [
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio(),
    new Audio()
];

App.musicSrc = [
    // '/src/mp3/cut/1.mp3',
    // '/src/mp3/cut/2.mp3',
    // '/src/mp3/cut/3.mp3',
    // '/src/mp3/cut/4.mp3',
    // '/src/mp3/cut/5.mp3',
    // '/src/mp3/cut/6.mp3',
    // '/src/mp3/cut/7.mp3',
    // '/src/mp3/cut/8.mp3',
    // '/src/mp3/cut/9.mp3',
    // '/src/mp3/cut/10.mp3'
    '/src/mp3/1.mp3',
    '/src/mp3/2.mp3',
    '/src/mp3/3.mp3',
    '/src/mp3/4.mp3',
    '/src/mp3/5.mp3',
    '/src/mp3/6.mp3',
    '/src/mp3/7.mp3',
    '/src/mp3/8.mp3',
    '/src/mp3/9.mp3',
    '/src/mp3/10.mp3'
];

//## CSS Variables
//
//*

App.animation = {
    transition: 0.3,
    ease: CustomEase.create('custom', 'M0,0 C0.25,0.1 0.25,1 1,1')
};


//## Check browser
//
//*

if (/MSIE 10/i.test(navigator.userAgent)) {
    App.browser = 'ie';

    App.$html.addClass('is-ie');
}

if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
    App.browser = 'ie';

    App.$html.addClass('is-ie');
}

if (/Edge\/\d./i.test(navigator.userAgent)) {
    App.browser = 'edge';

    App.$html.addClass('is-edge');
}

if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    App.browser = 'firefox';

    App.$html.addClass('is-firefox');
}

if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    App.browser = 'safari';

    App.$html.addClass('is-safari');
}


//## Svg class
//
//*

if (SVGElement && SVGElement.prototype) {
    SVGElement.prototype.hasClass = function (className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
    };
    SVGElement.prototype.addClass = function (className) {
        if (!this.hasClass(className)) {
            this.setAttribute('class', this.getAttribute('class') + ' ' + className);
        }
    };
    SVGElement.prototype.removeClass = function (className) {
        var removedClass = this.getAttribute('class')
            .replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
        if (this.hasClass(className)) {
            this.setAttribute('class', removedClass);
        }
    };
    SVGElement.prototype.toggleClass = function (className) {
        if (this.hasClass(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    };
}


//## Mosaics
//
//*

function scaleOut($elementHover, active) {
    var opacity = active ? 0.5 : 0,
        $title = App.$listSongsTitle.filter('[data-index=' + App.activeIndex + ']'),
        $listSongsTitle = App.activeIndex ? App.$listSongsTitle.not($title) : App.$listSongsTitle;

    // App.$mosaicsElementsShadow.css({ opacity: 0, visibility: 'hidden' });

    TweenLite.killTweensOf($listSongsTitle);

    TweenLite.to(App.$mosaicsElementsShadow, 0.2, {
        opacity: 0,
        visibility: 'hidden',
        ease: CustomEase.create('custom', 'M0,0 C0,0 0.58,1 1,1')
    });

    TweenLite.to($listSongsTitle, 0, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    });

    TweenLite.to($elementHover, 0.4, {
        transformOrigin: 'center center',
        scale: 1,
        ease: App.animation.ease
    });

    TweenLite.to($elementHover.parent(), 0.4, {
        opacity: opacity,
        ease: App.animation.ease
    });
}

function scaleIn($elementHover) {
    var index = $elementHover.data('index'),
        $title = App.$listSongsTitle.filter('[data-index=' + index + ']'),
        $elementShadow = App.$mosaicsElementsShadow.filter('[data-index=' + index + ']'),
        $listSongsTitle = App.$listSongsTitle.not($title);

    TweenLite.killTweensOf($listSongsTitle);

    TweenLite.to($listSongsTitle, 0, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    });

    TweenLite.to($title, 0.4, {
        opacity: 1,
        display: 'block',
        ease: App.animation.ease
    });

    TweenLite.to($elementHover, 0.4, {
        transformOrigin: 'center center',
        scale: 1.2,
        ease: App.animation.ease
    });

    TweenLite.to($elementHover.parent(), 0.4, {
        opacity: 1,
        ease: App.animation.ease
    });

    TweenLite.to($elementShadow, 0.2, {
        opacity: 1,
        visibility: 'visible',
        ease: CustomEase.create('custom', 'M0,0 C0,0 0.58,1 1,1')
    }, 0.2);
}

function waitingSound(index) {
    return function () {
        if (index === App.activeIndex) {
            App.$playBtn.addClass('is-loading');
        }
    };
}

function plaingSound(index) {
    return function () {
        if (index === App.activeIndex) {
            App.$playBtn.removeClass('is-loading');
        }
    };
}

function musicPlay(index) {
    var music = App.music[index - 1];

    App.$playBtn.removeClass('is-paused');

    music.addEventListener('waiting', waitingSound(index));
    music.addEventListener('playing', plaingSound(index));

    music.volume = 1;
    music.play();

}

function musicPause(index) {
    App.$playBtn.addClass('is-paused');
    App.music[index - 1].pause();
}

function musicStop(index) {
    var music = index ? App.music[index - 1] : App.music;

    if (!music.length) {
        music.pause();
        music.currentTime = 0;

        return false;
    }

    $.each(music, function () {
        var self = this;
        // if (!this.paused && ! this.readyState) {
        //     var musicIndex = music.indexOf(this);
        //     console.log('Nooooooo:' + musicIndex, this.readyState);
        //     this.oncanplay = function (s) {
        //         console.log('state changed', s);
        //         self.oncanplay = null;

        //         if (App.activeIndex != musicIndex) {
        //             self.pause();
        //             self.currentTime = 0;
        //         }
        //     };
        // } else {
            this.pause();
            this.currentTime = 0;
        // }
    });
}

function changeBtnStatus() {
    var length = App.music.length;

    App.$changeBtn.removeClass('is-disabled');

    if (App.activeIndex === 1) {
        App.$changeBtn.filter('.t-prev').addClass('is-disabled');
    }

    if (App.activeIndex === length) {
        App.$changeBtn.filter('.t-next').addClass('is-disabled');
    }
}

function openAnimation(index) {
    var $currentTitle = App.$songTitle.filter('[data-index=' + index + ']'),
        $currentAuthor = App.$infoAuthor.filter('[data-index=' + index + ']'),
        $currentText = App.$infoText.filter('[data-index=' + index + ']'),
        psScroll = $('.js-album-info__text').find('.ps__rail-y'),
        tl = new TimelineLite({
            onComplete: function () {

                if (App.psInfoScroll) {
                    App.psInfoScroll.update();
                    psScroll.css('opacity', 1);
                }

                if (App.firstSong) {
                    App.$mosaics.removeClass('is-disabled');
                    App.firstSong = false;
                }
            }
        });

    if (App.psInfoScroll) {
        psScroll.css('opacity', 0);
    }

    if (App.firstSong) {
        App.$mosaics.addClass('is-disabled');

        if ($(window).width() <= 650) {
            tl.to(App.$albumWrap, 0.5, {
                paddingBottom: 80,
                ease: App.animation.ease
            }, 0)
            .to(App.$albumTitle.parent(), 0.5, {
                top: '100%',
                ease: App.animation.ease
            }, 0)
            .to(App.$albumTitle, 0.5, {
                marginTop: '0',
                y: '40px',
                ease: App.animation.ease
            }, 0)
            .to(App.$listSongsTitle.parent(), 0.5, {
                top: '100%',
                marginTop: '70px',
                ease: App.animation.ease
            }, 0);

        } else {
            tl
            .to(App.$albumTitle, 0.5, {
                y: -90,
                ease: App.animation.ease
            }, 0)
            .to(App.$listSongsTitle.parent(), 0.5, {
                top: '59%',
                ease: App.animation.ease
            }, 0);
        }

        tl
        .to(App.$mosaicsElementsStatic, 0.5, {
            fill: 'transparent',
            ease: App.animation.ease
        })
        .to(App.$albumInfo, 0.5, {
            width: '100%',
            opacity: 1,
            visibility: 'visible',
            ease: App.animation.ease
        }, 0)
        .to(App.$albumControl, 0.5, {
            opacity: 1,
            visibility: 'visible',
            marginBottom: 0,
            y: 0,
            ease: App.animation.ease
        }, 0)
        .to(App.$closeBtn, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        })
        .to($currentTitle, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        }, '-=0.15')
        .to($currentAuthor, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        }, '-=0.15')
        .to($currentText, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        }, '-=0.15');
    } else {
        tl
        .to(App.$infoText, 0.3, {
            opacity: 0,
            display: 'none',
            ease: App.animation.ease
        })
        .to(App.$infoAuthor, 0.3, {
            opacity: 0,
            display: 'none',
            ease: App.animation.ease
        }, '-=0.15')
        .to(App.$songTitle, 0.3, {
            opacity: 0,
            display: 'none',
            ease: App.animation.ease
        }, '-=0.15')
        .to($currentTitle, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        })
        .to($currentAuthor, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        }, '-=0.15')
        .to($currentText, 0.3, {
            opacity: 1,
            display: 'block',
            ease: App.animation.ease
        }, '-=0.15');
    }
}

function activeElement(index, disableAutoplay) {
    var $elementHoverActive = App.$mosaicsElementsHover.filter('[data-index=' + index + ']'),
        $elementHover = App.$mosaicsElementsHover.filter('[data-index=' + App.hoverIndex + ']'),
        $elementHoverNotHover = App.$mosaicsElementsHover.not($elementHover),
        $elementActive = $elementHoverActive.parent(),
        center = $elementActive.data('center');

    App.activeIndex = index;

    changeBtnStatus();
    openAnimation(index);

    if (! disableAutoplay) {
        musicPlay(index);
    }

    scaleOut($elementHoverNotHover);

    if (App.hoverIndex && !$elementHoverActive.is(':hover')) {
        scaleOut($elementHoverActive, true);
    } else {
        scaleIn($elementHoverActive, center);
    }
}

function closeAnimation() {
    var tl = new TimelineLite({
        onComplete: function () {
            musicStop(App.activeIndex);

            App.hoverIndex = false;

            scaleOut(App.$mosaicsElementsHover);

            App.activeIndex = false;
            App.firstSong = true;
            App.$mosaics.css('pointer-events', 'all');
        },
        onUpdate: function () {
            tlUpdate(this);
        }
    });

    if (App.psInfoScroll) {
        $('.js-album-info__text').find('.ps__rail-y').css('opacity', 0);
    }

    App.$mosaics.css('pointer-events', 'none');

    function tlUpdate(e) {
        var currentTime = tl.time(),
            totalTime = e._totalDuration,
            currentMusic = App.music[App.activeIndex - 1];

        currentMusic.volume = 1 - currentTime / totalTime;
    }

    tl
    .to(App.$infoText, 0.3, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    })
    .to(App.$infoAuthor, 0.3, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    }, '-=0.15')
    .to(App.$songTitle, 0.3, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    }, '-=0.15')
    .to(App.$closeBtn, 0.3, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    }, '-=0.15')
    .to(App.$albumInfo, 0.3, {
        opacity: 0,
        visibility: 'hidden',
        ease: App.animation.ease
    }, '-=0.3')
    .add('infoHide', '-=0.15')
    .to(App.$albumControl, 0.5, {
        opacity: 0,
        marginBottom: -60,
        y: 70,
        visibility: 'hidden',
        ease: App.animation.ease
    }, 'infoHide')
    .to(App.$albumInfo, 0.5, {
        width: '0',
        ease: App.animation.ease
    }, 'infoHide')
    .to(App.$mosaicsElementsStatic, 0.5, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, 'infoHide');

    if ($(window).width() <= 650) {
        tl.to(App.$albumWrap, 0.5, {
            paddingBottom: 0,
            ease: App.animation.ease
        }, 'infoHide')
        .to(App.$albumTitle.parent(), 0.5, {
            top: '50%',
            ease: App.animation.ease
        }, 'infoHide')
        .to(App.$albumTitle, 0.5, {
            marginTop: '-9px',
            y: '0',
            ease: App.animation.ease
        }, 'infoHide')
        .to(App.$listSongsTitle.parent(), 0.5, {
            top: '50%',
            marginTop: '34px',
            ease: App.animation.ease
        }, 'infoHide');
    } else {
        tl
        .to(App.$albumTitle, 0.5, {
            y: 0,
            ease: App.animation.ease
        }, 'infoHide')
        .to(App.$listSongsTitle.parent(), 0.5, {
            top: '50%',
            ease: App.animation.ease
        }, 'infoHide');
    }
}

changeBtnStatus();

$.each(App.music, function () {
    this.addEventListener('ended', function () {
        var index = App.music.indexOf(this) + 1;

        if (index + 1 > App.music.length) {
            closeAnimation();
        } else {
            activeElement(index + 1);
        }
    });
});

App.$mosaicsElementsHover.on('mouseenter', function () {
    var index = $(this).data('index'),
    $elementHover = $(this),
    $element = $elementHover.parent(),
    center = $element.data('center'),
    $elementHoverActive = App.$mosaicsElementsHover.filter(
        '[data-index=' + App.activeIndex + ']'
    );

    App.hoverIndex = index;

    if (App.$mosaics.children().last()[0] !== $element[0]) {
        App.$mosaics.append($element);
    }

    if (index !== App.activeIndex) {
        scaleOut($elementHoverActive, true);
    }

    setTimeout(function () {
        scaleIn($elementHover, center);
    }, 0);
})
.on('mouseleave', function (e) {
    var $elementHoverNext = $(e.toElement),
        $elementActive, center, $elementHoverNotActive, $elementHoverActive;

    App.hoverIndex = false;

    if (!App.activeIndex) {
        scaleOut(App.$mosaicsElementsHover);
    } else {
        $elementHoverNotActive = App.$mosaicsElementsHover.not(
            '[data-index=' + App.activeIndex + ']'
        );
        $elementHoverActive = App.$mosaicsElementsHover.filter(
            '[data-index=' + App.activeIndex + ']'
        );
        $elementActive = $elementHoverActive.parent();
        center = $elementActive.data('center');

        if ($elementHoverNext.hasClass('svg-mosaics__element-hover')) {
            scaleOut($elementHoverNotActive);
            scaleOut($elementHoverActive, true);
        } else {
            scaleOut($elementHoverNotActive);
            scaleIn($elementHoverActive, center);
        }
    }
});

App.$mosaicsElementsHover.on('click touchend', _.debounce(function () {
    var index = $(this).data('index');

    musicStop();
    activeElement(index);
}, 500, { 'leading': true, 'trailing': false }));

App.$closeBtn.on('click', function () {
    closeAnimation();
});

App.$playBtn.on('click', function () {
    var music = App.music[App.activeIndex - 1];

    if (music.paused === false) {
        musicPause(App.activeIndex);
    } else {
        musicPlay(App.activeIndex);
    }
});

App.$changeBtn.on('click', _.debounce(function () {
    musicStop(App.activeIndex);

    if ($(this).hasClass('t-prev')) {
        activeElement(App.activeIndex - 1);
    } else {
        activeElement(App.activeIndex + 1);
    }
}, 500, { 'leading': true, 'trailing': false }));

window.addEventListener('focus', function () {
    TweenLite.lagSmoothing(1000, 16);
});
window.addEventListener('blur', function () {
    TweenLite.lagSmoothing(0);
});


//## Space click
//
//*

$(document).on('keyup', function (e) {
    if (e.which === 32) {

        if (App.music[App.activeIndex - 1].paused === false) {
            musicPause(App.activeIndex);
        } else {
            musicPlay(App.activeIndex);
        }
    }
});


//## Animation start
//
//*

function logoAnimate() {
    var tl = new TimelineLite();

    App.$logoLetter.each(function (index) {
        var delay = index > 0 ? '-=0.4' : 'none';

        tl.to($(this), 0.5, {
            opacity: 1,
            ease: App.animation.ease
        }, delay);
    });

    return tl;
}

function socialAnimate() {
    var tl = new TimelineLite();

    App.$socialItems.each(function (index) {
        var delay = index > 0 ? '-=0.7' : 'none';

        tl.to($(this), 0.8, {
            opacity: 1,
            ease: App.animation.ease
        }, delay);
    });

    return tl;
}

function socialMusicAnimate() {
    var tl = new TimelineLite();

    $(App.$socialMusicItems.get().reverse()).each(function (index) {
        var delay = index > 0 ? '-=1' : 'none';

        tl.to($(this), 1.1, {
            opacity: 1,
            ease: App.animation.ease
        }, delay);
    });

    return tl;
}

function hamburgerAnimate() {
    var tl = new TimelineLite({
        delay: 0.3
    });

    tl
    .to(App.$hamburgerIcon, 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, 0)
    .to($(App.$hamburgerText), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.4');

    return tl;
}

function glitchAnimate() {
    var tl = new TimelineMax({
        repeat: 6.1
    }),
    circle = App.$albumTitlePattern.filter('.t-circle'),
    line = App.$albumTitlePattern.filter('.t-line'),
    plus = App.$albumTitlePattern.filter('.t-plus'),
    dagger = App.$albumTitlePattern.filter('.t-dagger'),
    hexagon = App.$albumTitlePattern.filter('.t-hexagon'),
    square = App.$albumTitlePattern.filter('.t-square');

    tl
    .to(circle, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(circle, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    })
    .to(line, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(line, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    })
    .to(plus, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(plus, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    })
    .to(dagger, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(dagger, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    })
    .to(hexagon, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(hexagon, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    })
    .to(square, 0.04, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to(square, 0.04, {
        opacity: 0,
        ease: App.animation.ease
    });

    return tl;
}

function albumTitleAnimate() {
    var tl = new TimelineLite();

    tl
    .to(App.$albumTitle, 0.5, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to($(App.$albumTitleLetter[5]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, 0.5)
    .to($(App.$albumTitleLetter[0]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .to($(App.$albumTitleLetter[4]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .to($(App.$albumTitleLetter[2]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .to($(App.$albumTitleLetter[6]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .to($(App.$albumTitleLetter[1]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .to($(App.$albumTitleLetter[3]), 0.6, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.3')
    .add(glitchAnimate(), 0)
    .to(App.$albumTitle, 0.7, {
        scale: 1,
        marginTop: -9,
        ease: App.animation.ease
    })
    .to(App.$albumTitle, 0.4, {
        color: 'white',
        ease: App.animation.ease
    }, '+=0.1');

    return tl;
}

function mosaicsAnimate() {
    var mainTl = new TimelineLite({
        delay: -0.4,
        onComplete: function () {
            App.$mosaics.removeClass('is-disabled');
        }
    }),
    borderTl = new TimelineLite(),
    fillTl = new TimelineLite();

    borderTl
    .to($(App.$mosaicsElementsStatic[0]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    })
    .to($(App.$mosaicsElementsStatic[5]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[1]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[6]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[2]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[7]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[3]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[8]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[4]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[9]), 0.3, {
        opacity: 1,
        ease: App.animation.ease
    }, '-=0.25');

    fillTl
    .to($(App.$mosaicsElementsStatic[0]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    })
    .to($(App.$mosaicsElementsStatic[5]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[1]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[6]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[2]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[7]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[3]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[8]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[4]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25')
    .to($(App.$mosaicsElementsStatic[9]), 0.3, {
        fill: '#D11C00',
        ease: App.animation.ease
    }, '-=0.25');

    mainTl
    .to(App.$mosaics, 0, {
        visibility: 'visible'
    }, 0)
    .add(borderTl)
    .add(fillTl, 0.2);

    return mainTl;
}

function animationStart() {
    var mainTl = new TimelineLite({
        delay: 0.2,
        onComplete: function () {
            scaleIn($(App.$mosaicsElementsHover[0]));
            setTimeout(function () {
                activeElement(1, true);
                App.$playBtn.addClass('is-paused');
            }, 1000);
        },
    });

    App.music.forEach(function (item, index) {
        item.src = App.musicSrc[index];
    });

    mainTl.to(App.$startBtn, 0.2, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    })
    .to(App.$loader, 0.2, {
        opacity: 0,
        display: 'none',
        ease: App.animation.ease
    }, -0.2)
    .add('loaderHide', '+=0.2')
    .add(logoAnimate(), 'loaderHide')
    .add(socialAnimate(), 'loaderHide')
    .add(socialMusicAnimate(), 'loaderHide')
    .add(hamburgerAnimate(), 'loaderHide')
    .add(albumTitleAnimate(), 'loaderHide')
    .add(mosaicsAnimate());
}
window.onload = function() {
  animationStart();
};
/*App.$startBtn.on('click', function () {
    animationStart();
});

*/
//# Sidebar open
//
//*

App.$hamburgerLink.on('click', function (e) {
    e.preventDefault();

    if (App.sidebarOpen) {
        App.$html.removeClass('is-sidebar-open');
        App.sidebarOpen = false;

        return;
    }

    App.$html.addClass('is-sidebar-open');
    App.sidebarOpen = true;
});

App.$doc.on('click', function (e) {
    if (!$(e.target).closest('.c-sidebar').length && !$(e.target).closest('.c-banner').length) {
        if (App.sidebarOpen) {
            App.$html.removeClass('is-sidebar-open');
            App.sidebarOpen = false;
        }
    }
});


//# Navigation
//
//*

function changeCurrentPage() {
    var tl = new TimelineLite();

    App.$html.removeClass('is-sidebar-open');
    App.sidebarOpen = false;

    App.$navLink.parent().removeClass('is-active');

    App.$navLink.filter('[data-target=' + App.currentPage + ']').parent()
    .addClass('is-active');

    $.each(App.pages, function (prop, $element) {
        if (prop !== App.currentPage) {
            tl
            .to($element, 0.5, {
                opacity: 0,
                visibility: 'hidden'
            });
        }
    });

    tl
    .to(App.pages[App.currentPage], 0.5, {
        opacity: 1,
        visibility: 'visible'
    });
}

function checkCurrentPage() {

    if (window.location.hash && window.location.hash.substring(1) in App.pages) {
        App.currentPage = window.location.hash.substring(1);
    } else {
        App.currentPage = 'album';
    }

    changeCurrentPage();
}

checkCurrentPage();

App.$navLink.on('click', function (e) {
    e.preventDefault();

    window.location.hash = $(this).attr('href');
    App.currentPage = $(this).data('target');

    changeCurrentPage();
});


//# Sroll
//
//*

function scrollInit($element) {
    return new PerfectScrollbar($element[0], {
        wheelSpeed: 0.5,
        swipePropagation: !1
    });
}

App.$doc.ready(function () {
    var ua = navigator.userAgent;

    if (/Android | webOS | iPhone | iPad | iPod | BlackBerry | IEMobile | Opera Mini | Mobile | mobile | CriOS/i.test(ua)) {
        $('html').addClass('is-mobile');
    } else if (App.$win.width() >= 991) {
        App.psInfoScroll = scrollInit($('.js-album-info__text'));
        App.psSidebarScroll = scrollInit($('.js-sidebar-main'));
        App.psTourScroll = scrollInit($('.js-tour-list__wrap'));
    }
});


//# mobileInfoToggle
//
//*

App.$infoMobileToggle.on('click', function (e) {
    e.preventDefault();

    if (App.mobileInfoOpen) {
        App.$html.removeClass('is-info-open');
        App.mobileInfoOpen = false;

        return;
    }

    App.$html.addClass('is-info-open');
    App.mobileInfoOpen = true;
});



//## Loader
//
//*

App.$win.on('load', function () {
    App.$html.addClass('is-loaded');
});



// scrollfix
function scrollFix($el) {
    var scroll = {
        allowUp: null,
        allowDown: null,
        lastY: null,
    };

    $el.on('touchstart', function (event) {
        scroll.allowUp = this.scrollTop > 0;
        scroll.allowDown = this.scrollTop < (this.scrollHeight - this.offsetHeight);
        scroll.lastY = event.originalEvent.touches[0].pageY;
    });

    $el.on('touchmove', function (event) {
        var up = event.originalEvent.touches[0].pageY > scroll.lastY,
            down = !up;
        scroll.lastY = event.originalEvent.touches[0].pageY;
        if ((up && scroll.allowUp) || (down && scroll.allowDown)) {
            event.stopPropagation();
        } else {
            event.preventDefault();
        }
    });
};

scrollFix($('.c-sidebar .container-fluid'));
scrollFix($('.c-tour-wrap'));
scrollFix($('.c-album-info__wrap'));
