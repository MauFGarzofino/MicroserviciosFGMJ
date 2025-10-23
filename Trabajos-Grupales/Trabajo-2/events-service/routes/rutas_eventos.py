from flask import Blueprint
from controllers.controlador_eventos import crear_evento, obtener_eventos, actualizar_evento, eliminar_evento

blueprint_eventos = Blueprint('eventos', __name__)

blueprint_eventos.route('/', methods=['POST'])(crear_evento)
blueprint_eventos.route('/', methods=['GET'])(obtener_eventos)
blueprint_eventos.route('/<int:id_evento>', methods=['PUT'])(actualizar_evento)
blueprint_eventos.route(
    '/<int:id_evento>', methods=['DELETE'])(eliminar_evento)
