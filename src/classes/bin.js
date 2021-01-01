const { hostname } = require('os')
const { exec } = require('child_process')

module.exports.RecyclingBin = class {
    constructor() {
        this.computer = hostname().replace('.local', '')
        this.trashFolder = `/Users/${this.computer}/Library/Mobile\\ Documents/com\\~apple\\~CloudDocs/.Trash`
    }

    activate() {
        let trashFolder = this.trashFolder
        setInterval(function() {
            exec(`cd ${trashFolder} && ls`, async(error, stdout) => {
                if (error) throw new Error(error.message)
                else {
                    let files = stdout.split('\n').filter(f => f !== '')
                    for (let file of files) {
                        if (file.endsWith('.webp') || file.endsWith('.gif')) {
                            events.emit('file', {
                                name: file.replace(/.webp|.gif/, ''),
                                path: {
                                    absolute: file,
                                    dir: `${trashFolder}/${file}`
                                }
                            })
                            exec(`rm -rf ${trashFolder}/${file}`, async(error) => {
                                if (error) throw new Error(error.message)
                            })
                        }
                    }
                }
            })
        }, 2000)
    }
}