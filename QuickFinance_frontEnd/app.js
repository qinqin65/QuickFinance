var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("navBar", ["require", "exports", 'react', 'dojo/i18n!app/nls/langResource.js', 'dojo/topic'], function (require, exports, React, lang, topic) {
    "use strict";
    (function (select) {
        select[select["home"] = 0] = "home";
        select[select["help"] = 1] = "help";
    })(exports.select || (exports.select = {}));
    var select = exports.select;
    ;
    var ItemHome = (function (_super) {
        __extends(ItemHome, _super);
        function ItemHome(props, context) {
            _super.call(this, props, context);
        }
        ItemHome.prototype.render = function () {
            return (React.createElement("li", {className: this.props.select == select.home ? 'nav-item active' : 'nav-item', onClick: function () { return topic.publish('nav/itemClicked', select.home); }}, lang.home));
        };
        return ItemHome;
    }(React.Component));
    var ItemHelp = (function (_super) {
        __extends(ItemHelp, _super);
        function ItemHelp(props, context) {
            _super.call(this, props, context);
        }
        ItemHelp.prototype.render = function () {
            return (React.createElement("li", {className: this.props.select == select.help ? 'nav-item active' : 'nav-item', onClick: function () { return topic.publish('nav/itemClicked', select.help); }}, lang.help));
        };
        return ItemHelp;
    }(React.Component));
    var Nav = (function (_super) {
        __extends(Nav, _super);
        function Nav(props, context) {
            var _this = this;
            _super.call(this, props, context);
            this.state = { select: select.home };
            topic.subscribe('nav/itemClicked', function (selectItem) { return _this.setState({ select: selectItem }); });
        }
        Nav.prototype.render = function () {
            return (React.createElement("nav", {className: 'main-nav'}, React.createElement(ItemHome, {select: this.state.select}), React.createElement(ItemHelp, {select: this.state.select})));
        };
        return Nav;
    }(React.Component));
    exports.Nav = Nav;
});
define("mainShow", ["require", "exports", 'react', 'dojo/i18n!app/nls/langResource.js', 'dojo/topic'], function (require, exports, React, lang, topic) {
    "use strict";
    (function (select) {
        select[select["showItemConduct"] = 0] = "showItemConduct";
        select[select["showItemKeepAccount"] = 1] = "showItemKeepAccount";
        select[select["showItemQuick"] = 2] = "showItemQuick";
    })(exports.select || (exports.select = {}));
    var select = exports.select;
    var Items = (function () {
        function Items() {
        }
        Items.showItemConduct = React.createElement("div", {className: "mainCarousel-caption"}, React.createElement("h1", null, lang.conductFinance), React.createElement("p", null, lang.conductFinanceTip1), React.createElement("p", null, lang.conductFinanceTip2));
        Items.showItemKeepAccount = React.createElement("div", {className: "mainCarousel-caption"}, React.createElement("h1", null, lang.keepAccount), React.createElement("p", null, lang.keepAccountTip1), React.createElement("p", null, lang.keepAccountTip2));
        Items.showItemQuick = React.createElement("div", {className: "mainCarousel-caption"}, React.createElement("h1", null, lang.quickFinance), React.createElement("p", null, lang.quickFinanceTip1), React.createElement("p", null, lang.quickFinanceTip2));
        return Items;
    }());
    var Indicator = (function (_super) {
        __extends(Indicator, _super);
        function Indicator(props, context) {
            _super.call(this, props, context);
        }
        Indicator.prototype.render = function () {
            var _this = this;
            return (React.createElement("li", {"data-target": this.props.target, "data-slide-to": this.props.slideNum, className: this.props.isSelect ? "active" : "", onClick: function () { return topic.publish('mainShow/idicatorClicked', _this.props.itemName); }}));
        };
        return Indicator;
    }(React.Component));
    var ContentFrame = (function (_super) {
        __extends(ContentFrame, _super);
        function ContentFrame(props, context) {
            _super.call(this, props, context);
        }
        ContentFrame.prototype.setClass = function () {
            var className;
            if (this.props.isSelect) {
                className = this.props.isSlide ? "mainCarousel-item active left" : "mainCarousel-item active";
            }
            else if (this.props.isNext) {
                className = "mainCarousel-item next left";
            }
            else {
                className = "mainCarousel-item";
            }
            return className;
        };
        ContentFrame.prototype.render = function () {
            return (React.createElement("div", {className: this.setClass()}, React.createElement("div", {className: "mainCarousel-container"}, React.createElement("div", {className: "carousel-caption"}, this.props.child))));
        };
        return ContentFrame;
    }(React.Component));
    var MainShow = (function (_super) {
        __extends(MainShow, _super);
        function MainShow(props, context) {
            _super.call(this, props, context);
            this.carouselId = 'mainShowCarousel';
            this.state = { select: select.showItemConduct, next: undefined, isSlide: false };
            topic.subscribe('mainShow/idicatorClicked', this.slide);
        }
        MainShow.prototype.slide = function (selectItem) {
            var next;
            switch (selectItem) {
                case select.showItemConduct:
                    next = select.showItemKeepAccount;
                    break;
                case select.showItemKeepAccount:
                    next = select.showItemQuick;
                    break;
                case select.showItemQuick:
                    next = select.showItemConduct;
                    break;
            }
            this.state = { select: selectItem, next: next, isSlide: true };
        };
        MainShow.prototype.render = function () {
            return (React.createElement("div", {id: this.carouselId, className: "mainCarousel", "data-ride": "carousel"}, React.createElement("ol", {className: "mainCarousel-indicators"}, React.createElement(Indicator, {target: this.carouselId, slideNum: "0", itemName: select.showItemConduct, isSelect: this.state.select == select.showItemConduct}), React.createElement(Indicator, {target: this.carouselId, slideNum: "1", itemName: select.showItemKeepAccount, isSelect: this.state.select == select.showItemKeepAccount}), React.createElement(Indicator, {target: this.carouselId, slideNum: "2", itemName: select.showItemQuick, isSelect: this.state.select == select.showItemQuick})), React.createElement("div", {className: "mainCarousel-inner", role: "listbox"}, React.createElement(ContentFrame, {child: Items.showItemConduct, isSelect: this.state.select == select.showItemConduct, isNext: this.state.next == select.showItemConduct, isSlide: this.state.isSlide}), React.createElement(ContentFrame, {child: Items.showItemKeepAccount, isSelect: this.state.select == select.showItemKeepAccount, isNext: this.state.next == select.showItemKeepAccount, isSlide: this.state.isSlide}), React.createElement(ContentFrame, {child: Items.showItemQuick, isSelect: this.state.select == select.showItemQuick, isNext: this.state.next == select.showItemQuick, isSlide: this.state.isSlide}))));
        };
        return MainShow;
    }(React.Component));
    exports.MainShow = MainShow;
});
define("reactApp", ["require", "exports", 'react', "mainShow"], function (require, exports, React, mainShow_1) {
    "use strict";
    var App = (function (_super) {
        __extends(App, _super);
        function App(props, context) {
            _super.call(this, props, context);
        }
        App.prototype.render = function () {
            return (React.createElement(mainShow_1.MainShow, null));
        };
        return App;
    }(React.Component));
    exports.App = App;
});
define("footer", ["require", "exports", 'react', 'dojo/i18n!app/nls/langResource.js'], function (require, exports, React, lang) {
    "use strict";
    var Footer = (function (_super) {
        __extends(Footer, _super);
        function Footer(props, context) {
            _super.call(this, props, context);
        }
        Footer.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("p", null, lang.authorInfo), React.createElement("p", null, React.createElement("a", {href: "#"}, lang.backtoTop))));
        };
        return Footer;
    }(React.Component));
    exports.Footer = Footer;
});
define("app", ["require", "exports", 'react', 'react-dom', "navBar", "reactApp", "footer"], function (require, exports, React, ReactDOM, navBar_1, reactApp_1, footer_1) {
    "use strict";
    exports.renderApp = function () {
        ReactDOM.render(React.createElement(navBar_1.Nav, null), document.getElementById('mastheader'));
        ReactDOM.render(React.createElement(reactApp_1.App, null), document.getElementById('content'));
        ReactDOM.render(React.createElement(footer_1.Footer, null), document.getElementById('pageFooter'));
    };
});
//# sourceMappingURL=app.js.map