from flask import Flask, jsonify, request, send_from_directory
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from math import ceil

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ======  Swagger UI ====== 
@app.route("/openapi.yaml")
def openapi_yaml():
    return send_from_directory("spec", "openapi.yaml", mimetype="text/yaml")

SWAGGER_URL = "/docs"
API_URL = "/openapi.yaml"
bp = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={"app_name": "Alumnos API"})
app.register_blueprint(bp, url_prefix=SWAGGER_URL)

# ======  Dummy Data ====== 
ALUMNOS = [
    {"id": 1, "ci": "123456", "nombres": "Ana", "apellidos": "Ramírez", "sexo": "F", "email": "ana@example.com"},
    {"id": 2, "ci": "654321", "nombres": "Luis", "apellidos": "Gómez", "sexo": "M", "email": "luis@example.com"},
    {"id": 3, "ci": "789012", "nombres": "María", "apellidos": "Fernández", "sexo": "F", "email": "maria@example.com"},
]
AUTO_ID = 4

def next_id():
    global AUTO_ID
    n = AUTO_ID
    AUTO_ID += 1
    return n

def find_alumno(alumno_id: int):
    return next((a for a in ALUMNOS if a["id"] == alumno_id), None)

# ======  Validaciones simples ====== 
def validar_create(data: dict):
    errores = {}
    requeridos = ["ci", "nombres", "apellidos", "sexo"]
    for campo in requeridos:
        if campo not in data:
            errores.setdefault(campo, []).append("Campo requerido")
    if "sexo" in data and data["sexo"] not in ["M", "F", "X"]:
        errores.setdefault("sexo", []).append("Debe ser M, F o X")
    return errores

def validar_patch(data: dict):
    errores = {}
    if "sexo" in data and data["sexo"] not in ["M", "F", "X"]:
        errores.setdefault("sexo", []).append("Debe ser M, F o X")
    return errores

# ======  Endpoints API ====== 
@app.get("/api/alumnos")
def listar_alumnos():
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        return jsonify({
            "message": "Parámetros inválidos",
            "errors": {"page/limit": ["Deben ser enteros"]}
        }), 400

    if page < 1 or limit < 1:
        return jsonify({
            "message": "Parámetros inválidos",
            "errors": {
                "page": ["Debe ser >= 1"] if page < 1 else [],
                "limit": ["Debe ser >= 1"] if limit < 1 else []
            }
        }), 400

    total = len(ALUMNOS)
    start = (page - 1) * limit
    end = start + limit
    items = ALUMNOS[start:end]
    total_pages = ceil(total / limit) if limit else 0

    return jsonify({
        "data": items,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    }), 200

@app.get("/api/alumnos/<int:alumno_id>")
def obtener_alumno(alumno_id: int):
    alumno = find_alumno(alumno_id)
    if not alumno:
        return jsonify({"message": "Alumno no encontrado"}), 404
    return jsonify(alumno), 200

@app.post("/api/alumnos")
def crear_alumno():
    data = request.get_json(silent=True) or {}
    errores = validar_create(data)
    if errores:
        return jsonify({"errors": errores}), 400

    if any(a["ci"] == data["ci"] for a in ALUMNOS):
        return jsonify({"message": "CI ya está registrado"}), 409

    nuevo = {
        "id": next_id(),
        "ci": data["ci"],
        "nombres": data["nombres"],
        "apellidos": data["apellidos"],
        "sexo": data["sexo"],
        "email": data.get("email"),
    }
    ALUMNOS.append(nuevo)
    return jsonify(nuevo), 201

@app.patch("/api/alumnos/<int:alumno_id>")
def actualizar_parcial(alumno_id: int):
    alumno = find_alumno(alumno_id)
    if not alumno:
        return jsonify({"message": "Alumno no encontrado"}), 404

    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({"errors": {"body": ["Debe enviar al menos un campo"]}}), 400

    errores = validar_patch(data)
    if errores:
        return jsonify({"errors": errores}), 400

    permitido = {"ci", "nombres", "apellidos", "sexo", "email"}
    for k, v in data.items():
        if k in permitido:
            alumno[k] = v
    return jsonify(alumno), 200

@app.delete("/api/alumnos/<int:alumno_id>")
def eliminar_alumno(alumno_id: int):
    global ALUMNOS
    antes = len(ALUMNOS)
    ALUMNOS = [a for a in ALUMNOS if a["id"] != alumno_id]
    if len(ALUMNOS) == antes:
        return jsonify({"message": "Alumno no encontrado"}), 404
    return "", 204

if __name__ == "__main__":
    app.run(debug=True)
