//create a dummy wrapper for the console object if it has not been instantiated yet
//needed for IE9 because console is only created when dev tools is open
if (!(window.console && console.log)) {
    console = {
        log: function() {},
        debug: function() {},
        info: function () { },
        warn: function () { },
        error: function () { }
    };
}


if (typeof Orsted == undefined || Orsted == null) {
    var Orsted = {};
}

; Orsted.jQuery = (function ($) {
    return{
        $:$
    }
})(jQuery);

//detect device type
var isTouchDevice = (function() {
    try {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    } catch (e) {
        return false;
    }
}());
var isMobileDevice = isTouchDevice || (navigator.msPointerEnabled && navigator.userAgent.toLowerCase().indexOf('arm') >= 0);

/*!
 * FitVids 1.0
 *
 * Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
 * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 *
 * Date: Thu Sept 01 18:00:00 2011 -0500
 */
; (function (e) { e.fn.fitVids = function (t) { var n = { customSelector: null }, r = document.createElement("div"), i = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0]; return r.className = "fit-vids-style", r.innerHTML = "&shy;<style>               .fluid-width-video-wrapper {                 width: 100%;                              position: relative;                       padding: 0;                            }                                                                                   .fluid-width-video-wrapper iframe,        .fluid-width-video-wrapper object,        .fluid-width-video-wrapper embed {           position: absolute;                       top: 0;                                   left: 0;                                  width: 100%;                              height: 100%;                          }                                       </style>", i.parentNode.insertBefore(r, i), t && e.extend(n, t), this.each(function () { var t = ["iframe[src*='vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='23video.com']", "object", "embed"]; n.customSelector && t.push(n.customSelector); var r = e(this).find(t.join(",")); r.each(function () { var t = e(this); if (this.tagName.toLowerCase() == "embed" && t.parent("object").length || t.parent(".fluid-width-video-wrapper").length) return; var n = this.tagName.toLowerCase() == "object" || t.attr("height") ? t.attr("height") : t.height(), r = t.attr("width") ? t.attr("width") : t.width(), i = n / r; if (!t.attr("id")) { var s = "fitvid" + Math.floor(Math.random() * 999999); t.attr("id", s) } t.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", i * 100 + "%"), t.removeAttr("height").removeAttr("width") }) }) } })(Orsted.jQuery.$);
/*
 * jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
 *
 * twitter.com/keithclarkcouk
 * www.keithclark.co.uk
 */

(function($) {
    function getNthIndex(cur, dir) {
        var t = cur, idx = 0;
        while (cur = cur[dir] ) {
            if (t.tagName == cur.tagName) {
                idx++;
            }
        }
        return idx;
    }

    function isNthOf(elm, pattern, dir) {
        var position = getNthIndex(elm, dir), loop;
        if (pattern == "odd" || pattern == "even") {
            loop = 2;
            position -= !(pattern == "odd");
        } else {
            var nth = pattern.indexOf("n");
            if (nth > -1) {
                loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
                position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
            } else {
                loop = position + 1;
                position -= parseInt(pattern, 10) - 1;
            }
        }
        return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
    }

    var pseudos = {
        "first-of-type": function(elm) {
            return getNthIndex(elm, "previousSibling") == 0;
        },
        "last-of-type": function(elm) {
            return getNthIndex(elm, "nextSibling") == 0;
        },
        "only-of-type": function(elm) {
            return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
        },
        "nth-of-type": function(elm, i, match) {
            return isNthOf(elm, match[3], "previousSibling");
        },
        "nth-last-of-type": function(elm, i, match) {
            return isNthOf(elm, match[3], "nextSibling");
        }
    }
    $.extend($.expr[':'], pseudos);
}(Orsted.jQuery.$));

/*
 * jQuery Cycle Carousel plugin
 */
;(function($){
    function ScrollAbsoluteGallery(options) {
        this.options = $.extend({
            activeClass: 'active',
            mask: 'div.slides-mask',
            slider: '>ul',
            slides: '>li',
            btnPrev: '.btn-prev',
            btnNext: '.btn-next',
            pagerLinks: 'ul.pager > li',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            galleryReadyClass: 'gallery-js-ready',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            maskAutoSize: false,
            autoRotation: false,
            pauseOnHover: false,
            stretchSlideToMask: false,
            switchTime: 3000,
            animSpeed: 500,
            handleTouch: true,
            swipeThreshold: 50
        }, options);
        this.init();
    }
    ScrollAbsoluteGallery.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
            }
        },
        findElements: function() {
            // find structure elements
            this.holder = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.holder.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.holder.find(this.options.btnPrev);
            this.btnNext = this.holder.find(this.options.btnNext);

            // slide count display
            this.currentNumber = this.holder.find(this.options.currentNumber);
            this.totalNumber = this.holder.find(this.options.totalNumber);

            // create gallery pagination
            if(typeof this.options.generatePagination === 'string') {
                this.pagerLinks = this.buildPagination();
            } else {
                this.pagerLinks = this.holder.find(this.options.pagerLinks);
            }

            // define index variables
            this.slideWidth = this.slides.width();
            this.currentIndex = 0;
            this.prevIndex = 0;

            // reposition elements
            this.slider.css({
                position: 'relative',
                display	: 'block',
                height: this.slider.height()
            });
            this.slides.css({
                position: 'absolute',
                left: -9999,
                top: 0
            }).eq(this.currentIndex).css({
                    left: 0
                });

            jQuery(".gallery .next, .gallery .prev").show();

            this.refreshState();
        },
        buildPagination: function() {
            var pagerLinks = $();
            if(!this.pagerHolder) {
                this.pagerHolder = this.holder.find(this.options.generatePagination);
            }
            if(this.pagerHolder.length) {
                this.pagerHolder.empty();
                this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                for(var i = 0; i < this.slides.length; i++) {
                    $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
                }
                pagerLinks = this.pagerList.children();
            }
            return pagerLinks;
        },
        attachEvents: function() {
            // attach handlers
            var self = this;
            this.btnPrev.click(function(e){
                if(self.slides.length > 1) {
                    self.prevSlide();
                }
                e.preventDefault();
            });
            this.btnNext.click(function(e){
                if(self.slides.length > 1) {
                    self.nextSlide();
                }
                e.preventDefault();
            });
            this.pagerLinks.each(function(index){
                $(this).click(function(e){
                    if(self.slides.length > 1) {
                        self.numSlide(index);
                    }
                    e.preventDefault();
                });
            });

            // handle autorotation pause on hover
            if(this.options.pauseOnHover) {
                this.holder.hover(function(){
                    clearTimeout(self.timer);
                }, function(){
                    self.autoRotate();
                });
            }

            // handle holder and slides dimensions
            $(window).bind('load resize orientationchange', function(){
                if(!self.animating) {
                    if(self.options.stretchSlideToMask) {
                        self.resizeSlides();
                    }
                    self.resizeHolder();
                    self.setSlidesPosition(self.currentIndex);
                }
            });
            if(self.options.stretchSlideToMask) {
                self.resizeSlides();
            }

            // handle swipe on mobile devices
            if(this.options.handleTouch && $.fn.swipe && this.slides.length > 1) {
                this.mask.swipe({
                    excludedElements: '',
                    fallbackToMouseEvents: false,
                    threshold: this.options.swipeThreshold,
                    allowPageScroll: 'vertical',
                    swipeStatus: function(e, phase, direction, offset) {
                        // avoid swipe while gallery animating
                        if(self.animating) {
                            return false;
                        }

                        // move gallery
                        if(direction === 'left' || direction === 'right') {
                            self.swipeOffset = -self.slideWidth + (direction === 'left' ? -1 : 1) * offset;
                            self.slider.css({marginLeft: self.swipeOffset});
                        }
                        clearTimeout(self.timer);
                        switch(phase) {
                            case 'cancel':
                                self.slider.animate({marginLeft: -self.slideWidth}, {duration: self.options.animSpeed});
                                break;
                            case 'end':
                                if(direction === 'left') {
                                    self.nextSlide();
                                } else {
                                    self.prevSlide();
                                }
                                self.swipeOffset = 0;
                                break;
                        }
                    }
                });
            }

            // start autorotation
            this.autoRotate();
            this.resizeHolder();
            this.setSlidesPosition(this.currentIndex);
        },
        resizeSlides: function() {
            this.slideWidth = this.mask.width();
            this.slides.css({
                width: this.slideWidth
            });
        },
        resizeHolder: function() {
            if(this.options.maskAutoSize) {
                this.slider.css({
                    height: this.slides.eq(this.currentIndex).outerHeight(true)
                });

            }
        },
        prevSlide: function() {
            if(!this.animating) {
                this.direction = -1;
                this.prevIndex = this.currentIndex;
                if(this.currentIndex > 0) this.currentIndex--;
                else this.currentIndex = this.slides.length - 1;
                this.switchSlide();
            }
        },
        nextSlide: function(fromAutoRotation) {
            if(!this.animating) {
                this.direction = 1;
                this.prevIndex = this.currentIndex;
                if(this.currentIndex < this.slides.length - 1) this.currentIndex++;
                else this.currentIndex = 0;
                this.switchSlide();
            }
        },
        numSlide: function(c) {
            if(!this.animating && this.currentIndex !== c) {
                this.direction = c > this.currentIndex ? 1 : -1;
                this.prevIndex = this.currentIndex;
                this.currentIndex = c;
                this.switchSlide();
            }
        },
        preparePosition: function() {
            // prepare slides position before animation
            this.setSlidesPosition(this.prevIndex, this.direction < 0 ? this.currentIndex : null, this.direction > 0 ? this.currentIndex : null, this.direction);
        },
        setSlidesPosition: function(index, slideLeft, slideRight, direction) {
            // reposition holder and nearest slides
            if (this.slides.length > 1) {
                //QC 1008 - set slide width to mask width
                this.slideWidth = jQuery('.mask').width();
                var prevIndex = (typeof slideLeft === 'number' ? slideLeft : index > 0 ? index - 1 : this.slides.length - 1);
                var nextIndex = (typeof slideRight === 'number' ? slideRight : index < this.slides.length - 1 ? index + 1 : 0);

                this.slider.css({marginLeft: this.swipeOffset ? this.swipeOffset : -this.slideWidth});
this.slides.css({left:-9999}).eq(index).css({left: this.slideWidth});

                if(prevIndex === nextIndex && typeof direction === 'number') {
                    this.slides.eq(nextIndex).css({left: direction > 0 ? this.slideWidth*2 : 0 });
                } else {
                    this.slides.eq(prevIndex).css({left: 0});
                    this.slides.eq(nextIndex).css({left: this.slideWidth * 2});
                }
            }
        },
        switchSlide: function() {
            // prepare positions and calculate offset
            var self = this;
            var oldSlide = this.slides.eq(this.prevIndex);
            var newSlide = this.slides.eq(this.currentIndex);
            //QC 1008 - set slide width to mask width to prevent double image
            this.slideWidth = jQuery('.mask').width();
            // start animation
            var animProps = {marginLeft: this.direction > 0 ? -this.slideWidth*2 : 0 };
            if(this.options.maskAutoSize) {
                // resize holder if needed
                animProps.height = newSlide.outerHeight(true);
            }
            this.animating = true;
            this.preparePosition();
            this.slider.animate(animProps,{duration:this.options.animSpeed, complete:function() {
                self.setSlidesPosition(self.currentIndex);

                // start autorotation
                self.animating = false;
                self.autoRotate();
            }});

            // refresh classes
            this.refreshState();
            //QC 1008 - set slide width to mask width to prevent double image
            jQuery('.slide').width(jQuery('.mask').width());
        },
        refreshState: function(initial) {
            // slide change function
            this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);

            // display current slide number
            this.currentNumber.html(this.currentIndex + 1);
            this.totalNumber.html(this.slides.length);
        },
        autoRotate: function() {
            var self = this;
            clearTimeout(this.timer);
            if(this.options.autoRotation && self.slides.length > 1) {
                this.timer = setTimeout(function() {
                    self.nextSlide();
                }, this.options.switchTime);
            }
        }
    };

    // jquery plugin
    $.fn.scrollAbsoluteGallery = function (opt) {
        return this.each(function () {
            $(this).data('ScrollAbsoluteGallery', new ScrollAbsoluteGallery($.extend(opt, { holder: this })));
        });
    };

}(Orsted.jQuery.$));

/*
 * jQuery Tabs plugin
 */
;(function($){
    $.fn.contentTabs = function(o){
        // default options
        var options = $.extend({
            activeClass:'active',
            addToParent:false,
            autoHeight:false,
            autoRotate:false,
            checkHash:false,
            animSpeed:400,
            switchTime:3000,
            effect: 'none', // "fade", "slide"
            tabLinks:'a',
            attrib:'href',
            event:'click'
        },o);

        return this.each(function(){
            var tabset = $(this);
            var tabLinks = tabset.find(options.tabLinks);
            var tabLinksParents = tabLinks.parent();
            var prevActiveLink = tabLinks.eq(0), currentTab, animating;
            var tabHolder;

            // handle location hash
            if(options.checkHash && tabLinks.filter('[' + options.attrib + '="' + location.hash + '"]').length) {
                (options.addToParent ? tabLinksParents : tabLinks).removeClass(options.activeClass);
                setTimeout(function() {
                    window.scrollTo(0,0);
                },1);
            }

            // init tabLinks
            tabLinks.each(function(){
                var link = $(this);
                var href = link.attr(options.attrib);
                var parent = link.parent();
                href = href.substr(href.lastIndexOf('#'));

                // get elements
                var tab = $(href);
                link.data('cparent', parent);
                link.data('ctab', tab);

                // find tab holder
                if(!tabHolder && tab.length) {
                    tabHolder = tab.parent();
                }

                // show only active tab
                var classOwner = options.addToParent ? parent : link;
                if(classOwner.hasClass(options.activeClass) || (options.checkHash && location.hash === href)) {
                    classOwner.addClass(options.activeClass);
                    prevActiveLink = link; currentTab = tab;
                    tab.removeClass(tabHiddenClass).width('');
                    contentTabsEffect[options.effect].show({tab:tab, fast:true});
                } else {
                    contentTabsEffect[options.effect].hide({tab:tab, fast:true});
                    tab.width(tab.width()).addClass(tabHiddenClass);
                }

                // event handler
                link.bind(options.event, function(e){
                    if(link != prevActiveLink && !animating) {
                        switchTab(prevActiveLink, link);
                        prevActiveLink = link;
                    }
                });
                if(options.attrib === 'href') {
                    link.bind('click', function(e){
                        e.preventDefault();
                    });
                }
            });

            // tab switch function
            function switchTab(oldLink, newLink) {
                animating = true;
                var oldTab = oldLink.data('ctab');
                var newTab = newLink.data('ctab');
                prevActiveLink = newLink;
                currentTab = newTab;

                // refresh pagination links
                (options.addToParent ? tabLinksParents : tabLinks).removeClass(options.activeClass);
                (options.addToParent ? newLink.data('cparent') : newLink).addClass(options.activeClass);

                // hide old tab
                resizeHolder(oldTab, true);
                contentTabsEffect[options.effect].hide({
                    speed: options.animSpeed,
                    tab:oldTab,
                    complete: function() {
                        // show current tab
                        resizeHolder(newTab.removeClass(tabHiddenClass).width(''));
                        contentTabsEffect[options.effect].show({
                            speed: options.animSpeed,
                            tab:newTab,
                            complete: function() {
                                if(!oldTab.is(newTab)) {
                                    oldTab.width(oldTab.width()).addClass(tabHiddenClass);
                                }
                                animating = false;
                                resizeHolder(newTab, false);
                                autoRotate();
                            }
                        });
                    }
                });
            }

            // holder auto height
            function resizeHolder(block, state) {
                var curBlock = block && block.length ? block : currentTab;
                if(options.autoHeight && curBlock) {
                    tabHolder.stop();
                    if(state === false) {
                        tabHolder.css({height:''});
                    } else {
                        var origStyles = curBlock.attr('style');
                        curBlock.show().css({width:curBlock.width()});
                        var tabHeight = curBlock.outerHeight(true);
                        if(!origStyles) curBlock.removeAttr('style'); else curBlock.attr('style', origStyles);
                        if(state === true) {
                            tabHolder.css({height: tabHeight});
                        } else {
                            tabHolder.animate({height: tabHeight}, {duration: options.animSpeed});
                        }
                    }
                }
            }
            if(options.autoHeight) {
                $(window).bind('resize orientationchange', function(){
                    resizeHolder(currentTab, false);
                });
            }

            // autorotation handling
            var rotationTimer;
            function nextTab() {
                var activeItem = (options.addToParent ? tabLinksParents : tabLinks).filter('.' + options.activeClass);
                var activeIndex = (options.addToParent ? tabLinksParents : tabLinks).index(activeItem);
                var newLink = tabLinks.eq(activeIndex < tabLinks.length - 1 ? activeIndex + 1 : 0);
                prevActiveLink = tabLinks.eq(activeIndex);
                switchTab(prevActiveLink, newLink);
            }
            function autoRotate() {
                if(options.autoRotate && tabLinks.length > 1) {
                    clearTimeout(rotationTimer);
                    rotationTimer = setTimeout(function() {
                        if(!animating) {
                            nextTab();
                        } else {
                            autoRotate();
                        }
                    }, options.switchTime);
                }
            }
            autoRotate();
        });
    };

    // add stylesheet for tabs on DOMReady
    var tabHiddenClass = 'js-tab-hidden';
    $(function() {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.'+tabHiddenClass;
        tabStyleRule += '{display:none !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    });

    // tab switch effects
    var contentTabsEffect = {
        none: {
            show: function(o) {
                o.tab.css({display:'block'});
                if(o.complete) o.complete();
            },
            hide: function(o) {
                o.tab.css({display:'none'});
                if(o.complete) o.complete();
            }
        },
        fade: {
            show: function(o) {
                if(o.fast) o.speed = 1;
                o.tab.fadeIn(o.speed);
                if(o.complete) setTimeout(o.complete, o.speed);
            },
            hide: function(o) {
                if(o.fast) o.speed = 1;
                o.tab.fadeOut(o.speed);
                if(o.complete) setTimeout(o.complete, o.speed);
            }
        },
        slide: {
            show: function(o) {
                var tabHeight = o.tab.show().css({width:o.tab.width()}).outerHeight(true);
                var tmpWrap = $('<div class="effect-div">').insertBefore(o.tab).append(o.tab);
                tmpWrap.css({width:'100%', overflow:'hidden', position:'relative'}); o.tab.css({marginTop:-tabHeight,display:'block'});
                if(o.fast) o.speed = 1;
                o.tab.animate({marginTop: 0}, {duration: o.speed, complete: function(){
                    o.tab.css({marginTop: '', width: ''}).insertBefore(tmpWrap);
                    tmpWrap.remove();
                    if(o.complete) o.complete();
                }});
            },
            hide: function(o) {
                var tabHeight = o.tab.show().css({width:o.tab.width()}).outerHeight(true);
                var tmpWrap = $('<div class="effect-div">').insertBefore(o.tab).append(o.tab);
                tmpWrap.css({width:'100%', overflow:'hidden', position:'relative'});

                if(o.fast) o.speed = 1;
                o.tab.animate({marginTop: -tabHeight}, {duration: o.speed, complete: function(){
                    o.tab.css({display:'none', marginTop:'', width:''}).insertBefore(tmpWrap);
                    tmpWrap.remove();
                    if(o.complete) o.complete();
                }});
            }
        }
    };
}(Orsted.jQuery.$));

/*
 * jQuery Open/Close plugin
 */
;(function($) {
    function OpenClose(options) {
        this.options = $.extend({
            addClassBeforeAnimation: true,
            hideOnClickOutside: false,
            activeClass:'active',
            opener:'.opener',
            slider:'.slide-acc',
            animSpeed: 400,
            effect:'fade',
            event:'click'
        }, options);
        this.init();
    }
    OpenClose.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function() {
            this.holder = $(this.options.holder);
            this.opener = this.holder.find(this.options.opener);
            this.slider = this.holder.find(this.options.slider);
            if(this.options.hideOpeners) this.openersBlock = this.holder.find(this.options.hideOpeners);

            if (!this.holder.hasClass(this.options.activeClass)) {
                this.slider.addClass(slideHiddenClass);
            }
        },
        attachEvents: function() {
            // add handler
            var self = this;
            this.eventHandler = function(e) {
                e.preventDefault();
                if (self.slider.hasClass(slideHiddenClass)) {
                    if(self.options.hideOpeners) self.openersBlock.hide();
                    self.showSlide();
                } else {
                    self.hideSlide();
                }
            };
            self.opener.bind(self.options.event, this.eventHandler);

            // hover mode handler
            if(self.options.event === 'over') {
                self.opener.bind('mouseenter', function() {
                    self.holder.removeClass(self.options.activeClass);
                    self.opener.trigger(self.options.event);
                });
                self.holder.bind('mouseleave', function() {
                    self.holder.addClass(self.options.activeClass);
                    self.opener.trigger(self.options.event);
                });
            }

            if(self.options.scrollClose) {
                jQuery(window).bind('closeSlide', function() {
                    self.holder.removeClass(self.options.activeClass);
                    self.slider.addClass(slideHiddenClass).hide();
                    $(document).unbind('click touchstart', self.outsideClickHandler);
                });
                jQuery(window).bind('showSlide', function() {
                    self.holder.addClass(self.options.activeClass);
                    self.slider.removeClass(slideHiddenClass).show();
                });
            }

            // outside click handler
            if(self.options.hideOnClickOutside) {
                self.outsideClickHandler = function(e) {

                    var target = $(e.target);
                    if (!target.is(self.opener) && !target.parents().filter(self.slider).length && !target.parents().filter(self.opener).length) {
                        if(self.options.hideOpeners) {
                            jQuery(window).trigger('closeSlide');
                            self.openersBlock.show();
                        } else {
                            self.hideSlide();
                        }
                        $(document).unbind('click touchstart', self.outsideClickHandler);
                    }
                };
            };

        },
        showSlide: function() {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.addClass(self.options.activeClass);
            }
            self.slider.removeClass(slideHiddenClass);
            $(document).bind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', this, true);
            toggleEffects[self.options.effect].show({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function() {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.addClass(self.options.activeClass);
                    }
                    self.makeCallback('animEnd', true, self);
                }
            });
        },
        hideSlide: function() {
            var self = this;
            if (self.options.addClassBeforeAnimation) {
                self.holder.removeClass(self.options.activeClass);
            }
            $(document).unbind('click touchstart', self.outsideClickHandler);

            self.makeCallback('animStart', this, false);
            toggleEffects[self.options.effect].hide({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function() {
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.removeClass(self.options.activeClass);
                    }
                    self.slider.addClass(slideHiddenClass);
                    self.makeCallback('animEnd', false, self);
                }
            });
        },
        destroy: function() {
            this.slider.removeClass(slideHiddenClass).css({display:''});
            this.opener.unbind(this.options.event, this.eventHandler);
            this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
            $(document).unbind('click', this.outsideClickHandler);
        },
        makeCallback: function(name) {
            if(typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    // add stylesheet for slide on DOMReady
    var slideHiddenClass = 'js-slide-hidden';
    $(function() {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + slideHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    });

    // animation effects
    var toggleEffects = {
        slide: {
            show: function(o) {
                o.box.stop(true).hide().slideDown(o.speed, o.complete);
            },
            hide: function(o) {
                o.box.stop(true).slideUp(o.speed, o.complete);
            }
        },
        fade: {
            show: function(o) {
                o.box.stop(true).hide().fadeIn(o.speed, o.complete);
            },
            hide: function(o) {
                o.box.stop(true).fadeOut(o.speed, o.complete);
            }
        },
        none: {
            show: function(o) {
                o.box.hide().show(0, o.complete);
            },
            hide: function(o) {
                o.box.hide(0, o.complete);
            }
        }
    };

    // jQuery plugin interface
    $.fn.openClose = function(opt) {
        return this.each(function() {
            jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
        });
    };
}(Orsted.jQuery.$));

/*
 * jQuery SameHeight plugin
 */
;(function($){
    $.fn.sameHeight = function(opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        },opt);
        return this.each(function(){
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if(!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if(options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }
            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function() {
                if(!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function() {
                        doResize();
                        setTimeout(function(){
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if(options.flexible) {
                $(window).bind('resize.sh orientationchange.sh fontresize.sh customResize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function(ind){
            var curItem = $(this);
            if(curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if(currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if(options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function(){
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
            var element = $(this);
            var depthDiffHeight = 0;

            if(typeof parent !== 'number') {
                element.parents().each(function(){
                    var tmpParent = $(this);
                    if(this === parent[0]) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight - (element.outerHeight() - element.height());
            if(calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(Orsted.jQuery.$));

/*! http://mths.be/placeholder v2.0.6 by @mathias */
;(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input'),
        isTextareaSupported = 'placeholder' in document.createElement('textarea'),
        prototype = $.fn,
        valHooks = $.valHooks,
        hooks,
        placeholder;
    if(navigator.userAgent.indexOf('Opera/') != -1) {
        isInputSupported = isTextareaSupported = false;
    }
    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);
                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);
                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                        // We can�t use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don�t get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
            rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this,
            $input = $(input),
            hadFocus;
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            hadFocus = input == document.activeElement;
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
            }
            hadFocus && input.select();
        }
    }

    function setPlaceholder() {
        var $replacement,
            input = this,
            $input = $(input),
            $origInput = $input,
            id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': true,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, Orsted.jQuery.$));

/*
 * Browser platform detection
 */
PlatformDetect = (function(){
    var detectModules = {};
    return {
        options: {
            cssPath: '_layouts/15/Orsted.Group.Branding/v2/css/'
        },
        addModule: function(obj) {
            detectModules[obj.type] = obj;
        },
        addRule: function(rule) {
            if(this.matchRule(rule)) {
                this.applyRule(rule);
                return true;
            }
        },
        matchRule: function(rule) {
            return detectModules[rule.type].matchRule(rule);
        },
        applyRule: function(rule) {
            var head = document.getElementsByTagName('head')[0], fragment, cssText;
            if(rule.css) {
                cssText = '<link rel="stylesheet" href="' + this.options.cssPath + rule.css + '" />';
                if(head) {
                    fragment = document.createElement('div');
                    fragment.innerHTML = cssText;
                    head.appendChild(fragment.childNodes[0]);
                } else {
                    document.write(cssText);
                }
            }

            if(rule.meta) {
                if(head) {
                    fragment = document.createElement('div');
                    fragment.innerHTML = rule.meta;
                    head.appendChild(fragment.childNodes[0]);
                } else {
                    document.write(rule.meta);
                }
            }
        },
        matchVersions: function(host, target) {
            target = target.toString();
            host = host.toString();

            var majorVersionMatch = parseInt(target, 10) === parseInt(host, 10);
            var minorVersionMatch = (host.length > target.length ? host.indexOf(target) : target.indexOf(host)) === 0;

            return majorVersionMatch && minorVersionMatch;
        }
    };
}());

// Blackberry detection
PlatformDetect.addModule({
    type: 'blackberry',
    parseUserAgent: function() {
        var match = /(BlackBerry).*Version\/([0-9.]*).*/.exec(navigator.userAgent);
        if(match) {
            return {
                version: match[2]
            };
        }
    },
    matchRule: function(rule) {
        this.matchData = this.matchData || this.parseUserAgent();
        if(this.matchData) {
            return rule.version ? PlatformDetect.matchVersions(this.matchData.version, rule.version) : true;
        }
    }
});

PlatformDetect.addRule({type: 'blackberry', css: 'blackberry.css'});

/*
 * touchSwipe - jQuery Plugin
 * https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * http://labs.skinkers.com/touchSwipe/
 * http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010 Matt Bryson (www.skinkers.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * $version: 1.6.0
 */;(function(d){+"use strict";var n="left",m="right",c="up",u="down",b="in",v="out",k="none",q="auto",j="swipe",r="pinch",e="click",x="horizontal",s="vertical",h="all",f="start",i="move",g="end",o="cancel",a="ontouchstart" in window,w="TouchSwipe";var l={fingers:1,threshold:75,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"button, input, select, textarea, a, .noSwipe"};d.fn.swipe=function(A){var z=d(this),y=z.data(w);if(y&&typeof A==="string"){if(y[A]){return y[A].apply(this,Array.prototype.slice.call(arguments,1))}else{d.error("Method "+A+" does not exist on jQuery.swipe")}}else{if(!y&&(typeof A==="object"||!A)){return t.apply(this,arguments)}}return z};d.fn.swipe.defaults=l;d.fn.swipe.phases={PHASE_START:f,PHASE_MOVE:i,PHASE_END:g,PHASE_CANCEL:o};d.fn.swipe.directions={LEFT:n,RIGHT:m,UP:c,DOWN:u,IN:b,OUT:v};d.fn.swipe.pageScroll={NONE:k,HORIZONTAL:x,VERTICAL:s,AUTO:q};d.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:h};function t(y){if(y&&(y.allowPageScroll===undefined&&(y.swipe!==undefined||y.swipeStatus!==undefined))){y.allowPageScroll=k}if(!y){y={}}y=d.extend({},d.fn.swipe.defaults,y);return this.each(function(){var A=d(this);var z=A.data(w);if(!z){z=new p(this,y);A.data(w,z)}})}function p(S,af){var aF=(a||!af.fallbackToMouseEvents),ax=aF?"touchstart":"mousedown",U=aF?"touchmove":"mousemove",au=aF?"touchend":"mouseup",D=aF?null:"mouseleave",R="touchcancel";var ac=0;var N=null;var ag=0;var aB=0;var A=0;var ai=1;var aH=0;var H=d(S);var O="start";var aE=0;var ah=null;var I=0;var Y=0;var aA=0;var aJ=0;try{H.bind(ax,ar);H.bind(R,M)}catch(aC){d.error("events not supported "+ax+","+R+" on jQuery.swipe")}this.enable=function(){H.bind(ax,ar);H.bind(R,M);return H};this.disable=function(){Q();return H};this.destroy=function(){Q();H.data(w,null);return H};function ar(aM){if(X()){return}if(d(aM.target).closest(af.excludedElements,H).length>0){return}var aN=aM.originalEvent;var aL,aK=a?aN.touches[0]:aN;O=f;if(a){aE=aN.touches.length}else{aM.preventDefault()}ac=0;N=null;aH=null;ag=0;aB=0;A=0;ai=1;pinchDistance=0;ah=T();z();if(!a||(aE===af.fingers||af.fingers===h)||ao()){aI(0,aK);I=B();if(aE==2){aI(1,aN.touches[1]);aB=A=Z(ah[0].start,ah[1].start)}if(af.swipeStatus||af.pinchStatus){aL=aD(aN,O)}}else{aL=false}if(aL===false){O=o;aD(aN,O);return aL}else{aj(true)}}function P(aN){var aQ=aN.originalEvent;if(O===g||O===o||ae()){return}var aM,aL=a?aQ.touches[0]:aQ;var aO=V(aL);Y=B();if(a){aE=aQ.touches.length}O=i;if(aE==2){if(aB==0){aI(1,aQ.touches[1]);aB=A=Z(ah[0].start,ah[1].start)}else{V(aQ.touches[1]);A=Z(ah[0].end,ah[1].end);aH=an(ah[0].end,ah[1].end)}ai=y(aB,A);pinchDistance=Math.abs(aB-A)}if((aE===af.fingers||af.fingers===h)||!a||ao()){N=aq(aO.start,aO.end);C(aN,N);ac=G(aO.start,aO.end);ag=L();if(af.swipeStatus||af.pinchStatus){aM=aD(aQ,O)}if(!af.triggerOnTouchEnd||af.triggerOnTouchLeave){var aK=true;if(af.triggerOnTouchLeave){var aP=at(this);aK=az(aO.end,aP)}if(!af.triggerOnTouchEnd&&aK){O=aG(i)}else{if(af.triggerOnTouchLeave&&!aK){O=aG(g)}}if(O==o||O==g){aD(aQ,O)}}}else{O=o;aD(aQ,O)}if(aM===false){O=o;aD(aQ,O)}}function aa(aM){var aO=aM.originalEvent;if(a){if(aO.touches.length>0){av();return true}}if(ae()){aE=aJ}aM.preventDefault();Y=B();if(af.triggerOnTouchEnd||(af.triggerOnTouchEnd==false&&O===i)){O=g;var aL=((aE===af.fingers||af.fingers===h)||!a);var aK=ah[0].end.x!==0;var aN=aL&&aK&&(am()||ay());if(aN){aD(aO,O)}else{O=o;aD(aO,O)}}else{if(O===i){O=o;aD(aO,O)}}aj(false)}function M(){aE=0;Y=0;I=0;aB=0;A=0;ai=1;z();aj(false)}function W(aK){var aL=aK.originalEvent;if(af.triggerOnTouchLeave){O=aG(g);aD(aL,O)}}function Q(){H.unbind(ax,ar);H.unbind(R,M);H.unbind(U,P);H.unbind(au,aa);if(D){H.unbind(D,W)}aj(false)}function aG(aN){var aM=aN;var aL=ap();var aK=ad();if(!aL){aM=o}else{if(aK&&aN==i&&(!af.triggerOnTouchEnd||af.triggerOnTouchLeave)){aM=g}else{if(!aK&&aN==g&&af.triggerOnTouchLeave){aM=o}}}return aM}function aD(aM,aK){var aL=undefined;if(ab()){aL=al(aM,aK,j)}if(ao()&&aL!==false){aL=al(aM,aK,r)}if(K()&&aL!==false){aL=al(aM,aK,e)}if(aK===o){M(aM)}if(aK===g){if(a){if(aM.touches.length==0){M(aM)}}else{M(aM)}}return aL}function al(aN,aK,aM){var aL=undefined;if(aM==j){if(af.swipeStatus){aL=af.swipeStatus.call(H,aN,aK,N||null,ac||0,ag||0,aE);if(aL===false){return false}}if(aK==g&&ay()){if(af.swipe){aL=af.swipe.call(H,aN,N,ac,ag,aE);if(aL===false){return false}}switch(N){case n:if(af.swipeLeft){aL=af.swipeLeft.call(H,aN,N,ac,ag,aE)}break;case m:if(af.swipeRight){aL=af.swipeRight.call(H,aN,N,ac,ag,aE)}break;case c:if(af.swipeUp){aL=af.swipeUp.call(H,aN,N,ac,ag,aE)}break;case u:if(af.swipeDown){aL=af.swipeDown.call(H,aN,N,ac,ag,aE)}break}}}if(aM==r){if(af.pinchStatus){aL=af.pinchStatus.call(H,aN,aK,aH||null,pinchDistance||0,ag||0,aE,ai);if(aL===false){return false}}if(aK==g&&am()){switch(aH){case b:if(af.pinchIn){aL=af.pinchIn.call(H,aN,aH||null,pinchDistance||0,ag||0,aE,ai)}break;case v:if(af.pinchOut){aL=af.pinchOut.call(H,aN,aH||null,pinchDistance||0,ag||0,aE,ai)}break}}}if(aM==e){if(aK===o){if(af.click&&(aE===1||!a)&&(isNaN(ac)||ac===0)){aL=af.click.call(H,aN,aN.target)}}}return aL}function ad(){if(af.threshold!==null){return ac>=af.threshold}return true}function ak(){if(af.pinchThreshold!==null){return pinchDistance>=af.pinchThreshold}return true}function ap(){var aK;if(af.maxTimeThreshold){if(ag>=af.maxTimeThreshold){aK=false}else{aK=true}}else{aK=true}return aK}function C(aK,aL){if(af.allowPageScroll===k||ao()){aK.preventDefault()}else{var aM=af.allowPageScroll===q;switch(aL){case n:if((af.swipeLeft&&aM)||(!aM&&af.allowPageScroll!=x)){aK.preventDefault()}break;case m:if((af.swipeRight&&aM)||(!aM&&af.allowPageScroll!=x)){aK.preventDefault()}break;case c:if((af.swipeUp&&aM)||(!aM&&af.allowPageScroll!=s)){aK.preventDefault()}break;case u:if((af.swipeDown&&aM)||(!aM&&af.allowPageScroll!=s)){aK.preventDefault()}break}}}function am(){return ak()}function ao(){return !!(af.pinchStatus||af.pinchIn||af.pinchOut)}function aw(){return !!(am()&&ao())}function ay(){var aK=ap();var aM=ad();var aL=aM&&aK;return aL}function ab(){return !!(af.swipe||af.swipeStatus||af.swipeLeft||af.swipeRight||af.swipeUp||af.swipeDown)}function E(){return !!(ay()&&ab())}function K(){return !!(af.click)}function av(){aA=B();aJ=event.touches.length+1}function z(){aA=0;aJ=0}function ae(){var aK=false;if(aA){var aL=B()-aA;if(aL<=af.fingerReleaseThreshold){aK=true}}return aK}function X(){return !!(H.data(w+"_intouch")===true)}function aj(aK){if(aK===true){H.bind(U,P);H.bind(au,aa);if(D){H.bind(D,W)}}else{H.unbind(U,P,false);H.unbind(au,aa,false);if(D){H.unbind(D,W,false)}}H.data(w+"_intouch",aK===true)}function aI(aL,aK){var aM=aK.identifier!==undefined?aK.identifier:0;ah[aL].identifier=aM;ah[aL].start.x=ah[aL].end.x=aK.pageX;ah[aL].start.y=ah[aL].end.y=aK.pageY;return ah[aL]}function V(aK){var aM=aK.identifier!==undefined?aK.identifier:0;var aL=J(aM);aL.end.x=aK.pageX;aL.end.y=aK.pageY;return aL}function J(aL){for(var aK=0;aK<ah.length;aK++){if(ah[aK].identifier==aL){return ah[aK]}}}function T(){var aK=[];for(var aL=0;aL<=5;aL++){aK.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return aK}function L(){return Y-I}function Z(aN,aM){var aL=Math.abs(aN.x-aM.x);var aK=Math.abs(aN.y-aM.y);return Math.round(Math.sqrt(aL*aL+aK*aK))}function y(aK,aL){var aM=(aL/aK)*1;return aM.toFixed(2)}function an(){if(ai<1){return v}else{return b}}function G(aL,aK){return Math.round(Math.sqrt(Math.pow(aK.x-aL.x,2)+Math.pow(aK.y-aL.y,2)))}function F(aN,aL){var aK=aN.x-aL.x;var aP=aL.y-aN.y;var aM=Math.atan2(aP,aK);var aO=Math.round(aM*180/Math.PI);if(aO<0){aO=360-Math.abs(aO)}return aO}function aq(aL,aK){var aM=F(aL,aK);if((aM<=45)&&(aM>=0)){return n}else{if((aM<=360)&&(aM>=315)){return n}else{if((aM>=135)&&(aM<=225)){return m}else{if((aM>45)&&(aM<135)){return u}else{return c}}}}}function B(){var aK=new Date();return aK.getTime()}function at(aK){aK=d(aK);var aM=aK.offset();var aL={left:aM.left,right:aM.left+aK.outerWidth(),top:aM.top,bottom:aM.top+aK.outerHeight()};return aL}function az(aK,aL){return(aK.x>aL.left&&aK.x<aL.right&&aK.y>aL.top&&aK.y<aL.bottom)}}})(jQuery);

/*
 * Browser Detect script
 */
BrowserDetect = (function() {
    // script settings
    var options = {
        osVersion: true,
        minorBrowserVersion: false
    };

    // browser data
    var browserData = {
        browsers: {
            chrome: uaMatch(/Chrome\/([0-9\.]*)/),
            firefox: uaMatch(/Firefox\/([0-9\.]*)/),
            safari: uaMatch(/Version\/([0-9\.]*).*Safari/),
            opera: uaMatch(/Opera\/.*Version\/([0-9\.]*)/, /Opera\/([0-9\.]*)/),
            msie: uaMatch(/MSIE ([0-9\.]*)/)
        },
        engines: {
            webkit: uaContains('AppleWebKit'),
            gecko: uaContains('Gecko'),
            presto: uaContains('Presto'),
            trident: uaContains('MSIE')
        },
        platforms: {
            win: uaMatch(/Windows NT ([0-9\.]*)/),
            mac: uaMatch(/Mac OS X ([0-9_\.]*)/),
            linux: uaContains('X11', 'Linux')
        }
    };

    // perform detection
    var ua = navigator.userAgent;
    var detectData = {
        platform: detectItem(browserData.platforms),
        browser: detectItem(browserData.browsers),
        engine: detectItem(browserData.engines)
    };

    // private functions
    function uaMatch(regExp, altReg) {
        return function() {
            var result = regExp.exec(ua) || altReg && altReg.exec(ua);
            return result && result[1];
        };
    }
    function uaContains(word) {
        var args = Array.prototype.slice.apply(arguments);
        return function() {
            for(var i = 0; i < args.length; i++) {
                if(ua.indexOf(args[i]) < 0) {
                    return;
                }
            }
            return true;
        };
    }
    function detectItem(items) {
        var detectedItem = null, itemName, detectValue;
        for(itemName in items) {
            if(items.hasOwnProperty(itemName)) {
                detectValue = items[itemName]();
                if(detectValue) {
                    return {
                        name: itemName,
                        value: detectValue
                    };
                }
            }
        }
    }

    // add classes to root element
    (function() {
        // helper functions
        var addClass = function(cls) {
            var html = document.documentElement;
            html.className += (html.className ? ' ' : '') + cls;
        };
        var getVersion = function(ver) {
            return ver.replace(/\./g, '_');
        };

        // add classes
        if(detectData.platform) {
            addClass(detectData.platform.name);
            if(options.osVersion) {
                addClass(detectData.platform.name + '-' + getVersion(detectData.platform.value));
            }
        }
        if(detectData.engine) {
            addClass(detectData.engine.name);
        }
        if(detectData.browser) {
            addClass(detectData.browser.name);
            addClass(detectData.browser.name + '-' + parseInt(detectData.browser.value, 10));
            if(options.minorBrowserVersion) {
                addClass(detectData.browser.name + '-' + getVersion(detectData.browser.value));
            }
        }
    }());

    // export detection information
    return detectData;
}());

/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with divs). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */
;(function(a){"use strict";a.picturefill=function(){for(var b=a.document.getElementsByTagName("div"),c=0,d=b.length;d>c;c++)if(null!==b[c].getAttribute("data-picture")){for(var e=b[c].getElementsByTagName("div"),f=[],g=0,h=e.length;h>g;g++){var i=e[g].getAttribute("data-media");(!i||a.matchMedia&&a.matchMedia(i).matches)&&f.push(e[g])}var j=b[c].getElementsByTagName("img")[0];if(f.length){j||(j=a.document.createElement("img"),j.alt=b[c].getAttribute("data-alt"),b[c].appendChild(j));var k=f.pop(),l=k.getAttribute("data-width"),m=k.getAttribute("data-height");j.src=k.getAttribute("data-src"),l?j.setAttribute("width",l):j.removeAttribute("width"),m?j.setAttribute("height",m):j.removeAttribute("height")}else j&&b[c].removeChild(j)}},a.addEventListener?(a.addEventListener("resize",a.picturefill,!1),a.addEventListener("DOMContentLoaded",function(){a.picturefill(),a.removeEventListener("load",a.picturefill,!1)},!1),a.addEventListener("load",a.picturefill,!1)):a.attachEvent&&a.attachEvent("onload",a.picturefill)})(this);

;Orsted.Branding = (function ($) {
    if (typeof $ != "undefined") {
        var jQuery = $;

        function initExpandableArticles(){
            jQuery(".expandable-article .toggle-more").on("click",function(e){
                e.preventDefault();
                var clicked = jQuery(this);
                clicked.prev(".more-show").slideToggle(300);
                clicked.toggleClass("active");
                if(clicked.hasClass("active")){
                    clicked.text("Close");
                }else{
                    clicked.text("Read more");
                    jQuery('html, body').animate({
                        scrollTop: clicked.parent().offset().top
                    }, 500);
                }
                return false;
            });
        }

        function initCreateLogin(){
            jQuery(".create-login-opener").on("click touchstart",function(e){
                e.preventDefault();
                jQuery(".create-login-wrap").fadeIn(200);
                return false;
            });

            jQuery(".overlay, .close_overlay").on("click touchstart",function(e){
                e.preventDefault();
                jQuery(".create-login-wrap").fadeOut(200);
                return false;
            });

            jQuery('.create-login').on('click touchstart', function(event) {
                event.stopPropagation();
            });

            jQuery(".create-login .close").on("click touchstart",function(e){
                e.preventDefault();
                jQuery(".create-login-wrap").fadeOut(200);
                return false;
            });

            //This is dummy functionality to show the confirmation screen
            jQuery("#save-profile").on("click", function(e){
                e.preventDefault();
                jQuery(".create-login").fadeOut(200, function(){
                    jQuery(".create-login.succes").fadeIn(200);
                });

                return false;
            });
        }

// accordion menu init
        function initAccordion() {

            jQuery(".accordion li .opener").bind("click",function(e){
                e.preventDefault();
                var clicked = jQuery(this).parent();
                jQuery(".accordion li").removeClass("active");
                clicked.addClass("active");
                clicked.find(".slide-acc").slideDown(200);
                clicked.siblings().find(".slide-acc").slideUp(200);
                return false;
            });

            jQuery(".section-accordion li > a").on("click",function(e){
                e.preventDefault();
                var clicked = jQuery(this);
                var clickedMore = clicked.next("div.more");
                var allItems = clicked.parent().siblings();

                allItems.find("div.more").hide();
                allItems.removeClass("active");
                if(clickedMore.is(":visible")){
                    clicked.parent().toggleClass("active");
                    clickedMore.hide();
                }else{
                    clicked.parent().addClass("active");
                    clickedMore.show();
                }

                return false;
            });

        }

//Tooltip initializing
        function initToolTip() {
            jQuery('.open-caltooltip').tooltips({
                openEvent: "click",
                closeEvent: "click",
                alignment: "bottom"
            });

            var cont = ".main-container";
            if(jQuery("#content").length){
                cont = "#content";
            }

            jQuery('.open').tooltips({
                alignment: "right",
                offset: 0,
                closeClass: ".close",
                topContainer: cont
            });

            jQuery('.help').tooltips({
                alignment: "right",
                closeClass: ".help-close",
                tooltip: '.help-text',
                arrowClass: '.help-text-arrow'
            });
        }

        function initSwitchCases() {
            var ajaxFetchCases = function(newCases) {

                // TODO make ajax request to fetch the cases associated with the clicked list item.

                // The caseItem is an empty markup element of the single case.
                // On ajax complete/success fill out the content and info in the caseItem.
                var caseItem = $('<article class="cases-single">' +
                        '<a href="">' +
                        '<h1></h1>' +
                        '<div class="cases-thumbnail">' +
                        '<img src="" alt="">' +
                        '</div>' +
                        '</a>' +
                        '</article>'),
                    caseList = $(".cases-list");
                $.ajax({
                    type: "POST",
                    data: newCases,
                    success: function() {}
                });
            }
            $("ul.switch-cases a").on("click", function() {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
                ajaxFetchCases();
                return false;
            });
            $("select.switch-cases").on("change", function() {
                ajaxFetchCases();
            });
        }

        function initSwitchAlphabeticalLetter() {
            var ajaxFetchLetterArticles = function(newLetter) {

                // TODO make ajax request to fetch the articles associated with the clicked letter.

                // The articleItem is an empty markup element of the single article.
                // On ajax complete/success fill out the content and info in the articleList.
                var articleItem = $('<article class="article">' +
                        '<h3></h3>' +
                        '<p></p>' +
                        '</article>'),
                    articleList = $(".alphabetical-list .one-column");
                $.ajax({
                    type: "POST",
                    data: newLetter,
                    success: function() {}
                });
            }
            $("ul.alphabetical.list-switcher a").on("click", function() {
                $(this).parent().addClass("active");
                $(this).parent().siblings().removeClass("active");
                ajaxFetchLetterArticles();
                return false;
            });
            $("select.alphabetical.list-area").on("change", function() {
                ajaxFetchLetterArticles();
            });
        }

        function initLoginBoxFocus(){

            jQuery(".default-login-box input[type='text']").focusin(function(){
                jQuery(this).closest(".default-login-box").addClass("highlighted");

            });

            jQuery(".default-login-box input[type='text']").focusout(function(){
                jQuery(this).closest(".default-login-box").removeClass("highlighted");

            });
        }

        function initSearchPagination(){

            jQuery(".pagination-inner a").click(function(e){
                e.preventDefault();
                var changePage = false;
                if(jQuery(this).hasClass("navigate-left")){
                    if(!jQuery(".pagination-inner a.active").prev().hasClass("navigate-left")){
                        jQuery(".pagination-inner a.active").removeClass("active").prev().addClass("active");
                        changePage = true;
                    }
                }
                else if(jQuery(this).hasClass("navigate-right")){
                    if(!jQuery(".pagination-inner a.active").next().hasClass("navigate-right")){
                        jQuery(".pagination-inner a.active").removeClass("active").next().addClass("active");
                        changePage = true;
                    }
                }
                else{
                    jQuery(".pagination-inner a").removeClass("active");
                    jQuery(this).addClass("active");
                    changePage = true;
                }


                if(changePage){
                    //Inset ajax to reload new searchpage here.
                }
                return false;

            });

        }

        //Add show more detailt on click
        function initShowMoreDetailsLink(){
            jQuery(".show-details").on("click", function(){

                var toggleLink = jQuery(this);
                var toggleMe = toggleLink.parent().parent().parent().find(".product-details-alternate-duty");

                if(toggleMe.is(":visible")){
                    toggleMe.hide();
                    toggleLink.removeClass("active");
                }else{
                    toggleMe.show();
                    toggleLink.addClass("active");
                }
                return false;
            });
        }

        //cycle scroll gallery init
        function initCycleCarousel() {
            jQuery('.gallery').scrollAbsoluteGallery({
                mask: '.mask',
                slider: '.slides',
                slides: '.slide',
                btnPrev: 'a.prev',
                btnNext: 'a.next',
                generatePagination: '.switcher',
                stretchSlideToMask: true,
                maskAutoSize: true,
                autoRotation: true,
                switchTime: 3000,
                animSpeed: 500
            });
        }

        //handle flexible video size
        function initFitVids() {
            jQuery('.video').fitVids();
        }

        function initSortByTags() {
            jQuery(".sort-by-tags li").not(".label").find("a").on("click", function() {
                jQuery(this).parent().addClass("active");
                jQuery(this).parent().siblings().removeClass("active");
                // leoca - removed as this causes event calendar postback to stop return false;
            });
        }

        function initDatePicker() {
            if (jQuery.fn.datepicker) {
                var touchStart = 0;
                function documentClickCloseDatepicker(e) {
                    var $targetElem = jQuery(e.target);
                    if (!$targetElem.hasClass("hasDatepicker") && !$targetElem.parents().hasClass("ui-datepicker") && !$targetElem.parent().hasClass("ui-datepicker-header")) {
                        if (e.type === "touchstart") {
                            touchStart = e.originalEvent.targetTouches[0].pageY;
                        }
                        else if (e.type === "touchend") {
                            var touchEnd = e.originalEvent.changedTouches[0].pageY;
                            if ((touchStart - touchEnd) > -5 && (touchStart - touchEnd) < 5) {
                                $(".hasDatepicker").blur().datepicker("hide");
                                jQuery(document).off("touchstart touchend", documentClickCloseDatepicker);
                            }
                        }
                    }
                }
                jQuery(".datepicker").datepicker({
                    closeText: 'Luk',
                    prevText: '',
                    nextText: '',
                    currentText: 'Idag',
                    weekHeader: 'Uge',
                    firstDay: 1,
                    dateFormat: "dd.mm.yy",
                    showOn: "button",
                    buttonText: '<span class="icon"></span>',
                    minDate: 0,
                    beforeShow: function(input, inst) {
                        window.dpSelectedDay = inst.currentDay !== 0 && inst.currentDay !== undefined;
                        var inputOffset = jQuery(input).offset(),
                            inputWidth = jQuery(input).outerWidth(),
                            divWidth = jQuery(inst.dpDiv).outerWidth(),
                            winWidth = jQuery(window).width(),
                            margLeft = inputWidth - divWidth + 14,
                            divOffset = {left: inputOffset.left, top: inputOffset.top + input.offsetHeight},
                            isFixed = false;
                        jQuery(input).parents().each(function() {
                            isFixed = jQuery(this).css("position") === "fixed";
                            return !isFixed;
                        });
                        if (isTouchDevice || isMobileDevice) {
                            jQuery(document).on("touchstart touchend", documentClickCloseDatepicker);
                        }
                        if (isMobileDevice) {
                            setTimeout(function() {
                                jQuery(inst.dpDiv).removeClass("arrow-bottom");
                                jQuery(inst.dpDiv).css({
                                    top: inputOffset.top + input.offsetHeight
                                });
                                if (inputOffset.left + margLeft + divWidth + 15 > winWidth ) {
                                    margLeft -= (inputOffset.left + margLeft + divWidth + 15) - winWidth;
                                    jQuery(inst.dpDiv).addClass("arrow-center");
                                } else if (inputOffset.left + margLeft < 15) {
                                    margLeft = 0;
                                    jQuery(inst.dpDiv).addClass("arrow-center");
                                } else {
                                    jQuery(inst.dpDiv).removeClass("arrow-center");
                                }
                                jQuery(inst.dpDiv).css({
                                    marginLeft: margLeft
                                });
                            }, 0);
                        } else {
                            setTimeout(function() {
                                divOffset = jQuery.datepicker._checkOffset(inst, divOffset, isFixed);
                                if (divOffset.top < inputOffset.top + input.offsetHeight) {
                                    jQuery(inst.dpDiv).addClass("arrow-bottom");
                                } else {
                                    jQuery(inst.dpDiv).removeClass("arrow-bottom");
                                }
                                if (inputOffset.left + margLeft + divWidth + 15 > winWidth ) {
                                    margLeft -= (inputOffset.left + margLeft + divWidth + 15) - winWidth;
                                    jQuery(inst.dpDiv).addClass("arrow-center");
                                } else if (inputOffset.left + margLeft < 15) {
                                    margLeft = 0;
                                    jQuery(inst.dpDiv).addClass("arrow-center");
                                } else {
                                    jQuery(inst.dpDiv).removeClass("arrow-center");
                                }
                                jQuery(inst.dpDiv).css({
                                    marginLeft: margLeft
                                });
                            },0);
                        }
                    },
                    beforeShowDay: function(date) {
                        var currentDate = new Date(),
                            currentYear = currentDate.getYear(),
                            currentMonth = currentDate.getMonth(),
                            currentDay = currentDate.getDate(),
                            dateYear = date.getYear(),
                            dateMonth = date.getMonth(),
                            dateDay = date.getDate(),
                            returnArray = [true, ""];
                        if (!window.dpSelectedDay && dateYear === currentYear && dateMonth === currentMonth && dateDay === currentDay) {
                            returnArray = [true, "ui-state-active"];
                        }
                        return returnArray;
                    },
                    onClose: function() {
                        if (isTouchDevice || isMobileDevice) {
                            jQuery(document).off("touchstart touchend", documentClickCloseDatepicker);
                        }
                    }
                });
                jQuery(".datepicker.da").datepicker("option", {
                    "monthNames" : ['Januar','Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'],
                    "monthNamesShort": ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
                    "dayNames": ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
                    "dayNamesShort": ['Søn','Man','Tir','Ons','Tor','Fre','Lør'],
                    "dayNamesMin": ['Sø','Ma','Ti','On','To','Fr','Lø']
                });
            }
        }

        function initTableSorting() {
            jQuery("table th a, .list-label a").on("click", function() {
                jQuery(this).parent().siblings().find('a').removeClass('selected');
                jQuery(this).addClass('selected');
                return false;
            });
            jQuery("table .headitem a").on("click", function() {
                jQuery(this).parent().parent().siblings().find('a').removeClass('selected');
                jQuery(this).addClass('selected');
                return false;
            });
        }

        function overlayContent() {

            jQuery.scrollbarWidth = function() {
                var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
                    child  = parent.children(),
                    width  = child.innerWidth() - child.height( 99 ).innerWidth();
                parent.remove();
                return width;
            };

            function bindEscCloseOverlay(e) {
                if (e.keyCode === 27) {
                    jQuery(".overlay-wrapper.overlay-open .close-overlay").trigger("click");
                }
            }

            jQuery('[data-type="overlay-link"]').on("click", function() {
                var $target = jQuery(".overlay-wrapper");
                if (isTouchDevice || isMobileDevice) {
                    var scrolled = jQuery(window).scrollTop();
                    $target.css({
                        position: "absolute",
                        left: "-15px",
                        right: "-15px"
                    });
                    jQuery(".overlay-content", $target).css("top", scrolled);
                }
                jQuery("body").css({
                    "overflow": "hidden",
                    "margin-right": jQuery.scrollbarWidth() + "px"
                });
                $target.fadeIn(200, function() {
                    jQuery(this).addClass("overlay-open");
                });
                jQuery(document).on("keydown", bindEscCloseOverlay);
                return false;
            });

            jQuery(".close-overlay").on("click", function() {
                var $target = jQuery(".overlay-wrapper");
                $target.fadeOut(200, function() {
                    jQuery(this).removeClass("overlay-open");
                    jQuery("body").removeAttr("style");
                });
                jQuery(document).off("keydown", bindEscCloseOverlay);
                return false;
            });

            jQuery(".overlay-wrapper").on("click", function(e) {
                var clickTarget = e.target,
                    $overlay = jQuery(this);
                if (jQuery(clickTarget).hasClass("overlay-wrapper")) {
                    jQuery(".close-overlay", $overlay).trigger("click");
                }
            });

        }

        function init() {
            // page init
            jQuery(function(){
                jQuery('input, textarea').placeholder();
                jQuery('.notification-form').on('submit', function() {
                    jQuery(this).parent().width(jQuery(this).parent().width());
                    jQuery(this).hide();
                    jQuery(this).next('.notification-complete').show();
                    return false;
                });
                if (jQuery().loadbar) {
                    jQuery(".loadbar").loadbar();
                }

                initCreateLogin();
            });

            jQuery(window).bind('load', function(){
                //leoca : QC1010 fix initCycleCarousel();
                initFitVids();
                initLoginBoxFocus();
                if (jQuery().tooltips) {
                    initToolTip();
                }
                initExpandableArticles();
                initAccordion();
                initSortByTags();
                initSwitchCases();
                initSearchPagination();
                initSwitchAlphabeticalLetter();
                initDatePicker();
                initTableSorting();
                overlayContent();
                initCycleCarousel();
                initShowMoreDetailsLink();
            });

        }

        return {
            initExpandableArticles: initExpandableArticles,
            initAccordion: initAccordion,
            initToolTip: initToolTip,
            initLoginBoxFocus: initLoginBoxFocus,
            initCycleCarousel: initCycleCarousel,
            initFitVids: initFitVids,
            initSwitchCases: initSwitchCases,
            initSwitchAlphabeticalLetter: initSwitchAlphabeticalLetter,
            initSortByTags: initSortByTags,
            initSearchPagination: initSearchPagination,
            initDatePicker: initDatePicker,
            initTableSorting: initTableSorting,
            overlayContent: overlayContent,
            init: init
        }

    }

})(Orsted.jQuery.$);

Orsted.Branding.init();

if (typeof SP !== 'undefined') {
    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("common.js");
}