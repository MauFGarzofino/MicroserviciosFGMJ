from flask import Flask
from flask_cors import CORS          # ⬅️ IMPORTANTE
from config.bd import iniciar_bd
from routes.rutas_eventos import blueprint_eventos
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde .env
load_dotenv()

aplicacion = Flask(__name__)

# ⬇️ HABILITAR CORS para el frontend local
CORS(
    aplicacion,
    origins=["http://localhost:5173"],       # tu front en Vite
    supports_credentials=True,
    allow_headers=["Authorization", "Content-Type"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

# =======================
# CONFIG DB
# =======================
db_url = os.getenv('DATABASE_URL')
if not db_url:
    db_host = os.getenv('MYSQL_HOST', 'bd')
    db_port = os.getenv('MYSQL_PORT', '3306')
    db_user = os.getenv('MYSQL_USER', 'root')
    db_password = os.getenv('MYSQL_PASSWORD', '')
    db_name = os.getenv('MYSQL_DATABASE', 'eventos_db')
    db_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

aplicacion.config['SQLALCHEMY_DATABASE_URI'] = db_url
aplicacion.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

iniciar_bd(aplicacion)

# =======================
# RUTAS
# =======================
aplicacion.register_blueprint(blueprint_eventos, url_prefix='/api/events')

# =======================
# MAIN
# =======================
if __name__ == '__main__':
    aplicacion.run(host='0.0.0.0', port=5000, debug=True)
