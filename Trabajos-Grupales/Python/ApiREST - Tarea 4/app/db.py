import os
import mongoengine as me

def init_db():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/sales_db")
    me.connect(host=uri)
