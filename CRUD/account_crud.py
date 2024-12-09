from flask import Flask, jsonify, request
from script.models import *

# Get all accounts
@app.route('/accounts', methods=['GET'])
def get_accounts():
    all_accounts = Account.query.all()
    return jsonify(accounts_schema.dump(all_accounts))

# Get an account by ID
@app.route('/accounts/<int:id>', methods=['GET'])
def get_account_by_id(id):
    account = Account.query.get(id)
    if account is None:
        return jsonify({"message": "Account not found"}), 404
    return jsonify(account_schema.dump(account))

# Add a new account
@app.route('/accounts', methods=['POST'])
def add_account():
    data = request.json
    new_account = Account(
        email=data['email'],
        password=data['password'],
        role=data['role'],
        employee=data.get('employee')
    )
    db.session.add(new_account)
    db.session.commit()
    return account_schema.jsonify(new_account)

# Update an account
@app.route('/accounts/<int:id>', methods=['PUT'])
def update_account(id):
    account = Account.query.get_or_404(id)
    data = request.json
    account.email = data['email']
    account.password = data['password']
    account.role = data['role']
    account.employee = data.get('employee')
    db.session.commit()
    return account_schema.jsonify(account)

# Delete an account
@app.route('/accounts/<int:id>', methods=['DELETE'])
def delete_account(id):
    account = Account.query.get_or_404(id)
    db.session.delete(account)
    db.session.commit()
    return jsonify({'message': 'Account deleted'})

