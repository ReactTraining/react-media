export default class MediaQueryList {
  constructor(targetWindow, query, listener) {
    const nativeMediaQueryList = targetWindow.matchMedia(query);
    this.active = true;
    // Safari doesn't clear up listener with removeListener
    // when the listener is already waiting in the event queue.
    // Having an active flag to make sure the listener is not called
    // after we removeListener.
    this.cancellableListener = (...args) => this.active && listener(...args);
    nativeMediaQueryList.addListener(this.cancellableListener);
  }

  cancel() {
    this.active = false;
    this.nativeMediaQueryList.removeListener(this.cancellableListener);
  }
}
