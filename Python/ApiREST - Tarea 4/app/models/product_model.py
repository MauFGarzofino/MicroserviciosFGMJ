import mongoengine as me
from datetime import datetime

class Product(me.Document):
    name = me.StringField(required=True, max_length=150)
    description = me.StringField()
    brand = me.StringField()
    stock = me.IntField(min_value=0, default=0)

    created_at = me.DateTimeField(db_field='createdAt', default=datetime.utcnow)
    updated_at = me.DateTimeField(db_field='updatedAt', default=datetime.utcnow)

    version = me.IntField(db_field='__v')

    meta = {
        "collection": "products",
        "indexes": [{"fields": ["name"]}],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
