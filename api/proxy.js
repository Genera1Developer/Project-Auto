**New File: api/static/index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Web Proxy</title>
  </head>
  <body>
    <h1>Web Proxy</h1>
    <p>
      This web proxy allows you to access any website through this server.
      Simply enter the URL you wish to visit in the field below and click "Go".
    </p>
    <form>
      <input type="text" id="url" />
      <input type="submit" value="Go" />
    </form>

    <script>
      const form = document.querySelector("form");
      const urlInput = document.querySelector("#url");

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const targetUrl = urlInput.value;

        const proxyUrl = window.location.origin + "/proxy?url=" + targetUrl;
        window.location.href = proxyUrl;
      });
    </script>
  </body>
</html>
```