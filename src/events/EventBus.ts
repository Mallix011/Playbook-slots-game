export type GameEvent = {
  type:
    | "SPIN_REQUESTED"
    | "SPIN_STARTED"
    | "SPIN_STOPPED"
    | "WIN_DETECTED"
    | "GAME_INITIALIZED";
  data?: any;
};

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Array<(data?: any) => void>> = new Map();

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(eventType: string, callback: (data?: any) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: (data?: any) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: GameEvent): void {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(event.data));
    }
  }
}

export const eventBus = EventBus.getInstance();
