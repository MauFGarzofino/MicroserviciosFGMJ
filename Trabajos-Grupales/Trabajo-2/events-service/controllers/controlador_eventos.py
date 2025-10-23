from flask import request, jsonify
from models.evento import Evento
from config.bd import bd
import jwt
from functools import wraps
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def requerir_token(f):
    @wraps(f)
    def decorado(*args, **kwargs):
        logger.debug("Verificando token en la solicitud")
        token = request.headers.get('Authorization')
        if not token:
            logger.error("Token no proporcionado")
            return jsonify({'error': 'Se requiere token'}), 401
        try:
            token = token.split(" ")[1]
            logger.debug(f"Token recibido: {token}")
            datos = jwt.decode(token, 'sup6546ersecreto', algorithms=["HS256"])
            logger.debug(f"Token decodificado: {datos}")
        except Exception as e:
            logger.error(f"Error al decodificar token: {str(e)}")
            return jsonify({'error': 'Token inválido'}), 401
        return f(*args, **kwargs)
    return decorado


def requerir_admin(f):
    @wraps(f)
    def decorado(*args, **kwargs):
        logger.debug("Verificando rol de administrador")
        token = request.headers.get('Authorization').split(" ")[1]
        datos = jwt.decode(token, 'sup6546ersecreto', algorithms=["HS256"])
        if datos.get('role') != 'admin':  # Usar 'role' para coincidir con el payload
            logger.error(f"Acceso denegado, role: {datos.get('role')}")
            return jsonify({'error': 'Acceso denegado'}), 403
        return f(*args, **kwargs)
    return decorado

def crear_evento():
    logger.debug("Procesando solicitud para crear evento")
    try:
        datos = request.get_json()
        logger.debug(f"Datos recibidos: {datos}")
        evento = Evento(
            nombre=datos['nombre'],
            fecha=datos['fecha'],
            lugar=datos['lugar'],
            capacidad=datos['capacidad'],
            precio=datos['precio']
        )
        bd.session.add(evento)
        bd.session.commit()
        logger.info(f"Evento creado con ID: {evento.id}")
        return jsonify({'mensaje': 'Evento creado', 'id': evento.id}), 201
    except Exception as e:
        logger.error(f"Error al crear evento: {str(e)}")
        return jsonify({'error': str(e)}), 400


@requerir_token
def obtener_eventos():
    logger.debug("Obteniendo lista de eventos")
    eventos = Evento.query.all()
    return jsonify([evento.a_diccionario() for evento in eventos])


@requerir_admin
def actualizar_evento(id_evento):
    logger.debug(f"Actualizando evento con ID: {id_evento}")
    datos = request.get_json()
    evento = Evento.query.get(id_evento)
    if not evento:
        logger.error(f"Evento con ID {id_evento} no encontrado")
        return jsonify({'error': 'Evento no encontrado'}), 404
    for clave, valor in datos.items():
        setattr(evento, clave, valor)
    bd.session.commit()
    logger.info(f"Evento con ID {id_evento} actualizado")
    return jsonify({'mensaje': 'Evento actualizado'})


@requerir_admin
def eliminar_evento(id_evento):
    logger.debug(f"Eliminando evento con ID: {id_evento}")
    evento = Evento.query.get(id_evento)
    if not evento:
        logger.error(f"Evento con ID {id_evento} no encontrado")
        return jsonify({'error': 'Evento no encontrado'}), 404
    bd.session.delete(evento)
    bd.session.commit()
    logger.info(f"Evento con ID {id_evento} eliminado")
    return jsonify({'mensaje': 'Evento eliminado'})
