from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://twitterdb_gr08_user:xFiH1DSWlOlBQIIgmHvU7rO0Te5yrjs5@dpg-cvjtdteuk2gs73a2tieg-a.frankfurt-postgres.render.com:5432/twitterdb_gr08?sslmode=require"

# create the engine and test the connection
try:
    engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
    with engine.connect() as connection:
        print("Successfully connected to database")
except Exception as e:
    print("Error connecting to the database:", e)

# creates a factory for making database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# this is what the schemas will inherit from
Base = declarative_base()

# the function gives FastAPI access to the database
def get_db():
    db = SessionLocal()
    try:
        yield db # this gives the database connection to your API endpoint
    finally:
        db.close() # makes sure taht the connection is closed even if there's an error
