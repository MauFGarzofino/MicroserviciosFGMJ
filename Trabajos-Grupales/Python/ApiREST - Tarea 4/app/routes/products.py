# routes/products.py
from flask import Blueprint, request, jsonify
from mongoengine import DoesNotExist, ValidationError
from bson import ObjectId
from models.product_model import Product

bp = Blueprint("products", __name__)

def to_out(p: Product):
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "brand": p.brand,
        "stock": p.stock,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

@bp.get("/")
def list_products():
    """
    Listar productos (paginado)
    ---
    tags: [Products]
    parameters:
      - in: query
        name: page
        schema: { type: integer, example: 1 }
        description: Número de página (>=1)
      - in: query
        name: limit
        schema: { type: integer, example: 10 }
        description: Registros por página (<=100)
      - in: query
        name: search
        schema: { type: string }
        description: Filtro por nombre (contiene, case-insensitive)
    responses:
      200:
        description: Lista paginada de productos
    """
    try:
        page = int(request.args.get("page", 1))
        limit = min(int(request.args.get("limit", 10)), 100)
        if page < 1 or limit < 1:
            return jsonify({"message": "Parámetros inválidos"}), 400
    except ValueError:
        return jsonify({"message": "Parámetros inválidos"}), 400

    search = request.args.get("search")
    query = Product.objects
    if search:
        query = query.filter(name__icontains=search)

    total = query.count()
    skip = (page - 1) * limit
    items = query.order_by("-created_at").skip(skip).limit(limit)

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit if limit else 0,
        "items": [to_out(p) for p in items],
    })

@bp.get("/<id>")
def get_product(id):
    """
    Obtener producto por id
    ---
    tags: [Products]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200: { description: OK }
      400: { description: ID inválido }
      404: { description: No encontrado }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID inválido"}), 400
    try:
        p = Product.objects.get(id=id)
        return jsonify(to_out(p))
    except DoesNotExist:
        return jsonify({"message": "Producto no encontrado"}), 404
    except ValidationError as e:
        # Por si llega otro formato inválido
        return jsonify({"message": "ID inválido", "error": str(e)}), 400

@bp.post("/")
def create_product():
    """
    Crear producto
    ---
    tags:
      - Products
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [name]
          properties:
            name:
              type: string
              maxLength: 150
            description:
              type: string
            brand:
              type: string
            stock:
              type: integer
              minimum: 0
        examples:
          ejemplo:
            value:
              name: "Servilletas"
              description: "Paquete x 100"
              brand: "Scott"
              stock: 30
    responses:
      201:
        description: Creado
      400:
        description: Datos inválidos
    """
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name or not isinstance(name, str) or len(name) > 150:
        return jsonify({"message": "name es requerido (máx. 150)"}), 400

    stock = data.get("stock", 0)
    try:
        if stock is not None:
            stock = int(stock)
        if stock is None or stock < 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"message": "stock debe ser entero >= 0"}), 400

    try:
        p = Product(
            name=name,
            description=data.get("description"),
            brand=data.get("brand"),
            stock=stock,
        ).save()
        return jsonify(to_out(p)), 201
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.patch("/<id>")
def update_product(id):
    """
    Actualizar producto
    ---
    tags: [Products]
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
              name: { type: string, maxLength: 150 }
              description: { type: string }
              brand: { type: string }
              stock: { type: integer, minimum: 0 }
    responses:
      200: { description: OK }
      400: { description: ID o body inválido }
      404: { description: No encontrado }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID inválido"}), 400

    data = request.get_json(silent=True) or {}
    try:
        p = Product.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Producto no encontrado"}), 404
    except ValidationError:
        return jsonify({"message": "ID inválido"}), 400

    # actualizar solo campos presentes (y válidos)
    if "name" in data:
        name = data.get("name")
        if name is not None:
            if not isinstance(name, string_types := str) or len(name) > 150 or len(name) == 0:
                return jsonify({"message": "name debe ser string 1..150"}), 400
            p.name = name

    for k in ["description", "brand"]:
        if k in data:
            v = data.get(k)
            if v is not None and not isinstance(v, str):
                return jsonify({"message": f"{k} debe ser string"}), 400
            setattr(p, k, v)

    if "stock" in data:
        try:
            st = data.get("stock")
            if st is not None:
                st = int(st)
            if st is None or st < 0:
                raise ValueError()
            p.stock = st
        except (ValueError, TypeError):
            return jsonify({"message": "stock debe ser entero >= 0"}), 400

    try:
        p.save()
        return jsonify(to_out(p))
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

@bp.delete("/<id>")
def delete_product(id):
    """
    Eliminar producto
    ---
    tags: [Products]
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200: { description: Eliminado }
      400: { description: ID inválido }
      404: { description: No encontrado }
      409: { description: En uso en facturas }
    """
    if not ObjectId.is_valid(id):
        return jsonify({"message": "ID inválido"}), 400

    try:
        p = Product.objects.get(id=id)
    except DoesNotExist:
        return jsonify({"message": "Producto no encontrado"}), 404
    except ValidationError:
        return jsonify({"message": "ID inválido"}), 400

    # Evitar borrar si está referenciado en detalles de facturas
    from models.invoice_model import Invoice
    in_use = Invoice.objects(details__product=id).only("id").first()
    if in_use:
        return jsonify({"message": "No se puede eliminar: el producto está usado en facturas"}), 409

    p.delete()
    return jsonify({"message": "Producto eliminado"})
