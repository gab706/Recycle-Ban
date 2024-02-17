'use strict';

enum Colour {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    BLUE = 'blue',
    PURPLE = 'purple',
    CYAN = 'cyan',
    WHITE = 'white',
}

enum Style {
    BOLD = 'bold',
    ITALIC = 'italic',
    UNDERLINE = 'underline',
    BLINK = 'blink',
    INVERT = 'invert',
}

class ConsoleFormatter {
    private static TEXT_COLOUR: { [key in Colour]: string } = {
        [Colour.RED]: '\x1b[91m',
        [Colour.GREEN]: '\x1b[92m',
        [Colour.YELLOW]: '\x1b[93m',
        [Colour.BLUE]: '\x1b[94m',
        [Colour.PURPLE]: '\x1b[95m',
        [Colour.CYAN]: '\x1b[96m',
        [Colour.WHITE]: '\x1b[97m',
    };

    private static TEXT_FORMAT: { [key in Style]: string } = {
        [Style.BOLD]: '\x1b[1m',
        [Style.ITALIC]: '\x1b[3m',
        [Style.UNDERLINE]: '\x1b[4m',
        [Style.BLINK]: '\x1b[5m',
        [Style.INVERT]: '\x1b[7m',
    };

    private static RESET: string = '\x1b[0m';

    private static isColour(colour: string): colour is Colour {
        return (Object.values(Colour) as string[]).includes(colour);
    }

    private static isStyle(style: string): style is Style {
        return (Object.values(Style) as string[]).includes(style);
    }

    static colourise(text: string, colour?: Colour, styles?: Style[]): string {
        const colourCode: string = colour && this.isColour(colour) ? this.TEXT_COLOUR[colour] : '';
        const styleCodes: string = (styles || []).map((style) => this.isStyle(style) ? this.TEXT_FORMAT[style] : '').join('');
        return `${colourCode}${styleCodes}${text}${this.RESET}`;
    }

    static logEvent(text: string, eventType: string): void {
        const formattedTimestamp = this.colourise(new Date().toLocaleTimeString(), Colour.YELLOW);
        const eventColor = { 'INFO': Colour.GREEN, 'ERROR': Colour.RED, 'WARNING': Colour.YELLOW }[eventType.toUpperCase()] || Colour.WHITE;
        const formattedEventType = this.colourise(eventType, eventColor, [Style.BOLD]);
        const formattedMessage = this.colourise(text, Colour.WHITE);
        console.log(`${formattedTimestamp} ${formattedEventType}: ${formattedMessage}`);
    }
}

export default ConsoleFormatter;