import mongoengine as me
from datetime import datetime

class Client(me.Document):
    ci = me.StringField(required=True, unique=True, max_length=20)
    firstName = me.StringField(required=True, max_length=100)
    lastName  = me.StringField(required=True, max_length=100)
    sex       = me.StringField(required=True, choices=("M", "F", "O"))

    # Mapeo a createdAt/updatedAt
    created_at = me.DateTimeField(db_field="createdAt", default=datetime.utcnow)
    updated_at = me.DateTimeField(db_field="updatedAt", default=datetime.utcnow)
    version    = me.IntField(db_field="__v")

    meta = {
        "collection": "clients",
        "indexes": [
            {"fields": ["ci"], "unique": True},
            {"fields": ["lastName", "firstName"]},
        ],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
