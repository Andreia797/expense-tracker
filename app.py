from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Inicializar a base de dados
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
    category = request.args.get('category')
    date = request.args.get('date')
    query = 'SELECT * FROM transactions WHERE 1=1'
    params = []

    if category:
        query += ' AND category=?'
        params.append(category)
    if date:
        query += ' AND date=?'
        params.append(date)

    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        transactions = cursor.fetchall()
    return jsonify(transactions)

    @app.route('/chart-data', methods=['GET'])
def get_chart_data():
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT category, SUM(amount) FROM transactions GROUP BY category")
        data = cursor.fetchall()
    labels = [row[0] for row in data]
    values = [row[1] for row in data]
    return jsonify({'labels': labels, 'values': values})

@app.route('/update/<int:id>', methods=['PUT'])
def update_transaction(id):
    data = request.get_json()
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''UPDATE transactions SET type=?, category=?, amount=?, date=? WHERE id=?''',
                       (data['type'], data['category'], data['amount'], data['date'], id))
        conn.commit()
    return jsonify({'message': 'Transaction updated successfully'})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM transactions WHERE id=?', (id,))
        conn.commit()
    return jsonify({'message': 'Transaction deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
