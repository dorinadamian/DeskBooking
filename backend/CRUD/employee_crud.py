from flask import Flask, jsonify, request
from script.models import *

# Get all employees
@app.route('/employees', methods=['GET'])
def get_employees():
    all_employees = Employee.query.all()
    return jsonify(employees_schema.dump(all_employees))

# Get an employee by ID
@app.route('/employees/<int:id>', methods=['GET'])
def get_employee_by_id(id):
    employee = Employee.query.get(id)
    if employee is None:
        return jsonify({"message": "Employee not found"}), 404
    return jsonify(employee_schema.dump(employee))

# Add a new employee
@app.route('/employees', methods=['POST'])
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
@app.route('/employees/<int:id>', methods=['PUT'])
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
@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee deleted'})

# Get employee details
@app.route('/employees/<int:employee_id>/details', methods=['GET'])
def get_employee_details(employee_id):
    employee = db.session.query(Employee, Department).join(Department, Employee.department == Department.idDepartment).filter(Employee.idEmployee == employee_id).first()

    if employee:
        manager = db.session.query(Employee).filter(Employee.department == employee.Employee.department, Employee.role == 'Manager').first()
        manager_name = f"{manager.firstName} {manager.lastName}" if manager else "No manager found"

        employee_data = {
            'id': employee.Employee.idEmployee,
            'firstName': employee.Employee.firstName,
            'lastName': employee.Employee.lastName,
            'role': employee.Employee.role,
            'department': employee.Department.department,
            'manager': manager_name
        }
        return jsonify(employee_data)
    else:
        return jsonify({'error': 'Employee not found'}), 404