file: views/layout.pug
content: 
```pug
doctype html
html
  head
    meta(charset='UTF-8')
    meta(name='viewport' content='width=device-width, initial-scale=1.0')
    title Web Proxy
    link(rel='stylesheet' href='/stylesheets/style.css')
  body
    main
      block content
```