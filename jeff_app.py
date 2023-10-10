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

# Preload the data
MigrationData = Base.classes.county_migrations
session = Session(engine)
all_data = pd.read_sql(session.query(MigrationData).statement, session.bind)
session.close()

# Preload county geometries
counties_gdf = gpd.read_file('Data/us_counties_geometry.geojson')


@app.route('/api/v1.0/migration_data/<int:year>')
def migration_data(year):
    # Filter the preloaded data by the provided year
    filtered_data = all_data[all_data['year'] == year]

    # Merge the county geometries with the filtered data
    merged_gdf = counties_gdf.merge(filtered_data, left_on="GEOID", right_on="fips")

    # Convert the merged GeoDataFrame to GeoJSON format
    merged_geojson = merged_gdf.to_json()

    # Convert the string representation of GeoJSON to a JSON object
    json_data = json.loads(merged_geojson)

    return jsonify(json_data)


if __name__ == '__main__':
    app.run(debug=True)













# @app.route('/api/v1.0/table_data', methods=['GET'])
# @cross_origin()
# def table_data():
#     # Access the reflected table class
#     MigrationData = Base.classes.county_migrations

#     # Start a session and query all the data
#     session = Session(engine)
#     results = session.query(MigrationData).all()
#     session.close()

#     # Convert the queried results to a list of dictionaries
#     data_list = []
#     for row in results:
#         # Convert each row to a dictionary (while excluding '_sa_instance_state')
#         data_dict = {column: getattr(row, column) for column in row.__dict__.keys() if column != '_sa_instance_state'}
#         data_list.append(data_dict)

#     return jsonify(data_list)



# @app.route("/api/v1.0/tables")
# @cross_origin(origin='*')
# def tables():
#     # Get a list of all table names using the 'inspect' function
#     inspector = inspect(engine)
#     tables = inspector.get_table_names()
#     return jsonify(tables)
