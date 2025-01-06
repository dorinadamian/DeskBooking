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

# Get bookings for a specific employee
@app.route('/bookings/employee/<int:employee_id>', methods=['GET'])
def get_bookings_by_employee(employee_id):
    bookings = db.session.query(Booking, Desk, Location).join(Desk, Booking.desk == Desk.idDesk).join(Location, Desk.location == Location.idLocation).filter(Booking.employee == employee_id).order_by(Booking.bookingDate.asc()).all()
    result = []
    for booking, desk, location in bookings:
        result.append({
            'id': booking.idBooking,
            'desk': desk.deskNumber,
            'location': f"{location.city}, {location.country}",
            'date': booking.bookingDate.strftime('%d/%m/%Y'),
            'from': booking.startTime.strftime('%H:%M'),  # 24H format
            'to': booking.endTime.strftime('%H:%M')
        })
    return jsonify(result)
