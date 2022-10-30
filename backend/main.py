import os
from starlette.requests import Request

import uvicorn
from pymongo import MongoClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import apiUrl

client = MongoClient(os.environ.get('driver'))
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'])


# direct function
@app.get('/{id}')
async def redirect(request: Request, id):
    if len(id) > 1:
        return apiUrl.redirection(client, id)


# get name of user
@app.get('/get/username/{username}/{password}')
def get_user_name(request: Request, username, password):
    return apiUrl.get_user_name(client, username, password)


# check if login info is correct
@app.get('/login/{username}/{password}')
def login(request: Request, username, password):
    return apiUrl.check_login(client, username, password)


# get urls created by users
@app.get('/get/userurls/{username}/{password}')
def get_user_urls(request: Request, username, password):
    return apiUrl.get_user_urls(client, username, password)


# create new compressed url
@app.get('/create/url/{username}/{password}/{id}/url={url:path}')
def create_url(request: Request, username: str, password: str, id: str,
               url: str):
    return apiUrl.create_url(client, username, password, id, url[:6] + '/' + url[6:])


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=3000)
