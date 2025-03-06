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
      throw new Error(`HTTP error! status: ${response.status}`);
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