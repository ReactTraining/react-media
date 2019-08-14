export default class MediaQueryList {
  constructor(targetWindow, query, listener) {
    this.nativeMediaQueryList = targetWindow.matchMedia(query);
    this.active = true;
    // Safari doesn't clear up listener with removeListener
    // when the listener is already waiting in the event queue.
    // Having an active flag to make sure the listener is not called
    // after we removeListener.
    this.cancellableListener = (...args) => {
      this.matches = this.nativeMediaQueryList.matches;
      if (this.active) {
        listener(...args);
      }
    };
    this.nativeMediaQueryList.addEventListener("change", this.cancellableListener);
    this.matches = this.nativeMediaQueryList.matches;
  }

  cancel() {
    this.active = false;
    this.nativeMediaQueryList.removeEventListener("change", this.cancellableListener);
  }
}
