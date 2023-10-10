from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
from sqlalchemy import MetaData, inspect
import sqlite3
import geopandas as gpd
import pandas as pd



#################################################
# Database Setup

engine = create_engine("sqlite:///Data/CA_COVID_data.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

app = Flask(__name__)
CORS(app)

#################################################

# inspector = inspect(engine)
# print(inspector.get_table_names())



# RETURN DATA TO JAVASCRIPT APP

@app.route('/api/v1.0/migration_data')
def migration_data():
    # Connect to the SQLite database and read the 'county_migrations' table
    conn = sqlite3.connect('Data/CA_COVID_data.sqlite')
    query = "SELECT * FROM county_migrations"
    migrations_df = pd.read_sql(query, conn)
    conn.close()

    # Load the GeoJSON with county geometries
    counties_gdf = gpd.read_file('Data/us_counties_geometry.geojson')

    # Merge the two datasets on the appropriate column (e.g., 'geo_id' or 'fips')
    merged_gdf = counties_gdf.merge(migrations_df, left_on="GEOID", right_on="fips")

    # Convert the merged GeoDataFrame to GeoJSON format
    merged_geojson = merged_gdf.to_json()

    return jsonify(merged_geojson)







@app.route('/api/v1.0/table_data', methods=['GET'])
@cross_origin()
def table_data():
    # Access the reflected table class
    MigrationData = Base.classes.county_migrations

    # Start a session and query all the data
    session = Session(engine)
    results = session.query(MigrationData).all()
    session.close()

    # Convert the queried results to a list of dictionaries
    data_list = []
    for row in results:
        # Convert each row to a dictionary (while excluding '_sa_instance_state')
        data_dict = {column: getattr(row, column) for column in row.__dict__.keys() if column != '_sa_instance_state'}
        data_list.append(data_dict)

    return jsonify(data_list)



@app.route("/api/v1.0/tables")
@cross_origin(origin='*')
def tables():
    # Get a list of all table names using the 'inspect' function
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    return jsonify(tables)



if __name__ == '__main__':
    app.run(debug=True)