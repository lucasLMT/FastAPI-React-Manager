from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import Session
from .databasemodels.databasemodels import Base

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

def getDbSession():
    return Session(engine)

def close_db(db):
    db.close()

def print_all_tables(engine):
    # To load metdata and existing database schema
    metadata = MetaData()
    metadata.reflect(bind=engine)
    
    tables = metadata.tables.keys()
    
    print("List of tables:")
    for table in tables:
        print(table)

def initDatabase():
    print("initDatabase")
    try:
        engine.connect()
        print(engine)
    except Exception as e:
        print(e)

    Base.metadata.create_all(engine)
    print_all_tables(engine)