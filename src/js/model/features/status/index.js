import { createReducer } from '~/model/utils';

import win from './win.reducer';
import lose from './lose.reducer';
import enterDebug from './enterDebug.reducer';
import leaveDebug from './leaveDebug.reducer';

import { WIN, LOSE, ENTER_DEBUG, LEAVE_DEBUG } from './types';

export default createReducer(
    {
        gameStatus: 'playing',
        message: '',
        debugging: false,
    },
    {
        [WIN]: win,
        [LOSE]: lose,
        [ENTER_DEBUG]: enterDebug,
        [LEAVE_DEBUG]: leaveDebug,
    },
);
