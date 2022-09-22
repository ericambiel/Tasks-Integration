type ListenerType = (...args: Record<string, unknown>[]) => void;

type EventsType = { [event: string]: ListenerType[] };

export default class EventEmitter {
  private readonly events: EventsType = {};

  public on(event: string, listener: ListenerType): () => void {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }

    this.events[event].push(listener);
    return () => this.removeListener(event, listener);
  }

  public removeListener(event: string, listener: ListenerType): void {
    if (typeof this.events[event] !== 'object') {
      return;
    }

    const idx: number = this.events[event].indexOf(listener);
    if (idx > -1) {
      this.events[event].splice(idx, 1);
    }
  }

  public removeAllListeners(): void {
    Object.keys(this.events).forEach((event: string) =>
      this.events[event].splice(0, this.events[event].length),
    );
  }

  public emit(event: string, ...args: Record<string, unknown>[]): void {
    if (typeof this.events[event] !== 'object') {
      return;
    }

    [...this.events[event]].forEach(listener => listener.apply(this, args));
  }

  public once(event: string, listener: ListenerType): () => void {
    const remove: () => void = this.on(
      event,
      (...args: Record<string, unknown>[]) => {
        remove();
        listener.apply(this, args);
      },
    );

    return remove;
  }
}
