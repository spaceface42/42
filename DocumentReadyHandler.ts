type DocumentReadyState = 'loading' | 'interactive' | 'complete';

class DocumentReadyHandler {
    static readonly VERSION = '1.2.2';
    readonly ready: Promise<void>;
    private timeoutId: number | null = null;
    
    constructor(document: Document = window.document, timeout: number = 10000) {
        this.ready = this.initPromise(document, timeout);
    }
    
    private initPromise(document: Document, timeout: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.isDomReady(document.readyState)) {
                resolve();
            } else {
                const onReady = () => {
                    this.cleanup(document, onReady);
                    resolve();
                };
                
                document.addEventListener('DOMContentLoaded', onReady);
                
                this.timeoutId = window.setTimeout(() => {
                    this.cleanup(document, onReady);
                    reject(new Error('DOM ready timeout'));
                }, timeout);
            }
        });
    }
    
    private isDomReady(state: DocumentReadyState): boolean {
        return state === 'interactive' || state === 'complete';
    }
    
    private cleanup(document: Document, listener: EventListener): void {
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        document.removeEventListener('DOMContentLoaded', listener);
    }
    
    cancel(): void {
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

export default DocumentReadyHandler;