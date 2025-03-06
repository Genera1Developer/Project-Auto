document.addEventListener('DOMContentLoaded', () => {
  const proxyForm = document.getElementById('proxyForm');
  const urlInput = document.getElementById('url');
  const responseDiv = document.getElementById('response');
  const loadingIndicator = document.getElementById('loading');
  const corsBypassCheckbox = document.getElementById('corsBypass');
  const downloadButton = document.getElementById('downloadButton');
  const downloadLink = document.getElementById('downloadLink');
  const errorMessageDiv = document.getElementById('errorMessage');
  const rawHeadersDiv = document.getElementById('rawHeaders');

  proxyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();
    if (!url) {
      errorMessageDiv.textContent = 'Error: URL cannot be empty.';
      return;
    }

    const corsBypass = corsBypassCheckbox.checked;

    responseDiv.innerHTML = '';
    errorMessageDiv.textContent = '';
    rawHeadersDiv.textContent = '';
    loadingIndicator.style.display = 'block';
    downloadButton.style.display = 'none';
    downloadLink.style.display = 'none';

    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, corsBypass: corsBypass }),
      });

      // Display raw headers
      let rawHeadersText = '';
      for (const [key, value] of response.headers.entries()) {
        rawHeadersText += `${key}: ${value}\n`;
      }
      rawHeadersDiv.textContent = rawHeadersText;

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
      const contentDisposition = response.headers.get('content-disposition');

      let data;
      if (contentType && contentType.includes('json')) {
        data = await response.json();
        responseDiv.textContent = JSON.stringify(data, null, 2);
      } else {
        data = await response.text();
        responseDiv.textContent = data;
      }

      if (contentDisposition && contentDisposition.includes('attachment')) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        let filename = 'downloaded_file';

        const filenameRegex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i;
        const filenameMatch = contentDisposition.match(filenameRegex);

        if (filenameMatch && filenameMatch[1]) {
          try {
            filename = decodeURIComponent(filenameMatch[1]);
          } catch (e) {
            console.warn("Failed to decode filename: ", e);
            filename = filenameMatch[1];
          }
        } else {
          const filenameEqualsRegex = /filename=(["']?)([^"';\r\n]*)\1?/i;
          const filenameEqualsMatch = contentDisposition.match(filenameEqualsRegex);
          if (filenameEqualsMatch && filenameEqualsMatch[2]) {
            filename = filenameEqualsMatch[2];
          }
        }


        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        downloadLink.style.display = 'block';
        downloadButton.style.display = 'block';

        downloadLink.onclick = () => {
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      errorMessageDiv.textContent = `Error: ${error.message}`;
    } finally {
      loadingIndicator.style.display = 'none';
    }
  });
});