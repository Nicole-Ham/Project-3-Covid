
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
    all_case_surv = []
    for id, county, year, month, age_group, sex, race, ethnicity, hosp_yn, icu_yn, death_yn, underlying_conditions_yn in results:
        
        case_surv_dict = {}
        case_surv_dict["county"] = county 
        case_surv_dict["year"] = year
        case_surv_dict["month"] = month
        case_surv_dict["age_group"] = age_group
        case_surv_dict["sex"] = sex
        case_surv_dict["race"] = race
        case_surv_dict["ethnicity"] = ethnicity
        case_surv_dict["hosp_yn"] = hosp_yn
        case_surv_dict["icu_yn"] =  icu_yn
        case_surv_dict["death_yn"] = death_yn
        case_surv_dict["underlying_conditions_yn"] = underlying_conditions_yn

        all_case_surv.append(case_surv_dict)

    session.close()

    return jsonify(all_case_surv)

if __name__ == '__main__':
    app.run(debug=True)