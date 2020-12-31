import { InitOptions } from './types/options';
import { sendData } from './types/data'
import parseData from './utils/parseData'


class MonitorBase {
    private options: InitOptions;
    constructor(options: InitOptions) {
        this.options = options;
    }
    public send(msg: sendData) {
        const { logUrl, apiKey, debug, probability } = this.options;
        if (!logUrl || !apiKey) return false;
        const data: sendData = {
            apiKey,
            ...msg
        }
        if (Math.random() < (10 - (probability || 5)) / 10) {
            return false;
        }
        debug && console.log(msg);
        let dataString: string= parseData(data);
        if (navigator.sendBeacon) {
            navigator.sendBeacon(logUrl, dataString);
            return;
        }
        // 不能使用img上报错误，长度有限制
        // if (data.type === 'error') {
        //     new Image().src = `${logUrl}?info=${JSON.stringify(data)}`;
        //     return;
        // }
        setTimeout(() => {
            debug && console.info('传输数据📚🍊: ', logUrl, data);
            if ('fetch' in window) {
                fetch(logUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: dataString,
                    keepalive: true
                })
            } else {
                console.log(`%ckangaroo monitor 暂时只支持navigator.sendBean | fetch Api`, 'color:#FFA138;font-size:16px;');
            }
        })
    }
}

export default MonitorBase;