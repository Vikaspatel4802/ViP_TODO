Here is a comprehensive and professional README.md documentation for your project. You can copy and paste this directly into your repository.

ViP TODO 🚀
ViP Flow is a premium productivity dashboard designed for professionals to prioritize, track, and delegate tasks efficiently. Unlike standard to-do apps, ViP Flow features a unique Executive Delegation System, allowing users to assign tasks instantly via WhatsApp, Email, or SMS.

Built with a focus on aesthetics and user experience, the app features a glass-morphic UI, 3D visual elements, smooth animations, and a fully responsive layout.

(Replace this link with a screenshot of your actual app if available)

🛠 Tech Stack
Frontend Framework: React.js (Vite)

Styling: Tailwind CSS (Dark Mode, Responsive Grid, Animations)

Routing: React Router DOM (v6)

Icons: Lucide React

State Management: React Context API + Custom Hooks

Persistence: Browser LocalStorage (No backend required)

📂 Project Structure & Component Breakdown
The application follows a modular architecture, separating global logic, reusable components, and specific page views.

1. Global Logic (src/)
App.jsx: The core entry point. It handles:

Global State: Manages tasks, user profile, settings (font size/theme), and active alarms using Context API.

Routing: Defines navigation paths (/, /todo, /assign, etc.).

Layout Wrapper: Dynamically adjusts the layout width (Full Width for Home/Assign, Centered for others).

index.css: Contains global styles, Tailwind imports, custom animations (float, slide-in), and input field styling.

2. Core Components (src/components/)
Navbar.jsx: A responsive, sticky navigation bar.

Features a Hamburger Menu for mobile responsiveness.

Includes the User Dropdown for quick access to Profile, Settings, and Logout.

Contains the Theme Toggle (Sun/Moon).

AlarmManager.jsx: A background component that runs a clock every second.

Checks if any task's Due Date and Due Time matches the current time.

Triggers an audio alert and a visual Red Modal when a deadline hits.

3. Pages (src/pages/)
🏠 Home Page (Home.jsx)
The central dashboard.

Hero Section: Full-width 3D background with a personalized welcome message and rotating inspirational quotes.

Analytics Hub: Displays real-time stats for "Today's Outlook," breaking down tasks by Personal, Professional, and Total counts based on the user's local timezone.

✅ ToDo Page (TodoPage.jsx)
The main workspace for task management.

Animated Form: A large "Add Task" button expands into a detailed form with smooth animations.

Smart Sorting: Automatically sorts tasks: Incomplete > Complete, then High Priority > Medium > Low.

Features:

Priority Badges (Red/Orange/Green).

Category Tags (Personal/Professional).

Edit/Delete functionality with data persistence.

G-Cal Integration: One-click button to add the task to Google Calendar.

📊 Progress Page (ProgressPage.jsx)
Advanced metrics and reporting.

KPI Card: Calculates a "Sincerity Score" based on tasks completed vs. total tasks due this week.

Visual Logic: Includes an accordion to show the mathematical formula used for the score.

Category Split: Separate progress bars for Personal growth vs. Professional KPIs.

📲 Assign Page (AssignPage.jsx)
The unique delegation feature.

Message Generator: Creates a professional, linear-formatted text draft including Task Title, Description, and Timeline.

Smart Links:

WhatsApp: Opens API link with pre-filled text.

Mail: Opens native mail client draft.

SMS: Opens messaging app.

History: Remembers the last 4 used phone numbers and emails for quick access.

👤 Profile Page (ProfilePage.jsx)
A 3-section Accordion layout for settings.

Profile: Read-only ID card view of the user.

Settings:

Edit Profile Form: Update Name, Avatar, Designation.

App Appearance: Toggle Dark Mode and adjust Global Font Size slider.

Log Out: A "Danger Zone" to wipe LocalStorage and reset the app.

🚀 Key Features
1. The "Assign" Workflow
Instead of just managing your own tasks, ViP Flow lets you act as a manager.

Go to Assign.

Fill in task details and a timeline.

Enter a contact (Phone or Email).

Click Send via WhatsApp. The app formats a professional message automatically:

"Good Morning, New Task Assigned... Due by Friday..."

2. Audio Deadline Alarms
If you set a specific time (e.g., 2:30 PM) for a task, the app acts as an alarm clock.

At 2:30 PM: A loud alarm plays, and a red modal takes over the screen ensuring you don't miss the deadline.

3. Data Persistence
All data (Tasks, Profile Info, Recent Contacts, Theme) is saved to localStorage.

You can refresh the browser or close the tab, and your data will remain safe.

🔧 Installation & Setup
Clone the repository:

Bash

git clone <your-repo-link>
cd vip-flow
Install Dependencies:

Bash

npm install
Run the Development Server:

Bash

npm run dev
Open in Browser: Go to http://localhost:5173

🎨 Customization
To change the color themes, edit the root CSS variables in src/index.css or modify the Tailwind classes in the respective components. The app relies heavily on slate-50 to slate-900 for its clean, professional look.
