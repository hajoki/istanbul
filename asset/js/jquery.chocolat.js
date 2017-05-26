! function(t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = t(require("jquery"), window, document) : t(jQuery, window, document)
}(function(t, e, i, s) {
    function n(e, i) {
        var s = this;
        return this.settings = i, this._defaults = l, this.elems = {}, this.element = e, this._cssClasses = ["chocolat-open", "chocolat-mobile", "chocolat-in-container", "chocolat-cover", "chocolat-zoomable", "chocolat-zoomed"], !this.settings.setTitle && e.data("chocolat-title") && (this.settings.setTitle = e.data("chocolat-title")), this.element.find(this.settings.imageSelector).each(function() {
            s.settings.images.push({
                title: t(this).attr("title"),
                src: t(this).attr("href"),
                description: t(this).attr("longdesc")
                height: !1,
                width: !1
            })
        }), this.element.find(this.settings.imageSelector).each(function(e) {
            t(this).off("click.chocolat").on("click.chocolat", function(t) {
                s.init(e), t.preventDefault()
            })
        }), this
    }
    var o = 0,
        l = {
            container: e,
            imageSelector: ".chocolat-image",
            className: "",
            imageSize: "default",
            initialZoomState: null,
            fullScreen: !1,
            loop: !1,
            linkImages: !0,
            duration: 300,
            setTitle: "",
            separator2: "/",
            setIndex: 0,
            firstImage: 0,
            lastImage: !1,
            currentImage: !1,
            initialized: !1,
            timer: !1,
            timerDebounce: !1,
            images: [],
            enableZoom: !0
        };
    t.extend(n.prototype, {
        init: function(t) {
            return this.settings.initialized || (this.setDomContainer(), this.markup(), this.events(), this.settings.lastImage = this.settings.images.length - 1, this.settings.initialized = !0), this.load(t)
        },
        preload: function(e) {
            var i = t.Deferred();
            if ("undefined" != typeof this.settings.images[e]) {
                var s = new Image;
                return s.onload = function() {
                    i.resolve(s)
                }, s.src = this.settings.images[e].src, i
            }
        },
        load: function(e) {
            var i = this;
            if (this.settings.fullScreen && this.openFullScreen(), this.settings.currentImage !== e) {
                this.elems.overlay.fadeIn(800), this.settings.timer = setTimeout(function() {
                    "undefined" != typeof i.elems && t.proxy(i.elems.loader.fadeIn(), i)
                }, 800);
                var s = this.preload(e).then(function(t) {
                        return i.place(e, t)
                    }).then(function(t) {
                        return i.appear(e)
                    }).then(function(t) {
                        i.zoomable()
                    }),
                    n = e + 1;
                return "undefined" != typeof this.settings.images[n] && this.preload(n), s
            }
        },
        place: function(t, e) {
            var i, s = this;
            return this.settings.currentImage = t, this.description(), this.pagination(), this.arrows(), this.storeImgSize(e, t), i = this.fit(t, s.elems.wrapper), this.center(i.width, i.height, i.left, i.top, 0)
        },
        center: function(t, e, i, s, n) {
            return this.elems.content.css("overflow", "visible").animate({
                width: t,
                height: e,
                left: i,
                top: s
            }, n).promise()
        },
        appear: function(t) {
            var e = this;
            clearTimeout(this.settings.timer), this.elems.loader.stop().fadeOut(300, function() {
                e.elems.img.attr("src", e.settings.images[t].src)
            })
        },
        fit: function(e, i) {
            var s, n, o = this.settings.images[e].height,
                l = this.settings.images[e].width,
                a = t(i).height(),
                r = t(i).width(),
                c = this.getOutMarginH(),
                h = this.getOutMarginW(),
                m = r - h,
                g = a - c,
                u = g / m,
                f = a / r,
                p = o / l;
            return "cover" == this.settings.imageSize ? f > p ? (s = a, n = s / p) : (n = r, s = n * p) : "native" == this.settings.imageSize ? (s = o, n = l) : (p > u ? (s = g, n = s / p) : (n = m, s = n * p), "default" === this.settings.imageSize && (n >= l || s >= o) && (n = l, s = o)), {
                height: s,
                width: n,
                top: (a - s) / 2,
                left: (r - n) / 2
            }
        },
        change: function(t) {
            this.zoomOut(0), this.zoomable();
            var e = this.settings.currentImage + parseInt(t);
            if (e > this.settings.lastImage) {
                if (this.settings.loop) return this.load(0)
            } else {
                if (!(0 > e)) return this.load(e);
                if (this.settings.loop) return this.load(this.settings.lastImage)
            }
        },
        arrows: function() {
            this.settings.loop ? t([this.elems.left[0], this.elems.right[0]]).addClass("active") : this.settings.linkImages ? (this.settings.currentImage == this.settings.lastImage ? this.elems.right.removeClass("active") : this.elems.right.addClass("active"), 0 === this.settings.currentImage ? this.elems.left.removeClass("active") : this.elems.left.addClass("active")) : t([this.elems.left[0], this.elems.right[0]]).removeClass("active")
        },
        description: function() {
            var t = this;
            this.elems.description.html(t.settings.images[t.settings.currentImage].description)
        },
        pagination: function() {
            var t = this,
                e = this.settings.lastImage + 1,
                i = this.settings.currentImage + 1;
            this.elems.pagination.html(i + " " + t.settings.separator2 + e)
        },
        storeImgSize: function(t, e) {
            "undefined" != typeof t && (this.settings.images[e].height && this.settings.images[e].width || (this.settings.images[e].height = t.height, this.settings.images[e].width = t.width))
        },
        close: function() {
            if (this.settings.fullscreenOpen) return void this.exitFullScreen();
            var e = [this.elems.overlay[0], this.elems.loader[0], this.elems.wrapper[0]],
                i = this,
                s = t.when(t(e).fadeOut(200)).done(function() {
                    i.elems.domContainer.removeClass(i._cssClasses.join(" "))
                });
            return this.settings.currentImage = !1, this.settings.initialized = !1, s
        },
        destroy: function() {
            this.element.removeData(), this.element.find(this.settings.imageSelector).off("click.chocolat"), this.settings.initialized && (this.settings.fullscreenOpen && this.exitFullScreen(), this.settings.currentImage = !1, this.settings.initialized = !1, this.elems.domContainer.removeClass(this._cssClasses.join(" ")), this.elems.wrapper.remove())
        },
        getOutMarginW: function() {
            var t = this.elems.left.outerWidth(!0),
                e = this.elems.right.outerWidth(!0);
            return t + e
        },
        getOutMarginH: function() {
            return this.elems.top.outerHeight(!0) + this.elems.bottom.outerHeight(!0)
        },
        markup: function() {
            this.elems.domContainer.addClass("chocolat-open " + this.settings.className), "cover" == this.settings.imageSize && this.elems.domContainer.addClass("chocolat-cover"), this.settings.container !== e && this.elems.domContainer.addClass("chocolat-in-container"), this.elems.wrapper = t("<div/>", {
                "class": "chocolat-wrapper",
                id: "chocolat-content-" + this.settings.setIndex
            }).appendTo(this.elems.domContainer), this.elems.overlay = t("<div/>", {
                "class": "chocolat-overlay"
            }).appendTo(this.elems.wrapper), this.elems.loader = t("<div/>", {
                "class": "chocolat-loader"
            }).appendTo(this.elems.wrapper), this.elems.content = t("<div/>", {
                "class": "chocolat-content"
            }).appendTo(this.elems.wrapper), this.elems.img = t("<img/>", {
                "class": "chocolat-img",
                src: ""
            }).appendTo(this.elems.content), this.elems.top = t("<div/>", {
                "class": "chocolat-top"
            }).appendTo(this.elems.wrapper), this.elems.left = t("<div/>", {
                "class": "chocolat-left"
            }).appendTo(this.elems.wrapper), this.elems.right = t("<div/>", {
                "class": "chocolat-right"
            }).appendTo(this.elems.wrapper), this.elems.bottom = t("<div/>", {
                "class": "chocolat-bottom"
            }).appendTo(this.elems.wrapper), this.elems.fullscreen = t("<span/>", {
                "class": "chocolat-fullscreen"
            }).appendTo(this.elems.bottom), this.elems.description = t("<span/>", {
                "class": "chocolat-description"
            }).appendTo(this.elems.bottom), this.elems.pagination = t("<span/>", {
                "class": "chocolat-pagination"
            }).appendTo(this.elems.bottom), this.elems.setTitle = t("<span/>", {
                "class": "chocolat-set-title",
                html: this.settings.setTitle
            }).appendTo(this.elems.bottom), this.elems.close = t("<span/>", {
                "class": "chocolat-close"
            }).appendTo(this.elems.top)
        },
        openFullScreen: function() {
            var t = this.elems.wrapper[0];
            t.requestFullscreen ? (this.settings.fullscreenOpen = !0, t.requestFullscreen()) : t.mozRequestFullScreen ? (this.settings.fullscreenOpen = !0, t.mozRequestFullScreen()) : t.webkitRequestFullscreen ? (this.settings.fullscreenOpen = !0, t.webkitRequestFullscreen()) : t.msRequestFullscreen ? (t.msRequestFullscreen(), this.settings.fullscreenOpen = !0) : this.settings.fullscreenOpen = !1
        },
        exitFullScreen: function() {
            i.exitFullscreen ? (i.exitFullscreen(), this.settings.fullscreenOpen = !1) : i.mozCancelFullScreen ? (i.mozCancelFullScreen(), this.settings.fullscreenOpen = !1) : i.webkitExitFullscreen ? (i.webkitExitFullscreen(), this.settings.fullscreenOpen = !1) : this.settings.fullscreenOpen = !0
        },
        events: function() {
            var s = this;
            t(i).off("keydown.chocolat").on("keydown.chocolat", function(t) {
                s.settings.initialized && (37 == t.keyCode ? s.change(-1) : 39 == t.keyCode ? s.change(1) : 27 == t.keyCode && s.close())
            }), this.elems.wrapper.find(".chocolat-right").off("click.chocolat").on("click.chocolat", function() {
                s.change(1)
            }), this.elems.wrapper.find(".chocolat-left").off("click.chocolat").on("click.chocolat", function() {
                return s.change(-1)
            }), t([this.elems.overlay[0], this.elems.close[0]]).off("click.chocolat").on("click.chocolat", function() {
                return s.close()
            }), this.elems.fullscreen.off("click.chocolat").on("click.chocolat", function() {
                return s.settings.fullscreenOpen ? void s.exitFullScreen() : void s.openFullScreen()
            }), s.settings.backgroundClose && this.elems.overlay.off("click.chocolat").on("click.chocolat", function() {
                return s.close()
            }), this.elems.wrapper.find(".chocolat-img").off("click.chocolat").on("click.chocolat", function(t) {
                return null === s.settings.initialZoomState && s.elems.domContainer.hasClass("chocolat-zoomable") ? s.zoomIn(t) : s.zoomOut(t)
            }), this.elems.wrapper.mousemove(function(e) {
                if (null !== s.settings.initialZoomState && !s.elems.img.is(":animated")) {
                    var i = t(this).offset(),
                        n = t(this).height(),
                        o = t(this).width(),
                        l = s.settings.images[s.settings.currentImage],
                        a = l.width,
                        r = l.height,
                        c = [e.pageX - o / 2 - i.left, e.pageY - n / 2 - i.top],
                        h = 0;
                    a > o && (h = c[0] / (o / 2), h = (a - o + 0) / 2 * h);
                    var m = 0;
                    r > n && (m = c[1] / (n / 2), m = (r - n + 0) / 2 * m);
                    var g = {
                        "margin-left": -h + "px",
                        "margin-top": -m + "px"
                    };
                    "undefined" != typeof e.duration ? t(s.elems.img).stop(!1, !0).animate(g, e.duration) : t(s.elems.img).stop(!1, !0).css(g)
                }
            }), t(e).on("resize", function() {
                s.settings.initialized && s.debounce(50, function() {
                    fitting = s.fit(s.settings.currentImage, s.elems.wrapper), s.center(fitting.width, fitting.height, fitting.left, fitting.top, 0), s.zoomable()
                })
            })
        },
        zoomable: function() {
            var t = this.settings.images[this.settings.currentImage],
                e = this.elems.wrapper.width(),
                i = this.elems.wrapper.height(),
                s = !(!this.settings.enableZoom || !(t.width > e || t.height > i)),
                n = this.elems.img.width() > t.width || this.elems.img.height() > t.height;
            s && !n ? this.elems.domContainer.addClass("chocolat-zoomable") : this.elems.domContainer.removeClass("chocolat-zoomable")
        },
        zoomIn: function(e) {
            this.settings.initialZoomState = this.settings.imageSize, this.settings.imageSize = "native";
            var i = t.Event("mousemove");
            return i.pageX = e.pageX, i.pageY = e.pageY, i.duration = this.settings.duration, this.elems.wrapper.trigger(i), this.elems.domContainer.addClass("chocolat-zoomed"), fitting = this.fit(this.settings.currentImage, this.elems.wrapper), this.center(fitting.width, fitting.height, fitting.left, fitting.top, this.settings.duration)
        },
        zoomOut: function(t, e) {
            return null !== this.settings.initialZoomState ? (e = e || this.settings.duration, this.settings.imageSize = this.settings.initialZoomState, this.settings.initialZoomState = null, this.elems.img.animate({
                margin: 0
            }, e), this.elems.domContainer.removeClass("chocolat-zoomed"), fitting = this.fit(this.settings.currentImage, this.elems.wrapper), this.center(fitting.width, fitting.height, fitting.left, fitting.top, e)) : void 0
        },
        setDomContainer: function() {
            this.settings.container === e ? this.elems.domContainer = t("body") : this.elems.domContainer = t(this.settings.container)
        },
        debounce: function(t, e) {
            clearTimeout(this.settings.timerDebounce), this.settings.timerDebounce = setTimeout(function() {
                e()
            }, t)
        },
        api: function() {
            var t = this;
            return {
                open: function(e) {
                    return e = parseInt(e) || 0, t.init(e)
                },
                close: function() {
                    return t.close()
                },
                next: function() {
                    return t.change(1)
                },
                prev: function() {
                    return t.change(-1)
                },
                "goto": function(e) {
                    return t.open(e)
                },
                current: function() {
                    return t.settings.currentImage
                },
                place: function() {
                    return t.place(t.settings.currentImage, t.settings.duration)
                },
                destroy: function() {
                    return t.destroy()
                },
                set: function(e, i) {
                    return t.settings[e] = i, i
                },
                get: function(e) {
                    return t.settings[e]
                },
                getElem: function(e) {
                    return t.elems[e]
                }
            }
        }
    }), t.fn.Chocolat = function(e) {
        return this.each(function() {
            o++;
            var i = t.extend(!0, {}, l, e, {
                setIndex: o
            });
            t.data(this, "chocolat") || t.data(this, "chocolat", new n(t(this), i))
        })
    }
});