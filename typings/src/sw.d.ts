interface PageItem {
    time: number;
}
interface PageInfo {
    [id: string]: PageItem;
}
declare const CHECK_CRASH_INTERVAL: number;
declare const CRASH_THRESHOLD: number;
declare const pages: PageInfo;
declare let timer: any;
declare function checkCrash(): void;
