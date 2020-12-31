import {
  getCLS, getFCP, getFID, getLCP, getTTFB,
} from 'web-vitals';
import MonitorBase from './base';
import { InitOptions } from './types/options';

class PerformancePage extends MonitorBase {
    // private reportData: { [key: string]: any } = {};
    private enablePageResource;

    constructor(options: InitOptions) {
      super(options);
      this.enablePageResource = options.enablePageResource;
      this.syncCollect();
      this.asyncCollect();
    }

    // 收集同步指标
    private syncCollect() {
      // 通过performance Timing获取相应的性能指标
      this.performanceTime();
      // 获取页面加载资源性能指标
      this.enablePageResource && this.performanceResource();
      // 同步数据获取完毕共同完成上报
      // this.send(this.reportData);
    }

    // 收集异步指标
    private asyncCollect() {
      // 清空上报数据 重新上报异步数据
      // this.reportData = {};
      // 获取页面绘制相关的性能指标
      this.performancePaint();
    }

    private performanceTime() {
      const { timing } = performance;
      if (!timing) {
        this.send({
          type: 'timing',
          data: 'performance Api 暂不支持',
        });
        return;
      }
      const data = {
        type: 'timing',
        data: this.formatTime(timing, performance),
      };
      this.send(data);
    }

    private performanceResource() {
      const entities = performance.getEntriesByType('resource');
      const arr = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of entities) {
        // PerformanceResourceTiming对象扩展了PerformanceEntry对象并新增了很多属性
        const item = entry as PerformanceResourceTiming;
        arr.push(item);
      }
      this.send({
        type: 'resource',
        data: arr,
      });
    }

    private performancePaint() {
      const that = this;
      function sendToAnalytics(metric: object) {
        // that.reportData.performance = JSON.stringify(metric);
        that.send({
          type: 'performance',
          data: metric,
        });
      }
      getCLS(sendToAnalytics);
      getFCP(sendToAnalytics);
      getFID(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    }

    // eslint-disable-next-line class-methods-use-this
    private formatTime(timing: PerformanceTiming, performance: Performance) {
      const t = timing;
      return {
        // 重定向次数
        redirectCount: performance.navigation.redirectCount,
        // 页面重定向时间
        redirectTime: t.redirectEnd - t.redirectStart || 0,
        // DNS解析时间
        dnsTime: t.domainLookupEnd - t.domainLookupStart,
        // TCP建立时间
        tcpTime: t.connectEnd - t.connectStart || 0,
        // SSL安全连接耗时
        sslTime: t.connectEnd - t.connectStart || 0,
        // 网络请求耗时
        ttfbTime: t.responseStart - t.requestStart || 0,
        // 数据传输耗时
        dataTime: t.responseEnd - t.responseStart || 0,
        // DOM 解析耗时
        domAnalyzeTime: t.domInteractive - t.responseEnd || 0,
        // 资源加载耗时
        resourceTime: t.loadEventStart - t.domContentLoadedEventEnd,
        // 白屏时间
        whiteTime: t.responseEnd - t.navigationStart || 0,
        // 首次可交互时间
        reactiveTime: t.domInteractive - t.navigationStart || 0,
        // dome渲染完成时间 ??
        domRenderedTime: t.domContentLoadedEventEnd - t.navigationStart || 0,
        // 页面准备时间
        readyTime: t.domContentLoadedEventEnd - t.navigationStart || 0,
        // 页面onload时间
        pageLoadedTime: t.loadEventEnd - t.navigationStart || 0,
        // 页面解析dom耗时
        pageAnalyzeDomTime: t.domComplete - t.domInteractive || 0,
        // unload时间
        unloadTime: t.unloadEventEnd - t.unloadEventStart || 0,
      };
    }
}

export default PerformancePage;
