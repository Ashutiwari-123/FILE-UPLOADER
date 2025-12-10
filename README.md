FRONTEND ->
The frontend of this project is built using React, a modern and efficient JavaScript library used for creating dynamic and responsive user interfaces. The primary purpose of the frontend is to allow users to upload PDF files, view a list of previously uploaded documents, download files, and delete them when needed. The interface communicates directly with the backend through axios, ensuring smooth, secure, and reliable API interactions.

At the heart of the component are two state variables managed with React’s useState hook: file and docs.
The file state holds the PDF selected by the user, while the docs state stores an array of all uploaded document records that come from the backend.

When the application first loads, the useEffect hook automatically triggers the loadDocs function. This function makes a GET request to the backend using axios at the endpoint http://localhost:5000/documents
. Once the list of documents is returned, the docs state updates, and the UI automatically re-renders to show the newest version of the document list.

The PDF upload process is handled by the handleUpload function. When the user submits the form, the function prevents the default form behavior and checks whether a file has been selected. A FormData object is created and the PDF is appended to it. The form data is then sent to the backend with a POST request using axios at /documents/upload. After the file is successfully uploaded, the file state is cleared and loadDocs() is called again, which ensures the newly uploaded document immediately appears in the list without refreshing the page.

Deleting a document is managed by the handleDelete function. When a user chooses to delete a specific file, a DELETE request is sent to the backend using axios, along with the ID of the file. Once the backend confirms the deletion, the loadDocs function runs again to update the UI. This ensures the user always sees the correct, updated list of documents.

For styling the interface, this project uses tailwind, a utility-first CSS framework that provides ready-made classes for fast and modern UI development. The design includes gradient backgrounds created with bg-gradient-to-br, soft glass-effect cards using backdrop-blur-xl and shadow-2xl, and smoothly styled buttons with hover transitions. These styles contribute to a clean, responsive, and visually pleasing interface suitable for both mobile and desktop users.

To run the frontend during development, you simply install dependencies and start the project using the command:
npm run dev
This launches the React development server, allowing you to work with automatic reloading and immediate UI updates.

Overall, the frontend is lightweight, responsive, and user-friendly. It interacts efficiently with the backend through axios, utilizes React's state management for instant updates, and uses tailwind to provide a polished, modern user experience.

BACKEND ->

The backend of this project is built using express, a lightweight Node.js framework, to handle server-side logic efficiently. Its main role is to receive PDF files from the frontend, store them, provide a list of uploaded documents, allow downloads, and handle deletions. Communication between the frontend and backend is done through REST API endpoints.
To start the backend, run the following command in the terminal:

nodemon server.js

File uploads are managed using multer, a Node.js middleware that saves PDFs to a designated folder (e.g., uploads/) with unique filenames to avoid overwriting. When a user uploads a PDF, multer processes and stores the file on the server.
The backend exposes several API routes:

GET /documents: Retrieves all uploaded documents as JSON. The frontend calls this route on load and after uploads or deletions.

POST /documents/upload: Receives PDF files from the frontend via axios and FormData. After saving, it responds with a success message.

GET /documents/:id: Allows downloading a specific file using its ID.

DELETE /documents/:id: Deletes a selected file and confirms deletion to the frontend.

The backend runs on http://localhost:5000. The React frontend communicates with these endpoints using axios for uploading, fetching, downloading, and deleting files. CORS is enabled to allow seamless communication between the frontend (port 5173 / 3000) and backend.
