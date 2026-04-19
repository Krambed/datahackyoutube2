import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="YouTube Trend Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
countries = ["BR", "CA", "DE", "FR", "GB", "IN", "JP", "KR", "MX", "RU", "US"]
dfs = {}

for country in countries:
    file_path = os.path.join(data_dir, f"{country}_Trending.csv")
    dfs[country] = pd.read_csv(file_path)

@app.get("/")
def read_root():
    return {"message": "YouTube Trend Advisor API"}

@app.get("/countries")
def get_countries():
    return {"countries": countries}

@app.get("/trends/{country}")
def get_trends(country: str, limit: int = 10):
    if country not in dfs:
        return {"error": "Country not found"}
    df = dfs[country]
    top = df.nlargest(limit, 'views')[['title', 'channel_title', 'views', 'likes', 'tags', 'category_id']]
    return top.to_dict(orient='records')

@app.get("/top_tags/{country}")
def get_top_tags(country: str, limit: int = 20):
    if country not in dfs:
        return {"error": "Country not found"}
    df = dfs[country]
    tags = df['tags'].str.split('|').explode()
    top_tags = tags.value_counts().head(limit)
    return top_tags.to_dict()

@app.get("/top_categories/{country}")
def get_top_categories(country: str, limit: int = 10):
    if country not in dfs:
        return {"error": "Country not found"}
    df = dfs[country]
    top_cat = df['category_id'].value_counts().head(limit)
    return top_cat.to_dict()

@app.get("/recommendations/{country}")
def get_recommendations(country: str, tags: str = "", limit: int = 10):
    if country not in dfs:
        return {"error": "Country not found"}
    df = dfs[country]
    if tags:
        tag_list = [tag.strip().lower() for tag in tags.split(',')]
        mask = df['tags'].apply(lambda x: any(tag in x.lower() for tag in tag_list) if x != '[none]' else False)
        filtered = df[mask]
    else:
        filtered = df
    top = filtered.nlargest(limit, 'views')[['title', 'channel_title', 'views', 'likes', 'tags', 'category_id']]
    return top.to_dict(orient='records')