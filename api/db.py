import os
import urllib.parse as up
import psycopg2

up.uses_netloc.append("postgres")
db_url = up.urlparse(os.environ.get("DB_URL"))

def connect():
    return psycopg2.connect(database=db_url.path[1:],
                            user=db_url.username,
                            password=db_url.password,
                            host=db_url.hostname)