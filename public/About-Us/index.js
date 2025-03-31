import React from 'react';
import ReactDOM from 'react-dom/client';
import { Sidebar } from '../Sidebar';
import { CurrentTime } from '../CurrentTime';
import '../../style.css';

function AboutUs() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <CurrentTime />
        <h1>About Project Auto</h1>
        <p>
          Project Auto is a revolutionary tool designed to automate code modifications in your GitHub repositories.
          Our goal is to simplify development workflows and accelerate innovation by providing a platform that allows
          users to define and apply custom transformations with ease.
        </p>
        <h2>Our Mission</h2>
        <p>
          We are committed to empowering developers with the tools they need to automate repetitive tasks and focus on
          creative problem-solving. By leveraging the power of automation, we aim to enhance code quality,
          reduce manual errors, and foster a more efficient development ecosystem.
        </p>
        <h2>Our Team</h2>
        <p>
          Project Auto is developed by a team of experienced software engineers passionate about open-source and
          automation technologies. We are dedicated to continuously improving our platform and delivering exceptional
          value to our users.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions, feedback, or suggestions, please feel free to reach out to us. We would love to
          hear from you!
        </p>
        <p>
          Email: <a href="mailto:support@projectauto.com">support@projectauto.com</a>
        </p>
        <p>
          GitHub: <a href="https://github.com/Project-Auto">https://github.com/Project-Auto</a>
        </p>
        <p>
          <a href="https://github.com/Project-Auto/public/Home">Return to Home</a>
        </p>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AboutUs />);