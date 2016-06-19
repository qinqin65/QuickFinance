var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("carousel", ["require", "exports", 'dojo/dom', 'dojo/query', 'dojo/on'], function (require, exports, dom, query, on) {
    "use strict";
    /**
     * Carousel
     */
    var Carousel = (function () {
        function Carousel(nodeId) {
            this.transitionDuration = 600;
            this.carouselObj = dom.byId(nodeId);
            this.indicators = this.carouselObj.children[0];
            this.carouselItems = this.carouselObj.children[1];
            on(this.indicators, 'click', this.indicatorHandle.bind(this));
        }
        Carousel.prototype.indicatorHandle = function (evt) {
            if (evt.srcElement.nodeName == 'OL') {
                return;
            }
            var actIndicator = query('.carousel-indicators .active')[0];
            var curIndicator = evt.srcElement;
            var actItem = query('.carousel-item.active')[0];
            var curNum = curIndicator.dataset.slideTo;
            var curItem = this.carouselItems.childNodes[curNum];
            actIndicator.classList.remove('active');
            curIndicator.classList.add('active');
            curItem.classList.add('next');
            actItem.classList.add('left');
            curItem.classList.add('left');
            // curItem.style.left = '100%';
            // actItem.style.left = '100%';
            setTimeout(function () {
                curItem.classList.remove('next', 'left');
                curItem.classList.add('active');
                actItem.classList.remove('active', 'left');
            }, this.transitionDuration);
        };
        return Carousel;
    }());
    exports.__esModule = true;
    exports["default"] = Carousel;
});
define("util", ["require", "exports", 'dojo/cookie'], function (require, exports, cookie) {
    "use strict";
    var Config = (function () {
        function Config() {
        }
        Config.requestHost = 'http://localhost:8000/quick';
        return Config;
    }());
    exports.Config = Config;
    var Util = (function () {
        function Util() {
        }
        Util.getCSRF = function () {
            var csrf = cookie('csrftoken');
            return csrf;
        };
        return Util;
    }());
    exports.Util = Util;
});
define("validate", ["require", "exports", 'dojo/dom', 'dojo/on'], function (require, exports, dom, on) {
    "use strict";
    (function (validateType) {
        validateType[validateType["needed"] = 0] = "needed";
        validateType[validateType["mail"] = 1] = "mail";
        validateType[validateType["phone"] = 2] = "phone";
    })(exports.validateType || (exports.validateType = {}));
    var validateType = exports.validateType;
    ;
    var Validete = (function () {
        function Validete() {
            this.validateItems = [];
        }
        Validete.prototype.addValiItems = function (item, type) {
            this.validateItems.push({ item: item, type: type });
        };
        Validete.prototype.neededvalidate = function (nodeId) {
            var node = dom.byId(nodeId);
            if (node === null) {
                return true;
            }
            else if (node.value) {
                return true;
            }
            else {
                node.classList.add('needed');
                on.once(node, 'click', function () { return node.classList.remove('needed'); });
                return false;
            }
        };
        Validete.prototype.validate = function () {
            var isPassed = true;
            for (var i = 0; i < this.validateItems.length; i++) {
                var itemObj = this.validateItems[i];
                var itemId = itemObj.item;
                var type = itemObj.type;
                switch (type) {
                    case validateType.needed:
                        var result = this.neededvalidate(itemId);
                        if (isPassed) {
                            isPassed = result;
                        }
                        break;
                    default:
                        break;
                }
            }
            // this.validateItems.forEach((itemObj)=>{
            // });
            return isPassed;
        };
        return Validete;
    }());
    exports.Validete = Validete;
});
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
define("mainShow", ["require", "exports", 'react', 'dojo/i18n!app/nls/langResource.js', "carousel"], function (require, exports, React, lang, carousel_1) {
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
        Items.showItemConduct = React.createElement("div", {className: "carousel-caption"}, React.createElement("h1", null, lang.conductFinance), React.createElement("p", null, lang.conductFinanceTip1), React.createElement("p", null, lang.conductFinanceTip2));
        Items.showItemKeepAccount = React.createElement("div", {className: "carousel-caption"}, React.createElement("h1", null, lang.keepAccount), React.createElement("p", null, lang.keepAccountTip1), React.createElement("p", null, lang.keepAccountTip2));
        Items.showItemQuick = React.createElement("div", {className: "carousel-caption"}, React.createElement("h1", null, lang.quickFinance), React.createElement("p", null, lang.quickFinanceTip1), React.createElement("p", null, lang.quickFinanceTip2));
        return Items;
    }());
    var Indicator = (function (_super) {
        __extends(Indicator, _super);
        function Indicator(props, context) {
            _super.call(this, props, context);
        }
        Indicator.prototype.render = function () {
            return (
            // <li data-target = { this.props.target } data-slide-to = { this.props.slideNum } className = { this.props.isSelect ? "active" : "" } onClick = { ()=>topic.publish('mainShow/idicatorClicked', this.props.itemName) }></li>
            React.createElement("li", {"data-target": this.props.target, "data-slide-to": this.props.slideNum, className: this.props.isSelect ? "active" : ""}));
        };
        return Indicator;
    }(React.Component));
    var ContentFrame = (function (_super) {
        __extends(ContentFrame, _super);
        function ContentFrame(props, context) {
            _super.call(this, props, context);
        }
        ContentFrame.prototype.render = function () {
            return (React.createElement("div", {className: this.props.isSelect ? "carousel-item active" : "carousel-item"}, React.createElement("div", {className: "carousel-container"}, React.createElement("div", {className: "carousel-caption"}, this.props.child))));
        };
        return ContentFrame;
    }(React.Component));
    var MainShow = (function (_super) {
        __extends(MainShow, _super);
        function MainShow(props, context) {
            _super.call(this, props, context);
            this.carouselId = 'mainShowCarousel';
            this.carouselObj = null;
            this.state = { select: select.showItemConduct };
        }
        MainShow.prototype.componentDidMount = function () {
            this.carouselObj = new carousel_1["default"](this.carouselId);
        };
        MainShow.prototype.render = function () {
            return (React.createElement("div", {id: this.carouselId, className: "carousel", "data-ride": "carousel"}, React.createElement("ol", {className: "carousel-indicators"}, React.createElement(Indicator, {target: this.carouselId, slideNum: "0", itemName: select.showItemConduct, isSelect: this.state.select == select.showItemConduct}), React.createElement(Indicator, {target: this.carouselId, slideNum: "1", itemName: select.showItemConduct, isSelect: this.state.select == select.showItemKeepAccount}), React.createElement(Indicator, {target: this.carouselId, slideNum: "2", itemName: select.showItemConduct, isSelect: this.state.select == select.showItemQuick})), React.createElement("div", {className: "carousel-inner", role: "listbox"}, React.createElement(ContentFrame, {child: Items.showItemConduct, isSelect: this.state.select == select.showItemConduct}), React.createElement(ContentFrame, {child: Items.showItemKeepAccount, isSelect: this.state.select == select.showItemKeepAccount}), React.createElement(ContentFrame, {child: Items.showItemQuick, isSelect: this.state.select == select.showItemQuick}))));
        };
        return MainShow;
    }(React.Component));
    exports.MainShow = MainShow;
});
define("login", ["require", "exports", 'react', 'dojo/i18n!app/nls/langResource.js', 'dojo/topic', 'dojo/request/xhr', "validate", "util"], function (require, exports, React, lang, topic, xhr, validate_1, util_1) {
    "use strict";
    var select;
    (function (select) {
        select[select["login"] = 0] = "login";
        select[select["register"] = 1] = "register";
    })(select || (select = {}));
    ;
    var layerState;
    (function (layerState) {
        layerState[layerState["wait"] = 0] = "wait";
        layerState[layerState["loading"] = 1] = "loading";
    })(layerState || (layerState = {}));
    ;
    var LoginHeader = (function (_super) {
        __extends(LoginHeader, _super);
        function LoginHeader(props, context) {
            _super.call(this, props, context);
        }
        LoginHeader.prototype.render = function () {
            return (React.createElement("div", {className: "login_header"}, React.createElement("a", {className: this.props.select == select.login ? 'switch_btn_focus' : 'switch_btn', hidefocus: "true", href: "javascript:void(0);", onClick: function () { return topic.publish('login/itemClicked', select.login); }}, lang.login), React.createElement("a", {className: this.props.select == select.register ? 'switch_btn_focus' : 'switch_btn', hidefocus: "true", href: "javascript:void(0);", onClick: function () { return topic.publish('login/itemClicked', select.register); }}, lang.register), React.createElement("div", {className: "switch_bottom", id: "switch_bottom", style: { left: '0px', width: '50%', marginLeft: this.props.select == select.login ? '0' : '50%', position: 'absolute' }})));
        };
        return LoginHeader;
    }(React.Component));
    var MainLogin = (function (_super) {
        __extends(MainLogin, _super);
        function MainLogin(props, context) {
            _super.call(this, props, context);
            this.validates = new validate_1.Validete();
        }
        MainLogin.prototype.componentDidMount = function () {
            this.validates.addValiItems('lgInputUserName', validate_1.validateType.needed);
            this.validates.addValiItems('lgInputPassword', validate_1.validateType.needed);
        };
        MainLogin.prototype.btLoginHandle = function () {
            if (this.validates.validate()) {
                topic.publish('login/loginBtnClicked', true);
                var option = {
                    handleAs: 'json',
                    // headers: {
                    //   HTTP_X_CSRFTOKEN: Util.getCSRF()
                    // },
                    data: {
                        'userName': this.refs.lgInputUserName,
                        'password': this.refs.lgInputPassword,
                        'csrfmiddlewaretoken': util_1.Util.getCSRF()
                    }
                };
                xhr.post(util_1.Config.requestHost + "/login", option).then(function (data) {
                    console.debug('test data');
                }, function (error) {
                    console.error(error);
                });
            }
        };
        MainLogin.prototype.render = function () {
            return (React.createElement("div", {className: "main_login"}, React.createElement("label", {htmlFor: "lgInputUserName", className: "sr-only"}, lang.userName), React.createElement("input", {ref: 'lgInputUserName', type: "text", id: "lgInputUserName", className: "form-control", required: true, autofocus: true}), React.createElement("label", {htmlFor: "lgInputPassword", className: "sr-only"}, lang.password), React.createElement("input", {ref: 'lgInputPassword', type: "password", id: "lgInputPassword", className: "form-control", placeholder: "Password", required: true}), React.createElement("div", {className: "checkbox"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", value: "remember-me"}), lang.rememberMe)), React.createElement("button", {className: "btn-lg", type: "submit", onClick: this.btLoginHandle.bind(this)}, lang.login)));
        };
        return MainLogin;
    }(React.Component));
    var Register = (function (_super) {
        __extends(Register, _super);
        function Register(props, context) {
            _super.call(this, props, context);
            this.validates = new validate_1.Validete();
        }
        Register.prototype.componentDidMount = function () {
            this.validates.addValiItems('regInputUserName', validate_1.validateType.needed);
            this.validates.addValiItems('regInputPassword', validate_1.validateType.needed);
            this.validates.addValiItems('regInputPasswordAgain', validate_1.validateType.needed);
        };
        Register.prototype.registerHandle = function () {
            if (this.validates.validate()) {
                topic.publish('login/registerBtnClicked', true);
            }
        };
        Register.prototype.render = function () {
            return (React.createElement("div", {className: "main_login"}, React.createElement("label", {htmlFor: "regInputUserName", className: "sr-only"}, lang.userName), React.createElement("input", {type: "text", id: "regInputUserName", className: "form-control", required: "", autofocus: ""}), React.createElement("label", {htmlFor: "regInputPassword", className: "sr-only"}, lang.password), React.createElement("input", {type: "password", id: "regInputPassword", className: "form-control", placeholder: "Password", required: ""}), React.createElement("label", {htmlFor: "regInputPasswordAgain", className: "sr-only"}, lang.passwordAgain), React.createElement("input", {type: "password", id: "regInputPasswordAgain", className: "form-control", placeholder: "Password", required: ""}), React.createElement("button", {className: "btn-lg", type: "submit", onClick: this.registerHandle.bind(this)}, lang.register)));
        };
        return Register;
    }(React.Component));
    var Login = (function (_super) {
        __extends(Login, _super);
        function Login(props, context) {
            var _this = this;
            _super.call(this, props, context);
            this.state = { select: select.login, isLoading: false };
            this.loadingLayer = (React.createElement("div", {className: "main_login"}, React.createElement("i", {className: "loading fa fa-refresh fa-spin"})));
            topic.subscribe('login/itemClicked', function (selectItem) { return _this.setState({ select: selectItem }); });
            topic.subscribe('login/loginBtnClicked', function (isLoading) { return _this.setState({ isLoading: isLoading }); });
            topic.subscribe('login/registerBtnClicked', function (isLoading) { return _this.setState({ isLoading: isLoading }); });
        }
        Login.prototype.render = function () {
            return (React.createElement("div", {className: "login"}, React.createElement(LoginHeader, {select: this.state.select}), this.state.isLoading ? this.loadingLayer :
                this.state.select == select.login ? React.createElement(MainLogin, null) : React.createElement(Register, null)));
        };
        return Login;
    }(React.Component));
    exports.__esModule = true;
    exports["default"] = Login;
});
define("reactApp", ["require", "exports", 'react', "mainShow", "login"], function (require, exports, React, mainShow_1, login_1) {
    "use strict";
    var App = (function (_super) {
        __extends(App, _super);
        function App(props, context) {
            _super.call(this, props, context);
        }
        App.prototype.render = function () {
            return (React.createElement("div", null, React.createElement(mainShow_1.MainShow, null), React.createElement(login_1["default"], null)));
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