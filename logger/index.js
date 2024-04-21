// Node
import fs from 'fs/promises';
import path from 'path';

// Constants
import { rootDir } from '#constants.cjs';

class Logger {
    constructor() {
        this.logFilePath = path.join(rootDir, 'logs', 'data.log');
    }

    async init() {
        if (!fs?.writeFile) {
            console.warn('[logger]: Unexpected error - fs missing');
        }

        try {
            const startMessage = `FILE SERVER LOGS SINCE: ${this._getDateString()}\n`;
            await fs.writeFile(this.logFilePath, startMessage);
        } catch (err) {
            console.warn(`[logger]: ${err}`);
        }
    }

    async error(message = '', placement = '') {
        await this.log(message, placement, 'ERROR');
    }

    async log(message = '', placement = '', status = 'INFO') {
        let newLog = `${this._getDateString()} - [${status}]`;
        newLog += placement ? `|(${placement})` : '';
        newLog += `: ${message}`;

        console.log(newLog);
        await this._addLine(newLog);
    }

    async _addLine(line = '') {
        try {
            await fs.appendFile(this.logFilePath, `\n${line}`);
        } catch (err) {
            console.warn(`[logger]: ${err}`);
        }
    }

    _getDateString() {
        let result = new Date();
        result = result.toISOString().replaceAll('T', ' ');
        result = result.slice(0, result.indexOf('.'));

        return result;
    }
}

export default new Logger();
