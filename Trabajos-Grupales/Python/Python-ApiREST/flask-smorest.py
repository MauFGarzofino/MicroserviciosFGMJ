from flask import Flask
from flask_smorest import Api, Blueprint, abort, error_handler
from marshmallow import Schema, fields
from marshmallow.validate import Email

# ====== Server || Config ======
server = Flask(__name__)
server.config.update(
    API_TITLE="Python API REST",
    API_VERSION="v1",
    OPENAPI_VERSION="3.0.3",
    OPENAPI_URL_PREFIX="/docs",
    OPENAPI_SWAGGER_UI_PATH="/",
    OPENAPI_SWAGGER_UI_URL="https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
)
api = Api(server)

# ====== Schemas ======
class AlumnoSchema(Schema):
    id = fields.Int(dump_only=True, metadata={"example": 1})
    ci = fields.Str(required=True, metadata={"example": "123456"})
    nombres = fields.Str(required=True, metadata={"example": "Usuario"})
    apellidos = fields.Str(required=True, metadata={"example": "Ejemplo"})
    sexo = fields.Str(required=True, metadata={"example": "M"})
    email = fields.Str(
        load_default=None,
        validate=Email(error="Debe ser un email válido"),
        metadata={"example": "user@example.com"}
    )
    
# ====== Datos dummy ======
ALUMNOS = [
    {"id": 1, "ci": "123", "nombres": "Ana",  "apellidos": "Ramírez", "sexo": "F", "email": "ana@example.com"},
    {"id": 2, "ci": "456", "nombres": "Luis", "apellidos": "Gómez",   "sexo": "M", "email": "luis@example.com"},
]
_next_id = 3

def find_alumno(alumno_id: int):
    return next((a for a in ALUMNOS if a["id"] == alumno_id), None)

# ====== Blueprint ======
blp = Blueprint("Alumnos", __name__, url_prefix="/alumnos", description="Operaciones con alumnos")

# Listar
@blp.route("/")
@blp.response(
    200,
    AlumnoSchema(many=True),
    description="OK",
    example=[
        {"id": 1, "ci": "123", "nombres": "Ana",  "apellidos": "Ramírez", "sexo": "F", "email": "ana@example.com"},
        {"id": 2, "ci": "456", "nombres": "Luis", "apellidos": "Gómez",   "sexo": "M", "email": "luis@example.com"},
    ],
)
@blp.paginate(page_size=10, max_page_size=100)
def listar_alumnos(pagination_parameters):
    total = len(ALUMNOS)
    pagination_parameters.item_count = total

    page = pagination_parameters.page
    page_size = pagination_parameters.page_size
    start = (page - 1) * page_size
    end = start + page_size
    return ALUMNOS[start:end]

# Crear
@blp.route("/", methods=["POST"])
@blp.arguments(AlumnoSchema)
@blp.response(201, AlumnoSchema)
@blp.alt_response(
    422,
    schema=error_handler.ErrorSchema,
    description="Unprocessable Content",
    example={
        "code": 422,
        "status": "Unprocessable Entity",
        "message": "Error de validación",
        "errors": {"ci": ["Campo requerido"]},
    },
)
@blp.alt_response(
    400,
    schema=error_handler.ErrorSchema,
    description="Bad Request",
    example={
        "code": 400,
        "status": "Bad Request",
        "message": "CI ya registrado",
        "errors": {"ci": ["duplicado"]},
    },
)
def crear_alumno(data):
    # Validación antes de insertar
    if any(a["ci"] == data["ci"] for a in ALUMNOS):
        abort(400, message="CI ya registrado", errors={"ci": ["duplicado"]})

    global _next_id
    data["id"] = _next_id
    _next_id += 1
    ALUMNOS.append(data)
    return data

# Obtener por id
@blp.route("/<int:alumno_id>")
@blp.response(200, AlumnoSchema)
@blp.alt_response(404, schema=error_handler.ErrorSchema, description="No encontrado")
def obtener_alumno(alumno_id):
    alumno = find_alumno(alumno_id)
    if not alumno:
        abort(404, message="Alumno no encontrado")
    return alumno

# Actualizar parcial
@blp.route("/<int:alumno_id>", methods=["PATCH"])
@blp.arguments(AlumnoSchema(partial=True))
@blp.response(
    200,
    AlumnoSchema,
    description="Actualización exitosa",
    example={"id": 2, "ci": "456", "nombres": "Luis", "apellidos": "Gómez", "sexo": "M", "email": "luis@example.com"},
)
@blp.alt_response(
    404,
    schema=error_handler.ErrorSchema,
    description="No encontrado",
    example={
        "code": 404,
        "status": "Not Found",
        "message": "Alumno no encontrado",
        "errors": {}
    },
)
@blp.alt_response(
    422,
    schema=error_handler.ErrorSchema,
    description="Error de validación (payload inválido)",
    example={
        "code": 422,
        "status": "Unprocessable Entity",
        "message": "Error de validación",
        "errors": {
            "nombres": ["Debe ser una cadena"],
            "sexo": ["Valor inválido"]
        },
    },
)
def actualizar_alumno(data, alumno_id):
    alumno = find_alumno(alumno_id)
    if not alumno:
        abort(404, message="Alumno no encontrado")

    if "ci" in data and data["ci"] != alumno["ci"]:
        if any(a["ci"] == data["ci"] for a in ALUMNOS):
            abort(400, message="CI ya registrado", errors={"ci": ["duplicado"]})

    alumno.update(data)
    return alumno

# Eliminar
@blp.route("/<int:alumno_id>", methods=["DELETE"])
@blp.response(204)
@blp.alt_response(404, schema=error_handler.ErrorSchema, description="No encontrado")
def eliminar_alumno(alumno_id):
    alumno = find_alumno(alumno_id)
    if not alumno:
        abort(404, message="Alumno no encontrado")
    ALUMNOS.remove(alumno)
    return ""

api.register_blueprint(blp)

if __name__ == "__main__":
    server.run(debug=True)
