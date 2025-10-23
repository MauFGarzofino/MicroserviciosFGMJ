from config.bd import bd
from datetime import datetime


class Evento(bd.Model):
    __tablename__ = 'eventos'

    id = bd.Column(bd.Integer, primary_key=True)
    nombre = bd.Column(bd.String(100), nullable=False)
    fecha = bd.Column(bd.String(50), nullable=False)
    lugar = bd.Column(bd.String(100), nullable=False)
    capacidad = bd.Column(bd.Integer, nullable=False)
    precio = bd.Column(bd.Float, nullable=False)
    creado_en = bd.Column(bd.DateTime, default=datetime.utcnow)

    def a_diccionario(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'fecha': self.fecha,
            'lugar': self.lugar,
            'capacidad': self.capacidad,
            'precio': self.precio
        }
