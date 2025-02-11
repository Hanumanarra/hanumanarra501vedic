Sports Session Management Application
Overview
This application is built to facilitate the management of sports sessions for both players and administrators. Players have the ability to join, create, and cancel sessions, with their cancellation reasons visible to admins. Admins can oversee all sessions, including cancellations, and generate reports based on customizable timeframes.

Key Features
Player Dashboard:
Browse available sports and sessions.
Participate in ongoing sessions.
Organize and schedule new sessions.
Cancel a session with a specified reason.
Admin Dashboard:
Access and manage all sports and sessions.
Monitor session cancellations along with reasons.
Add new sports and schedule sessions.
Generate reports on session activities and sports popularity over a set period.
Reports:
Create reports for sessions within a defined date range.
Analyze sports popularity by the number of hosted sessions.
Installation Guide
Clone the Repository:
bash
Copy
Edit
git clone <repository_url>
cd sports-session-management
Install Dependencies:
bash
Copy
Edit
npm install
Configuration:
Create a .env file in the project root and define the following environment variables:

env
Copy
Edit
DB_USER=<your_database_user>  
DB_HOST=<your_database_host>  
DB_DATABASE=<your_database_name>  
DB_PASSWORD=<your_database_password>  
DB_PORT=<your_database_port>  
SESSION_SECRET=<your_session_secret>
Database Setup (PostgreSQL)
Run the following SQL commands to create the necessary tables:

sql
Copy
Edit
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  sport_id INTEGER REFERENCES sports(id),
  team1 VARCHAR(255) NOT NULL,
  team2 VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  creator_id INTEGER REFERENCES users(id),
  cancelled BOOLEAN DEFAULT FALSE,
  cancellation_reason TEXT
);

CREATE TABLE session_players (
  session_id INTEGER REFERENCES sessions(id),
  player_id INTEGER REFERENCES users(id),
  PRIMARY KEY (session_id, player_id)
);
Starting the Application:
bash
Copy
Edit
node index.js
Once the server starts, open your browser and navigate to:
http://localhost:3000

Application Workflow
Player Dashboard:
Sports Section: Explore available sports.
Available Sessions: Browse and join open sessions.
My Sessions: Manage and track sessions the player has created.
Session Creation: Set up new sessions.
Session Cancellation: Provide a reason when canceling a session.
Admin Dashboard:
Manage Sports: View and edit sports information.
View Sessions: Access all sessions, including those created by players.
Cancelled Sessions: Track and review canceled sessions with reasons.
Session Management: Organize and schedule new sessions.
Generate Reports: Obtain insights into session trends and sports popularity.
Reports Section:
Set Timeframe: Define a period for generating reports.
Session Report: View all sessions within the selected timeframe.
Sports Popularity Analysis: Identify which sports have the most activity based on session count.
Troubleshooting
If any issues arise, check the server logs for error messages and verify that the database configuration is correct.

License
This project is licensed under the MIT License.
