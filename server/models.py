from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from flask_login import UserMixin


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    favorite_parks = db.relationship('FavoritePark', back_populates='user', lazy=True)
    houses = db.relationship('House', back_populates='user', lazy=True)
    user_activity_logs = db.relationship('UserActivityLog', back_populates='user', lazy=True)

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            
        }    

class Park(db.Model, SerializerMixin):
    __tablename__ = 'parks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    description = db.Column(db.Text)
    amenities = db.Column(db.Text)

    # Relationship
    favorite_parks = db.relationship('FavoritePark', back_populates='park', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'description': self.description,
            'amenities': self.amenities,
            # Here too, be cautious with relationships to avoid recursion
        }

class FavoritePark(db.Model, SerializerMixin):
    __tablename__ = 'favorite_parks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    park_id = db.Column(db.Integer, db.ForeignKey('parks.id'))
    date_added = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", back_populates='favorite_parks')
    park = db.relationship("Park", back_populates='favorite_parks') 


class House(db.Model, SerializerMixin):
    __tablename__ = 'houses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    address = db.Column(db.String)

    user = db.relationship("User", back_populates='houses')

class UserActivityLog(db.Model, SerializerMixin):
    __tablename__ = 'user_activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    activity_type = db.Column(db.String)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship("User", back_populates='user_activity_logs')

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    park_id = db.Column(db.Integer, db.ForeignKey('parks.id'))
    name = db.Column(db.String)
    description = db.Column(db.Text)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)

    # Relationship
    user_events = db.relationship('UserEvent', back_populates='event', lazy=True)

class UserEvent(db.Model, SerializerMixin):
    __tablename__ = 'user_events'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key=True)

    event = db.relationship("Event", back_populates="user_events")


class UserLocation(db.Model, SerializerMixin):
    __tablename__ = 'user_locations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location_name = db.Column(db.String(255), nullable=False)  # e.g., "Home", "Work"
    address = db.Column(db.String(255), nullable=False)
    zip_code = db.Column(db.String(10), nullable=True)

    user = db.relationship("User", backref=db.backref('locations', lazy=True))

    def to_dict(self):
        # Custom method to serialize UserLocation to a dict
        return {
            'id': self.id,
            'user_id': self.user_id,
            'location_name': self.location_name,
            'address': self.address,
            'zip_code': self.zip_code
        }

class UserPreference(db.Model, SerializerMixin):
    __tablename__ = 'user_preferences'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    preference_key = db.Column(db.String(255), nullable=False)
    preference_value = db.Column(db.Text, nullable=False)

    user = db.relationship('User', backref=db.backref('preferences', lazy=True))

    
