'use strict';
import inquirer, { Answers } from 'inquirer';
import chalk from 'chalk';

class Choices {
    static areUReady(callback: (arg0: null) => void) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'ready',
                message: 'Are you ready to start?',
                choices: ['Yes', new inquirer.Separator(), 'No']
            }
        ]).then(({ ready }: Answers) => {
            if (ready === 'Yes')
                callback(null);
            else {
                console.log(chalk.bold.green('See Ya :)'));
                process.exit(0)
            }
        });
    }

    static getToken(callback: (token: string) => void) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Please paste in your bot token:'
            }
        ]).then(({ token }: Answers) => callback(token));
    }

    static getGuild(callback: (guild: string) => void) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'guild',
                message: 'Please paste in the ID for the server you want to run on:'
            }
        ]).then(({ guild }: Answers) => callback(guild));
    }

    static getChannel(callback: (channel: string | null) => void) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'secret',
                message: 'Do you want to announce bans in a text channel?',
                choices: ['Yes', new inquirer.Separator(), 'No']
            }
        ]).then(({ secret }: Answers) => {
            if (secret === 'Yes')
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'channel',
                        message: 'Please paste in the ID for the channel you want to announce in:'
                    }
                ]).then(({ channel }: Answers) => callback(channel));
            else {
                console.log(chalk.bold.red('Bans Announced ⛔'))
                callback(null);
            }
        });
    }

    static getDelay(callback: (delay: string) => void) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'delay',
                message: 'How frequent do you want to check the bin folder (in seconds):'
            }
        ]).then(({ delay }: Answers) => callback(delay));
    }
}

export default Choices;