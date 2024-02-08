from datetime import datetime
import os
from dateutil import parser as dateutil_parser

from flask import Flask, request, session, jsonify, send_from_directory, make_response
from flask_restful import Resource, Api, reqparse
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from config import app, db, api
from models import User, Park, FavoritePark, House, UserActivityLog, Event, UserEvent

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        return {'error': 'Unauthorized'}, 401

class Users(Resource):
    def get(self):
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return users_list

class Login(Resource):
    def post(self):
        username = request.json.get('username')
        password = request.json.get('password')
        user = User.query.filter(User.username == username).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return make_response({'error': '401 Unauthorized'}, 401)

class SignUp(Resource):
    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return {'message': 'User already exists'}, 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username=data['name'], email=data['email'], _password_hash=hashed_password)
        db.session.add(user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201
    
class SignUp(Resource):
    def post(self):
        data = request.get_json()
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return {'message': 'Missing name, email, or password'}, 400

        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User or Email already exists'}, 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username=data['name'], email=data['email'], _password_hash=hashed_password)

        db.session.add(user)
        db.session.commit()

        return {'message': 'User created successfully'}, 201


event_parser = reqparse.RequestParser()
event_parser.add_argument('name', required=True, help="Name cannot be blank!")
event_parser.add_argument('description')
event_parser.add_argument('start', required=True, help="Start date/time cannot be blank!")
event_parser.add_argument('end', required=True, help="End date/time cannot be blank!")
event_parser.add_argument('park_id', type=int, required=True, help="Park ID cannot be blank!")


class EventAPI(Resource):
    def get(self, event_id=None):
        if event_id:
            event = Event.query.get(event_id)
            if not event:
                return {'message': 'Event not found'}, 404
            return jsonify(event.to_dict())
        else:
            events = Event.query.all()
            return jsonify([event.to_dict() for event in events])

    def post(self):
        args = event_parser.parse_args()
        new_event = Event(
            name=args['name'],
            description=args.get('description', ''),
            start=dateutil_parser.parse(args['start']),
            end=dateutil_parser.parse(args['end']),
            park_id=args['park_id']
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