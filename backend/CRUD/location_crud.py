from flask import Flask, jsonify, request
from script.models import *

# Get all locations
@app.route('/locations', methods=['GET'])
def get_locations():
    all_locations = Location.query.all()
    return jsonify(locations_schema.dump(all_locations))

# Get a location by ID
@app.route('/locations/<int:id>', methods=['GET'])
def get_location_by_id(id):
    location = Location.query.get(id)
    if location is None:
        return jsonify({"message": "Location not found"}), 404
    return jsonify(location_schema.dump(location))

# Add a new location
@app.route('/locations', methods=['POST'])
def add_location():
    data = request.json
    new_location = Location(country=data['country'], city=data['city'])
    db.session.add(new_location)
    db.session.commit()
    return location_schema.jsonify(new_location)

# Update a location
@app.route('/locations/<int:id>', methods=['PUT'])
def update_location(id):
    location = Location.query.get_or_404(id)
    data = request.json
    location.country = data['country']
    location.city = data['city']
    db.session.commit()
    return location_schema.jsonify(location)

# Delete a location
@app.route('/locations/<int:id>', methods=['DELETE'])
def delete_location(id):
    location = Location.query.get_or_404(id)
    db.session.delete(location)
    db.session.commit()
    return jsonify({'message': 'Location deleted'})