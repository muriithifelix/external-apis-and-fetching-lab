// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('state-input');
  const button = document.getElementById('fetch-alerts');
  const alertsDisplay = document.getElementById('alerts-display');
  const errorMessage = document.getElementById('error-message');

  button.addEventListener('click', async () => {
    const state = input.value.trim().toUpperCase();

    // Clear the input and previous results
    input.value = '';
    alertsDisplay.replaceChildren();
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');

    // Validate input
    if (!state) {
      displayError('Please enter a state abbreviation.');
      return;
    }

    if (!/^[A-Z]{2}$/.test(state)) {
      displayError('Please enter a valid two-letter state abbreviation.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.weather.gov/alerts/active?area=${state}`
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      const alerts = data.features || [];

      // Display title and alert count
      const heading = document.createElement('h2');
      heading.textContent = `${data.title}: ${alerts.length}`;
      alertsDisplay.appendChild(heading);

      // Display alert headlines
      const list = document.createElement('ul');

      alerts.forEach((alert) => {
        const item = document.createElement('li');
        item.textContent =
          alert.properties?.headline || 'No headline available';
        list.appendChild(item);
      });

      alertsDisplay.appendChild(list);

      // Hide and clear errors after success
      errorMessage.textContent = '';
      errorMessage.classList.add('hidden');

    } catch (error) {
      displayError(error.message);
    }
  });

  function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
});
