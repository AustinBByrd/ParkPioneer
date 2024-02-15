from datetime import datetime
import os
from dateutil import parser as dateutil_parser
import re
from flask_mail import Mail

from flask import Flask, request, session, jsonify, send_from_directory, make_response
from flask_restful import Resource, Api, reqparse
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from sqlalchemy import func
from flask_login import LoginManager
from flask import redirect, url_for, flash
from flask_login import login_required, current_user
import requests

from config import app, db, api
from models import User, Park, FavoritePark, House, UserActivityLog, Event, UserEvent, UserPreference, UserLocation
from email_utils import send_email

login_manager = LoginManager(app)
bcrypt = Bcrypt(app)
CORS(app)
googleMapsApiKey = os.getenv('GOOGLE_MAPS_API_KEY')
mail = Mail(app)
app.mail = mail 

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
        return {'error': 'Unauthorized'}, 401

class Users(Resource):
    def get(self):
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return users_list

class Login(Resource):
    def post(self):
        data = request.get_json()
        login_value = data.get('login') or data.get('email') or data.get('username')

        user = None
        if re.match(r"[^@]+@[^@]+\.[^@]+", login_value):

            user = User.query.filter(func.lower(User.email) == func.lower(login_value)).first()
        else:

            user = User.query.filter(func.lower(User.username) == func.lower(login_value)).first()

        if not user:

            return {'error': 'User not found'}, 404

        if bcrypt.check_password_hash(user._password_hash, data['password']):
            session['user_id'] = user.id
            user_data = user.to_dict()
            user_data['userId'] = user.id 
            return user_data, 200


        return {'error': 'Invalid credentials'}, 401


class SignUp(Resource):
    def post(self):
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return {'message': 'Email and password are required'}, 400

        if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
            return {'message': 'Invalid email format'}, 400

        if User.query.filter_by(email=data['email']).first():
            return {'message': 'Email already in use'}, 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(email=data['email'], _password_hash=hashed_password, username=data.get('username', ''))

        db.session.add(user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201
    
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('loginpage'))


@app.route('/api/add-favorite', methods=['POST'])
def add_favorite():
    data = request.json
    user_id = data['userId']
    park_name = data['parkName']
    park_location = data['parkLocation']
    park = Park.query.filter_by(name=park_name).first()
    if not park:
        park = Park(name=park_name, location=park_location)
        db.session.add(park)
        db.session.commit()

    # Check if already a favorite to avoid duplicates
    existing_favorite = FavoritePark.query.filter_by(user_id=user_id, park_id=park.id).first()
    if not existing_favorite:
        favorite = FavoritePark(user_id=user_id, park_id=park.id)
        db.session.add(favorite)
        db.session.commit()
        return jsonify({'message': 'Park added to favorites'}), 200
    else:
        return jsonify({'message': 'Park already in favorites'}), 409

event_parser = reqparse.RequestParser()
event_parser.add_argument('name', required=True, help="Name cannot be blank!")
event_parser.add_argument('description')
event_parser.add_argument('start', required=True, help="Start date/time cannot be blank!")
event_parser.add_argument('end', required=True, help="End date/time cannot be blank!")
event_parser.add_argument('park_name', required=True, help="Park name cannot be blank!")

# test
class EventAPI(Resource):
    def get(self, event_id=None):
        if event_id:
            event = Event.query.get(event_id)
            if not event:
                return {'message': 'Event not found'}, 404
            # Assuming event has a relationship to Park called 'park'
            return jsonify({
                'id': event.id,
                'name': event.name,
                'description': event.description,
                'start': event.start.isoformat(),
                'end': event.end.isoformat(),
                'park_name': event.park.name if event.park else None
            })
        else:
            events = Event.query.all()
            simplified_events = [{
                'id': event.id,
                'name': event.name,
                'description': event.description,
                'start': event.start.isoformat(),
                'end': event.end.isoformat(),
                'park_name': event.park.name if event.park else None
            } for event in events]
            return jsonify(simplified_events)


    def post(self):
        args = event_parser.parse_args()
        park_name = args['park_name']
        
        
        park = Park.query.filter_by(name=park_name).first()
        

        if not park:
            park = Park(name=park_name)
            db.session.add(park)
            db.session.commit()
        
        new_event = Event(
            name=args['name'],
            description=args.get('description', ''),
            start=dateutil_parser.parse(args['start']),
            end=dateutil_parser.parse(args['end']),
            park_id=park.id
        )
        db.session.add(new_event)
        db.session.commit()
        return make_response(jsonify({'message': 'Event created successfully', 'event': new_event.to_dict()}), 201)


    def put(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        args = event_parser.parse_args()
        event.name = args['name']
        event.description = args.get('description', event.description)
        event.start = dateutil_parser.parse(args['start'])
        event.end = dateutil_parser.parse(args['end'])
        event.park_id = args['park_id']

        db.session.commit()
        return make_response(jsonify({'message': 'Event updated successfully', 'event': event.to_dict()}), 200)

    def delete(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        db.session.delete(event)
        db.session.commit()
        return {'message': 'Event deleted successfully'}, 200
    
    def patch(self, event_id):
        args = event_parser.parse_args()
        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        
        # Update event with new details
        event.name = args['name']
        event.description = args.get('description', event.description)
        event.start = dateutil_parser.parse(args['start'])
        event.end = dateutil_parser.parse(args['end'])
        db.session.commit()

        return {'message': 'Event updated successfully', 'event': event.to_dict()}, 200


@app.route('/api/parks', methods=['GET'])
def get_parks():
    parks = Park.query.all()
    return jsonify([park.to_dict() for park in parks]), 200

@app.route('/api/parks', methods=['POST'])
def create_park():
    data = request.json
    park_name = data.get('name')

    # Check if a park with the given name already exists
    existing_park = Park.query.filter_by(name=park_name).first()
    if existing_park:
        return jsonify({'error': 'Park with this name already exists'}), 409

    # Create a new park
    new_park = Park(name=park_name)
    db.session.add(new_park)
    db.session.commit()

    return jsonify({'message': 'Park created successfully', 'park': new_park.to_dict()}), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/<int:user_id>/preferences', methods=['POST'])
def update_preferences(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    preference_key = data.get('preference_key')
    preference_value = data.get('preference_value')


    preference = UserPreference.query.filter_by(
        user_id=user_id, 
        preference_key=preference_key
    ).first()

    if preference:
        preference.preference_value = preference_value
    else:
  
        preference = UserPreference(
            user_id=user_id, 
            preference_key=preference_key, 
            preference_value=preference_value
        )
        db.session.add(preference)

    db.session.commit()
    return jsonify({'message': 'Preferences updated successfully'}), 200


@app.route('/api/users/<int:user_id>/preferences/zipcode', methods=['GET'])
def get_user_zipcode_preference(user_id):
    preference = UserPreference.query.filter_by(user_id=user_id, preference_key="preferred_zip_code").first()
    if preference:
        return jsonify({'preferred_zip_code': preference.preference_value}), 200
    return jsonify({'error': 'Preference not found'}), 404

@app.route('/api/users/<int:user_id>/favorited-parks', methods=['GET'])
def get_favorited_parks(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    favorited_parks = FavoritePark.query.filter_by(user_id=user_id).all()
    parks_data = [park.park.to_dict() for park in favorited_parks]  
    return jsonify(parks_data), 200

@app.route('/api/users/<int:user_id>/favorited-parks/<int:park_id>', methods=['DELETE'])
def remove_favorited_park(user_id, park_id):
    favorite_park = FavoritePark.query.filter_by(user_id=user_id, park_id=park_id).first()
    if not favorite_park:
        return jsonify({'message': 'Favorite park not found'}), 404

    db.session.delete(favorite_park)
    db.session.commit()

    return jsonify({'message': 'Favorited park removed successfully'}), 200

@app.route('/api/users/<int:user_id>/locations', methods=['GET'])
def get_user_locations(user_id):
    locations = UserLocation.query.filter_by(user_id=user_id).all()
    return jsonify([location.to_dict() for location in locations]), 200

@app.route('/api/users/<int:user_id>/locations', methods=['POST'])
def add_user_location(user_id):
    data = request.get_json()
    new_location = UserLocation(
        user_id=user_id,
        location_name=data.get('location_name'),
        address=data.get('address'),
        zip_code=data.get('zip_code')
    )
    db.session.add(new_location)
    db.session.commit()
    return jsonify(new_location.to_dict()), 201

@app.route('/api/users/<int:user_id>/locations/<int:location_id>', methods=['DELETE'])
def delete_user_location(user_id, location_id):
    location = UserLocation.query.filter_by(user_id=user_id, id=location_id).first()
    if location:
        db.session.delete(location)
        db.session.commit()
        return jsonify({'message': 'Location deleted successfully'}), 200
    else:
        return jsonify({'error': 'Location not found'}), 404

@app.route('/api/distance-matrix', methods=['POST'])
def get_distance_matrix():
    data = request.json
    origins = data['origins']
    destinations = data['destinations']
    mode = data.get('mode', 'driving')
    
    parameters = {
        'origins': '|'.join(origins),
        'destinations': '|'.join(destinations),
        'key': googleMapsApiKey,
        'mode': mode,
    }

    response = requests.get('https://maps.googleapis.com/maps/api/distancematrix/json', params=parameters)

    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return jsonify({'error': 'Failed to fetch data from Google Distance Matrix API'}), response.status_code
    
@app.route('/api/events/signup', methods=['POST'])
def event_signup():
    data = request.json
    user_id = data['user_Id']
    event_id = data['event_id']
    # Logic to add user to event
    return jsonify({'message': 'Signed up successfully'}), 200

@app.route('/api/events/invite', methods=['POST'])
def event_invite():
    data = request.json
    event_id = data['eventId']
    email = data['email']
    # Assuming you have a send_email function defined that sends the email
    try:
        send_email(
            'Park Pioneer Event Invitation',
            [email],
            'You have been invited to a Park Pioneer event!'
        )
        return jsonify({'message': 'Invitation sent successfully'}), 200
    except Exception as e:
        # Log the exception and return a failure message
        print(e)  # or use a proper logging mechanism
        return jsonify({'error': 'Failed to send invitation'}), 500




api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Login, '/api/login')
api.add_resource(Users, '/api/users')
api.add_resource(SignUp, '/api/signup')
api.add_resource(EventAPI, '/api/events', '/api/events/<int:event_id>')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')
app.debug = True
if __name__ == '__main__':
    app.run(port=5555, debug=True)