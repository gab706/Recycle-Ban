'use strict';
import figlet from 'figlet';
import chalk from 'chalk';
import pkg from '../../package.json';

interface CreditsCallback {
    (err: Error | null, result: string): void;
}

export function printCredits(callback: CreditsCallback): void {
    figlet('RecycleBan', (err: Error | null, logo: string | undefined) => {
        if (err)
            throw new Error(err.message);

        if (logo === undefined) {
            callback(new Error("Failed to generate the logo"), "");
            return;
        }

        const credits = chalk.yellow(`     === Ban People simply by dragging them into the bin (${chalk.blue('RecycleBan v' + pkg.version)}) ===\n ${chalk.yellow('     Made by ')} ${chalk.blue('Gabriel Esposito')} ===`);
        callback(null, `${chalk.blue(logo)} \n ${credits} \n\n`);
    });
}

interface OnlineCallback {
    (err: Error | null, result: boolean): void;
}

export function isOnline(callback: OnlineCallback): void {
    require('dns').lookup('google.com', (err: Error | null) => {
        err && err.message === 'ENOTFOUND' ?
            callback(null, false) :
            callback(null, true);
    });
}

const Utilities = {
    printCredits,
    isOnline
};

export default Utilities;