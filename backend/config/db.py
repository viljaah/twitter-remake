import psycopg2

try:
    conn = psycopg2.connect(
        host="dpg-cvjtdteuk2gs73a2tieg-a.frankfurt-postgres.render.com",
        port=5432,
        database="twitterdb_gr08",
        user="twitterdb_gr08_user",
        password="xFiH1DSWlOlBQIIgmHvU7rO0Te5yrjs5",
        sslmode="require"
    )
    print("Connection established successfully.")
except Exception as e:
    print("Error connecting to the database:", e)
