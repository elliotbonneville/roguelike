import { generate as generateId } from 'shortid';

import rectangle from '~/utils/rectangle';

import toolTypes from '~/controller/tools/toolTypes';

import { selectors as mouseSelectors } from '~/model/features/ui/mouse';
import { selectors as modeSelectors } from '~/model/features/ui/mode';

import createTraps from '~/model/features/traps/createTraps.action';
import trapDefinitions from '~/model/data/traps/definitions';

export const menu = {
    title: 'Traps',
    mode: toolTypes.TRAP,
    children: Object.keys(trapDefinitions).map(name => ({
        title: name,
        mode: name,
    })),
}

export const mouseListeners = {
    mouseup: [
        ({ store, location }) => {
            const state = store.getState();
            const selectionBounds = rectangle(
                mouseSelectors.selectionBounds(state),
            );
            const trapType = modeSelectors.getMode(state)[0];

            const traps = selectionBounds.reduce(
                (actions, position) => [
                    ...actions,
                    { id: generateId(), position, trapType },
                ],
                [],
            );
            store.dispatch(createTraps(traps));
        },
    ],
};;
