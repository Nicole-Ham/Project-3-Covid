from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template, url_for #urlfor ask flask to find certain files and translate to website ##lets flask send html file to user
from flask_cors import CORS, cross_origin
import json

import sqlite3 as sq


#################################################
# Database Setup
#################################################
app = Flask(__name__, template_folder='templates')

db = "sqlite:////Users/adrianagalindo/Documents/Project3COVID/Project-3-Covid/DataCA_COVID_data.sqlite"
engine = create_engine(db)
#inspector = inspect(engine)
#print(inspector.get_table_names())

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)

# print(Base.classes.keys())
vaccines_hpi_poverty_data = Base.classes.vaccines_hpi_poverty
# print(vaccine_data.__table__.columns.keys())

def get_all( json_str = False ):
    conn = sq.connect(db)
    conn.row_factory = sq.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute("SELECT * from vaccine_data").fetchall()

    conn.commit()
    conn.close()
#
    if json_str:
        return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON
#
    return rows
#
app = Flask(__name__, template_folder='templates')


# routes
@app.route("/login")
@cross_origin(origin='*')
def login():
  
  return jsonify({'success': 'ok'})

#@app.route("/")
#def index():
#    return render_template('index.html')



@app.route('/api/vaccines_hpi_poverty')
@cross_origin(origin='*')
def vaccines_hpi_poverty_data():
    session = Session(engine)

    results = session.query(vaccines_hpi_poverty_data.date, 
                            vaccines_hpi_poverty_data.zip_code, 
                            vaccines_hpi_poverty_data.county_name, 
                            vaccines_hpi_poverty_data.total_population, 
                            vaccines_hpi_poverty_data.percent_fully_vaccinated, 
                            vaccines_hpi_poverty_data.percent_partially_vaccinated,
                            vaccines_hpi_poverty_data.employed_percentile,
                            vaccines_hpi_poverty_data.income_value,
                            vaccines_hpi_poverty_data.hpi_value
                            ).all()
    print(results)
  
    # Create a dictionary from the row data and append to a list of all_passengers
    hpi_poverty_data = []
    for date, zip_code, county_name, total_population, percent_fully_vaccinated, percent_partially_vaccinated, employed_percentile, income_value, hpi_value in results:
        
        poverty_hpi_dict = {
            "date": date,
            "zip_code": zip_code,
            "county_name": county_name,
            "total_population": total_population,
            "percent_fully_vaccinated": percent_fully_vaccinated,
            "percent_partially_vaccinated": percent_partially_vaccinated,
            "employed_percentile": employed_percentile,
            "income_value": income_value,
            "hpi_value": hpi_value

        }
        

        hpi_poverty_data.append(poverty_hpi_dict)

    session.close()

    return jsonify(hpi_poverty_data)

if __name__ == '__main__':
    app.run(debug=True)