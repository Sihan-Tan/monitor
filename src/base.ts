import { InitOptions } from './types/options';
import { sendData } from './types/data';
import parseData from './utils/parseData';

class MonitorBase {
    private options: InitOptions;

    constructor(options: InitOptions) {
      this.options = options;
    }

    public send(msg: sendData) :void {
      const {
        server, apiKey, debug, probability,
      } = this.options;
      if (!server || !apiKey) return;
      const data: sendData = {
        apiKey,
        ...msg,
      };
      if (Math.random() < (10 - (probability || 5)) / 10) {
        return;
      }
      debug && console.log(msg);
      const dataString: string = parseData(data);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(server, dataString);
        return;
      }
      // 不能使用img上报错误，长度有限制
      // if (data.type === 'error') {
      //     new Image().src = `${server}?info=${JSON.stringify(data)}`;
      //     return;
      // }
      setTimeout(() => {
        debug && console.info('传输数据📚🍊: ', server, data);
        if ('fetch' in window) {
          fetch(server, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: dataString,
            keepalive: true,
          });
        } else {
          console.log('%ckangaroo monitor 暂时只支持navigator.sendBean | fetch Api', 'color:#FFA138;font-size:16px;');
        }
      });
    }
}

export default MonitorBase;
