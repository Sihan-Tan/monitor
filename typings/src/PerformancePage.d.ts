import MonitorBase from './base';
import { InitOptions } from './types/options';
declare class PerformancePage extends MonitorBase {
    private isResource;
    constructor(options: InitOptions);
    private syncCollect;
    private asyncCollect;
    private performanceTime;
    private performanceResource;
    private performancePaint;
    private formatTime;
}
export default PerformancePage;
