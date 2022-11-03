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
async def redirect(request: Request, id: str):
    if len(id) > 1:
        return apiUrl.redirection(client, id)


# get name of user
@app.get('/get/username/{username}/{password}')
def get_user_name(request: Request, username: str, password: str):
    return apiUrl.get_user_name(client, username, password)


# check if login info is correct
@app.get('/login/{username}/{password}')
def login(request: Request, username: str, password: str):
    return apiUrl.check_login(client, username, password)


@app.get('/get/adminstatus/{username}/{password}')
def get_admin_status(request: Request, username: str, password: str):
    return apiUrl.get_admin_status(client, username, password)

    
# get urls created by users
@app.get('/get/userurls/{username}/{password}')
def get_user_urls(request: Request, username: str, password: str):
    return apiUrl.get_user_urls(client, username, password)


# create new compressed url
@app.get('/create/url/{username}/{password}/{id}/url={url:path}')
def create_url(request: Request, username: str, password: str, id: str,
               url: str):
    return apiUrl.create_url(client, username, password, id,
                             url[:6] + '/' + url[6:])


# update url's id
@app.get('/edit/url/{username}/{password}/{old_id}/{id}')
def edit_url(request: Request, username: str, password: str, old_id: str,
             id: str):
    return apiUrl.edit_url(client, username, password, old_id, id)


# delete url
@app.get('/delete/url/{username}/{password}/{id}')
def delete_url(request: Request, username: str, password: str, id: str):
    return apiUrl.delete_url(client, username, password, id)


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=3000)