document.addEventListener('DOMContentLoaded', () => {
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = timeString;
  }

  // Initial time update
  updateTime();

  // Update time every second
  setInterval(updateTime, 1000);

  // Sidebar functionality
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('sidebar-collapsed');
  });

  // Form submission handling
  const projectAutoForm = document.getElementById('project-auto-form');

  projectAutoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const repo = document.getElementById('repo').value;
    const prompt = document.getElementById('prompt').value;

    // Basic input validation
    if (!repo || !prompt) {
      alert('Please fill in both repository and prompt fields.');
      return;
    }

    try {
      const response = await fetch('/api/run_auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repo, prompt }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Or display the result in a more user-friendly way
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error during Project Auto execution:', error);
      alert('An error occurred while running Project Auto. Please check the console.');
    }
  });
});