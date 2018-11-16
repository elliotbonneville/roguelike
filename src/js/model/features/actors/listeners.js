import { generate as generateId } from 'shortid';

import { getActorById, getActorsToKill } from './selectors';

import { ACTOR_LEAVE, DAMAGE_ACTOR, CREATE_ACTOR } from './types';

import placeItem from '~/model/features/items/placeItem.action';

import killActor from '~/model/features/actors/killActor.action';
import removeActor from '~/model/features/actors/removeActor.action';
import pickUpItem from '~/model/features/actors/pickUpItem.action';
import dropItem from '~/model/features/actors/dropItem.action';

import lose from '~/model/features/status/lose.action';
import win from '~/model/features/status/win.action';

import setPaused from '~/model/features/time/setPaused.action';

import log from '~/model/features/ui/messages/log.action';

import createItems from '~/model/features/items/createItems.action';
import createItem from '~/model/features/items/utils/createItem';
import generateItem from '~/model/features/items/utils/generateItem';

import actorDefinitions from '~/model/data/actors/definitions';

export default ({ store }) => {
    store.listen((newState, action) => {
        if (action.type === DAMAGE_ACTOR) {
            const state = store.getState();
            getActorsToKill(state).forEach((actor) => {
                actor.inventory.forEach(itemId => {
                    store.dispatch(dropItem({ itemId, actorId: actor.id }));
                    store.dispatch(placeItem({
                        itemId: itemId,
                        position: actor.position,
                    }));
                });


                store.dispatch(removeActor({ id: actor.id }));
                store.dispatch(
                    createItems([
                        {
                            itemType: 'corpse',
                            position: actor.position,
                            id: generateId(),
                        }
                    ]),
                );
            });
        }

        if (action.type === CREATE_ACTOR) {
            const inventory = [];
            let wealth = actorDefinitions[action.actorType].data.baseWealth;
            while (wealth >= 5) {
                const [itemType, itemData] = generateItem(wealth, generateId());
                wealth -= itemData.data.value;
                inventory.push({ itemType, id: generateId() });
            }
            store.dispatch(createItems(inventory));
            inventory.forEach(
                item => {
                    store.dispatch(
                        pickUpItem({
                            actorId: action.id,
                            itemId: item.id,
                        }),
                    );
                },
            );
        }
    });
};
