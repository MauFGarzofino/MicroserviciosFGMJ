from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mongoengine import ValidationError, DoesNotExist, NotUniqueError

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(ValidationError)
    async def handle_validation_error(_req: Request, exc: ValidationError):
        return JSONResponse(status_code=400, content={
            "message": "Datos inválidos",
            "errors": str(exc)
        })

    @app.exception_handler(DoesNotExist)
    async def handle_not_found(_req: Request, _exc: DoesNotExist):
        return JSONResponse(status_code=404, content={"message": "Recurso no encontrado"})

    @app.exception_handler(NotUniqueError)
    async def handle_conflict(_req: Request, exc: NotUniqueError):
        return JSONResponse(status_code=409, content={
            "message": "Conflicto de unicidad",
            "errors": str(exc)
        })

    @app.exception_handler(Exception)
    async def handle_generic_error(_req: Request, exc: Exception):
        # Loguear exc si quieres
        return JSONResponse(status_code=500, content={
            "message": "Error interno del servidor"
        })
