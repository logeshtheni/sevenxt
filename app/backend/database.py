import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="sevenext",
            port=3306
        )
    except Error as e:
        print(f"Database connection error: {e}")
        raise Exception("Failed to connect to the database")