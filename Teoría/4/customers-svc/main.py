from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Dict
from uuid import uuid4

app = FastAPI(title="customers-svc")

class CustomerIn(BaseModel):
    name: str
    email: EmailStr

class CustomerOut(CustomerIn):
    id: str

db: Dict[str, CustomerOut] = {}

@app.get("/health")
def health():
    return {"ok": True, "service": "customers"}

@app.get("/customers", response_model=list[CustomerOut])
def list_customers():
    return list(db.values())

@app.get("/customers/{cid}", response_model=CustomerOut)
def get_customer(cid: str):
    if cid not in db:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db[cid]

@app.post("/customers", response_model=CustomerOut, status_code=201)
def create_customer(payload: CustomerIn):
    cid = uuid4().hex[:8]
    # payload ya está validado por FastAPI/Pydantic
    cust = CustomerOut(id=cid, **payload.model_dump())
    db[cid] = cust
    return cust

@app.put("/customers/{cid}", response_model=CustomerOut)
def put_customer(cid: str, payload: CustomerIn):
    if cid not in db:
        raise HTTPException(status_code=404, detail="Customer not found")
    cust = CustomerOut(id=cid, **payload.model_dump())
    db[cid] = cust
    return cust

@app.patch("/customers/{cid}", response_model=CustomerOut)
def patch_customer(cid: str, payload: dict):
    if cid not in db:
        raise HTTPException(status_code=404, detail="Customer not found")
    curr = db[cid].model_dump()
    curr.update(payload)
    # Revalida el resultado final
    try:
        cust = CustomerOut(**curr)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid fields")
    db[cid] = cust
    return cust

@app.delete("/customers/{cid}", status_code=204)
def delete_customer(cid: str):
    if cid not in db:
        raise HTTPException(status_code=404, detail="Customer not found")
    del db[cid]
    return
