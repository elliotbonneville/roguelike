import { generate as generateId } from 'shortid';
import sample from 'lodash/sample';

import {
    treasureToActorsRatio,
    winConditionTreasure,
    rogueForecast,
} from '~/model/constants';

import requiredProp from '~/utils/requiredProp';

import { getActors } from '~/model/features/actors/selectors';
import { getTilesOfType } from '~/model/features/level/selectors';
import { getValueOfItemsOnFloor } from '~/model/features/items/selectors';

import killActor from '~/model/features/actors/killActor.action';
import createActor from '~/model/features/actors/createActor.action';
import log from '~/model/features/ui/messages/log.action';

import behaviors from '~/model/data/actors/behaviors';

export default ({
    store = requiredProp('store'),
}) => {};
