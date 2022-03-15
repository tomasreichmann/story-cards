import { createClient } from 'contentful';

const accessToken = 'SAO875yKIJxYLBXsYGdxvFJE23wfdMNOQxNL6l-dhHQ';
const space = 'ikcv14gqq1og';

const contentfulClient = createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken,
});

export default contentfulClient;
