'use strict';
import Discord from 'discord.js';
import inquirer, { Answers } from 'inquirer';

class Choices {
    static getToken = (): Promise<string> => inquirer.prompt([
        {
            type: 'input',
            name: 'token',
            message: 'Please paste in your bot token:'
        }
    ]).then((answer: Answers) => answer.token as string);

    static getGuild = (guilds: Discord.Collection<Discord.Snowflake, Discord.Guild>): Promise<string> => inquirer.prompt([
        {
            type: 'list',
            name: 'guild',
            message: 'Which server do you want to run on?',
            choices: guilds.map(g => ({ name: g.name, value: g.id }))
        }
    ]).then((answer: Answers) => answer.guild as string);

    static getChannel = (channels: Discord.Collection<Discord.Snowflake, Discord.GuildBasedChannel>): Promise<string | boolean> => inquirer.prompt([
        {
            type: 'confirm',
            name: 'channel',
            message: 'Do you want to announce bans in a text channel?'
        }
    ]).then((answer: Answers) => {
        if (answer.channel) {
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'channel',
                    message: 'Which channel do you want to announce in?',
                    choices: channels.map(c => ({ name: `#${c.name}`, value: c.id }))
                }
            ]).then((answer: Answers) => answer.channel as string);
        } else
            return false;
    });

    static getDelay = (): Promise<string> => inquirer.prompt([
        {
            type: 'input',
            name: 'delay',
            message: 'How frequent do you want to check the bin folder (in seconds)?',
            validate: (input: string) => {
                const isValidNumber = /^\d+$/.test(input);
                return isValidNumber ? true : 'Please enter a valid number';
            }
        }
    ]).then((answer: Answers) => answer.delay as string);

    static confirmCorrect = (): Promise<boolean> => inquirer.prompt([
        {
            type: 'confirm',
            name: 'correct',
            message: 'Are all these details correct?'
        }
    ]).then((answer: Answers) => answer.correct as boolean);
}

export default Choices;