'use strict';
import async from 'async';
import chalk from 'chalk';
import { Spinner } from 'cli-spinner';

import Utilities from '../src/handlers/Utilities';
import Choices from '../src/handlers/Choices';

async.waterfall([
    (callback: any) => {
        Utilities.printCredits((err: any, ascii: any) => {
            if (err)
                throw err;
            console.log(ascii);
            callback(null);
        });
    },
    (callback: (arg0: null) => void) => {
        Choices.areUReady(callback);
    },
]);