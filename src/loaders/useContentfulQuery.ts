import { useState, useEffect } from 'react';
import contentful from 'contentful';

const cache = new Map();

const accessToken = 'SAO875yKIJxYLBXsYGdxvFJE23wfdMNOQxNL6l-dhHQ';
const space = 'ikcv14gqq1og';

const useContentfulQuery = <ReturnData>(
  query: string,
  adapter: (data) => ReturnData = (data) => data,
  {
    includeLevels,
  }: {
    includeLevels: number;
  } = {
    includeLevels: 3,
  }
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
        (cache.set(
          query,
          window
            .fetch(
              `https://graphql.contentful.com/content/v1/spaces/${space}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Authenticate the request
                  Authorization: `Bearer ${accessToken}`,
                },
                // send the GraphQL query
                body: JSON.stringify({ query }),
              }
            )
            .then((response) => response.json())
        ) &&
          cache.get(query));
      promise.then(({ data, errors }) => {
        if (isValid) {
          setIsPending(false);
          if (errors) {
            console.error(errors);
            setError(errors);
          }
          // rerender the entire component with new data
          setData(adapter(data));
        } else {
          console.log('old promise');
        }
      });
    }
    return () => {
      isValid = false;
    };
  }, []);

  return { data, isPending, error, includeLevels };
};

export default useContentfulQuery;
