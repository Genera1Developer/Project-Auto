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
        const errorBody = await response.json(); // Attempt to parse as JSON first
        errorText += ` - ${errorBody.message || JSON.stringify(errorBody)}`; // Use message if available
      } catch (jsonError) {
        try {
          const errorBody = await response.text(); // Fallback to text if JSON parsing fails
          errorText += ` - ${errorBody}`;
        } catch (textError) {
          console.warn("Failed to parse error body as JSON or text:", textError);
        }
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