const { EventEmitter } = require('./src/classes/events')
const { Client } = require('discord.js')
global.events = new EventEmitter()
require('dotenv').config()
const client = new Client()
const { RecyclingBin } = require('./src/classes/bin')
const bin = new RecyclingBin()

if (!process.env.TOKEN)
    throw new Error('Please set a bot token in the \'.env\' file')

client.on('ready', () => {
    if (!client.guilds.cache.get(process.env.GUILD))
        throw new Error('Please set a valid guild id in the \'.env\' file')
    console.log(`Logged in as ${client.user.tag}`)
    bin.activate()
})

events.on('file', async file => {
    await client.guilds.cache.get(process.env.GUILD).members.fetch()
    let guild = client.guilds.cache.get(process.env.GUILD),
        user = client.users.cache.find(u => u.avatar === file.name)

    if (user) {
        await guild.members.cache.get(user.id).ban({
            reason: (process.env.REASON || 'You have been Recycled by Recycle-Bot'),
            days: ((process.env.DELETE_MESSAGES.toLowerCase() === 'true') ? 7 : 0)
        })
    } else throw new Error('Unknown User')
})

client.login(process.env.TOKEN).then(() => {
    console.log('Starting Discord Bot')
})