# TrueTrip Development Context
> **Last Updated:** 2025-12-26
> **Description:** This file documents the current state of the project to facilitate context restoration in new development sessions.

## 1. Project Structure
The project is a monorepo divided into backend and frontend.

```text
TrueTrip/
├── backend/          # Spring Boot 4.0.1 (Kotlin)
│   ├── src/main/kotlin/com/spring/truetrip/
│   │   ├── config/   # WebConfig (CORS), DataInitializer
│   │   ├── controller/ # PlaceController, RecommendationController
│   │   ├── domain/   # JPA Entities (Place, Trip, User, Itinerary)
│   │   ├── dto/      # RecommendationRequest
│   │   ├── service/  # OpenAIService (gpt-4o-mini), PlaceService
│   │   └── ...
│   └── build.gradle.kts
├── frontend/         # Next.js 15 (App Router)
│   ├── src/app/
│   │   ├── components/ # Navbar
│   │   ├── places/     # Place List Page
│   │   ├── globals.css # Tailwind v4 config
│   │   ├── layout.tsx
│   │   └── page.tsx    # Main AI Planner Page
│   └── package.json
└── README.md
```

## 2. Tech Stack & Versions

### Backend
- **Framework:** Spring Boot 4.0.1
- **Language:** Kotlin (JVM 21)
- **Database:** H2 In-Memory Database (Development)
- **ORM:** Spring Data JPA (Hibernate 7.2)
- **AI Integration:** OpenAI API (`gpt-4o-mini`) via `RestClient`
- **Build Tool:** Gradle (Kotlin DSL)

### Frontend
- **Framework:** Next.js 16.1.1 (App Router)
- **Styling:** Tailwind CSS v4.0 (Configured via `@import "tailwindcss";` in `globals.css`)
- **Language:** TypeScript
- **State:** React Hooks (`useState`, `useEffect`)

## 3. Implemented Features

### ✅ Backend
1.  **Data Initialization:** Automatically loads 5 sample places (Seoul landmarks) into H2 DB on startup (`DataInitializer`).
2.  **Place API:** `GET /api/places` returns all stored places.
3.  **AI Recommendation API:** `POST /api/recommendations`
    - Accepts user preferences (Destination, Date, Age, Themes, Group Size).
    - Prompts OpenAI `gpt-4o-mini` to generate 5 JSON-formatted travel spots.
    - Returns structured JSON to frontend.
4.  **CORS:** Configured to allow requests from `http://localhost:3000`.

### ✅ Frontend
1.  **Theme:** "Bright & Cheerful" Travel Theme (Emerald/Teal/White).
2.  **AI Planner (Main Page):**
    - Input form for travel details.
    - Fetches data from backend and displays AI-curated itinerary cards.
3.  **Explore Page:**
    - Displays static sample places from DB with Namuwiki links.
4.  **Navigation:** Responsive Navbar linking Planner and Explore pages.

## 4. Setup & Run Instructions

### Prerequisites
- JDK 21+
- Node.js 20+
- OpenAI API Key

### Backend Setup
1.  Navigate to `backend/`.
2.  Create `src/main/resources/application-secret.properties`.
3.  Add your key: `openai.api-key=sk-your-key-here`.
4.  Run: `./gradlew bootRun`
    - Server runs on: `http://localhost:8080`

### Frontend Setup
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`
3.  Run: `npm run dev`
    - App runs on: `http://localhost:3000`

## 5. Troubleshooting Log
- **Tailwind v4 Issue:** Initial styling failed because v4 syntax was mixed with v3. Fixed by using `@import "tailwindcss";` in `globals.css`.
- **H2 DB:** Currently using in-memory H2. Data resets on restart.
- **JPA:** Added `kotlin-jpa` plugin and default values to entities to resolve "No default constructor" errors.
- **BootRun:** Occasionally fails if previous process isn't killed. Use `pkill -f java` if port 8080 is locked.

## 6. Next Steps
- [ ] Save AI recommendations to Database (`Trip` & `Itinerary` entities).
- [ ] Implement Route Optimization (TSP) logic.
- [ ] User Authentication (Login/Signup).
- [ ] Switch to MySQL for persistence.
