import { useState, useEffect } from 'react';
import contentful from './contentful';

const cache = new Map();

const useContentfulQuery = <ReturnData>(
  query: any,
  adapter: (data) => ReturnData = (data) => data
) => {
  const [data, setData] = useState<ReturnData>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error[]>(null);

  useEffect(() => {
    setIsPending(true);
    setData(null);
    setError(null);
    let isValid = true;
    if (query) {
      const promise =
        cache.get(query) ||
        (cache.set(query, contentful.getEntries(query)) && cache.get(query));
      promise
        .then((data) => {
          console.log('data', data);
          if (isValid) {
            setIsPending(false);
            // rerender the entire component with new data
            setData(adapter(data));
          } else {
            console.log('old promise');
          }
        })
        .catch((error) => {
          if (isValid) {
            console.error(isValid);
            setError(error);
          }
        });
    }
    return () => {
      isValid = false;
    };
  }, []);

  return { data, isPending, error };
};

export default useContentfulQuery;
