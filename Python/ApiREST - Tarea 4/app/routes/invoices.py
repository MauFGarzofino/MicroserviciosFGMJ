from flask import Blueprint, request, jsonify
from mongoengine import DoesNotExist, ValidationError
from bson import ObjectId
from datetime import datetime
from models.invoice_model import Invoice
from models.client_model import Client

bp = Blueprint("invoices", __name__)

def parse_iso_date(s: str):
    if not s:
        return None
    try:
        # ISO-8601 simple (YYYY-MM-DD)
        if len(s) == 10:
            return datetime.fromisoformat(s)
        # manejar 'Z' -> +00:00
        if s.endswith("Z"):
            s = s.replace("Z", "+00:00")
        return datetime.fromisoformat(s)
    except Exception:
        return None

@bp.get("/")
def list_invoices():
    """
    Listar facturas con paginación
    ---
    tags: [Invoices]
    parameters:
      - in: query
        name: page
        schema: { type: integer, example: 1 }
      - in: query
        name: limit
        schema: { type: integer, example: 10 }
    responses:
      200:
        description: Lista paginada de facturas
    """
    try:
        page = max(int(request.args.get("page", 1)), 1)
        limit = min(max(int(request.args.get("limit", 10)), 1), 100)
    except ValueError:
        return jsonify({"message": "Parámetros inválidos"}), 400

    skip = (page - 1) * limit

    # orden: date DESC, createdAt DESC
    query = Invoice.objects
    total = query.count()
    items = query.order_by("-date", "-created_at").skip(skip).limit(limit)

    # “populate” manual al serializar (to_dict(populate=True))
    data = [inv.to_dict(populate=True) for inv in items]

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit if limit else 0,
        "items": data,
    })

@bp.get("/<id>")
def get_invoice(id):
    """
    Obtener factura por ID
    ---
    tags: [Invoices]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200:
        description: Factura encontrada
      400:
        description: ID inválido
      404:
        description: No encontrada
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de factura inválido"}), 400
    try:
        inv = Invoice.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404
    return jsonify(inv.to_dict(populate=True))

@bp.post("/")
def create_invoice():
    """
    Crear factura
    ---
    tags: [Invoices]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [date, clientId]
            properties:
              date: { type: string, example: "2025-09-05" }
              clientId: { type: string }
    responses:
      201:
        description: Creado
      400:
        description: Datos inválidos
    """
    data = request.get_json(silent=True) or {}
    date_str = data.get("date")
    client_id = data.get("clientId")

    parsed = parse_iso_date(date_str)
    if not parsed:
        return jsonify({"message": "Fecha inválida (use ISO-8601 o YYYY-MM-DD)"}), 400

    if not ObjectId.is_valid(client_id):
        return jsonify({"message": "Cliente inválido"}), 400

    client = Client.objects(id=client_id).only("id").first()
    if not client:
        return jsonify({"message": "Cliente inválido"}), 400

    try:
        inv = Invoice(date=parsed, client=client, details=[])
        inv.save()
        return jsonify(inv.to_dict(populate=True)), 201
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.patch("/<id>")
def update_invoice(id):
    """
    Actualizar factura
    ---
    tags: [Invoices]
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
              date: { type: string, example: "2025-09-05" }
              clientId: { type: string }
    responses:
      200:
        description: Actualizada
      400:
        description: Datos inválidos
      404:
        description: No encontrada
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de factura inválido"}), 400

    data = request.get_json(silent=True) or {}
    try:
        inv = Invoice.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404

    if "date" in data:
        parsed = parse_iso_date(data.get("date"))
        if not parsed:
            return jsonify({"message": "Fecha inválida (use ISO-8601 o YYYY-MM-DD)"}), 400
        inv.date = parsed

    if "clientId" in data:
        client_id = data.get("clientId")
        if not ObjectId.is_valid(client_id):
            return jsonify({"message": "Cliente inválido"}), 400
        client = Client.objects(id=client_id).only("id").first()
        if not client:
            return jsonify({"message": "Cliente inválido"}), 400
        inv.client = client

    try:
        inv.save()
        return jsonify(inv.to_dict(populate=True))
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.delete("/<id>")
def delete_invoice(id):
    """
    Eliminar factura
    ---
    tags: [Invoices]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200:
        description: Eliminada
      400:
        description: ID inválido
      404:
        description: No encontrada
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID de factura inválido"}), 400
    try:
        inv = Invoice.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrado"}), 404

    inv.delete()
    return jsonify({"message": "Factura eliminada"})
