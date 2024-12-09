from flask import Flask, jsonify, request
from script.models import *

# Get all departments
@app.route('/departments', methods=['GET'])
def get_departments():
    all_departments = Department.query.all()
    return jsonify(departments_schema.dump(all_departments))

# Get a department by ID
@app.route('/departments/<int:id>', methods=['GET'])
def get_department_by_id(id):
    department = Department.query.get(id)
    if department is None:
        return jsonify({"message": "Department not found"}), 404
    return jsonify(department_schema.dump(department))

# Add a new department
@app.route('/departments', methods=['POST'])
def add_department():
    data = request.json
    new_department = Department(department=data['department'])
    db.session.add(new_department)
    db.session.commit()
    return department_schema.jsonify(new_department)

# Update a department
@app.route('/departments/<int:id>', methods=['PUT'])
def update_department(id):
    department = Department.query.get_or_404(id)
    data = request.json
    department.department = data['department']
    db.session.commit()
    return department_schema.jsonify(department)

# Delete a department
@app.route('/departments/<int:id>', methods=['DELETE'])
def delete_department(id):
    department = Department.query.get_or_404(id)
    db.session.delete(department)
    db.session.commit()
    return jsonify({'message': 'Department deleted'})
