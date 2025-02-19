Based on the project goal, following file should be created:

FILE PATH: views/index.pug
CONTENT: 
```html
extends layout

block content
  h1 Google Search Proxy
  form(action="/search" method="GET")
    input(type="text" name="query")
    button(type="submit") Search
  //- Display search results
  ul#results
```