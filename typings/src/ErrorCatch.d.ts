import MonitorBase from './base';
import { InitOptions } from './types/options';
declare class ErrorCatch extends MonitorBase {
    constructor(options: InitOptions);
    _onerror(): void;
    _eventListenerError(): void;
    _unhandleRejection(): void;
}
export default ErrorCatch;
