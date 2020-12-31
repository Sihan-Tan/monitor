import { InitOptions } from './types/options';
import { sendData } from './types/data';
declare class MonitorBase {
    private options;
    constructor(options: InitOptions);
    send(msg: sendData): false | undefined;
}
export default MonitorBase;
