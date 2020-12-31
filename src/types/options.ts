/**
 * 监控初始化参数
 * @param logUrl - 发送数据请求的dsn服务器地址
 * @param disabled - 为true时，禁用sdk
 * @param apiKey - 项目的key，唯一
 * @param debug - 是否开启调试，默认开启
 * @param isPage - 是否上报页面的性能数据，默认true
 * @param isResource - 是否上报页面资源数据，默认true
 * @param isError - 是否上报错误信息，默认true
 * @param probability - 上传概率，默认50%
 * 
 * @public
 */
export interface InitOptions {
    logUrl?: string;
    disabled?: boolean;
    apiKey?: string;
    debug?: boolean;
    isPage?: boolean;
    isResource?: boolean;
    isError?: boolean;
    isCrash?: boolean;
    probability?: number;
}
