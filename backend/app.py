from flask import request, jsonify
from import_file import *
from script.models import *

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    account = Account.query.filter_by(email=email, password=password).first()
    if account:
        return jsonify({"message": "Login successful", "idEmployee": account.idAccount}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)