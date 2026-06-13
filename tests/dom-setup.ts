import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/'
});

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  HTMLButtonElement: dom.window.HTMLButtonElement,
  HTMLImageElement: dom.window.HTMLImageElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  DocumentFragment: dom.window.DocumentFragment,
  NodeFilter: dom.window.NodeFilter,
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  FocusEvent: dom.window.FocusEvent,
  MutationEvent: dom.window.MutationEvent,
  MutationObserver: dom.window.MutationObserver,
  KeyboardEvent: dom.window.KeyboardEvent,
  MouseEvent: dom.window.MouseEvent,
  getComputedStyle: dom.window.getComputedStyle,
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(callback, 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id)
});

class TestPointerEvent extends dom.window.MouseEvent {
  pointerId = 1;
  pointerType = 'mouse';
}

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class TestIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.assign(globalThis, {
  PointerEvent: TestPointerEvent,
  ResizeObserver: TestResizeObserver,
  IntersectionObserver: TestIntersectionObserver
});
Object.assign(dom.window, {
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  FocusEvent: dom.window.FocusEvent,
  MutationEvent: dom.window.MutationEvent,
  PointerEvent: TestPointerEvent,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  ResizeObserver: TestResizeObserver,
  IntersectionObserver: TestIntersectionObserver
});

Object.defineProperty(dom.window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value() {}
});
Object.defineProperty(dom.window.HTMLElement.prototype, 'hasPointerCapture', {
  configurable: true,
  value() {
    return false;
  }
});
Object.defineProperty(dom.window.HTMLElement.prototype, 'setPointerCapture', {
  configurable: true,
  value() {}
});
Object.defineProperty(dom.window.HTMLElement.prototype, 'releasePointerCapture', {
  configurable: true,
  value() {}
});
