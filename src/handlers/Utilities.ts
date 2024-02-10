'use strict';
import figlet from 'figlet';
import chalk from 'chalk';
import pkg from '../../package.json';

export function printCredits(callback: any) {
    figlet('RecycleBan', (err: any, logo) => {
        if (err)
            throw new Error(err);

        const credits = chalk.yellow(`     === Ban People simply by dragging them into the bin (${chalk.blue('RecycleBan v' + pkg.version)}) ===\n ${chalk.yellow('     Made by ')} ${chalk.blue('Gabriel Esposito')} ===`)
        callback(null, `${chalk.blue(logo)} \n ${credits} \n\n`)
    });
}

export function isOnline(callback: any) {
    require('dns').lookup('google.com', (err: any) => {
        err && err.code === 'ENOTFOUND' ?
            callback(null, false) :
            callback(null, true);
    });
}

const Utilities = {
    printCredits,
    isOnline
};

export default Utilities;