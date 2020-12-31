'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var webVitals = require('web-vitals');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

function parseData(target) {
  var cache = [];
  var res = JSON.stringify(target, function (_key, value) {
    if (_typeof__default['default'](value) === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      } // Store value in our collection


      cache.push(value);
    }

    return value;
  });
  cache = null; // Enable garbage collection

  return res;
}

var MonitorBase =
/** @class */
function () {
  function MonitorBase(options) {
    this.options = options;
  }

  MonitorBase.prototype.send = function (msg) {
    var _a = this.options,
        logUrl = _a.logUrl,
        apiKey = _a.apiKey,
        debug = _a.debug,
        probability = _a.probability;
    if (!logUrl || !apiKey) return false;

    var data = __assign({
      apiKey: apiKey
    }, msg);

    if (Math.random() < (10 - (probability || 5)) / 10) {
      return false;
    }

    debug && console.log(msg);
    var dataString = parseData(data);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(logUrl, dataString);
      return;
    } // 不能使用img上报错误，长度有限制
    // if (data.type === 'error') {
    //     new Image().src = `${logUrl}?info=${JSON.stringify(data)}`;
    //     return;
    // }


    setTimeout(function () {
      debug && console.info('传输数据📚🍊: ', logUrl, data);

      if ('fetch' in window) {
        fetch(logUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: dataString,
          keepalive: true
        });
      } else {
        console.log("%ckangaroo monitor \u6682\u65F6\u53EA\u652F\u6301navigator.sendBean | fetch Api", 'color:#FFA138;font-size:16px;');
      }
    });
  };

  return MonitorBase;
}();

var PerformancePage =
/** @class */
function (_super) {
  __extends(PerformancePage, _super);

  function PerformancePage(options) {
    var _this_1 = _super.call(this, options) || this;

    _this_1.isResource = options.isResource;

    _this_1.syncCollect();

    _this_1.asyncCollect();

    return _this_1;
  } // 收集同步指标


  PerformancePage.prototype.syncCollect = function () {
    // 通过performance Timing获取相应的性能指标
    this.performanceTime(); // 获取页面加载资源性能指标

    this.isResource && this.performanceResource(); // 同步数据获取完毕共同完成上报
    // this.send(this.reportData);
  }; // 收集异步指标


  PerformancePage.prototype.asyncCollect = function () {
    // 清空上报数据 重新上报异步数据
    // this.reportData = {};
    // 获取页面绘制相关的性能指标
    this.performancePaint();
  };

  PerformancePage.prototype.performanceTime = function () {
    var timing = performance.timing;

    if (!timing) {
      this.send({
        type: 'timing',
        data: 'performance Api 暂不支持'
      });
      return;
    }

    var data = {
      type: 'timing',
      data: this.formatTime(timing, performance)
    };
    this.send(data);
  };

  PerformancePage.prototype.performanceResource = function () {
    var entities = performance.getEntriesByType('resource');
    var arr = [];

    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
      var entry = entities_1[_i]; // PerformanceResourceTiming对象扩展了PerformanceEntry对象并新增了很多属性

      var item = entry;
      arr.push(item);
    }

    this.send({
      type: 'resource',
      data: arr
    });
  };

  PerformancePage.prototype.performancePaint = function () {
    var _this = this;

    function sendToAnalytics(metric) {
      // _this.reportData.performance = JSON.stringify(metric);
      _this.send({
        type: 'performance',
        data: metric
      });
    }

    webVitals.getCLS(sendToAnalytics);
    webVitals.getFCP(sendToAnalytics);
    webVitals.getFID(sendToAnalytics);
    webVitals.getLCP(sendToAnalytics);
    webVitals.getTTFB(sendToAnalytics);
  };

  PerformancePage.prototype.formatTime = function (timing, performance) {
    var t = timing;
    return {
      // 重定向次数
      redirectCount: performance.navigation.redirectCount,
      // 页面重定向时间
      redirectTime: t.redirectEnd - t.redirectStart || 0,
      // DNS解析时间
      dnsTime: t.domainLookupEnd - t.domainLookupStart,
      // TCP建立时间
      tcpTime: t.connectEnd - t.connectStart || 0,
      // SSL安全连接耗时
      sslTime: t.connectEnd - t.connectStart || 0,
      // 网络请求耗时
      ttfbTime: t.responseStart - t.requestStart || 0,
      // 数据传输耗时
      dataTime: t.responseEnd - t.responseStart || 0,
      // DOM 解析耗时
      domAnalyzeTime: t.domInteractive - t.responseEnd || 0,
      // 资源加载耗时
      resourceTime: t.loadEventStart - t.domContentLoadedEventEnd,
      // 白屏时间
      whiteTime: t.responseEnd - t.navigationStart || 0,
      // 首次可交互时间
      reactiveTime: t.domInteractive - t.navigationStart || 0,
      // dome渲染完成时间 ??
      domRenderedTime: t.domContentLoadedEventEnd - t.navigationStart || 0,
      // 页面准备时间
      readyTime: t.domContentLoadedEventEnd - t.navigationStart || 0,
      // 页面onload时间
      pageLoadedTime: t.loadEventEnd - t.navigationStart || 0,
      // 页面解析dom耗时
      pageAnalyzeDomTime: t.domComplete - t.domInteractive || 0,
      // unload时间
      unloadTime: t.unloadEventEnd - t.unloadEventStart || 0
    };
  };

  return PerformancePage;
}(MonitorBase);

var ErrorCatch =
/** @class */
function (_super) {
  __extends(ErrorCatch, _super);

  function ErrorCatch(options) {
    var _this = _super.call(this, options) || this; // 1.处理try...catch异常和异步异常


    _this._onerror(); // 2.处理网络请求异常


    _this._eventListenerError(); // 3.补货promise的错误异常


    _this._unhandleRejection();

    return _this;
  }

  ErrorCatch.prototype._onerror = function () {
    var _this = this; // source-map-support 使用source-map支持定位源码


    window.onerror = function (msg, _url, line, col, error) {
      var _a, _b, _c;

      var defaults = {};
      col = col || ((_a = window === null || window === void 0 ? void 0 : window.event) === null || _a === void 0 ? void 0 : _a.colno) || 1;
      line = line || ((_b = window === null || window === void 0 ? void 0 : window.event) === null || _b === void 0 ? void 0 : _b.lineno) || 1;
      defaults.msg = error && error.stack ? error.stack.toString() : msg;
      defaults.type = 'error';
      defaults.title = document.title;
      defaults.curUrl = (_c = window === null || window === void 0 ? void 0 : window.location) === null || _c === void 0 ? void 0 : _c.href;
      defaults.data = {
        resourceUrl: _url,
        line: line,
        col: col
      };

      _this.send(defaults);

      return true;
    };
  };

  ErrorCatch.prototype._eventListenerError = function () {
    var _this = this;

    window.addEventListener('error', function (e) {
      var _a;

      console.log('_eventListenerError', e);
      var defaults = {};
      var target = e.target || e.srcElement;
      defaults.note = 'resource';
      defaults.time = new Date().getTime();
      defaults.msg = e.message || (target === null || target === void 0 ? void 0 : target.localName) + ' is load error';
      defaults.type = 'error';
      defaults.title = document.title;
      defaults.curUrl = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href;
      defaults.data = {
        target: target.localName,
        type: e.type,
        resourceUrl: target.href || target.currentSrc || target.outerHTML
      };
      defaults.data.target && _this.send(defaults);
    }, true);
  };

  ErrorCatch.prototype._unhandleRejection = function () {
    var _this = this;

    window.addEventListener('unhandledrejection', function (e) {
      var _a, _b;

      console.log('_unhandleRejection', e);
      var error = e && e.reason;

      if (_typeof__default['default'](error) !== 'object') {
        _this.send({
          type: 'error',
          msg: error,
          title: document.title,
          curUrl: (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href,
          data: {
            type: e.type
          }
        });

        e.preventDefault();
        return true;
      }

      var message = error && error.message || '';
      var stack = error && error.stack || ''; // processing error

      var resourceUrl, col, line;
      var errs = stack.match(/\(.+?\)/);
      if (errs && errs.length) errs = errs[0];
      errs = errs.replace(/\w.+[js|html]/g, function ($1) {
        resourceUrl = $1;
        return '';
      });
      errs = errs.split(':');

      if (errs && errs.length > 1) {
        line = Number.parseInt(errs[1] || 0);
        col = Number.parseInt(errs[2] || 0);
      }

      var defaults = {};
      defaults.time = new Date().getTime();
      defaults.msg = message;
      defaults.type = 'error';
      defaults.title = document.title;
      defaults.curUrl = (_b = window === null || window === void 0 ? void 0 : window.location) === null || _b === void 0 ? void 0 : _b.href;
      defaults.data = {
        resourceUrl: resourceUrl,
        line: line,
        col: col
      };

      _this.send(defaults);

      e.preventDefault();
      return true;
    });
  };

  return ErrorCatch;
}(MonitorBase);

function S4() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

function guid() {
  return S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4();
}

var Monitor =
/** @class */
function () {
  function Monitor(options) {
    this.options = __assign({
      debug: true,
      isError: true,
      isPage: true,
      isResource: true,
      probability: 5,
      isCrash: true
    }, options);
    this.errInstance = {};
  }

  Monitor.prototype.run = function () {
    var _a = this.options,
        isPage = _a.isPage,
        isError = _a.isError,
        isCrash = _a.isCrash;
    isPage && new PerformancePage(this.options);
    isError && (this.errInstance = new ErrorCatch(this.options));
    isCrash && this.checkCrash();
  };

  Monitor.prototype.report = function (data) {
    console.log('report: ', data);
    this.errInstance.send({
      type: 'error',
      data: data
    });
  };

  Monitor.prototype.checkCrash = function () {
    var _this = this;

    console.log('registerServiceWork');
    var sessionId = guid();
    console.log(sessionId);
    window.addEventListener("load", function () {
      var lastCrash = localStorage.getItem("crash");

      if (lastCrash) {
        _this.report({
          type: 'error',
          data: lastCrash
        });
      }

      localStorage.setItem('crash', sessionId);
    }); // 在正常退出页面前销毁

    window.addEventListener("beforeunload", function () {
      localStorage.setItem('crash', '');
    });
    /*   // 判断当前浏览器是否支持serviceWork
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js').then(() => {
            console.log('sw注册成功')
          }).catch(() => {
            console.log('sw注册失败')
          })
        })
      }
      if (navigator?.serviceWorker?.controller) {
        console.log('controller')
          let HEART_BEAT = 5e3;
          let sessionId = uuid();
          let heartbeat = function () {
            console.log('检测💓')
              navigator?.serviceWorker?.controller?.postMessage({
                type: 'heartbeat',
                id: sessionId,
                data: {} // 附加信息，如果页面 crash，上报的附加数据
              });
            }
            // 在正常退出页面前销毁
            window.addEventListener("beforeunload", function() {
              navigator?.serviceWorker?.controller?.postMessage({
                type: 'unload',
                id: sessionId
              });
            });
            setInterval(heartbeat, HEART_BEAT);
            heartbeat();
      } else {
        console.log(`%c当前浏览器不支持奔溃上报`, 'color:#FFA138;font-size:16px;');
      } */
  };

  return Monitor;
}();

var version = "0.0.1";

function init(options) {
  if (options === void 0) {
    options = {};
  }

  console.log("%ckangaroo monitor version: " + version, 'color:#FFA138;font-size:16px;');
  if (options.disabled) return;

  if (!options.logUrl) {
    console.error('请输入正确的log地址参数');
    return;
  }

  if (!options.apiKey) {
    console.error('请输入apiKey参数');
    return;
  }

  var instance = new Monitor(options);
  instance.run();
  return instance;
}

exports.init = init;
