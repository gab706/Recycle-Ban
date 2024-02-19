'use strict';
import { execSync } from 'child_process';
import path from 'path';

type EventMap = Record<string, Array<(...args: any[]) => void>>;

class FileHandler {
    private readonly batScript: string = path.resolve('../src/scripts/windows.bat');
    private readonly bashScript: string = path.resolve('../src/scripts/darwin.sh');

    private readonly events: EventMap;

    public delay: number = 0;

    constructor() {
        this.events = {};
    }

    public startCycleHandler(): void {
        const isWindows: boolean = process.platform === 'win32';
        const scriptPath: string = isWindows ? this.batScript : this.bashScript;

        setInterval(() => {
            try {
                const output: string = execSync(
                    `${isWindows ? 'cmd /c' : `chmod +x ${scriptPath} && bash`} ${scriptPath}`,
                    { encoding: 'utf-8' });

                const avatarArray = output.startsWith('SUCCESS:')
                    ? output.split('\n').filter(l => l !== '' && l !== 'SUCCESS:')
                    : [];

                if (avatarArray.length > 0)
                    this.emit('file', avatarArray);
            } catch (error: any) {
                console.log(error);
            }
        }, this.delay * 1000);
    }

    public on<T extends any[]>(event: string, listener: (...args: T) => void): void {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(listener as (...args: any[]) => void);
    }

    private emit<T extends any[]>(event: string, ...args: T): void {
        const listeners = this.events[event];
        if (listeners)
            for (const listener of listeners)
                listener(...args);
    }
}

export default FileHandler;