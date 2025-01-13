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
        return jsonify({"message": "Login successful", "idEmployee": account.idAccount, "role": account.role}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')

    account = Account.query.filter_by(email=email).first()
    if account:
        account.password = new_password
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200
    else:
        return jsonify({"message": "Account not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)