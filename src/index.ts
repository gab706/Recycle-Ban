'use strict';
import async from 'async';
import fs from 'fs';
import path from 'path';

import ClientHandler from './handlers/ClientHandler.js';
import FileHandler from './handlers/FileHandler.js';
import CF from './handlers/ConsoleFormatter.js';
import Choices from './handlers/Choices.js';

const Client = new ClientHandler();
const Files = new FileHandler();

async.waterfall([
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        const sourceDir = path.resolve('../../src/');
        const targetDir = path.resolve('./');
        fs.mkdirSync(`${targetDir}/scripts`, { recursive: true });
        fs.readdirSync(`${sourceDir}/scripts`).forEach(file =>
            fs.copyFileSync(`${sourceDir}/scripts/${file}`, `${targetDir}/scripts/${file}`));
        callback(null);
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        try {
            await Client.checkOnline();
            callback(null);
        } catch (error) {
            callback(new Error('You need an internet connection to run this program'));
        }
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        try {
            await Client.setToken(await Choices.getToken());
            callback(null);
        } catch (error) {
            callback(new Error('Token is NOT valid'));
        }
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        try {
            await Client.guilds.fetch();
            await Client.setGuildID(await Choices.getGuild(Client.guilds.cache));
            callback(null);
        } catch (error) {
            callback(new Error(`Server is NOT valid OR ${Client.user?.tag} is not on it`));
        }
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        try {
            await Client.guild!.channels.fetch();
            const channel = await Choices.getChannel(Client.guild!.channels.cache.filter(c => c.type === 0));
            if (channel)
                await Client.setChannelID(channel as string);
            callback(null);
        } catch (error) {
            callback(new Error(`Channel is NOT valid OR ${Client.user?.tag} does not have access`));
        }
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);
        try {
            Files.delay = parseInt(await Choices.getDelay());
            callback(null);
        } catch (error) {
            callback(new Error('The delay must be a number'));
        }
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);

        console.log(`${CF.colourise('Bot: ', 'cyan', ['bold'])}${Client.user?.tag}`);
        console.log(`${CF.colourise('Server: ', 'cyan', ['bold'])}${Client.guild?.name}`);
        console.log(`${CF.colourise('Channel: ', 'cyan', ['bold'])}${Client.channel ? `#${Client.channel.name}` : '🚫'}`);
        console.log(`${CF.colourise('Delay: ', 'cyan', ['bold'])}${Files.delay}\n`);

        await Choices.confirmCorrect() ?
            callback(null) :
            callback(new Error('You have not confirmed the details are correct'));
    },
    async (callback: (arg0: Error | null) => void) => {
        CF.printCredits(true);

        Files.startCycleHandler();
        Files.on('file', (files: string[]) => {
            files.forEach((file: string) =>
                Client.banUserByAvatar(path.basename(file, path.extname(file))));
        });
    }
], async(err) => {
    if (err) {
        Client.logEvent(err.message, 'error', false);
        process.exit(1);
    }
});