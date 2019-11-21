const createListener = (nativeMediaQueryList, matches, active, listener) => (...args) => {
  matches = nativeMediaQueryList.matches;
  if (active) {
    listener(...args);
  }
}

export default class MediaQueryListener {
  constructor(targetWindow, query, listener) {
    this.nativeMediaQueryList = targetWindow.matchMedia(query);
    this.active = true;
    // Safari doesn't clear up listener with removeListener
    // when the listener is already waiting in the event queue.
    // Having an active flag to make sure the listener is not called
    // after we removeListener.
    this.cancellableListener = createListener(this.nativeMediaQueryList, this.matches, this.active, listener);
    this.nativeMediaQueryList.addListener(this.cancellableListener);
    this.matches = this.nativeMediaQueryList.matches;
  }

  cancel() {
    this.active = false;
    this.nativeMediaQueryList.removeListener(this.cancellableListener);
  }
}
