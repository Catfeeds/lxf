var t = require("./../../components/quick-navigation/quick-navigation.js"), a = 0, e = !0, o = 1, i = !1;

Page({
    data: {
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy: !1,
        opendate: !1
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a), this.loadData(a), t.init(this);
    },
    suspension: function() {
        var t = this;
        a = setInterval(function() {
            getApp().request({
                url: getApp().api.default.buy_data,
                data: {
                    time: t.data.time
                },
                method: "POST",
                success: function(a) {
                    if (0 == a.code) {
                        var e = !1;
                        t.data.msgHistory == a.md5 && (e = !0);
                        var o = "", i = a.cha_time, s = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
                        o = 0 == s ? i % 60 + "秒" : s + "分" + i % 60 + "秒", !e && a.cha_time <= 300 ? t.setData({
                            buy: {
                                time: o,
                                type: a.data.type,
                                url: a.data.url,
                                user: a.data.user.length >= 5 ? a.data.user.slice(0, 4) + "..." : a.data.user,
                                avatar_url: a.data.avatar_url,
                                address: a.data.address.length >= 8 ? a.data.address.slice(0, 7) + "..." : a.data.address,
                                content: a.data.content
                            },
                            msgHistory: a.md5
                        }) : t.setData({
                            buy: !1
                        });
                    }
                }
            });
        }, 1e4);
    },
    loadData: function(t) {
        var a = this, o = getApp().core.getStorageSync(getApp().const.PAGE_INDEX_INDEX);
        o && (o.act_modal_list = [], a.setData(o)), getApp().request({
            url: getApp().api.default.index,
            success: function(t) {
                0 == t.code && (e ? a.data.user_info_show || (e = !1) : t.data.act_modal_list = [], 
                a.setData(t.data), getApp().core.setStorageSync(getApp().const.PAGE_INDEX_INDEX, t.data), 
                a.miaoshaTimer());
            },
            complete: function() {
                getApp().core.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        var t = this;
        getApp().page.onShow(this), getApp().getConfig(function(a) {
            var e = a.store;
            e && e.name && getApp().core.setNavigationBarTitle({
                title: e.name
            }), e && 1 === e.purchase_frame ? t.suspension(t.data.time) : t.setData({
                buy_user: ""
            });
        }), t.notice();
    },
    onPullDownRefresh: function() {
        getApp().getStoreData(), clearInterval(o), this.loadData();
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var a = this;
        return {
            path: "/pages/index/index?user_id=" + getApp().getUser().id,
            title: a.data.store.name
        };
    },
    showshop: function(t) {
        var a = this, e = t.currentTarget.dataset.id, o = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && a.setData({
                    data: o,
                    attr_group_list: t.data.attr_group_list,
                    goods: t.data,
                    showModal: !0
                });
            }
        });
    },
    receive: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "领取中",
            mask: !0
        }), a.hideGetCoupon || (a.hideGetCoupon = function(t) {
            var e = t.currentTarget.dataset.url || !1;
            a.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: e || "/pages/list/list"
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: e
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? a.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (getApp().core.showToast({
                    title: t.msg,
                    duration: 2e3
                }), a.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this.data.notice;
        if (void 0 !== t) t.length;
    },
    miaoshaTimer: function() {
        var t = this;
        t.data.miaosha && 0 != t.data.miaosha.rest_time && (t.data.miaosha.ms_next || (o = setInterval(function() {
            t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
            t.data.miaosha.times = t.setTimeList(t.data.miaosha.rest_time), t.setData({
                miaosha: t.data.miaosha
            })) : clearInterval(o);
        }, 1e3)));
    },
    onHide: function() {
        getApp().page.onHide(this), this.setData({
            play: -1
        }), clearInterval(a);
    },
    onUnload: function() {
        getApp().page.onUnload(this), this.setData({
            play: -1
        }), clearInterval(o), clearInterval(a);
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, o = !0;
        for (var i in e) {
            var s = parseInt(i);
            e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && o && (o = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    },
    naveClick: function(t) {
        var a = this;
        getApp().navigatorClick(t, a);
    },
    play: function(t) {
        this.setData({
            play: t.currentTarget.dataset.index
        });
    },
    onPageScroll: function(t) {
        var a = this;
        if (!i && -1 != a.data.play) {
            var e = getApp().core.getSystemInfoSync().windowHeight;
            "undefined" == typeof my ? getApp().core.createSelectorQuery().select(".video").fields({
                rect: !0
            }, function(t) {
                (t.top <= -200 || t.top >= e - 57) && a.setData({
                    play: -1
                });
            }).exec() : getApp().core.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function(t) {
                (t[0].top <= -200 || t[0].top >= e - 57) && a.setData({
                    play: -1
                });
            });
        }
    },
    fullscreenchange: function(t) {
        i = !!t.detail.fullScreen;
    }
});