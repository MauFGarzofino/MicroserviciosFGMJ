from flask_sqlalchemy import SQLAlchemy

bd = SQLAlchemy()


def iniciar_bd(aplicacion):
    bd.init_app(aplicacion)
    with aplicacion.app_context():
        bd.create_all()
