1. **Install Git:** Ensure you have Git installed on your machine. You can download it from [https://git-scm.com/](https://git-scm.com/).

2. **Install Python:** This project requires Python 3.8 or higher. Download the latest version from [https://www.python.org/downloads/](https://www.python.org/downloads/). Make sure to add Python to your PATH during installation. Consider using a Python version manager like `pyenv` or `asdf` for managing multiple Python versions. **Using a version manager is strongly recommended to avoid conflicts and ensure consistency across development environments.** It's also recommended to use a tool like `pyenv-virtualenv` to manage virtual environments in conjunction with `pyenv`.

3. **Clone the Repository:** Clone the project repository to your local machine using:

   
   git clone <repository_url>
   cd <repository_name>
   

4. **Create and Activate a Virtual Environment:** Create a virtual environment to isolate the project dependencies. Using virtual environments like `venv`, `poetry`, or `pipenv` is highly recommended. These tools simplify dependency resolution and environment management. Choose **one** of the following methods:

   * **Using `venv`:**

     
     python3 -m venv venv
     

     It's also recommended to add `venv` to your `.gitignore` file.

   * **Using `poetry`:** Refer to [https://python-poetry.org/docs/](https://python-poetry.org/docs/) for installation and usage.
   * **Using `pipenv`:** Refer to [https://pipenv.pypa.io/en/latest/](https://pipenv.pypa.io/en/latest/) for installation and usage.

5. **Activate the Virtual Environment:**

   * On Linux/macOS (using `venv`):

     
     source venv/bin/activate
     

   * On Windows (using `venv`):

     
     venv\Scripts\activate
     

   * Using `poetry`: `poetry shell`
   * Using `pipenv`: `pipenv shell`

6. **Install Dependencies:** Install the project dependencies using the chosen virtual environment manager:

   * Using `venv`:

     
     pip install -r requirements.txt
     

   * Using `poetry`:

     
     poetry install
     

   * Using `pipenv`:

     
     pipenv install --dev
     

7. **Configure your Editor/IDE:** We recommend using VS Code with the Python extension. Configure your editor to use the virtual environment you created. Ensure your IDE uses `flake8` for linting, `pytest` for testing, and `black` for code formatting. **It's highly recommended to configure pre-commit hooks to automate code formatting and linting, ensuring code quality and consistency.** Instructions for setting up pre-commit hooks are below.

8. **Set up Environment Variables:** Refer to the `.env.example` file for the required environment variables. Create a `.env` file in the project root directory and populate it with the necessary values. It is recommended to use `python-dotenv` to load these. **Ensure the `.env` file is added to your `.gitignore` to avoid committing sensitive information to the repository. Never commit sensitive information to the repository. Double-check before committing.**

9. **Set up pre-commit hooks:**

    * Install pre-