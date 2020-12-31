import MonitorBase from './base';
import { InitOptions } from './types/options';
import { sendData } from './types/data';

class ErrorCatch extends MonitorBase {
    constructor(options: InitOptions) {
        super(options);
        // 1.处理try...catch异常和异步异常
        this._onerror();
        // 2.处理网络请求异常
        this._eventListenerError();
        // 3.补货promise的错误异常
        this._unhandleRejection();
    }
    _onerror() {
        // source-map-support 使用source-map支持定位源码
        window.onerror = (msg, _url, line, col, error) => {
            let defaults: sendData = {};
            col = col || ((<ErrorEvent>window?.event)?.colno) || 1;
            line = line || ((<ErrorEvent>window?.event)?.lineno) || 1;
            defaults.msg = <string>(error && error.stack ? error.stack.toString() : msg);
            defaults.type = 'error';
            defaults.title = document.title;
            defaults.curUrl = window?.location?.href;
            defaults.data = {
                resourceUrl: _url,
                line,
                col
            }
            this.send(defaults);
            return true;
        }
    }
    _eventListenerError() {
        window.addEventListener('error', (e: ErrorEvent | any) => {
            console.log('_eventListenerError', e)
            let defaults: sendData = {};
            const target = e.target || e.srcElement;
            defaults.note = 'resource';
            defaults.time = new Date().getTime();
            defaults.msg = e.message || ((target?.localName) + ' is load error');
            defaults.type = 'error';
            defaults.title = document.title;
            defaults.curUrl = window?.location?.href;
            defaults.data = {
                target: target.localName,
                type: <string>(e.type),
                resourceUrl: target.href || target.currentSrc || target.outerHTML
            };
            defaults.data.target && this.send(defaults);
        }, true);
    }
    _unhandleRejection() {
        window.addEventListener('unhandledrejection', e => {
            console.log('_unhandleRejection', e)
            const error = e && e.reason;
            if (typeof error !== 'object') {
                this.send({
                    type: 'error',
                    msg: error,
                    title: document.title,
                    curUrl: window?.location?.href,
                    data: {
                        type: e.type
                    }
                });
                e.preventDefault();
                return true;
            }
            const message = (error && error.message) || '';
            const stack = (error && error.stack) || '';
            // processing error
            let resourceUrl, col, line;
            let errs = stack.match(/\(.+?\)/);
            if (errs && errs.length) errs = errs[0];
            errs = errs.replace(/\w.+[js|html]/g, ($1: any) => {
                resourceUrl = $1;
                return '';
            });
            errs = errs.split(':');
            if (errs && errs.length > 1) {
                line = Number.parseInt(errs[1] || 0);
                col = Number.parseInt(errs[2] || 0);
            }
            let defaults: sendData = {};
            defaults.time = new Date().getTime();
            defaults.msg = message;
            defaults.type = 'error';
            defaults.title = document.title;
            defaults.curUrl = window?.location?.href;
            defaults.data = {
                resourceUrl,
                line,
                col
            };
            this.send(defaults);
            e.preventDefault();
            return true;
        })
    }
}

export default ErrorCatch