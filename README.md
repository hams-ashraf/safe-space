This is the frontend part of the Safe Space project, built using React and Vite.

🛠️ Prerequisites
Before you begin, ensure you have the following installed:

Node.js (Version 18 or higher recommended)

npm (Comes with Node.js)

📦 Installation Steps
Clone the repository:

Bash
git clone [your-repository-link]
Navigate to the project folder:

Bash
cd safe-space
Install all dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
The app will be running at http://localhost:5173

📚 Key Libraries Used
After running npm install, the following essential libraries will be ready to use:

React-Router-Dom: For handling navigation between pages (Login, Dashboard, Meetings).

Axios: For making API requests to the backend server.

React-Icons: For the visual icons used in the Admin Dashboard and Session cards.

@microsoft/signalr: For enabling real-time video calls and chat features.

Bootstrap: For responsive layout and styling components.

🏗️ Project Structure
src/api: Contains the API service files (e.g., authApi.js, sessionsApi.js).

src/components: Reusable UI components (e.g., RoomCards, Navbar).

src/pages: Main application views (e.g., Login, AdminDashboard).
