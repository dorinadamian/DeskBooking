from flask import Flask, jsonify, request
from script.models import *

# Get all accounts
@app.route('/accounts', methods=['GET'])
def get_accounts():
    all_accounts = Account.query.all()
    return jsonify(accounts_schema.dump(all_accounts))

# Add a new account
@app.route('/account', methods=['POST'])
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
@app.route('/account/<int:id>', methods=['PUT'])
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
@app.route('/account/<int:id>', methods=['DELETE'])
def delete_account(id):
    account = Account.query.get_or_404(id)
    db.session.delete(account)
    db.session.commit()
    return jsonify({'message': 'Account deleted'})

