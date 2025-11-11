import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Garg2004*',
    database='intellios'
)
print("Connected successfully!")
connection.close()