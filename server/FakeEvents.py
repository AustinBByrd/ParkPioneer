from faker import Faker
from datetime import datetime, timedelta
from app import app, db  
from models import Event, Park
from sqlalchemy import func


fake = Faker()


event_names = [
    "Nature Walk",
    "Family Picnic",
    "Outdoor Yoga Session",
    "Bird Watching Tour",
    "Stargazing Night",
    "Trail Running Challenge",
    "Wildlife Photography Workshop",
    "Outdoor Movie Night",
    "Fishing Expedition",
    "Nature Sketching Workshop",
    "Sunrise Hike",
    "Botanical Garden Tour"
]

event_descriptions = [
    "Join us for a refreshing nature walk through the serene trails of the park.",
    "Bring your loved ones and enjoy a delightful picnic amidst the beautiful scenery.",
    "Unwind and rejuvenate with an invigorating outdoor yoga session, surrounded by nature's tranquility.",
    "Embark on an exciting bird watching tour and discover the diverse avian species that call our park home.",
    "Gaze upon the mesmerizing night sky and explore the wonders of the universe during our stargazing event.",
    "Test your endurance and conquer the trails in our exhilarating trail running challenge.",
    "Learn the art of capturing stunning wildlife moments with our expert-led photography workshop.",
    "Grab your blankets and popcorn for a cozy outdoor movie night under the stars.",
    "Cast your lines and reel in the excitement on our adventurous fishing expedition.",
    "Unleash your creativity and connect with nature through our guided nature sketching workshop.",
    "Witness the breathtaking sunrise from atop the trails during our invigorating sunrise hike.",
    "Explore the enchanting world of flora with a guided tour of our vibrant botanical gardens."
]


def generate_fake_events(num_events):
    with app.app_context():  
        for _ in range(num_events):
           
            name = fake.random_element(event_names)
            description = fake.random_element(event_descriptions)

           
            start_date = fake.date_time_this_month(before_now=True, after_now=False)
            end_date = start_date + timedelta(hours=fake.random_int(min=2, max=3))

            park = Park.query.order_by(func.random()).first()

            new_event = Event(
                name=name,
                description=description,
                start=start_date,
                end=end_date,
                park_id=park.id
            )

            db.session.add(new_event)
        db.session.commit()


num_weeks = 4
num_events_per_week = fake.random_int(min=3, max=4)
total_events = num_weeks * num_events_per_week


generate_fake_events(total_events)

print(f"{total_events} fake events have been generated.")
