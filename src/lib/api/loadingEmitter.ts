type LoadingListener = (isLoading: boolean) => void;

class LoadingEmitter {
  private activeRequests = 0;
  private listeners: LoadingListener[] = [];

  subscribe(listener: LoadingListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit() {
    const isLoading = this.activeRequests > 0;
    this.listeners.forEach((l) => l(isLoading));
  }

  startRequest() {
    this.activeRequests++;
    this.emit();
  }

  endRequest() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.emit();
  }
}

export const loadingEmitter = new LoadingEmitter();
