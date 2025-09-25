from flask import Blueprint, request, jsonify
from bson import ObjectId
from mongoengine import DoesNotExist, ValidationError
from models.invoice_model import Invoice, InvoiceDetail
from models.product_model import Product

bp = Blueprint("invoice_details", __name__)

def product_out(p: Product):
    if not p:
        return None
    return {
        "_id": str(p.id),
        "id": str(p.id),
        "name": p.name,
        "brand": p.brand,
    }

def detail_out(d: InvoiceDetail):
    return {
        "_id": str(d.id),
        "id": str(d.id),
        "product": product_out(d.product),
        "quantity": d.quantity,
        "unitPrice": d.unitPrice,
    }

@bp.get("/")
def list_details(invoiceId):
    """
    Listar detalles de una factura
    ---
    tags: [InvoiceDetails]
    """
    if not ObjectId.is_valid(invoiceId):
        return jsonify({"message": "ID de factura inválido"}), 400

    try:
        inv = Invoice.objects.get(id=invoiceId)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404

    # “populate” manual: cargar productos referenciados
    prod_ids = [d.product.id for d in inv.details if d.product]
    prods = {str(p.id): p for p in Product.objects(id__in=prod_ids).only("name", "brand")}
    # rehacer product refs desde cache
    for d in inv.details:
        if d.product:
            d.product = prods.get(str(d.product.id), d.product)

    return jsonify([detail_out(d) for d in inv.details])

@bp.post("/")
def add_detail(invoiceId):
    """
    Agregar detalle a la factura
    ---
    tags: [InvoiceDetails]
    """
    if not ObjectId.is_valid(invoiceId):
        return jsonify({"message": "ID de factura inválido"}), 400

    data = request.get_json(silent=True) or {}
    product_id = data.get("productId")
    quantity   = data.get("quantity")
    unit_price = data.get("unitPrice")

    if not ObjectId.is_valid(product_id):
        return jsonify({"message": "Producto inválido"}), 400

    # Validaciones numéricas
    try:
        quantity = int(quantity)
        unit_price = float(unit_price)
    except (TypeError, ValueError):
        return jsonify({"message": "quantity y unitPrice deben ser numéricos válidos"}), 422
    if quantity < 1 or unit_price < 0:
        return jsonify({"message": "quantity >= 1 y unitPrice >= 0"}), 422

    try:
        inv = Invoice.objects.get(id=invoiceId)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404

    p = Product.objects(id=product_id).only("id", "name", "brand").first()
    if not p:
        return jsonify({"message": "Producto inválido"}), 400

    # Agregar el item
    new_detail = InvoiceDetail(product=p, quantity=quantity, unitPrice=unit_price)
    inv.details.append(new_detail)

    try:
        inv.save()  # genera id del subdoc
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

    # Devolver el último con “populate”
    created = inv.details[-1]
    # popular producto (ya lo tenemos)
    created.product = p
    return jsonify(detail_out(created)), 201

@bp.patch("/<detailId>")
def update_detail(invoiceId, detailId):
    """
    Actualizar detalle de factura
    ---
    tags: [InvoiceDetails]
    """
    if not ObjectId.is_valid(invoiceId):
        return jsonify({"message": "ID de factura inválido"}), 400
    if not ObjectId.is_valid(detailId):
        return jsonify({"message": "ID de detalle inválido"}), 400

    data = request.get_json(silent=True) or {}

    try:
        inv = Invoice.objects.get(id=invoiceId)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404

    idx = inv.find_detail_index(detailId)
    if idx < 0:
        return jsonify({"message": "Detalle no encontrado"}), 404

    det = inv.details[idx]

    # Actualizar product
    if "productId" in data:
        pid = data.get("productId")
        if not ObjectId.is_valid(pid):
            return jsonify({"message": "Producto inválido"}), 400
        p = Product.objects(id=pid).only("id", "name", "brand").first()
        if not p:
            return jsonify({"message": "Producto inválido"}), 400
        det.product = p

    # Actualizar quantity
    if "quantity" in data:
        try:
            q = int(data.get("quantity"))
        except (TypeError, ValueError):
            return jsonify({"message": "quantity debe ser un entero >= 1"}), 422
        if q < 1:
            return jsonify({"message": "quantity debe ser >= 1"}), 422
        det.quantity = q

    # Actualizar unitPrice
    if "unitPrice" in data:
        try:
            up = float(data.get("unitPrice"))
        except (TypeError, ValueError):
            return jsonify({"message": "unitPrice debe ser un número >= 0"}), 422
        if up < 0:
            return jsonify({"message": "unitPrice debe ser >= 0"}), 422
        det.unitPrice = up

    try:
        inv.save()
    except ValidationError as e:
        return jsonify({"message": "Datos inválidos", "error": str(e)}), 400

    # “populate” del producto
    if det.product:
        det.product = Product.objects(id=det.product.id).only("name", "brand").first() or det.product

    return jsonify(detail_out(det))

@bp.delete("/<detailId>")
def delete_detail(invoiceId, detailId):
    """
    Eliminar detalle de factura
    ---
    tags: [InvoiceDetails]
    """
    if not ObjectId.is_valid(invoiceId):
        return jsonify({"message": "ID de factura inválido"}), 400
    if not ObjectId.is_valid(detailId):
        return jsonify({"message": "ID de detalle inválido"}), 400

    try:
        inv = Invoice.objects.get(id=invoiceId)
    except DoesNotExist:
        return jsonify({"message": "Factura no encontrada"}), 404

    idx = inv.find_detail_index(detailId)
    if idx < 0:
        return jsonify({"message": "Detalle no encontrado"}), 404

    # eliminar por índice
    inv.details.pop(idx)
    inv.save()
    return jsonify({"message": "Detalle eliminado"})
