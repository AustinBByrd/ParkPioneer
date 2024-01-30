


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationships
    favorite_parks = db.relationship('FavoritePark', backref='user', lazy=True)
    houses = db.relationship('House', backref='user', lazy=True)
    user_activity_logs = db.relationship('UserActivityLog', backref='user', lazy=True)


class Park(db.Model, SerializerMixin):
    __tablename__ = 'parks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    description = db.Column(db.Text)
    amenities = db.Column(db.Text)

    # Relationship
    favorite_parks = db.relationship('FavoritePark', backref='park', lazy=True)

class FavoritePark(db.Model, SerializerMixin):
    __tablename__ = 'favorite_parks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    park_id = db.Column(db.Integer, db.ForeignKey('parks.id'))
    date_added = db.Column(db.DateTime, server_default=db.func.now())

class House(db.Model, SerializerMixin):
    __tablename__ = 'houses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    address = db.Column(db.String)

class UserActivityLog(db.Model, SerializerMixin):
    __tablename__ = 'user_activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    activity_type = db.Column(db.String)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    park_id = db.Column(db.Integer, db.ForeignKey('parks.id'))
    name = db.Column(db.String)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime)

    # Relationship
    user_events = db.relationship('UserEvent', backref='event', lazy=True)

class UserEvent(db.Model, SerializerMixin):
    __tablename__ = 'user_events'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key=True)
