document.getElementById('proxyForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.getElementById('url').value;
  const responseDiv = document.getElementById('response');
  const loadingIndicator = document.getElementById('loading');
  const corsBypass = document.getElementById('corsBypass').checked;

  responseDiv.innerHTML = '';
  loadingIndicator.style.display = 'block';

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
    if (contentType && contentType.includes('json')) {
      const data = await response.json();
      responseDiv.textContent = JSON.stringify(data, null, 2);
    } else {
      const data = await response.text();
      responseDiv.textContent = data;
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    responseDiv.textContent = `Error: ${error.message}`;
  } finally {
    loadingIndicator.style.display = 'none';
  }
});