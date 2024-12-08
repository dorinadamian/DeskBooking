from flask import Flask, jsonify, request
from script.models import *

@app.route('/departments', methods=['GET'])
def get_departments():
    all_departments = Department.query.all()
    return jsonify(departments_schema.dump(all_departments))

@app.route('/department', methods=['POST'])
def add_department():
    data = request.json
    new_department = Department(department=data['department'])
    db.session.add(new_department)
    db.session.commit()
    return department_schema.jsonify(new_department)

@app.route('/department/<int:id>', methods=['PUT'])
def update_department(id):
    department = Department.query.get_or_404(id)
    data = request.json
    department.department = data['department']
    db.session.commit()
    return department_schema.jsonify(department)

@app.route('/department/<int:id>', methods=['DELETE'])
def delete_department(id):
    department = Department.query.get_or_404(id)
    db.session.delete(department)
    db.session.commit()
    return jsonify({'message': 'Department deleted'})
