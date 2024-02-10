'use strict';
import inquirer from 'inquirer';
import chalk from 'chalk';

class Choices {
    private static _callback: any;

    static areUReady(callback: (arg0: null) => void) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'ready',
                message: 'Are you ready to start?',
                choices: ['Yes', new inquirer.Separator(), 'No']
            }
        ]).then(({ ready }) => {
            if (ready === 'Yes')
                callback(null);
            else {
                console.log(chalk.bold.green('See Ya :)'));
                process.exit(0)
            }
        });
    }

    static getToken(callback: any) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Please paste in your bot token:'
            }
        ]).then(({ token }) => callback(token));
    }

    static getGuild(callback: any) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'guild',
                message: 'Please paste in the ID for the server you want to run on:'
            }
        ]).then(({ guild }) => callback(guild));
    }

    static getChannel(callback: any) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'secret',
                message: 'Do you want to announce bans in a text channel?',
                choices: ['Yes', new inquirer.Separator(), 'No']
            }
        ]).then(({ ready }) => {
            if (ready === 'Yes')
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'channel',
                        message: 'Please paste in the ID for the channel you want to announce in:'
                    }
                ]).then(({ channel }) => callback(channel));
            else {
                console.log(chalk.bold.red('Bans Announced ⛔'))
                callback(null);
            }
        });
    }

    static getDelay(callback: any) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'delay',
                message: 'How frequent do you want to check the bin folder (in seconds):'
            }
        ]).then(({ delay }) => callback(delay));
    }
}

export default Choices;