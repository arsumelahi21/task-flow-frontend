# Task Flow – Frontend

Task Flow is a web-based task management application that allows users to manage projects and tasks efficiently. The frontend is built with **React** and provides a clean, responsive, and interactive user experience.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Logout functionality

### Dashboard

* View all projects created by the user
* Search projects by title or description
* Create projects using a modal
* Delete projects with confirmation
* Graceful empty states

### Project Management

* View project details
* Task list grouped by status (Kanban style)
* Drag & drop tasks to update status
* Search tasks by title and description

### Task Management

* Create, edit, and delete tasks
* Task status: **Pending** and **Completed**
* Description word limits and validation
* Optimistic UI updates
* Confirmation before deletion

### UI & UX

* Responsive design (mobile, tablet, desktop)
* Tailwind CSS for styling
* Toast notifications for feedback
* Loaders for async actions
* Modals with controlled closing behavior

### Error Handling

* Route-level 404 page
* Data-level fallback for invalid project IDs
* Global error boundary to prevent blank screens

---

## Tech Stack

* **React (Vite)**
* **React Router DOM**
* **Axios**
* **Tailwind CSS**
* **react-hot-toast**
* **@dnd-kit (Drag & Drop)**

---

## Environment Setup

### Clone the repository

```bash
mkidir task-flow-frontend
cd task-flow-frontend
git clone https://github.com/arsumelahi21/task-flow-frontend.git

```

### Install dependencies

```bash
npm install
```

### 3️Create environment file

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000  (in my case)
```

> Make sure the backend server is running before starting the frontend.

---

## Run the Application

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Test Scenarios

* Invalid routes display a custom 404 page
* Invalid project IDs show a fallback message with navigation
* Forms validate required fields
* Modals do not close on outside click
* Toast messages appear for success and failure states

---

## Project Structure (Simplified)

```
src/
├── components/
│   ├── Header.jsx
│   ├── Modal.jsx
│   ├── ErrorBoundary.jsx
│   └── ...
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetail.jsx
│   └── NotFound.jsx
├── services/
│   └── api.js
├── utils/
│   └── helpers.js
└── main.jsx
```

---
