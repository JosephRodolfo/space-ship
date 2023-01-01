export interface Timer {
    running: boolean,
    iv: number,
    timeout: number,
    cb: Function,
    start: Function,
    execute: Function,
    stop: Function,
    set_interval: Function,
}

export const timer: Timer = {
    running: false,
    iv: 100,
    timeout: 0,
    cb: function () {},
    start: function (cb: Function, iv: number) {
      let elm = this;
      clearInterval(this.timeout);
      this.running = true;
      if (cb) this.cb = cb;
      if (iv) this.iv = iv;
      this.timeout = setTimeout(function () {
        elm.execute(elm);
      }, this.iv);
    },
    execute: function (e: { running: boolean; cb: () => void; start: () => void; }) {
      if (!e.running) return false;
      e.cb();
      e.start();
    },
    stop: function () {
      this.running = false;
    },
    set_interval: function (iv: number) {
      clearInterval(this.timeout);
      this.start(false, iv);
    },
  };