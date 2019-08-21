import runLetteringAction from "./lettering";

self.onmessage = async function (e) {
  self.postMessage(runLetteringAction(e.data));
};