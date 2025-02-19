FILE PATH: api/search.test.js
CONTENT: 
```javascript
const fetch = require('node-fetch');
const search = require('./search');

describe('search', () => {
  it('should return an array of search results', async () => {
    const results = await search('github');
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return an object for each search result', async () => {
    const results = await search('github');
    results.forEach((result) => {
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('description');
    });
  });

  it('should handle errors', async () => {
    const results = await search('this is an error');
    expect(results).toBeInstanceOf(Error);
  });
});
```