from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/deskBookingDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Define models
class Department(db.Model):
    __tablename__ = 'tblDepartment'
    idDepartment = db.Column(db.Integer, primary_key=True)
    department = db.Column(db.String(100), nullable=False)
    # One-to-Many: Department -> Employees
    employees = db.relationship('Employee', backref='department_ref', cascade='all, delete, delete-orphan', passive_deletes=True)


class Employee(db.Model):
    __tablename__ = 'tblEmployee'
    idEmployee = db.Column(db.Integer, primary_key=True)
    lastName = db.Column(db.String(50), nullable=False)
    firstName = db.Column(db.String(50), nullable=False)
    role = db.Column(db.Enum('Manager', 'Employee'), nullable=False)
    department = db.Column(db.Integer, db.ForeignKey('tblDepartment.idDepartment', ondelete='CASCADE', onupdate='CASCADE'), nullable=True)

    # One-to-One: Employee -> Account
    account = db.relationship('Account', backref='employee_ref', uselist=False, cascade='all, delete, delete-orphan', passive_deletes=True)

    # One-to-Many: Employee -> Bookings
    bookings = db.relationship('Booking', backref='employee_ref', cascade='all, delete, delete-orphan', passive_deletes=True)


class Account(db.Model):
    __tablename__ = 'tblAccount'
    idAccount = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=True, unique=True)
    password = db.Column(db.String(50), nullable=True)
    role = db.Column(db.Enum('User', 'Admin'), nullable=False)
    employee = db.Column(db.Integer, db.ForeignKey('tblEmployee.idEmployee',  ondelete='CASCADE', onupdate='CASCADE'), nullable=True)

class Desk(db.Model):
    __tablename__ = 'tblDesk'
    idDesk = db.Column(db.Integer, primary_key=True)
    availability = db.Column(db.Enum('Free', 'Busy'), nullable=False)

    # One-to-Many: Desk -> Bookings
    bookings = db.relationship('Booking', backref='desk_ref', cascade='all, delete, delete-orphan', passive_deletes=True)

class Booking(db.Model):
    __tablename__ = 'tblBooking'
    idBooking = db.Column(db.Integer, primary_key=True)
    bookingDate = db.Column(db.Date, nullable=False)
    startTime = db.Column(db.Time, nullable=False)
    endTime = db.Column(db.Time, nullable=False)
    employee = db.Column(db.Integer, db.ForeignKey('tblEmployee.idEmployee', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    desk = db.Column(db.Integer, db.ForeignKey('tblDesk.idDesk', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

# Define schemas using Marshmallow
class DepartmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Department
        load_instance = True

class EmployeeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Employee
        load_instance = True
    # Nested department schema
    department_ref = ma.Nested('DepartmentSchema', many=False)

class AccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Account
        load_instance = True
    employee_ref = ma.Nested('EmployeeSchema', many=False)

class DeskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Desk
        load_instance = True

class BookingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        load_instance = True
    employee_ref = ma.Nested('EmployeeSchema', many=False)
    desk_ref = ma.Nested('DeskSchema', many=False)

# Initialize schemas
department_schema = DepartmentSchema()
departments_schema = DepartmentSchema(many=True)

employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)

account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)

desk_schema = DeskSchema()
desks_schema = DeskSchema(many=True)

booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)

# if __name__ == '__main__':
#     app.run(debug=True)
