document.addEventListener('DOMContentLoaded', () => {
  const proxyForm = document.getElementById('proxyForm');
  const urlInput = document.getElementById('url');
  const responseDiv = document.getElementById('response');
  const loadingIndicator = document.getElementById('loading');
  const corsBypassCheckbox = document.getElementById('corsBypass');
  const downloadButton = document.getElementById('downloadButton');

  proxyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = urlInput.value;
    const corsBypass = corsBypassCheckbox.checked;

    responseDiv.innerHTML = '';
    loadingIndicator.style.display = 'block';
    downloadButton.style.display = 'none';

    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, corsBypass: corsBypass }),
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
      const contentDisposition = response.headers.get('content-disposition');

      if (contentType && contentType.includes('json')) {
        const data = await response.json();
        responseDiv.textContent = JSON.stringify(data, null, 2);
      } else {
        const data = await response.text();
        responseDiv.textContent = data;
      }

      if (contentDisposition && contentDisposition.includes('attachment')) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const filename = contentDisposition.split('filename=')[1] || 'downloaded_file';

        downloadButton.href = blobUrl;
        downloadButton.download = filename;
        downloadButton.style.display = 'block';

        downloadButton.onclick = () => {
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
        };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      responseDiv.textContent = `Error: ${error.message}`;
    } finally {
      loadingIndicator.style.display = 'none';
    }
  });
});