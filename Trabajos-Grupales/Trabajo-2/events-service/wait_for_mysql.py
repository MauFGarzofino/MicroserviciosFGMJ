import time
import pymysql
import sys


def wait_for_mysql(host, max_attempts=30, delay=2):
    attempt = 1
    while attempt <= max_attempts:
        try:
            connection = pymysql.connect(
                host=host,
                user='root',
                password='',
                database='eventos_db'
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
    wait_for_mysql('bd')
