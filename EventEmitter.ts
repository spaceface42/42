/**
 * EventEmitter v1.2.1
 */
class EventEmitter {
    static readonly VERSION = '1.2.1';
    private listeners: { [key: string]: Array<(data?: any) => void> } = {};

    on(event: string, callback: (data?: any) => void): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        
        // Return a function to remove this listener
        return () => {
            const eventListeners = this.listeners[event];
            if (eventListeners) {
                this.listeners[event] = eventListeners.filter(cb => cb !== callback);
            }
        };
    }

    emit(event: string, data?: any): void {
        const callbacks = this.listeners[event];
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
}

export default EventEmitter;