var tsParticles;
fetch("particles-config.json")
  .then(response => response.json())
  .then(config => {
    tsParticles
      .load("tsparticles", config)
      .then(container => {
        console.log("tsParticles config loaded");
      })
      .catch(error => {
        console.error("Error loading tsParticles config:", error);
      });
  })
  .catch(error => {
    console.error("Error fetching particles-config.json:", error);
  });