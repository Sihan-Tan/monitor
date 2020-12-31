// import { Severity } from '../utils/Severity'
// import { BREADCRUMBTYPES } from '../common'
import { ReportDataType } from './transportData';
import { Replace } from './replace';

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: string
  // string for click dom
  data: ReportDataType | string | Replace.IRouter | Replace.TriggerConsole
  /**
   * 分为user action、debug、http、
   */
  category?: string
  time?: number
  level: string
}
