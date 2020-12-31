export interface IStringObject {
  [key: string]: any
}

export type voidFun = () => void;

/**
 * 上报的事件类型
 */
export enum REPORT_TYPES {
  PERFORMANCE = 'PERFORMANCE',
  RESOURCE = 'RESOURCE',
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  LOG_ERROR = 'LOG_ERROR',
  FETCH_ERROR = 'HTTP_ERROR',
  VUE_ERROR = 'VUE_ERROR',
  REACT_ERROR = 'REACT_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  PROMISE_ERROR = 'PROMISE_ERROR'
}

/**
 * 用户行为栈事件类型
 */
export enum BREAD_CRUMB_TYPES {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  XHR = 'Xhr',
  FETCH = 'Fetch',
  SEND_BEAN = 'Send_Bean',
  UNHANDLEDREJECTION = 'Unhandled_Rejection',
  VUE = 'Vue',
  REACT = 'React',
  RESOURCE = 'Resource',
  CODE_ERROR = 'Code_Error',
  CUSTOMER = 'Customer'
}
