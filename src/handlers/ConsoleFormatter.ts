'use strict';
import figlet from 'figlet';

class ConsoleFormatting {
    private static TEXT_COLOUR: { [key: string]: string } = {
        red: '\x1b[91m',
        green: '\x1b[92m',
        yellow: '\x1b[93m',
        blue: '\x1b[94m',
        purple: '\x1b[95m',
        cyan: '\x1b[96m',
        white: '\x1b[97m',
    };

    private static TEXT_FORMAT: { [key: string]: string } = {
        bold: '\x1b[1m',
        italic: '\x1b[3m',
        underline: '\x1b[4m',
        blink: '\x1b[5m',
        invert: '\x1b[7m',
    };

    private static RESET: string = '\x1b[0m';


    private static isColour(colour: string): colour is string {
        return Object.keys(ConsoleFormatting.TEXT_COLOUR).includes(colour.toLowerCase());
    }

    private static isStyle(style: string): style is string {
        return Object.keys(ConsoleFormatting.TEXT_FORMAT).includes(style.toLowerCase());
    }

    public static clear() {
        process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc');
    }

    public static colourise(text: string, colour?: string, styles?: string[]): string {
        const colourCode: string = colour && this.isColour(colour) ? this.TEXT_COLOUR[colour.toLowerCase()] : '';
        const styleCodes: string = (styles || []).map((style) => this.isStyle(style) ?
            this.TEXT_FORMAT[style.toLowerCase()] :
            '').join('');
        return `${colourCode}${styleCodes}${text}${this.RESET}`;
    }

    public static printCredits(clear: boolean): void {
        clear && this.clear();
        figlet('RecycleBan', (ignored, logo: string | undefined) => {
            const credits = this.colourise(
                '    === ' +
                `${this.colourise('RecycleBan v' + process.env.VERSION, 'blue')}` +
                `${this.colourise(' ===', 'yellow')}\n` +
                `${this.colourise('    === Made by ', 'yellow')}` +
                `${this.colourise('Gabriel Esposito ===', 'yellow')}`,
                'yellow');
            console.log(`${this.colourise(logo!!, 'blue')} \n ${credits} \n`);
        });
    }
}

export default ConsoleFormatting;