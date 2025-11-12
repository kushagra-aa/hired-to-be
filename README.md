# 🚀 HiredToBe

> _“Because you’re not just applying. You’re **HiredToBe**.”_

## Full Description

Job hunting is exhausting. You apply to dozens of roles, only to get ghosted. You finally get an interview, but the rounds keep multiplying. You wait weeks for an offer, only to hear _“our manager is out, we’ll get back to you”_. The process is messy, demotivating, and hard to track.

**HiredToBe** is here to make that journey a little easier (and fun).

It’s your personal **career companion app** — helping you:

- **Track applications**: Keep all your job details, recruiter contacts, and documents in one place.
- **Stay on top of interviews**: Schedule rounds, sync with Google Calendar, and jot down notes + feedback.
- **Visualize progress**: Use a Kanban board to see where each application stands.
- **Compare offers**: Put offers side by side and see which one really works for you.
- **Stay motivated**: Turn the chaotic job hunt into a structured, gamified journey.

Instead of drowning in emails, spreadsheets, and sticky notes, **HiredToBe** gives you clarity and control. It’s not just about tracking jobs — it’s about keeping your head up through the rejections, the ghosting, and the endless waiting, so you can focus on what matters: landing the role you’re meant to be.

---

The first public milestone release of **HiredToBe**, a job-hunt tracker that helps you stay organized, motivated, and one step closer to your next offer.  
This MVP focuses on delivering the **core authentication** and **job/organization management features** essential to the experience.

## Features

### Authentication

- **Google OAuth login** via Supabase
- **Short-lived cookie sessions (~1h)** for secure access
- **Logout** flow implemented for clean session handling

### Job Management

- **CRUD operations** for Jobs  
  Create, edit, and delete job entries with essential details.
- **Update Job Status** to track progress (Applied → Interview → Offer → Hired)
- **Attach Documents (links only)** to jobs
- **Connect Jobs to Organizations**

### Organization Management

- **CRUD for Organizations**
- **Attach Organizations** to jobs
- Organization details page showing associated **jobs** and **connections**

### Details Pages

- **Job Details Page**
  - Displays **interviews**, **notes**, **docs**, and **connections**
- **Organization Details Page**
  - Shows related **jobs** and **connections**

## Improvements & Under the Hood

- Added **query invalidation logic** to keep data in sync after mutations
- Modularized components for cleaner code and easier scaling
- Improved **data models** for jobs, organizations, and docs
- Consistent **UI layout and structure** for better UX

## 🛠️ Tech Stack

- **Next.js 14 + Supabase**
- **TanStack Query**
- **TailwindCSS + ShadCN UI**
- **Google OAuth 2.0**
- Hosted on **Vercel (serverless)**

## Coming Next (v1 Roadmap)

- 🗂️ **Kanban view** for job stages
- 🗓️ **Interview scheduling & calendar integration**
- ⚖️ **Offer comparison** module
- 🧭 **Dashboard** with analytics and insights
- 🔄 **Persistent sessions / refresh tokens**

## ❤️ A Note from the Dev

This version marks the foundation of **HiredToBe** — the start of something that makes job hunting feel _less chaotic_ and a bit more _in control_.  
Stay tuned — v1 will bring visualization, structure, and motivation to your job journey!
