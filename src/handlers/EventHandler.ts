'use strict';

type EventMap = Record<string, Array<(...args: any[]) => void>>;

class EventHandler {
    private readonly events: EventMap;

    constructor() {
        this.events = {};
    }

    on<T extends any[]>(event: string, listener: (...args: T) => void): void {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(listener as (...args: any[]) => void);
    }

    emit<T extends any[]>(event: string, ...args: T): void {
        const listeners = this.events[event];
        if (listeners)
            for (const listener of listeners)
                listener(...args);
    }
}

export default EventHandler;