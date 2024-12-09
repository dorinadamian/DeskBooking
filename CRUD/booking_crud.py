from flask import Flask, jsonify, request
from script.models import *

# Get all bookings
@app.route('/bookings', methods=['GET'])
def get_bookings():
    all_bookings = Booking.query.all()
    return jsonify(bookings_schema.dump(all_bookings))

# Get a booking by ID
@app.route('/bookings/<int:id>', methods=['GET'])
def get_booking_by_id(id):
    booking = Booking.query.get(id)
    if booking is None:
        return jsonify({"message": "Booking not found"}), 404
    return jsonify(booking_schema.dump(booking))

# Add a new booking
@app.route('/bookings', methods=['POST'])
def add_booking():
    data = request.json
    new_booking = Booking(
        bookingDate=data['bookingDate'],
        startTime=data['startTime'],
        endTime=data['endTime'],
        employee=data['employee'],
        desk=data['desk']
    )
    db.session.add(new_booking)
    db.session.commit()
    return booking_schema.jsonify(new_booking)

# Update a booking
@app.route('/bookings/<int:id>', methods=['PUT'])
def update_booking(id):
    booking = Booking.query.get_or_404(id)
    data = request.json
    booking.bookingDate = data['bookingDate']
    booking.startTime = data['startTime']
    booking.endTime = data['endTime']
    booking.employee = data['employee']
    booking.desk = data['desk']
    db.session.commit()
    return booking_schema.jsonify(booking)

# Delete a booking
@app.route('/bookings/<int:id>', methods=['DELETE'])
def delete_booking(id):
    booking = Booking.query.get_or_404(id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted'})
