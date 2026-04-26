# Gambling Analytics - User Guide
# Student Name: Wai Leung Fan
# Student Number: 33752058

## 🌐 Live Demo

**Try it now:** https://final-project-casino-vrfk.vercel.app

No installation required—just visit the link, create an account, and start playing!

---

## What the Software Does

**Gambling Analytics** is an educational web application that lets users explore betting behaviour and decision-making through a simulated blackjack game. Players can track their session history, analyze personal statistics, and visualize their gambling patterns through an interactive dashboard—all with no real money involved.

---

## Core Features Implemented

- ✅ **User Authentication**: Secure registration and login via Supabase
- ✅ **Blackjack Simulator**: Fully playable blackjack game with realistic card mechanics
- ✅ **Personal Analytics Dashboard**: Real-time charts showing profit/loss trends and session statistics
- ✅ **Session Tracking**: Automatic logging of each blackjack session with detailed statistics
- ✅ **Risk Score Calculation**: Dynamic behavior analysis based on betting patterns
- ✅ **Leaderboard**: Top winners and losers across all users
- ✅ **Data Visualization**: Interactive line charts and pie charts using Recharts
- ✅ **Session Log**: Detailed round-by-round game history
- ✅ **Responsive Design**: Works on desktop and mobile browsers

---

## Setup and Run Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/waifan321/Final-Project-Casino.git
cd Final-Project-Casino/gambling-analytics
```

#### 2. Install Dependencies
```bash
npm install
```
This will install all required packages including React, Vite, Supabase, and Recharts.

#### 3. Environment Configuration
The `.env` file is already configured with Supabase credentials. **No additional setup is needed.**

The following environment variables are already set:
```
VITE_SUPABASE_URL=https://vxxdslnucqhfbwmlhoqb.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Q8w2aqa_No_SSCMuBfxENw_TtN0cEYm
```

#### 4. Start the Development Server
```bash
npm run dev
```

The application will start and display a message like:
```
  VITE v8.0.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

#### 5. Open in Browser
Navigate to **`http://localhost:5173/`** in your web browser.

---

## Dependencies and Packages

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI framework |
| React DOM | 19.2.4 | React rendering |
| Vite | 8.0.1 | Build tool and dev server |
| @supabase/supabase-js | 2.104.0 | Backend services (authentication, database) |
| Recharts | 3.8.1 | Interactive charts and visualizations |
| ESLint | 9.39.4 | Code quality and linting |

**Installation:** All dependencies are installed automatically with `npm install`.

---

## Test Credentials and Sample Usage

### Creating a Test Account

1. Click **"Sign Up"** on the home page
2. Enter an email and password (any valid email and password work)
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the dashboard

**Example credentials:**
- Email: `testuser@example.com`
- Password: `TestPassword123!`

### Testing the Application

#### On the Dashboard:
- View your personal statistics (sessions played, average bet, risk score)
- See your profit/loss trends in the line chart
- Check win/loss/draw distribution in the pie chart
- View the leaderboard (top 5 winners and losers)

#### In the Blackjack Simulator:
1. Click **"Open Simulator"** from the dashboard
2. Set your bet amount (default 50, range: 10-500)
3. Click **"Place Bet"** to start a round
4. Click **"Hit"** to take another card or **"Stand"** to end your turn
5. The dealer plays automatically (hits on 16 or less, stands on 17+)
6. Your session data is saved automatically when you return to the dashboard

---

## How to Run the System

### Development Mode
```bash
npm run dev
```
- Hot reload enabled (changes appear instantly)
- Detailed error messages in browser console
- Best for testing and development

### Production Build
```bash
npm run build
```
Creates an optimized build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Runs the production build locally for testing.

### Code Quality Check
```bash
npm run lint
```
Checks for code style and potential errors.

---

## Known Limitations and What's Not Implemented

### ⚠️ Current Limitations

1. **No Real-Time Multiplayer**: The leaderboard shows all-time statistics, not live updates
2. **No Mobile App**: Only web-based (mobile browser support is present but not optimized)
3. **Limited Game Variety**: Only blackjack is available (no other casino games)
4. **No Statistics Export**: Cannot export session data as CSV or PDF
5. **No Email Notifications**: No email alerts for achievements or milestones
6. **Limited Session Storage**: Sessions are stored only in the database (no offline mode)
7. **No Customizable Avatars**: Users cannot upload profile pictures
8. **Basic Deck Management**: Deck reshuffles at 0 cards (no advanced card counting considerations)
9. **No Social Features**: Cannot share results or add friends
10. **No Password Reset**: Must contact support to recover lost passwords

### 🔧 Features Not Yet Implemented

- Advanced AI opponent or multi-player gameplay
- Cryptocurrency or blockchain integration
- Machine learning-based behavior prediction
- Third-party payment integrations
- API for external applications
- Dark mode / theme customization
- Push notifications
- Voice-based controls

### 🐛 Known Issues

- Leaderboard may take a few seconds to load with many users
- Chart animations may lag on very low-end devices
- Session logs with many rounds (100+) may have minor UI lag

---

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal for the actual URL.

### Blank Page After Login
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Refresh the page (F5 or Cmd+R)
- Check browser console for errors (F12 → Console tab)

### Cannot Connect to Supabase
- Verify internet connection
- Check if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present in `.env`
- The Supabase service may be temporarily unavailable

### npm install fails
- Delete `node_modules` folder: `rm -rf node_modules` (or `rmdir /s node_modules` on Windows)
- Delete `package-lock.json`: `rm package-lock.json`
- Run `npm install` again

---

## Tech Stack

- **Frontend**: React 19.2 with Vite 8.0
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Charting**: Recharts
- **Build Tool**: Vite
- **Code Quality**: ESLint
- **Language**: JavaScript (ES6+)

---

## Project Structure

```
src/
├── App.jsx              # Main app router and authentication logic
├── HomePage.jsx         # Landing page with feature overview
├── LoginPage.jsx        # User login form
├── SignupPage.jsx       # User registration form
├── DashboardPage.jsx    # Analytics dashboard with charts
├── SessionPage.jsx      # Blackjack simulator game logic
├── main.jsx             # React entry point
├── styles.css           # Global styles and layout
└── lib/
    └── supabase.js      # Supabase client initialization
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production-optimized build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm install` | Install/update dependencies |

---

## Support and Feedback

For issues, questions, or feature requests:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Open an issue on the [GitHub repository](https://github.com/waifan321/Final-Project-Casino)
3. Review the browser console (F12) for error messages

**Repository:** https://github.com/waifan321/Final-Project-Casino

---

## License

This is an educational prototype built as a Final Year Project. 

**Disclaimer**: This application is for educational purposes only. It simulates gambling behavior and uses no real money. It is designed for data visualization and behavioral analysis research.

---

## Checklist: Verify Everything Works

After following the setup instructions, verify:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts the server
- [ ] Browser opens to `http://localhost:5173/`
- [ ] You can see the home page with "Sign Up" and "Login" buttons
- [ ] You can create an account or log in with test credentials
- [ ] Dashboard displays with charts and statistics
- [ ] Blackjack simulator opens and you can place a bet
- [ ] You can complete a round (Hit/Stand)
- [ ] Dashboard updates after returning from simulator
- [ ] ESLint shows no critical errors: `npm run lint`
