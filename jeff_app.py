from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
import geopandas as gpd
import pandas as pd
import json


# Database Setup
engine = create_engine("sqlite:///Data/CA_COVID_data.sqlite")

# Reflect an existing database into a new model
Base = automap_base()
# Reflect the tables
Base.prepare(engine, reflect=True)

app = Flask(__name__)
CORS(app)

# Load the GeoJSON string from the database
MigrationData = Base.classes.us_county_migrations

print("TYPE IS:", type(MigrationData))

session = Session(engine)
record = session.query(MigrationData).first()
geojson_string = getattr(record, "data")
session.close()

# Convert the GeoJSON string to a Python dictionary
geojson_data = json.loads(geojson_string)

# Create a global dictionary to store the filtered GeoJSON objects by year
geojson_data_by_year = {}

# Assuming each feature in the GeoJSON data has a 'year' property
for feature in geojson_data['features']:
    year = feature['properties']['year']
    if year not in geojson_data_by_year:
        geojson_data_by_year[year] = {
            "type": "FeatureCollection",
            "features": []
        }
    geojson_data_by_year[year]['features'].append(feature)

@app.route('/api/v1.0/migration_data/<int:year>')
def migration_data(year):
    return jsonify(geojson_data_by_year.get(year, {}))


# @app.route('/api/v1.0/table_data', methods=['GET'])
# def table_data():
#     return jsonify(geojson_data)



if __name__ == '__main__':
    app.run(debug=True)





