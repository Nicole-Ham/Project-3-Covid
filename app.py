from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify, render_template, url_for #urlfor ask flask to find certain files and translate to website
from flask_cors import cross_origin
import json
import sqlite3 as sq
import os


#################################################
# Database Setup
#################################################

# db = "sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/Data/CA_COVID_data.sqlite" #use relative path instead
# engine = create_engine(db)
# inspector = inspect(engine)
# print(inspector.get_table_names())

#only works if you open the Project-3-Covid file in VSCode
cwd = os.getcwd()
sqlite_path = os.path.join(cwd, "Data/CA_COVID_data.sqlite")
sqlite_path = f"sqlite:///{sqlite_path}"
#print(sqlite_path)

#db = "sqlite:////Users/isabelsmorrison/Personal/Data_Analytics_Bootcamp/Projects/Project3/Project-3-Covid/Data/CA_COVID_data.sqlite" #use relative path instead
engine = create_engine(sqlite_path)
inspector = inspect(engine)
#print(inspector.get_table_names())

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(autoload_with = engine)
#print(Base.classes.keys())
case_surv_data = Base.classes.case_surv
#print(case_surv_data.__table__.columns.keys())

vaccine_data = Base.classes.vaccine_by_county
#print(vaccine_data.__table__.columns.keys())

def get_all( json_str = False ):
    conn = sq.connect(sqlite_path)
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

# @app.route("/login")
# @cross_origin(origin='*')
# def login():
  
#   return jsonify({'success': 'ok'})

# @app.route("/")
# def index():
#     return render_template('index.html')

@app.route("/api/v1.0/vaccine_data")
@cross_origin(origin='*')
def api_vaccine():
  
# # Create our session (link) from Python to the DB
    v_session = Session(engine)

    # results = session.execute(""" SELECT * FROM vaccine_data """)

    # results = v_session.query(vaccine_data.county, vaccine_data.Date).all()

    results = v_session.query(vaccine_data.county, vaccine_data.cumulative_total_doses, 
                            vaccine_data.cumulative_fully_vaccinated ,vaccine_data.cumulative_at_least_one_dose,
                            vaccine_data.cumulative_up_to_date_count, vaccine_data.Date).all()

    # Create a dictionary from the row data and append to a list of all_passengers

    v_counter = 0
    v_county_dict = {}
    total_dose_dict = {}
    fully_vax_dict = {}
    one_dose_dict = {}
    up_to_date_dict = {}
    date_dict = {}
    for id, county, cumulative_total_doses, cumulative_fully_vaccinated, cumulative_at_least_one_dose, cumulative_up_to_date_count, Date in results:
        
        v_county_dict[v_counter] = county
        total_dose_dict[v_counter] = cumulative_total_doses
        fully_vax_dict[v_counter] = cumulative_fully_vaccinated
        one_dose_dict[v_counter] = cumulative_at_least_one_dose
        up_to_date_dict[v_counter] = cumulative_up_to_date_count
        date_dict[v_counter] = Date

        v_counter += 1

    all_vaccine = {}
    all_vaccine["county"] = v_county_dict
    all_vaccine["cumulative_total_doses"] = cumulative_total_doses
    all_vaccine["cumulative_fully_vaccinated"] = cumulative_fully_vaccinated
    all_vaccine["cumulative_at_least_one_dose"] = cumulative_at_least_one_dose
    all_vaccine["cumulative_up_to_date_count"] = cumulative_up_to_date_count
    all_vaccine["Date"] = date_dict

    v_session.close()

    return jsonify(all_vaccine_data)

if __name__ == '__main__':
    app.run(debug=True)