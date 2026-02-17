# Muscle Muse — AI-Powered Fitness Tracker

![App Screenshot](https://placeholder-screenshot.png)

> **Track workouts, monitor progress, and get AI-powered fitness insights.**

**🚀 Live Demo:** *Deploying soon*

## 🎯 What It Does

Muscle Muse is a comprehensive fitness tracking application that helps users:
- Log workouts with detailed exercise tracking
- Monitor progress over time with visual analytics
- Access workout inspiration and routines
- Get personalized fitness insights
- Manage fitness goals through onboarding flows

## ✨ Features

- **Workout Logging** — Track exercises, sets, reps, and weights
- **Progress Analytics** — Visual charts showing strength gains over time
- **AI-Powered Insights** — Smart recommendations based on workout patterns
- **User Authentication** — Secure login/signup with Supabase
- **Responsive Design** — Works on mobile and desktop
- **Real-time Data** — Live updates with Supabase backend

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | React Query (TanStack Query) |
| Routing | React Router |
| Backend | Supabase (Auth + Database) |
| Build Tool | Vite |
| Notifications | Sonner + Toast |

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- Supabase account (for backend)

### Environment Variables
Create `.env` file:
```bash
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Note:** Add environment variables in Vercel dashboard before deploying.

## 📊 What I Learned

Building Muscle Muse reinforced three key lessons:

1. **Auth flows need careful UX** — The protected route pattern with loading states prevents jarring redirects and gives users feedback during auth checks.

2. **Database design matters early** — Planning the Supabase schema upfront (users, workouts, exercises, progress) made the frontend implementation smoother. Retrofitting relationships later would have been painful.

3. **UI component libraries accelerate development** — Using shadcn/ui provided polished, accessible components out of the box. The time saved on styling allowed focus on core fitness tracking logic.

## 🔮 Roadmap

- [x] Core workout tracking
- [x] User authentication
- [x] Progress analytics
- [ ] AI workout recommendations
- [ ] Social features (share workouts)
- [ ] Mobile app (React Native)
- [ ] Integration with fitness wearables

## 🤝 Why I Built This

I'm transitioning to AI/ML roles and building a portfolio of production-ready applications. Muscle Muse demonstrates:
- **Full-stack development** — React frontend + Supabase backend
- **Authentication & security** — Protected routes, secure auth flows
- **Data visualization** — Progress tracking with charts
- **Real-world problem solving** — Actual fitness tracking workflows

**Hiring?** Check out my other projects: [github.com/Nas20two](https://github.com/Nas20two)

---

Built with ❤️ by [NaSy](https://github.com/Nas20two)
