from flask import Flask
from config.bd import iniciar_bd
from routes.rutas_eventos import blueprint_eventos

aplicacion = Flask(__name__)
aplicacion.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@bd/eventos_db'
aplicacion.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
iniciar_bd(aplicacion)

aplicacion.register_blueprint(blueprint_eventos, url_prefix='/api/events')

if __name__ == '__main__':
    aplicacion.run(host='0.0.0.0', port=5000, debug=True)
