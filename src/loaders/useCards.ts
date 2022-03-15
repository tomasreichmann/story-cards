import cards from '../mocks/cards';
import options from '../options';
import { CardResponse } from '../types';
import useContentfulEntries from './useContentfulEntries';

const query = {
  content_type: 'card',
  include: 1,
};

const cardsAdapter = (data) => {
  console.log(data);
  return (data?.items?.map(({ fields, sys: { id } }) => ({ ...fields, id })) ||
    []) as CardResponse[];
};

const useCards = () => {
  if (options.useMocks) {
    return {
      data: cards as CardResponse[],
      isPending: false,
      error: undefined,
    };
  }
  return useContentfulEntries(query, cardsAdapter);
};

export default useCards;
