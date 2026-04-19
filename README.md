# YouTube Trend Advisor Demo

A web application demo for analyzing YouTube trending data from 2026 to help content creators understand trends and get personalized recommendations.

## Features

- **Login Page**: Prefilled demo login (username: demo, password: demo)
- **Dashboard**: 
  - Select country from available data (BR, CA, DE, FR, GB, IN, JP, KR, MX, RU, US)
  - View top tags and categories with charts
  - See current trending videos
  - Select tags to get personalized recommendations
- **Dark/Light Mode Toggle**
- **Modern UI** with Tailwind CSS

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js, Tailwind CSS, Recharts
- **Data**: YouTube Trending CSV files

## Setup and Run

1. **Backend**:
   ```bash
   cd backend
   # Activate virtual environment if needed
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open http://localhost:3000 in browser

## API Endpoints

- `GET /countries`: List available countries
- `GET /trends/{country}`: Get top trending videos for country
- `GET /top_tags/{country}`: Get top tags for country
- `GET /top_categories/{country}`: Get top categories for country
- `GET /recommendations/{country}?tags=tag1,tag2`: Get recommendations based on tags

## Data Analysis

The app analyzes:
- Formats (categories) that drive viewership
- Tags associated with high-view videos
- Personalized recommendations based on selected tags

For a full-scale app, integrate live YouTube API for real-time data.