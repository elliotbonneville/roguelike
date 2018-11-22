import { MAP_WIDTH, MAP_HEIGHT } from '~/constants';

import rectangle from '~/utils/rectangle';
import requiredProp from '~/utils/requiredProp';
import cellKey from '~/utils/cellKey';

import { createSelector } from '~/model/utils';

import { getTiles } from '~/model/features/level/selectors';
import { getItemsOnFloor } from '~/model/features/items/selectors';
import { getTilesOfType } from '~/model/features/level/selectors';
import { getDebugging } from '~/model/features/status/selectors';

export const getUnassignedDistanceMap = distance => rectangle({
    width: MAP_WIDTH,
    height: MAP_HEIGHT
}).reduce(
    (map, coords) => Object.assign( map, { [cellKey(coords)]: distance }),
    {},
);

export const generateMap = ({
    pointsOfInterest = requiredProp('pointsOfInterest'),
    tiles = requiredProp('tiles'),
    maxInterest = Infinity,
    debugging = false,
}) => {
    const startTime = Date.now();
    const combinedDistances = Object.assign(
        {},
        getUnassignedDistanceMap(Infinity),
    );
    pointsOfInterest.forEach(({ position, interestLevel = 0 }) => {
        combinedDistances[position] = interestLevel;
        const frontier = [position];
        const distance = { [position]: interestLevel };
        let current;
        let neighbors;

        while (frontier.length) {
            current = frontier.shift();
            Object.keys(tiles[current].neighbors).forEach((neighbor) => {
                if (typeof distance[neighbor] === 'undefined') {
                    const { walkable } = tiles[neighbor].data;
                    if (walkable) frontier.push(neighbor);
                    distance[neighbor] = distance[current] + 1;
                    combinedDistances[neighbor] =
                        (walkable)
                            ? Math.min(
                                combinedDistances[neighbor],
                                distance[neighbor],
                            )
                            : Infinity;
                }
            });
        }
    });

    if (debugging) {
        const time = Date.now() - startTime;
        const points = pointsOfInterest.length;
        console.log(
            `Took ${time}ms to generate map with ${points} points of interest`,
        );
    }

    return combinedDistances;
};

const mapGenerators = {
    items: createSelector(
        [getTiles, getItemsOnFloor, getDebugging],
        (tiles, items, debugging) => generateMap({
            pointsOfInterest: Object.values(items).map(
                ({ position, data }) => ({
                    position: cellKey(position),
                    interestLevel: -data.value
                }),
            ),
            maxInterest: 10,
            tiles,
            debugging,
        }),
    ),
    stairs: createSelector(
        [
            getTiles,
            (state) => getTilesOfType(state, { type: 'stairs' }),
            getDebugging,
        ],
        (tiles, stairs, debugging) => generateMap({
            pointsOfInterest: Object.entries(stairs).map(
                ([position]) => ({ position })
            ),
            tiles,
            debugging,
        }),
    ),
};

// generate a Dijkstra map based on criteria
export default ({ state, name }) => mapGenerators[name](state);
