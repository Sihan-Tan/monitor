import { InitOptions } from './types/options';
import Monitor from './monitor';
import { SDK_VERSION, SDK_NAME } from './config';

function init(options: InitOptions = {}) {
  console.log(`%c ${SDK_NAME} version: ${SDK_VERSION}`, 'color:#FFA138;font-size:16px;');
  if (options.disabled) return;
  if (!options.logUrl) {
    console.error('请输入正确的log地址参数');
    return;
  }
  if (!options.apiKey) {
    console.error('请输入apiKey参数');
    return;
  }
  const instance = new Monitor(options);
  instance.run();
  return instance;
}

export { SDK_VERSION, SDK_NAME, init };
