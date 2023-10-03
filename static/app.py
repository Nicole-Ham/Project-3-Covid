from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template, url_for #urlfor ask flask to find certain files and translate to website
from flask_cors import cross_origin
import json
import sqlite3 as sq


#################################################
# Database Setup
#################################################
# db = "sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/data/CA_COVID_data.sqlite"
# cs_engine = create_engine(cs_db)

db = "sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/Data/CA_COVID_data.sqlite" #use relative path instead
engine = create_engine(db)
# inspector = inspect(engine)
# print(inspector.get_table_names())

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)
#print(Base.classes.keys())
case_surv_data = Base.classes.case_surv
#print(case_surv_data.__table__.columns.keys())

vaccine_data = Base.classes.vaccine_by_county
# print(vaccine_data.__table__.columns.keys())

def get_all( json_str = False ):
    conn = sq.connect(db)
    conn.row_factory = sq.Row # This enables column access by name: row['column_name'] 
    db = conn.cursor()

    rows = db.execute("SELECT * from vaccine_data").fetchall()

    conn.commit()
    conn.close()

    if json_str:
        return json.dumps( [dict(ix) for ix in rows] ) #CREATE JSON

    return rows

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
    cs_session = Session(engine)

    results = cs_session.execute(""" SELECT * FROM case_surv """)

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

    cs_session.close()

    return jsonify(all_case_surv)
# @app.route("/login")
# @cross_origin(origin='*')
# def login():
  
#   return jsonify({'success': 'ok'})

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/api/v1.0/vaccine_data")
# @cross_origin(origin='*')
def api_vaccine():
  
  
    # # Create our session (link) from Python to the DB
    v_session = Session(engine)

    # results = session.execute(""" SELECT * FROM vaccine_data """)

    results = v_session.query(vaccine_data.county, vaccine_data.year, vaccine_data.month, vaccine_data.cumulative_total_doses, 
                            vaccine_data.cumulative_fully_vaccinated ,vaccine_data.cumulative_at_least_one_dose,
                            vaccine_data.cumulative_up_to_date_count).all()
    print(results)
    # Create a dictionary from the row data and append to a list of all_passengers
    all_vaccine_data = []
    for county, year, month, cumulative_total_doses, cumulative_fully_vaccinated, cumulative_at_least_one_dose, cumulative_up_to_date_count in results:
        
        vaccine_data_dict = {}
        vaccine_data_dict["county"] = county 
        vaccine_data_dict["year"] = year
        vaccine_data_dict["month"] = month
        vaccine_data_dict["cumulative_total_doses"] = cumulative_total_doses
        vaccine_data_dict["cumulative_fully_vaccinated"] = cumulative_fully_vaccinated
        vaccine_data_dict["cumulative_at_least_one_dose"] = cumulative_at_least_one_dose
        vaccine_data_dict["cumulative_up_to_date_count"] = cumulative_up_to_date_count

        all_vaccine_data.append(vaccine_data_dict)

    v_session.close()

    return jsonify(all_vaccine_data)

if __name__ == '__main__':
    app.run(debug=True)