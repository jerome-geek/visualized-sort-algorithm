import constants from './constants';
import { range, shuffle } from 'lodash';

const getX = (index: number) => index * (constants.BAR + constants.BAR_MARGIN);
const getArr = () => shuffle(range(1, constants.SIZE + 1));
const initArr = range(1, constants.SIZE + 1).map(() => 1);

export { getX, getArr, initArr };
