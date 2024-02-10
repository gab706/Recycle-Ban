'use strict';
import { execSync } from 'child_process';
import EventHandler from './EventHandler';

class FileHandler extends EventHandler {
    private readonly batScript: string = '../scripts/windows.sh';
    private readonly bashScript: string = '../scripts/darwin.sh 2>/dev/null';

    constructor(delay: number) {
        super();

        setInterval(() => {
            const avatarArray = this.cycleHandler();
            if (avatarArray.length > 0)
                this.emit('file', avatarArray);
        }, delay * 1000);
    }

    private cycleHandler(): string[] {
        const isWindows = process.platform === 'win32';
        const scriptPath = isWindows ? this.batScript : this.bashScript;

        try {
            const output = execSync(
                `${isWindows ? 'cmd /c' : 'bash'} ${scriptPath}`,
                { encoding: 'utf-8' });

            return output.startsWith('SUCCESS:')
                ? output.split('\n').filter(l => l !== '' && l !== 'SUCCESS:')
                : [];
        } catch (error: any) {
            console.log(error.message);
            return [];
        }
    }
}

export default FileHandler;