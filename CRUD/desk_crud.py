from flask import Flask, jsonify, request
from script.models import *

# Get all desks
@app.route('/desks', methods=['GET'])
def get_desks():
    all_desks = Desk.query.all()
    return jsonify(desks_schema.dump(all_desks))

# Add a new desk
@app.route('/desk', methods=['POST'])
def add_desk():
    data = request.json
    new_desk = Desk(availability=data['availability'])
    db.session.add(new_desk)
    db.session.commit()
    return desk_schema.jsonify(new_desk)

# Update a desk
@app.route('/desk/<int:id>', methods=['PUT'])
def update_desk(id):
    desk = Desk.query.get_or_404(id)
    data = request.json
    desk.availability = data['availability']
    db.session.commit()
    return desk_schema.jsonify(desk)

# Delete a desk
@app.route('/desk/<int:id>', methods=['DELETE'])
def delete_desk(id):
    desk = Desk.query.get_or_404(id)
    db.session.delete(desk)
    db.session.commit()
    return jsonify({'message': 'Desk deleted'})
