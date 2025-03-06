document.getElementById('proxyForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.getElementById('url').value;
  const responseDiv = document.getElementById('response');
  const loadingIndicator = document.getElementById('loading');
  const corsBypass = document.getElementById('corsBypass').checked;
  const downloadButton = document.getElementById('downloadButton');

  responseDiv.innerHTML = '';
  loadingIndicator.style.display = 'block';
  downloadButton.style.display = 'none';

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, corsBypass: corsBypass })
    });

    if (!response.ok) {
      let errorText = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.text();
        errorText += ` - ${errorBody}`;
      } catch (parseError) {
        errorText += ` - Error parsing error body: ${parseError.message}`;
      }
      throw new Error(errorText);
    }

    const contentType = response.headers.get('content-type');
    const disposition = response.headers.get('content-disposition');

    if (contentType && contentType.includes('json')) {
      const data = await response.json();
      responseDiv.textContent = JSON.stringify(data, null, 2);
    } else {
      const data = await response.text();
      responseDiv.textContent = data;
    }

    if (disposition && disposition.includes('attachment')) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = disposition.split('filename=')[1] || 'downloaded_file';

      downloadButton.href = url;
      downloadButton.download = filename;
      downloadButton.style.display = 'block';
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    responseDiv.textContent = `Error: ${error.message}`;
  } finally {
    loadingIndicator.style.display = 'none';
  }
});
edit filepath: public/script.js
content: [removed]
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
  <title>Web Proxy</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Web Proxy</h1>

  <form id="proxyForm">
    <label for="url">URL:</label>
    <input type="url" id="url" name="url" required>
    <br><br>
    <label for="corsBypass">Enable CORS Bypass:</label>
    <input type="checkbox" id="corsBypass" name="corsBypass">
    <br><br>
    <button type="submit">Fetch</button>
  </form>

  <div id="loading" style="display:none;">Loading...</div>
  <div id="response"></div>
  <a id="downloadButton" style="display:none;" href="#" download>Download</a>

  <script src="script.js"></script>
</body>
</html>