# Setting Up a FastAPI Project with ReactJs and Postgres

Prerequisites:

Git: Install Git from https://git-scm.com/downloads.
Python 3.6 or later: Download and install Python from https://www.python.org/downloads/.

1. Clone the Repository

Open your terminal or command prompt and navigate to the directory where you want to clone the repository. Use 1  the git clone command followed by the repository URL: 2    

```Bash
git clone https://github.com/lucasLMT/FastAPI-React-Manager.git
```

2. Navigate to the Backend Folder

Change directories to the backend folder within the cloned repository:

```Bash
cd backend
```

3. Create a Virtual Environment

Windows:

```Bash
python -m venv C:\path\to\new\virtual\environment
```

Replace C:\path\to\new\virtual\environment with the desired path for your virtual environment.

Linux/macOS:

```Bash
python3 -m venv new_virtual_environment
```

This creates a virtual environment directory named new_virtual_environment. You can adjust the name as needed.

4. Activate the Virtual Environment

Windows:

```Bash
new_virtual_environment\Scripts\activate
```

Linux/macOS:

```Bash
source new_virtual_environment/bin/activate
```

Your terminal prompt will change to indicate that you're working within the virtual environment.

5. Install Dependencies

Assuming you have a requirements.txt file listing your project's dependencies, run the following command:

```Bash
pip install -r requirements.txt
```

This will download and install the necessary packages from the Python Package Index (PyPI).

6. Navigate to the Frontend Folder

Change your current directory to the frontend folder:

7. Install Dependencies

Run the following command to install all required dependencies:

```Bash
npm install
```

8. Start the PostgreSQL Container

Navigate to the Project Root and run the following command to start the PostgreSQL container defined in your docker-compose.yml file:

```Bash
docker-compose up -d --build
```

Now you ready to start the backend service.

9. Run the FastAPI Server

Inside the backend folder execute the following command to start the FastAPI development server:

```Bash
fastapi dev main.py
```

This will launch the FastAPI server, typically accessible at http://127.0.0.1:8000/ in your web browser. You can view API documentation and interact with endpoints.

10. Run the Vite Server

Inside the frontend folder execute the following command to start the Vite development server:

```Bash
npm run dev
```

This will launch the FastAPI server, typically accessible at http://localhost:5173/ in your web browser.
