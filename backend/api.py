from pymongo import MongoClient
from fastapi.responses import RedirectResponse


def isLogin(db_client: MongoClient, username: str, password: str) -> bool:
    try:
        users_db = db_client['users']["login_credentials"]
        db_pw = users_db.find({'username': username})[0]['password']
        return password == db_pw
    except:
        return False


def isAdmin(db_client: MongoClient, username: str, password: str) -> bool:
    try:
        if isLogin(db_client, username, password):
            users_db = db_client['users']["login_credentials"]
            admin_status = users_db.find({'username': username})[0]['admin']
            return admin_status
    except:
        return False


def idExist(db_client: MongoClient, id: str) -> bool:
    try:
        for col in db_client['urls'].list_collection_names():
            db = db_client['urls'][col]
            for _ in db.find({'compressed_id': id}):
                return True
        return False
    except:
        return False


class apiUrl:

    # provide redirection to original url
    @staticmethod
    def redirection(db_client: MongoClient, id: str) -> RedirectResponse:
        result = ''
        for col in db_client['urls'].list_collection_names():
            db = db_client['urls'][col]
            for doc in db.find({'compressed_id': id}):
                if not doc['approved']:
                    result = doc['original']
        try:
            return RedirectResponse(result)
        except:
            return None

    # check login credentials
    @staticmethod
    def check_login(db_client: MongoClient, username: str,
                    password: str) -> dict:
        return {'results': isLogin(db_client, username, password)}

    # get admin status
    @staticmethod
    def get_admin_status(db_client: MongoClient, username: str,
                         password: str) -> dict:
        return {'results': isAdmin(db_client, username, password)}

    # get the name of a user
    @staticmethod
    def get_user_name(db_client: MongoClient, username: str,
                      password: str) -> dict:
        try:
            if isLogin(db_client, username, password):
                users_db = db_client['users']['login_credentials']
                user_name = users_db.find({'username': username})[0]['name']
                return {'results': user_name}
        except:
            return {'results': None}

    # get all urls from user
    @staticmethod
    def get_user_urls(db_client: MongoClient, username: str,
                      password: str) -> dict:
        try:
            if isLogin(db_client, username, password):
                result = []
                if isAdmin(db_client, username, password): 
                    for col in db_client['urls'].list_collection_names():
                        db = db_client['urls'][col]
                        for doc in db.find():
                            doc.pop('_id')
                            result.append(doc)
                else:
                    url_db = db_client['urls'][username]
                    for document in url_db.find():
                        document.pop('_id')
                        result.append(document)
                return {'results': result}
            else:
                return {'results': None}
        except:
            return {'results': None}

    # create new compressed url
    @staticmethod
    def create_url(db_client: MongoClient, username: str, password: str,
                   id: str, url: str) -> dict:
        try:
            if isLogin(db_client, username, password):
                if not idExist(db_client, id):
                    document = {'original': url, 'compressed_id': id, 'approved': False, 'author': username}
                    if isAdmin(db_client, username, password):
                        document = {'original': url, 'compressed_id': id, 'approved': True, 'author': username}
                    url_db = db_client['urls'][username]
                    url_db.insert_one(document)
                    return {'results': True}
            return {'results': False}
        except:
            return {'results': False}

    # update url's id
    @staticmethod
    def edit_url(db_client: MongoClient, username: str, password: str,
                 old_id: str, id: str, author: str) -> dict:
        try:
            if isLogin(db_client, username, password):
                if not idExist(db_client, id):
                    url_db = db_client['urls'][author]
                    query = {'$set': {'compressed_id': id}}
                    url_db.update_one({'compressed_id': old_id}, query)
                    return {'results': True}
            return {'results': False}
        except:
            return {'results': False}

    # delete url
    @staticmethod
    def delete_url(db_client: MongoClient, username: str, password: str,
                   id: str, author: str) -> dict:
        try:
            if isLogin(db_client, username, password):
                if idExist(db_client, id):
                    if isAdmin(db_client, username, password) or username == author: 
                        url_db = db_client['urls'][author]
                        query = {'compressed_id': id}
                        url_db.delete_one(query)
                        return {'results': True}
            return {'results': False}
        except:
            return {'results': False}

    @staticmethod
    def approve_url(db_client: MongoClient, username: str, password: str, id: str, author: str):
        try: 
            if isAdmin(db_client, username, password):
                url_db = db_client['urls'][author]
                query = {'$set': {'approved': True}}
                url_db.update_one({'compressed_id': id}, query)
                return {'results': True}
        except: 
            return {'results': False}