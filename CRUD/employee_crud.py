from flask import Flask, jsonify, request
from script.models import *

# Get all employees
@app.route('/employees', methods=['GET'])
def get_employees():
    all_employees = Employee.query.all()
    return jsonify(employees_schema.dump(all_employees))

# Add a new employee
@app.route('/employee', methods=['POST'])
def add_employee():
    data = request.json
    print(data)
    new_employee = Employee(
        lastName=data['lastName'],
        firstName=data['firstName'],
        role=data['role'],
        department=data.get('department')
    )
    db.session.add(new_employee)
    db.session.commit()
    return employee_schema.jsonify(new_employee)

# Update an employee
@app.route('/employee/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    data = request.json
    employee.lastName = data['lastName']
    employee.firstName = data['firstName']
    employee.role = data['role']
    employee.department = data.get('department')
    db.session.commit()
    return employee_schema.jsonify(employee)

# Delete an employee
@app.route('/employee/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee deleted'})
