import cards from './mocks/cards';
import { CardResponse } from './types';

export const outcomeCards = cards.filter(
  (card) => card.type?.includes('outcome') || false
) as CardResponse[];
