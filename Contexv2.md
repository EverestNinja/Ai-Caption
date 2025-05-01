🧠 context.md v2 – GloCap: Best Caption Generator
📌 Product Summary
GloCap is an AI-powered web app that helps users generate engaging captions and professional flyers for social media. It supports a smooth, minimal user journey across multiple steps — from landing to generation to publishing — with the ability to save content and resume or post later.

🚀 Core Flow Overview
css
Copy
Edit
Landing Page → Choose Page → Caption Generation → Flyer Generation → Publish Page
Each step maintains state via Context API.

Users can save or favorite content after login.

Final content can be published to social media or saved for later.

✅ Functional Overview
🔐 Authentication
Firebase Auth

Guest users have limited daily usage

Logged-in users get unlimited access

Usage counter + daily reset logic included

✏️ Caption Generation (Page)
Post types: promotional, engagement, testimonial, event, product-launch, custom

Options:

Business Type

Tone selection

Emoji toggle

Hashtag generation

Image upload

Caption length (short/medium/long)

Copy, Regenerate, Save, ❤️ Favorite functionality per caption

🖼️ Flyer Generation (Page)
Description input

Logo upload + placement

Theme-based AI flyer output

Download flyer

Save to account (user-only)

Generate multiple styles

📤 Publish Page
Final step in the flow

Review generated caption and flyer

Social media publishing option

Option to Save Draft (for publishing later)

Drafts saved to user’s account for future access

🧭 Navigation & UI
🔘 Minimal UI Philosophy
Simple, distraction-free interface

Responsive + mobile-first

Blur backgrounds, soft animations, gradients (via Framer Motion + TSParticles)

🔗 Navigation Structure
Choose Navbar or Collapsible Sidebar:

Logo

Home (Choose Page)

Caption Generator

Flyer Generator

Saved Items

Publish

Profile / Logout

📌 Navbar is preferred for simplicity unless more sections are added.

💾 User Data Persistence
Action	Access Level	Saved to User Profile
Generate Caption	Guest + Logged-in	❌ for guests / ✅ for users
Favorite Caption ❤️	Logged-in only	✅
Save Flyer	Logged-in only	✅
Save Publish Draft	Logged-in only	✅

Data stored using Firebase Firestore (recommended) or secure API with user ID

⚙️ Technical Summary
Feature	Stack / Tool
Framework	Vite + React + TS
Styling	Material UI + Custom CSS
Animations	Framer Motion
Auth	Firebase Authentication
Routing	React Router DOM
State Management	React Context API
Backend API (Captions)	Axios (TBD Endpoint)
UI Effects	TSParticles, React Icons

🎯 UX Highlights
Usage counter on top-right (dynamic, reset daily)

Login prompts for guests on restricted actions

Loading states, toast notifications for save/fav

Multi-step generation preserved across routes

Dark/light mode toggle

📦 Future Scope (Planned)
Subscription & payment integration

Social posting APIs (Meta, Twitter, LinkedIn, etc.)

Dashboard with analytics on saved content

AI caption rephrasing/improvement tool

Shared templates between users

This document serves as a blueprint for any AI co-developer or frontend/backend contributor. It ensures that UX, backend logic, and UI components stay consistent while allowing modular growth.

