import { InitOptions } from './types/options';
declare class Monitor {
    private options;
    private errInstance;
    constructor(options: InitOptions);
    run(): void;
    report(data: any): void;
    private checkCrash;
}
export default Monitor;
