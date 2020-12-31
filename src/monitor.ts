import { InitOptions } from './types/options';
import PerformancePage from './PerformancePage';
// import sw from './sw';
import ErrorCatch from './ErrorCatch';
import uuid from './utils/uuid';

class Monitor {
    private options: InitOptions;

    private errInstance:any;

    constructor(options: InitOptions) {
      this.options = {
        debug: true,
        isError: true,
        isPage: true,
        isResource: true,
        probability: 5,
        isCrash: true,
        ...options,
      };
      this.errInstance = {};
    }

    public run() {
      const { isPage, isError, isCrash } = this.options;
      isPage && new PerformancePage(this.options);
      isError && (this.errInstance = new ErrorCatch(this.options));
      isCrash && this.checkCrash();
    }

    public report(data:any) {
      console.log('report: ', data);
      this.errInstance.send({
        type: 'error',
        data,
      });
    }

    private checkCrash() {
      const sessionId = uuid();
      window.addEventListener('load', () => {
        const lastCrash = localStorage.getItem('crash');
        if (lastCrash) {
          this.report({
            type: 'error',
            data: lastCrash,
          });
        }
        localStorage.setItem('crash', sessionId);
      });
      // 在正常退出页面前销毁
      window.addEventListener('beforeunload', () => {
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
    }
}

export default Monitor;
