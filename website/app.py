
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify
from flask_cors import cross_origin

import sqlite3 as sq


#################################################
# Database Setup
#################################################
db = "sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/data/CA_COVID_data.sqlite"
engine = create_engine(db)
# inspector = inspect(engine)
# print(inspector.get_table_names())

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)
# print(Base.classes.keys())
case_surv_data = Base.classes.case_surv
#print(case_surv_data.__table__.columns.keys())

# def get_all( json_str = False ):
#     conn = sq.connect(db)
#     conn.row_factory = sq.Row # This enables column access by name: row['column_name'] 
#     db = conn.cursor()

#     rows = db.execute("SELECT * from case_surv").fetchall()

#     conn.commit()
#     conn.close()

#     if json_str:
#         return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON

#     return rows

app = Flask(__name__, template_folder='templates')

# routes
@app.route("/login")
@cross_origin(origin='*')
def login():
  
  return jsonify({'success': 'ok'})

@app.route("/api/v1.0/case_surv")
@cross_origin(origin='*')
def case_surv():

    # # # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.execute(""" SELECT * FROM case_surv """)

    # results = session.query(case_surv_data.county, case_surv_data.year).all()

    # Create a dictionary from the row data and append to a list of all_passengers

    counter = 0
    county_dict = {}
    year_dict = {}
    month_dict = {}
    age_group_dict = {}
    sex_dict = {}
    race_dict = {}
    hosp_yn_dict = {}
    death_yn_dict = {}
    for id, county, year, month, age_group, sex, race, ethnicity, hosp_yn, icu_yn, death_yn, underlying_conditions_yn in results:
        
        county_dict[counter] = county
        year_dict[counter] = year
        month_dict[counter] = month
        age_group_dict[counter] = age_group
        sex_dict[counter] = sex
        race_dict[counter] = race
        hosp_yn_dict[counter] = hosp_yn
        death_yn_dict[counter] = death_yn

        counter += 1

    all_case_surv = {}
    all_case_surv["county"] = county_dict 
    all_case_surv["year"] = year_dict
    all_case_surv["month"] = month_dict
    all_case_surv["age_group"] = age_group_dict
    all_case_surv["sex"] = sex_dict
    all_case_surv["race"] = race_dict
    #case_surv_dict["ethnicity"] = ethnicity
    all_case_surv["hosp_yn"] = hosp_yn_dict
    #case_surv_dict["icu_yn"] =  icu_yn
    all_case_surv["death_yn"] = death_yn_dict
    #case_surv_dict["underlying_conditions_yn"] = underlying_conditions_yn

    session.close()

    return jsonify(all_case_surv)

if __name__ == '__main__':
    app.run(debug=True)