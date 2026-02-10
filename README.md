# Autism Support & Learning Platform

A full-stack web application designed to support autistic children through interactive lessons, therapeutic games, social stories, and progress tracking. The platform features full **English/Urdu bilingual** support and a sensory-friendly customizable interface.

---

## Features

- **Interactive Lessons** — Step-by-step lessons on communication, social skills, emotions, and daily life with built-in quizzes
- **Therapeutic Games** — 5 games designed to develop cognitive and motor skills:
  - Puzzle Game (drag & drop)
  - Tower of Hanoi Game
  - Voice Recognition Game (Web Speech API)
  - Emotion Recognition Game
  - Eye Tracking Game
- **Social Stories** — Visual stories that teach social scenarios (going to school, making friends, visiting the doctor)
- **Dashboard** — Track progress, view skill assessments, weekly charts, and behavioral notes
- **Child Profiles** — Manage multiple child profiles with individual tracking
- **Bilingual Support** — Full English and Urdu language switching across the entire app
- **Sensory Settings** — Customizable theme (default, calm, high contrast), animation speed, font size, and sound toggle
- **Reward Animations** — Confetti and celebration effects to encourage learning
- **JWT Authentication** — Secure login and registration system

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Framer Motion | Animations |
| React DnD | Drag and drop (Puzzle Game) |
| Recharts | Dashboard charts |
| React Icons | Icon library |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Django 5 | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication |
| django-cors-headers | CORS handling |
| django-filter | API filtering |
| Pillow | Image processing |
| SQLite | Database (development) |

---

## Project Structure

```
autism/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Avatar/              # Animated avatar with speech
│   │   │   ├── Navbar/              # Navigation bar
│   │   │   ├── SensoryPanel/        # Floating sensory settings panel
│   │   │   └── common/              # Button, Card, RewardAnimation
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── SensoryContext.jsx    # Sensory preferences state
│   │   ├── hooks/
│   │   │   ├── useTranslation.js     # i18n translation hook
│   │   │   └── useSpeech.js          # Text-to-speech hook
│   │   ├── i18n/
│   │   │   └── translations.js       # English & Urdu translations
│   │   ├── pages/
│   │   │   ├── Home/                 # Landing page
│   │   │   ├── Login/                # Login & registration
│   │   │   ├── Dashboard/            # Progress dashboard
│   │   │   ├── ChildProfile/         # Child profile management
│   │   │   ├── Lessons/              # Interactive lessons & quizzes
│   │   │   ├── Stories/              # Social stories viewer
│   │   │   └── Games/
│   │   │       ├── PuzzleGame/
│   │   │       ├── TowerGame/
│   │   │       ├── VoiceGame/
│   │   │       ├── EmotionGame/
│   │   │       └── EyeTrackingGame/
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── App.jsx                   # Root component & routes
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/                       # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/                     # User authentication app
│   ├── lessons/                      # Lessons & quizzes app
│   ├── games/                        # Game scores & progress app
│   ├── stories/                      # Social stories app
│   ├── dashboard/                    # Dashboard & analytics app
│   ├── requirements.txt
│   └── manage.py
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **pip** (Python package manager)

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (optional, for admin panel)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The backend will run at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run at `http://localhost:5173`

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be generated in `frontend/dist/`.

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/accounts/register/` | POST | User registration |
| `/api/accounts/login/` | POST | JWT token login |
| `/api/accounts/token/refresh/` | POST | Refresh JWT token |
| `/api/accounts/children/` | GET, POST | List/create child profiles |
| `/api/lessons/` | GET | List all lessons |
| `/api/games/scores/` | GET, POST | Game scores |
| `/api/stories/` | GET | List all stories |
| `/api/dashboard/` | GET | Dashboard analytics |

---

## Language Switching

The app supports full English and Urdu bilingual switching. To change the language:

1. Click the gear icon (floating sensory panel button)
2. Select **English** or **Urdu** from the language option
3. All text across the app will switch instantly

Translation strings are managed in `frontend/src/i18n/translations.js`.

---

## Sensory Settings

The sensory panel allows customization for accessibility:

- **Theme** — Default, Calm (muted colors), High Contrast
- **Animation Speed** — Normal, Slow, Off
- **Font Size** — Small, Medium, Large
- **Sound** — Enable/Disable sound effects
- **Language** — English / Urdu

Settings are persisted in `localStorage`.

---

## License

This project is developed for educational and therapeutic purposes.
