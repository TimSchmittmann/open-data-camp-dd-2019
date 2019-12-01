import pandas as pd

def add_data(current, remaining_index_cols, index_cols, row):
    if len(remaining_index_cols) == 0:
        for col in row[1].index:
            print(col)
            if col in index_cols:
                continue
            current[col] = row[1][col]
        return current

    col = remaining_index_cols.pop(0)
    
    if row[1][col] not in current:
        current[row[1][col]] = {} 
    current[row[1][col]] = add_data(current[row[1][col]], remaining_index_cols, index_cols, row)
    
    return current

def opendata_dd_export_aggregated_csv(request, file_name, index_cols):
    df = pd.read_csv("csv/opendata_dresden/export/aggregated/"+file_name, 
                     sep=",", header=0, encoding = 'ansi')
    print(df)
    json = {}
    for r in df.iterrows():
        json = add_data(json, index_cols.copy(), index_cols, r)
    print(json)


opendata_dd_export_aggregated_csv(None, 'de-sn-dresden-kbu_-_einkommen_aequivalenz-_1993ff_stadtraum.csv' ,['Stadtraum', 'Jahr'])