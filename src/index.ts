import { InitOptions } from './types/options';
import Monitor from './monitor';
import { version } from '../package.json';

function init(options: InitOptions = {}) {
    console.log(`%ckangaroo monitor version: ${version}`, 'color:#FFA138;font-size:16px;');
    if (options.disabled) return;
    if (!options.logUrl) {
        console.error('请输入正确的log地址参数')
        return;
    }
    if (!options.apiKey) {
        console.error('请输入apiKey参数')
        return;
    }
    const instance = new Monitor(options);
    instance.run();
    return instance;
}

export { init };