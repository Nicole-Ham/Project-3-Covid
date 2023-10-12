
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
