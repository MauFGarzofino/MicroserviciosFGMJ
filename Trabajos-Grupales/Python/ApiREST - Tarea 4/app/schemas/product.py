from pydantic import BaseModel, Field
from typing import Optional, List

class ProductBase(BaseModel):
    name: str = Field(..., max_length=150, description="Nombre del producto")
    description: Optional[str] = None
    brand: Optional[str] = None
    stock: int = Field(0, ge=0, description="Stock >= 0")

class CreateProductDto(ProductBase):
    pass

class UpdateProductDto(BaseModel):
    name: Optional[str] = Field(None, max_length=150)
    description: Optional[str] = None
    brand: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)

class ProductOut(ProductBase):
    id: str

class PaginatedProductResponse(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int
    items: List[ProductOut]
