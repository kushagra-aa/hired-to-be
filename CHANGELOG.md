# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.5.0] - 2025-11-12

The first public milestone release of **HiredToBe**, a job-hunt tracker that helps you stay organized, motivated, and one step closer to your next offer.  
This MVP focuses on delivering the **core authentication** and **job/organization management features** essential to the experience.

### New Features

#### Authentication

- **Google OAuth login** via Supabase  
- **Short-lived cookie sessions (~1h)** for secure access  
- **Logout flow** implemented for clean session handling  

#### Job Management

- **CRUD operations for Jobs**  
  Create, edit, and delete job entries with essential details.  
- **Update Job Status** to track progress (Applied → Interview → Offer → Hired)  
- **Attach Documents (links only)** to jobs  
- **Connect Jobs to Organizations**  

#### Organization Management

- **CRUD for Organizations**  
- **Attach Organizations** to jobs  
- **Organization details page** showing associated jobs and connections  

#### Details Pages

- **Job Details Page**  
  Displays interviews, notes, documents, and connections.  
- **Organization Details Page**  
  Shows related jobs and connections.  

### Improvements & Under the Hood

- Added **query invalidation logic** to keep data in sync after mutations  
- Modularized components for cleaner code and easier scaling  
- Improved **data models** for jobs, organizations, and docs  
- Consistent **UI layout and structure** for better UX  

---

_“Because you’re not just applying. You’re **HiredToBe**.”_ 💼✨
