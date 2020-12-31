interface PageItem {
  time: number;
}
interface PageInfo {
  [id: string]: PageItem;
}

const CHECK_CRASH_INTERVAL = 10 * 1000; // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000; // 15s 超过15s没有心跳则认为已经 crash
const pages:PageInfo = {};
let timer: any = null;
function checkCrash() {
  const now = Date.now();
  for (const id in pages) {
    const page = pages[id];
    if ((now - page.time) > CRASH_THRESHOLD) {
      // 上报 crash
      delete pages[id];
    }
  }
  if (Object.keys(pages).length == 0) {
    clearInterval(timer);
    timer = null;
  }
}

window.addEventListener('message', (e) => {
  console.log('message', e);
  const { data } = e;
  if (data.type === 'heartbeat') {
    pages[data.id] = {
      time: Date.now(),
    };
    if (!timer) {
      timer = setInterval(() => {
        checkCrash();
      }, CHECK_CRASH_INTERVAL);
    }
  } else if (data.type === 'unload') {
    delete pages[data.id];
  }
});
