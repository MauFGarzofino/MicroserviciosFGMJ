import mongoengine as me
from datetime import datetime
from bson import ObjectId
from models.product_model import Product
from models.client_model import Client 

class InvoiceDetail(me.EmbeddedDocument):
    id = me.ObjectIdField(default=ObjectId)  # <-- NUEVO
    product = me.ReferenceField(Product, required=True)
    quantity = me.IntField(required=True, min_value=1)
    unitPrice = me.FloatField(required=True, min_value=0.0)

class Invoice(me.Document):
    date = me.DateTimeField(required=True)
    client = me.ReferenceField(Client, required=True, reverse_delete_rule=me.DENY)
    details = me.EmbeddedDocumentListField(InvoiceDetail, default=[])

    # mapeamos a la convención "createdAt/updatedAt" por compatibilidad con datos previos
    created_at = me.DateTimeField(db_field='createdAt', default=datetime.utcnow)
    updated_at = me.DateTimeField(db_field='updatedAt', default=datetime.utcnow)
    version = me.IntField(db_field='__v')  # opcional

    meta = {
        "collection": "invoices",
        "indexes": [
            {"fields": ["-date"]},
            {"fields": ["client"]},
        ],
    }

    @property
    def total(self) -> float:
        return sum((d.quantity or 0) * (d.unitPrice or 0.0) for d in (self.details or []))

    def to_dict(self, populate: bool = True):
        # cliente
        client_obj = None
        if self.client:
            c = self.client if not populate else Client.objects(id=self.client.id).only(
                "ci", "firstName", "lastName", "sex"
            ).first()
            if c:
                client_obj = {
                    "_id": str(c.id),
                    "ci": c.ci,
                    "firstName": c.firstName,
                    "lastName": c.lastName,
                    "sex": c.sex,
                    "id": str(c.id),
                }

        # detalles
        dets = []
        for d in (self.details or []):
            prod_obj = None
            if d.product:
                p = d.product if not populate else Product.objects(id=d.product.id).only(
                    "name", "brand"
                ).first()
                if p:
                    prod_obj = {
                        "_id": str(p.id),
                        "name": p.name,
                        "brand": p.brand,
                        "id": str(p.id),
                    }
            dets.append({
                "_id": str(getattr(d, "id", "")) if getattr(d, "id", None) else None,
                "product": prod_obj,
                "quantity": d.quantity,
                "unitPrice": d.unitPrice,
                "id": str(getattr(d, "id", "")) if getattr(d, "id", None) else None,
            })

        return {
            "_id": str(self.id),
            "id": str(self.id),
            "date": self.date.isoformat() if self.date else None,
            "client": client_obj,
            "details": dets,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "__v": self.version,
            "total": self.total,
        }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def find_detail_index(self, detail_id: str):
        """Retorna el índice del detalle por su id (o -1 si no existe)."""
        try:
            oid = ObjectId(detail_id)
        except Exception:
            return -1
        for idx, d in enumerate(self.details or []):
            if d.id == oid:
                return idx
        return -1