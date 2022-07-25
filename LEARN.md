# Recycle Ban
![Man taking out the Trash](https://static01.nyt.com/images/2017/12/29/style/31FIRSTPERSON-TRASH/merlin_131324395_cb0a9257-7185-452b-b7d4-836eb4f76fcc-superJumbo.jpg)
**What is it?**: Recycle Ban is a project I built almost 2 years ago from a project I saw on Reddit, basically it's a Discord bot that allows me to ban people from my server just by dragging their avatar from Discord into my Bin on my computer.

**How does it work?**: I spent a lot of time trying to figure out to make this bot work, while you can view code samples below, the simple explanation is, the Bin is a folder on my computer, all I had to do was grab a list of every file in my Bin folder, once I had a list of all the folders I could use the Discord API to then search for the user in which the avatar belonged to and ban them from the server using Discord API.

# Run Information
 - OS: `MacOS Big Sur v11.6`
 - Environment: `Node.JS v16.15.0`
 - **Dependencies**
	 - `discord.js v14.0.3`
	 - `dotenv v16.0.1`

# The Code

You can view some important code samples for how I access the recycle bin and how to I transfer that information to Discord API below.


**File**: `MacOSBin.js`
**Description**: This is one part of the bin file, in this file I am defining a class, in this class I have two properties, one property is the name for my machine, and the other property is the location of the Bin file.
```javascript
constructor() {
	this.machine = hostname().replace('.local', '');
	this.binFolder = `/Users/${this.machine}/Library/Mobile\\ Documents/com\\~apple\\~CloudDocs/.Trash`;
}
```

**File**: `MacOSBin.js`
**Description**: This is another part of the bin file, this part of the file is simply a function that runs a Linux command to list all the files in the Bin, if the file ends with either .wepb, .gif, .png, .jpg or .jpeg, it adds the file name to an array.
```javascript
cycleBin() {
	const dir = execSync(`ls ${this.binFolder}`).toString();
	const files = [];
	for (const file of dir.split('\n').filter(f => f !== ''))
		if (file.endsWith('.webp') || file.endsWith('.gif') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
			files.push(file);
	return files;
}
```

**File**: `index.js`
**Description**: This is the main file for the program, basically when I get a response from the Discord API saying my bot is logged in, I start an interval (which is predefined in my config), every time the interval loops I run my `cycleBin` function and take the array of avatars, from then I run it through a function named `banUserByAvatar`, which you can see bellow, and then if that function returns `true`, then I run a function to delete the avatar file out of my Bin forever.
```javascript
RecycleBotManager.once('ready', () => {
	const RecycleBinManager = new MacOSBin();
	setInterval(async() => {
		const activeFiles = [];
		for (const avatar of RecycleBinManager.cycleBin()) {
			const isUserBanned = await RecycleBotManager.banUserByAvatar(avatar.split('.')[0]);
			isUserBanned && activeFiles.push(avatar);
		}
		RecycleBinManager.deleteFiles(activeFiles);
	}, config.bin.check_interval * 1000);
});
```

**File**: `Recycle.js`
**Description**: This is the function I talked about bellow, all it does is take an avatar ID and use the Discord API to find which user the avatar belongs to, basically what I am saying is the actual avatar file does not matter, all that matters is the ID assigned to that file (it's in the file name). I then ban the user that is found and post in a channel (that is predefined) that the user was banned.
```javascript
async banUserByAvatar(avatar) {
	const guild = this.guilds.cache.get(config.guild.id),
	channel = guild.channels.cache.get(config.guild.channel),
	user = guild.members.cache.find(u => u.user.avatar === avatar);
	if (user && user.bannable) {
		await user.ban({ reason: 'Trashed by Recycle BAN!!!', deleteMessageDays: 7 });
		if (channel.type === 0)
			await channel.send(`:recycle: ${user} has been Trashed :wastebasket: by **Recycle BAN!** `);
	}
	return (user && user.bannable);
}
```
