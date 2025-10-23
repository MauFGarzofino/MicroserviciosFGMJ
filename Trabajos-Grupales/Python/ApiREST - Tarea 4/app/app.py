from flask import Flask, jsonify
from flask_cors import CORS
from flasgger import Swagger
from db import init_db
from routes.products import bp as products_bp
from routes.clients import bp as clients_bp
from routes.invoices import bp as invoices_bp
from routes.invoice_details import bp as invoice_details_bp

def create_app():
    app = Flask(__name__)

    CORS(app)
    init_db()

    # Registrar Blueprints
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(invoices_bp, url_prefix="/api/invoices")
    app.register_blueprint(clients_bp,  url_prefix="/api/clients") 
    app.register_blueprint(invoice_details_bp, url_prefix="/api/invoices/<invoiceId>/details")

    # Swagger (flasgger)
    template = {
        "swagger": "2.0",
        "info": {
            "title": "Sales API (Flask)",
            "description": "API REST de ventas (Products, Clients, Invoices)",
            "version": "1.0.0"
        },
        "basePath": "/",
        "schemes": ["http"],
        "securityDefinitions": {},
        "tags": [
            {"name": "Products", "description": "Gestión de productos"},
            {"name": "Invoices", "description": "Gestión de facturas"},
            {"name": "Clients", "description": "Gestión de clientes"},
            {"name": "InvoiceDetails", "description": "Gestión de detalles de factura"},
        ],
    }
    Swagger(app, template=template)

    # Handlers simples
    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"message": "Ruta no encontrada"}), 404

    @app.errorhandler(500)
    def internal(_e):
        return jsonify({"message": "Error interno del servidor"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
