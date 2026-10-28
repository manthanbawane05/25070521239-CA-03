# FLEXI - PC Parts Store (25070521239-CA-03)

A full-stack web application for browsing and managing PC parts, built with a
React.js frontend, a Node.js (Express) backend, and MongoDB as the database
(viewable in MongoDB Compass).

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript (React.js + Vite + React Router)
* **Backend:** Node.js (Express)
* **Database:** MongoDB (MongoDB Compass)

## Folder Structure

```
.
├── client/          # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── homeComp/   # header, footer, main content components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── nav.jsx
│   │   ├── home.jsx
│   │   ├── parts.jsx
│   │   ├── about.jsx
│   │   └── contact.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/          # Node.js + Express backend
    ├── server.js
    └── package.json
```

## Getting Started

### 1. Start the backend (needs MongoDB running locally on port 27017)

```bash
cd server
npm install
npm start
```

The API runs at `http://localhost:5000`.

To load sample PC parts into the database, open `http://localhost:5000/seed`
once in a browser (it only inserts data if the collection is empty).

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API Endpoints

| Method | Route              | Description                                  |
|--------|--------------------|----------------------------------------------|
| GET    | `/`                | API welcome message                          |
| GET    | `/seed`            | Insert sample PC parts (only if empty)       |
| GET    | `/getall`          | Get all parts                                |
| GET    | `/get/:id`         | Get a single part by id                      |
| GET    | `/category/:name`  | Get all parts of a category                  |
| POST   | `/create`          | Add a new part                               |
| PUT    | `/update/:id`      | Update a part's price / stock                |
| DELETE | `/delete/:id`      | Delete a part                                |
| POST   | `/contact`         | Save a contact form message                  |
| GET    | `/messages`        | Get all contact messages                     |

## Notes

* Parts and contact messages are stored in the `flexiDB` database
  (`parts` and `messages` collections) — open them in MongoDB Compass.
* The frontend calls the backend at `http://localhost:5000`.
