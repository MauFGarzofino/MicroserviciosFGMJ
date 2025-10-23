import time
import pymysql
import sys
import os
from dotenv import load_dotenv


def wait_for_mysql(host, max_attempts=30, delay=2):
    attempt = 1
    while attempt <= max_attempts:
        try:
            connection = pymysql.connect(
                host=host,
                user=os.getenv('MYSQL_USER', 'root'),
                password=os.getenv('MYSQL_PASSWORD', ''),
                database=os.getenv('MYSQL_DATABASE', 'eventos_db'),
                port=int(os.getenv('MYSQL_PORT', '3306'))
            )
            connection.close()
            print("MySQL está listo, iniciando la aplicación...")
            return
        except pymysql.err.OperationalError as e:
            print(
                f"Esperando a que MySQL esté listo... (Intento {attempt}/{max_attempts})")
            time.sleep(delay)
            attempt += 1
    print("Error: No se pudo conectar a MySQL después de varios intentos.")
    sys.exit(1)


if __name__ == "__main__":
    # Cargar .env antes de leer variables
    load_dotenv()
    host = os.getenv('MYSQL_HOST', 'bd')
    wait_for_mysql(host)
