import ajax from './ajax';

const defaultConfig = {
  cdn: 'https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js',
  method: 'post',
  // url: '/error',
  showDevtools: false,
};

function processStackMsg(error) {
  let stack = error.stack
    .replace(/\n/gi, '')
    .split(/\bat\b/)
    .slice(0, 9)
    .join('@')
    .replace(/\?[^:]+/gi, '');
  const msg = error.toString();
  if (stack.indexOf(msg) < 0) {
    stack = `${msg}@${stack}`;
  }
  return stack;
}

function isOBJByType(o, type) {
  return Object.prototype.toString.call(o) === `[object ${type || 'Object'}]`;
}

class CatchError {
  init(config) {
    this.config = Object.assign(defaultConfig, config);

    if (window.onerror) {
      this.windowError = window.onerror;
    }

    if (this.config.url) {
      window.onerror = this.onerror;
    }

    if (this.config.showDevtools || /devtools=show/.test(window.location.search)) {
      return this.loadVconsole();
    }

    return Promise.resolve();
  }

  onerror = (msg, url, line, col, error) => {
    if (this.windowError) this.windowError(msg, url, line, col, error);
    let newMsg = msg;

    if (error && error.stack) {
      newMsg = processStackMsg(error);
    }

    if (isOBJByType(newMsg, 'Event')) {
      newMsg += newMsg.type ?
        (`--${newMsg.type}--${newMsg.target ?
          (`${newMsg.target.tagName}::${newMsg.target.src}`) : ''}`) : '';
    }

    newMsg = (`${newMsg}` || '').substr(0, 500);
    const logs = {
      msg: newMsg,
      timestamp: Date.now(),
      userAgent: window.navigator.userAgent,
      targetUrl: url,
      line,
      col,
    };

    // upload error
    ajax({
      method: this.config.method,
      url: this.config.url,
      data: logs,
    });
  }

  loadVconsole = () => this.loadScript(this.config.cdn).then(() => new window.VConsole());

  loadScript = src => new Promise((resolve) => {
    let flag = false;
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = src;
    const finished = () => {
      if (!flag && (!this.readyState || this.readyState === 'complete')) {
        flag = true;
        resolve();
      }
    };

    el.onload = finished;
    el.onreadystatechange = finished;

    const t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(el, t);
  });
}

export default CatchError;
