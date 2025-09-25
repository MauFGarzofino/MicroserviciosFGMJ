from flask import Blueprint, request, jsonify
from mongoengine import DoesNotExist, ValidationError, NotUniqueError
from bson import ObjectId
from models.client_model import Client
from models.invoice_model import Invoice

bp = Blueprint("clients", __name__)

def to_out_client(c: Client):
    return {
        "id": str(c.id),
        "_id": str(c.id),  # por compatibilidad con ejemplos
        "ci": c.ci,
        "firstName": c.firstName,
        "lastName": c.lastName,
        "sex": c.sex,
        "createdAt": c.created_at.isoformat() if c.created_at else None,
        "updatedAt": c.updated_at.isoformat() if c.updated_at else None,
        "__v": c.version,
    }

@bp.get("/")
def list_clients():
    """
    Listar clientes con paginación
    ---
    tags: [Clients]
    parameters:
      - in: query
        name: page
        schema: { type: integer, example: 1 }
      - in: query
        name: limit
        schema: { type: integer, example: 10 }
    responses:
      200:
        description: Lista de clientes paginada
    """
    try:
        page = max(int(request.args.get("page", 1)), 1)
        limit = max(int(request.args.get("limit", 10)), 1)
    except ValueError:
        return jsonify({"message": "Parámetros inválidos"}), 400

    skip = (page - 1) * limit
    query = Client.objects
    total = query.count()
    items = query.order_by("-created_at").skip(skip).limit(limit)

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit if limit else 0,
        "items": [to_out_client(c) for c in items],
    })

@bp.get("/<id>")
def get_client(id):
    """
    Obtener cliente por ID
    ---
    tags: [Clients]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200: { description: Cliente encontrado }
      404: { description: Cliente no encontrado }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de cliente inválido"}), 400
    try:
        c = Client.objects.get(id=id)
        return jsonify(to_out_client(c))
    except DoesNotExist:
        return jsonify({"message": "Cliente no encontrado"}), 404

@bp.post("/")
def create_client():
    """
    Crear cliente
    ---
    tags: [Clients]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [ci, firstName, lastName, sex]
            properties:
              ci:        { type: string, maxLength: 20 }
              firstName: { type: string, maxLength: 100 }
              lastName:  { type: string, maxLength: 100 }
              sex:       { type: string, enum: [M, F, O] }
    responses:
      201: { description: Creado }
      409: { description: CI ya registrado }
      400: { description: Datos inválidos }
    """
    data = request.get_json(silent=True) or {}
    try:
        # Verificar duplicado por CI (similar a findOne({ci}))
        if Client.objects(ci=data.get("ci")).first():
            return jsonify({"message": "CI ya registrado"}), 409

        c = Client(
            ci=data.get("ci"),
            firstName=data.get("firstName"),
            lastName=data.get("lastName"),
            sex=data.get("sex"),
        ).save()
        return jsonify(to_out_client(c)), 201
    except NotUniqueError:
        return jsonify({"message": "CI ya registrado"}), 409
    except (ValidationError, TypeError) as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.patch("/<id>")
def update_client(id):
    """
    Actualizar cliente
    ---
    tags: [Clients]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              ci:        { type: string, maxLength: 20 }
              firstName: { type: string, maxLength: 100 }
              lastName:  { type: string, maxLength: 100 }
              sex:       { type: string, enum: [M, F, O] }
    responses:
      200: { description: Actualizado }
      404: { description: No encontrado }
      409: { description: CI ya registrado }
      400: { description: Datos inválidos }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de cliente inválido"}), 400

    data = request.get_json(silent=True) or {}
    try:
        c = Client.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Cliente no encontrado"}), 404

    # actualizar solo campos presentes
    for k in ["ci", "firstName", "lastName", "sex"]:
        if k in data:
            setattr(c, k, data[k])

    try:
        c.save()
        return jsonify(to_out_client(c))
    except NotUniqueError:
        return jsonify({"message": "CI ya registrado"}), 409
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.delete("/<id>")
def delete_client(id):
    """
    Eliminar cliente
    ---
    tags: [Clients]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200: { description: Eliminado }
      404: { description: No encontrado }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de cliente inválido"}), 400

    try:
        c = Client.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Cliente no encontrado"}), 404

    c.delete()
    return jsonify({"message": "Cliente eliminado"})

@bp.get("/<clientId>/invoices")
def list_invoices_by_client(clientId):
    """
    Listar facturas por cliente (paginado)
    ---
    tags: [Invoices]
    parameters:
      - in: path
        name: clientId
        required: true
        schema: { type: string }
      - in: query
        name: page
        schema: { type: integer, example: 1 }
      - in: query
        name: limit
        schema: { type: integer, example: 10 }
    responses:
      200: { description: Lista paginada }
      400: { description: Cliente inválido }
      404: { description: Cliente no encontrado }
    """
    from models.invoice_model import Invoice  # evitar ciclos de import

    if not ObjectId.is_valid(clientId):
        return jsonify({"message": "Cliente inválido"}), 400

    exists = Client.objects(id=clientId).only("id").first()
    if not exists:
        return jsonify({"message": "Cliente no encontrado"}), 404

    try:
        page = max(int(request.args.get("page", 1)), 1)
        limit = min(max(int(request.args.get("limit", 10)), 1), 100)
    except ValueError:
        return jsonify({"message": "Parámetros inválidos"}), 400

    skip = (page - 1) * limit
    query = Invoice.objects(client=clientId)
    total = query.count()
    items = query.order_by("-date", "-created_at").skip(skip).limit(limit)

    # usamos to_dict(populate=True) como en invoices router
    data = [inv.to_dict(populate=True) for inv in items]

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit if limit else 0,
        "items": data,
    })
