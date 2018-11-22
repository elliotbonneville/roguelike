import { MAP_WIDTH, MAP_HEIGHT } from '~/constants';

import rectangle from '~/utils/rectangle';

import Component from '~/view/Component';
import Cell from '~/view/Cell';

import {
    actions as mouseActions,
    selectors as mouseSelectors,
} from '~/model/features/ui/mouse/';

import { selectors as modeSelectors } from '~/model/features/ui/mode';
import { getDebugging } from '~/model/features/status/selectors';

export default store => new Component({
    x: 0,
    y: 0,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    selectState: (state) => ({
        mouseDown: mouseSelectors.mouseDown(state),
        mousePosition: mouseSelectors.mousePosition(state),
        selectionBounds: rectangle(mouseSelectors.getSelectionBounds(state)),
        activeTool: modeSelectors.getActiveTool(state),
        debugging: getDebugging(state),
    }),
    mouseListeners: {
        mousedown: [
            function({ location }) {
                store.dispatch(
                    mouseActions.setMouseDown({ mousePosition: location }),
                );
            },
        ],
        mouseup: [
            function ({ location }) {
                const { activeTool } = this.state;
                if (activeTool && activeTool.mouseListeners) {
                    const { mouseup } = activeTool.mouseListeners;
                    mouseup.forEach(
                        listener => listener({ store, location }),
                    );
                }

                store.dispatch(
                    mouseActions.setMouseUp({ mousePosition: location }),
                ); 
            }
        ],
        mouseenter: [
            function ({ location }) {
                if (!this.state.mouseDown) return;
                store.dispatch(
                    mouseActions.setMousePosition({ mousePosition: location }),
                );
            }
        ],
    },
    render() {
        if (!this.state.debugging) return;
        return this.state.selectionBounds.reduce(
            (cells, { x, y }) => Object.assign(
                cells,
                {
                    [`${x},${y}`]: new Cell({
                        x,
                        y,
                        backgroundColor: 'gray',
                    }),
                },
            ),
            {},
        );
    },
});
