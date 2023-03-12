 interface TimerInterface {
  running: boolean,
  iv: number,
  timeout: number,
  cb: Function | boolean,
  start: Function,
}

export class Timer implements TimerInterface {
  constructor() { }
  running: boolean = false;
  iv: number = 100;
  timeout: number = 0;
  cb: Function = () => { };
  start(cb?: Function, iv?: number) {
    let elm = this;
    clearInterval(this.timeout);
    this.running = true;
    if (cb) this.cb = cb;
    if (iv) this.iv = iv;
    this.timeout = setTimeout(function () {
      elm.execute(elm);
    }, this.iv);
  };
  execute(e: Timer) {
    if (!e.running) return false;
    e.cb();
    e.start();
  };
  stop() {
    this.running = false;
  };
  set_interval(iv: number) {
    clearInterval(this.timeout);
    this.start(undefined, iv);
  };
};