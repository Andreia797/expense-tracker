from flask import Flask, render_template, request, redirect, jsonify
import sqlite3

app = Flask(__name__)

# Criar o banco de dados SQLite
def init_db():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS transactions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            type TEXT,
                            category TEXT,
                            amount REAL,
                            date TEXT)''')
        conn.commit()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_transaction():
    data = request.get_json()
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''INSERT INTO transactions (type, category, amount, date)
                          VALUES (?, ?, ?, ?)''',
                          (data['type'], data['category'], data['amount'], data['date']))
        conn.commit()
    return jsonify({'message': 'Transaction added successfully'})

@app.route('/transactions', methods=['GET'])
def get_transactions():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM transactions')
        transactions = cursor.fetchall()
    return jsonify(transactions)

if __name__ == '__main__':
    app.run(debug=True)
