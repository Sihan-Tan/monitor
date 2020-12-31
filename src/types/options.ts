import { ReportDataType } from './transportData';
import { BreadcrumbPushData } from './breadcrumb';

type CANCEL = null | undefined | boolean;

// 请求方法类型
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS'

export enum EMethods {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}

interface IRequestHeaderConfig {
    url: HttpMethod
    method: string
}

type TSetRequestHeader = (key: string, value: string) => {}

export interface IBeforeAppAjaxSendConfig {
    setRequestHeader: TSetRequestHeader
}

/**
 * 静默事件类型
 */
export interface SilentEventTypes {
    /**
     * 静默监控xhr事件
     */
    silentXhr?: boolean;
    /**
     * 静默监控fetch事件
     */
    silentFetch?: boolean;
    /**
     * 静默监控console事件
     */
    silentConsole?: boolean;
    /**
     * 静默监控dom事件
     */
    silentDom?: boolean;
    /**
     * 静默监控history事件
     */
    silentHistory?: boolean;
    /**
     * 静默监控hash事件
     */
    silentHash?: boolean;
    /**
     * 静默监控error事件
     */
    silentError?: boolean;
    /**
     * 静默监控unhandleReject事件
     */
    silentUnhandledRejection?: boolean;
    /**
     * 静默监控vue.warn事件
     */
    silentVue?: boolean;
}

/**
 * 钩子函数类型
 */
export interface HooksTypes {
    /**
     * 钩子函数，配置发送到服务端的xhr
     * 可以对当前xhr实例做一些配置：xhr.setRequestHeader、xhr.withCredentials
     * 会在xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF=8')、
     * xhr.withCredentials = true 后面调用该函数
     * @param xhr XMLHttpRequest实例
     */
    configReportXhr?(xhr: XMLHttpRequest): void

    /**
     * 钩子函数，在每次发送事件前会调用
     * @param event 有SDK生成的错误事件
     * @returns 如果返回 null | undefined | boolean 时，将忽略本次上传
     */
    beforeDataReport?(
        event: ReportDataType
    ): PromiseLike<ReportDataType | null> | ReportDataType | CANCEL

    /**
     * 钩子函数，在每次添加用户行为事件前都会调用
     * @param breadcrumb 由SDK生成的breadcrumb事件栈
     * @param hint 当次的生成的breadcrumb数据
     * @return 如果返回 null | undefined | boolean 时，将忽略本次的push
     */
    beforePushBreadcrumbs?(breadcrumb: Breadcrumb, hint: BreadcrumbPushData): BreadcrumbPushData | CANCEL

    /**
     * 钩子函数，拦截用户页面的ajax请求，并在ajax请求发送前执行该hook，可以对用户发送的ajax请求做xhr.setRequestHeader
     * @param config 当前请求的配置
     */
    beforeAppAjaxSend?(config: IRequestHeaderConfig, setRequestHeaders: IBeforeAppAjaxSendConfig): void

    /**
     * 钩子函数，在beforeDataReport后面调用，在整合上报数据和本身SDK信息数据前调用，当前函数执行完后立即将数据错误信息上报至服务端
     * trackerId表示用户唯一键（可以理解成userId），需要trackerId的意义可以区分每个错误影响的用户数量
     */
    backTrackerId?(): string | number
}

export interface InitOptions extends SilentEventTypes, HooksTypes {
    /**
     * 发送数据请求的dsn服务器地址
     */
    server?: string;
    /**
     * 为true时，禁用sdk
     */
    disabled?: boolean;
    /**
     * 项目的key，唯一
     */
    apiKey?: string;
    /**
     * 是否开启调试，默认开启
     */
    debug?: boolean;
    /**
     * 是否上报页面的性能数据，默认true
     */
    enablePagePerformance?: boolean;
    /**
     * 是否上报页面资源数据，默认true
     */
    enablePageResource?: boolean;
    /**
     * 是否上报错误信息，默认true
     */
    enableError?: boolean;
    /**
     * 是否开启crash上报
     */
    enableCrash?: boolean;
    /**
     * 请求是否添加tranceId
     */
    enableTraceId?: boolean;
    /**
     * 上报概率，默认50%
     */
    probability?: number;
    /**
     * 上传过滤的正则
     */
    filterRegExp?: RegExp;
    /**
    * 用来存储用户行为栈的数量
    * 默认10，最大50
    */
    maxBreadcrumbs?: number;
}
