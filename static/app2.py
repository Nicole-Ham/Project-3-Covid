from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template, url_for #urlfor ask flask to find certain files and translate to website
#from flask_cors import cross_origin
import json
import sqlite3 as sq


#################################################
# Database Setup
#################################################

db = "sqlite:///Users/adrianagalindo/Documents/Project3COVID/Project-3-Covid/HPI_and_Poverty/vaccines_hpi_poverty.db"
engine = create_engine(db)
# inspector = inspect(engine)
# print(inspector.get_table_names())

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)
# print(Base.classes.keys())
vaccines_hpi_poverty_data = Base.classes.vaccines_hpi_poverty
print(vaccines_hpi_poverty_data.__table__.columns.keys())

#def get_all( json_str = False ):
 #   conn = sq.connect(db)
  #  conn.row_factory = sq.Row # This enables column access by name: row['column_name'] 
   # db = conn.cursor()

    #rows = db.execute("SELECT * from vaccine_data").fetchall()

#    conn.commit()
 #   conn.close()
#
 #   if json_str:
  #      return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON
#
 #   return rows
#
#app = Flask(__name__, template_folder='templates')

# routes
# @app.route("/login")
# @cross_origin(origin='*')
# def login():
  
#   return jsonify({'success': 'ok'})

#@app.route("/")
#def index():
 #   return render_template('index.html')

#@app.route("/api/v1.0/vaccine_data")
#@cross_origin(origin='*')
#def api_vaccine():
  
  
    # # Create our session (link) from Python to the DB
 #   session = Session(engine)

    # results = session.execute(""" SELECT * FROM vaccine_data """)

  #  results = session.query(vaccine_data.county, vaccine_data.year, vaccine_data.month, vaccine_data.cumulative_total_doses, 
     #                       vaccine_data.cumulative_fully_vaccinated ,vaccine_data.cumulative_at_least_one_dose,
      #                      vaccine_data.cumulative_up_to_date_count).all()
   # print(results)
    # Create a dictionary from the row data and append to a list of all_passengers
    #all_vaccine_data = []
   # for county, year, month, cumulative_total_doses, cumulative_fully_vaccinated, cumulative_at_least_one_dose, cumulative_up_to_date_count in results:
    #    
     #   vaccine_data_dict = {}
      #  vaccine_data_dict["county"] = county 
       # vaccine_data_dict["year"] = year
       # vaccine_data_dict["month"] = month
       # vaccine_data_dict["cumulative_total_doses"] = cumulative_total_doses
       # vaccine_data_dict["cumulative_fully_vaccinated"] = cumulative_fully_vaccinated
       # vaccine_data_dict["cumulative_at_least_one_dose"] = cumulative_at_least_one_dose
       # vaccine_data_dict["cumulative_up_to_date_count"] = cumulative_up_to_date_count

        #all_vaccine_data.append(vaccine_data_dict)

   # session.close()

    #return jsonify(all_vaccine_data)

#if __name__ == '__main__':
 #   app.run(debug=True)