# GameVault

## Description
GameVault is a full-stack video game encyclopedia web application that brings all the information you need about any video game into one place. Users can search for games, browse trending and new releases, view detailed game information including descriptions, ratings, platforms, genres, and screenshots, and save their favorite games to a personal favorites list powered by Supabase.

## Target Browsers
GameVault is designed for modern desktop browsers including:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

Mobile browsers are not officially supported but the layout is functional on most devices.

## Link to Developer Manual
See the Developer Manual section below.

---

# Developer Manual

## Audience
This document is intended for future developers who will take over and continue development of GameVault. It assumes familiarity with JavaScript, Node.js, and web development concepts.

---

## How to Install the Application

### Prerequisites
- Node.js (v18 or higher) — download from https://nodejs.org
- A Supabase account — https://supabase.com
- A RAWG API key — https://rawg.io/apidocs

### Steps
1. Clone the repository:
```
git clone https://github.com/travis4740/inst377-gamevault.git
cd inst377-gamevault
```
2. Install dependencies:
```
npm install
```
3. Create a ` .env` file in the root directory with the following:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
RAWG_KEY=your_rawg_api_key
```
4. In your Supabase project create a table called `favorites` with these columns:
   - `id` — int8, primary key (auto generated)
   - `created_at` — timestamptz (auto generated)
   - `game_id` — int8
   - `name` — text
   - `cover_image` — text

5. Make sure Row Level Security is disabled on the favorites table.

---

## How to Run the Application

Start the development server:
```
npm start
```
The app will be available at `http://localhost:3000`

The server uses nodemon so any changes you make to files will automatically restart the server.

---

## How to Run Tests

There are no automated tests written for this application currently. Manual testing can be done by:
- Visiting each page and verifying data loads correctly
- Searching for a game and verifying results appear
- Clicking a game card and verifying the detail page loads
- Saving a game to favorites and verifying it appears on the favorites page
- Removing a favorite and verifying it disappears

---

## API Endpoints

### External API Endpoints (RAWG)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Fetches top rated trending games from RAWG |
| GET | `/api/games/search?q={query}` | Searches RAWG for games matching the query |
| GET | `/api/games/new` | Fetches games released in the last 30 days |
| GET | `/api/games/upcoming` | Fetches games releasing in the next year |
| GET | `/api/games/genre/:genre` | Fetches games filtered by genre |
| GET | `/api/games/:id` | Fetches full details for a single game |
| GET | `/api/games/:id/screenshots` | Fetches screenshots for a single game |
| GET | `/api/games/:id/similar` | Fetches similar games in the same series |

### Supabase Database Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Retrieves all saved favorite games from Supabase |
| POST | `/api/favorites` | Saves a new game to the favorites list in Supabase |
| DELETE | `/api/favorites/:id` | Removes a game from the favorites list in Supabase |

---

## Known Bugs

- When saving to favorites so the same game can be saved multiple times and will appear more than once on the favorites page.
- Similar games may not load for some games if they do not belong to a franchise or series in the RAWG database.
- The search bar does not support pressing Enter to search, the user must click the Search button.
- Screenshots may not load for some games if RAWG does not have any screenshots available for that title.

---

## Roadmap for Future Development

- Add user authentication so each user has their own favorites list
- Add a rating system so users can rate games directly on GameVault
- Improve mobile responsiveness
- Add a trailer/video section on the game detail page using YouTube API
- Implement a recommendation engine based on favorited games