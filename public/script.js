document.getElementById('proxyForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = document.getElementById('url').value;
  const responseDiv = document.getElementById('response');
  const loadingIndicator = document.getElementById('loading');

  responseDiv.innerHTML = '';
  loadingIndicator.style.display = 'block';

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      let errorText = `HTTP error! status: ${response.status}`;
      try {
          const errorBody = await response.text();
          errorText += ` - ${errorBody}`;
      } catch (bodyError) {
          console.warn("Failed to parse error body:", bodyError);
      }
      throw new Error(errorText);
    }

    const data = await response.text();
    responseDiv.textContent = data;
  } catch (error) {
    console.error('Error fetching data:', error);
    responseDiv.textContent = `Error: ${error.message}`;
  } finally {
    loadingIndicator.style.display = 'none';
  }
});