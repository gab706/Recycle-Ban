module.exports.EventEmitter = class {
    constructor() {
        this._events = {}
    }

    on(event, listener) {
        if (!this._events[event])
            this._events[event] = []
        this._events[event].push(listener)
    }

    emit(event, data) {
        if (this._events[event]) {
            let callbacks = (callback) => {
                callback(data)
            }
            this._events[event].forEach(callbacks)
        }
    }
}