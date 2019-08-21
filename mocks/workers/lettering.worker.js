import runLetteringAction from "@WORKERS/lettering";

export default class LetteringWorker {
  constructor() {
    // should be overwritten by client code
    this.onmessage = () => { };
  }

  // mock expects data: { } instead of e: { data: { } }
  postMessage(data) {
    // actual worker implementation wraps argument arg into { data: arg },
    // so the mock needs to fake it 
    this.onmessage({ data: runLetteringAction(data) });
  }
}
