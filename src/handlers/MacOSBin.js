'use strict';
const { hostname } = require('os');
const { execSync } = require('child_process');

class MacOSBin {
    constructor() {
        this.machine = hostname().replace('.local', '');
        this.binFolder = `/Users/${this.machine}/Library/Mobile\\ Documents/com\\~apple\\~CloudDocs/.Trash`;
    }

    cycleBin() {
        const dir = execSync(`ls ${this.binFolder}`).toString();
        const files = [];
        for (const file of dir.split('\n').filter(f => f !== ''))
            if (file.endsWith('.webp') || file.endsWith('.gif') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
                files.push(file);
        return files;
    }

    deleteFiles(files) {
        execSync(`rm -rf ${files.map(f => `${this.binFolder}/${f}`).join(' ')}`);
    }
}

module.exports = MacOSBin;