from typing import Union
from fastapi import FastAPI, Body, Request, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from contextlib import asynccontextmanager
from models.models import UserModel, Token
from auth.auth import authenticate_user, create_access_token, get_password_hash
from repository.databaseprovider import initDatabase, getDbSession
from repository.databasemodels.databasemodels import User, Project, Task
from models.models import UserModel, ProjectModel, TaskModel
from auth.auth import get_current_user
from datetime import date
from utilities.utilities import AlchemyEncoder
import json
from uuid import UUID
from repository.serializers.databaseSerializer import serialize_complex

async def startup():
    print("startup")
    initDatabase()

async def shutdown():
    pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup()
    yield
    await shutdown()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "localhost:5173",
    "http://localhost:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/user/token")
async def get_user(request: Request, user=Body(...)):
    email = user.get("email")
    try:
        session = getDbSession()
        user_database = session.query(User).filter(User.email == email).first()
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)  

    if user_database is None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "Usuário não encontrado."})
    elif authenticate_user(email, user.get("password"), user_database.password): 
        print("Usuário autenticado.")                 
        access_token = create_access_token({"sub": str(user_database.id), "email": user_database.email})
        print(access_token)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Authenticated", "access_token": access_token, "token_type": "bearer"},
                             headers={"x-auth-token": access_token, "access-control-expose-headers": "x-auth-token"})
    
@app.post("/user/register")
async def register_user(request: Request, user=Body(...)):
    session = getDbSession()
    user = session.query(User).filter(User.email == user.get("email")).first()
    if (user is None):
        try:
            user["password"] = get_password_hash(user["password"])
            loginUser = UserModel(email=user.get("email"), password=user["password"])
            session.add(User(**loginUser.model_dump()))
            session.commit()
            return JSONResponse(status_code=status.HTTP_201_CREATED, content="Usuário criado com sucesso!")
        except Exception as e:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)
    else:
        message = "Já existe um usuário com esse email. " + user.email
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=message)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

################## Project Router ########################

@app.post("/project")
async def add_project(request: Request, project=Body(...)):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except Exception as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})

    session = getDbSession()
    project_database = session.query(Project).filter(Project.title == project.get("title")).first()
    if (project_database is None):
        try:
            startDate = str(project.get("startDate")).replace("/", "")
            newDate = date(int(startDate[4:8]), int(startDate[2:4]), int(startDate[0:2]))
            print(newDate)
            newProject = ProjectModel(title=project.get("title"), start=newDate)
            session.add(Project(**newProject.model_dump()))
            session.commit()
            return JSONResponse(status_code=status.HTTP_201_CREATED, content="Projeto criado com sucesso!")
        except Exception as e:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)
    else:
        message = "Já existe um projeto com esse título. " + project.title
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=message)
    
@app.get("/projects")
async def get_projects(request: Request):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except Exception as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})
    session = getDbSession()
    projects_database = session.query(Project).all()
    projects_serialized = json.dumps(serialize_complex(projects_database), indent=0)
    try:
        session = getDbSession()
        projects_database = session.query(Project)
        return JSONResponse(status_code=status.HTTP_200_OK, content=projects_serialized)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)
    
@app.delete("/projects/{id}")
async def delete_project(id: str, request: Request):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})

    try:
        session = getDbSession()
        project = session.query(Project).filter(Project.id == UUID(id).hex).first()
        if project is None:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content="Projeto não encotrado!")
        else:
            session.delete(project)
            session.commit()
            return JSONResponse(status_code=status.HTTP_200_OK, content="Projeto deletado com sucesso!")
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)

@app.put("/projects/{id}")
async def update_project(id: str, request: Request, project=Body(...)):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})

    try:
        session = getDbSession()
        projectUpdate = session.query(Project).filter(Project.id == UUID(id).hex).first()
        if projectUpdate is None:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content="Projeto não encotrado!")
        else:
            projectUpdate.title = project.get("title")
            startDate = str(project.get("startDate")).replace("/", "")
            newDate = date(int(startDate[4:8]), int(startDate[2:4]), int(startDate[0:2]))
            projectUpdate.start = newDate
            session.commit()
            session.refresh(projectUpdate)
            return JSONResponse(status_code=status.HTTP_200_OK, content="Projeto atualizado com sucesso!")
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=e)