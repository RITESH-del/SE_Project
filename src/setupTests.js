import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill window.matchMedia for MantineProvider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Polyfill ResizeObserver for Mantine and Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill scrollTo for jsdom
window.scrollTo = jest.fn();

if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };
}

// Mock Recharts ResponsiveContainer to render children reliably in JSDOM
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => (
      <div className="recharts-responsive-container" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  };
});
