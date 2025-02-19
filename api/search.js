file path: api/search.js
content: 
```js
export async function search(query) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error('Missing API key');
  }

  const { data } = await axios.get(`https://serpapi.com/search.json?q=${query}&api_key=${apiKey}`);
  if (!data.organic_results) {
    throw new Error('No organic results');
  }

  return data.organic_results.map(result => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet
  }));
}
```