import requiredProp from '~/utils/requiredProp';

import Pane from '~/view/Pane';

// Panes
import Messages from '~/view/panes/Messages';
import Menu from '~/view/panes/Menu';

// Components
import MapView from '~/view/components/data/MapView';
import ItemsView from '~/view/components/data/ItemsView';
import TrapsView from '~/view/components/data/TrapsView';
import DijkstraMapView from '~/view/components/data/DijkstraMapView';
import ActorsView from '~/view/components/data/ActorsView';
import MapControls from '~/view/components/MapControls';

import GameStatusModal from '~/view/components/GameStatusModal';

import { GAME_WIDTH, GAME_HEIGHT } from '~/constants';

export default ({
    store = requiredProp('store'),
    renderer = requiredProp('renderer'),
    controller = requiredProp('controller'),
}) => {
    const view = new Pane({
        x: 0,
        y: 0,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        children: [
            // Panes
            Messages(),

            // Components
            MapView(),
            TrapsView(),
            ItemsView(),
            DijkstraMapView(),
            ActorsView(),
            MapControls(store),
            GameStatusModal(),
        ],
    });

    store.listen((newState) => {
        view.onStateChange(newState);
        view.render({ offsetX: 0, offsetY: 0 });
        view.blit({ renderer });
    });

    const mouseEvents = ['mousedown', 'mouseup', 'mouseenter'];
    mouseEvents.forEach(eventName =>
        controller.mouse.on({ eventName, callback: view.handleMouseEvent }),
    );

    return view;
}
