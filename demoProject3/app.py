
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify

from flask import Flask, jsonify
from flask_cors import cross_origin


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/data/CA_COVID_data.sqlite")
# inspector = inspect(engine)
# inspector.get_table_names()

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Base.classes.keys()

# app = Flask(__name__, template_folder='templates')


# # routes
# @app.route("/login")
# @cross_origin(origin='*')
# def login():
#   return jsonify({'success': 'ok'})

# @app.route("/api/v1.0/passengers")
# @cross_origin(origin='*')
# def passengers():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     """Return a list of passenger data including the name, age, and sex of each passenger"""
#     # Query all passengers
#     results = session.query(Passenger.name, Passenger.age, Passenger.sex).filter(Passenger.age > 40).all()

#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_passengers = []
#     for name, age, sex in results:
#         passenger_dict = {}
#         passenger_dict["name"] = name
#         passenger_dict["age"] = age
#         passenger_dict["sex"] = sex
#         all_passengers.append(passenger_dict)

#     return jsonify(all_passengers)


# if __name__ == '__main__':
#     app.run(debug=True)