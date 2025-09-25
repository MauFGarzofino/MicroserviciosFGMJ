from flask import Flask, request, jsonify
from ariadne import QueryType, MutationType, make_executable_schema, graphql_sync, gql
from ariadne.explorer import ExplorerGraphiQL

# ---------- Esquema GraphQL (SDL) ----------
type_defs = gql("""
type Estudiante {
  ci: String!
  nombres: String!
  apellidos: String!
  carrera: String!
}

type Query {
  estudiantes: [Estudiante!]!
  estudiante(ci: String, nombres: String): Estudiante
}

type Mutation {
  agregarEstudiante(ci: String!, nombres: String!, apellidos: String!, carrera: String!): Estudiante!
}
""")

# ---------- "Base de datos" en memoria ----------
DB = [
    {"ci": "123", "nombres": "Ana", "apellidos": "Pérez", "carrera": "Sistemas"},
    {"ci": "456", "nombres": "Luis", "apellidos": "Gómez", "carrera": "Electrónica"},
]

# ---------- Resolvers ----------
query = QueryType()
mutation = MutationType()

@query.field("estudiantes")
def resolve_estudiantes(*_):
    return DB

@query.field("estudiante")
def resolve_estudiante(*_, ci=None, nombres=None):
    if ci:
        return next((e for e in DB if e["ci"] == ci), None)
    if nombres:
        # Búsqueda exacta, case-insensitive
        target = nombres.strip().lower()
        return next((e for e in DB if e["nombres"].lower() == target), None)
    return None

@mutation.field("agregarEstudiante")
def resolve_agregar_estudiante(*_, ci, nombres, apellidos, carrera):
    nuevo = {"ci": ci, "nombres": nombres, "apellidos": apellidos, "carrera": carrera}
    DB.append(nuevo)
    return nuevo

schema = make_executable_schema(type_defs, query, mutation)

# ---------- Flask app + GraphiQL ----------
app = Flask(__name__)
explorer = ExplorerGraphiQL()

@app.route("/graphql", methods=["GET"])
def graphql_playground():
    # Pasa el request actual a .html(...)
    return explorer.html(request), 200

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(schema, data, context_value=request, debug=True)
    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == "__main__":
    app.run(debug=True)

# Listar Alumnos
# query {
#   estudiantes {
#     ci
#     nombres
#     apellidos
#     carrera
#   }
# }

# Obtener Alumno por CI
# query {
#   estudiante(ci: "123") {
#     ci
#     nombres
#     apellidos
#     carrera
#   }
# }

# Agregar Alumno
# mutation {
#   agregarEstudiante(
#     ci: "789"
#     nombres: "María"
#     apellidos: "López"
#     carrera: "Civil"
#   ) {
#     ci
#     nombres
#     apellidos
#     carrera
#   }
# }
