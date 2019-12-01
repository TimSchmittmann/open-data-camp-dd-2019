import pandas as pd

def create_mapping_dicts(input_file='de-sn-dresden-kleinraeumige_strukturmerkmale_2018_stand_31122018__fuer_raeumliche_ableitungen_ab_raumbezug_statistischer_bezirk.csv'):
    df_structure = pd.read_csv(input_file, sep=";", header=0, encoding = 'ansi')
    teil_zu_raum_dict = df_structure.set_index('Stadtteil zus.').to_dict()['Stadtraum']
    df_structure['Statistischer Bezirk'] = df_structure['Statistischer Bezirk'].str.slice(0,3)
    bezirk_zu_raum_dict = df_structure.set_index('Statistischer Bezirk').to_dict()['Stadtraum']
    return(teil_zu_raum_dict, bezirk_zu_raum_dict)

def agg_and_sum_teil(df, mapping_dict):
    df['Stadtteil zus.'] = df['Stadtteil zus.'].map(mapping_dict)
    df=df.groupby(df['Stadtteil zus.']).agg('sum')
    return(df)

def agg_and_sum_bezirk(df, mapping_dict):
    df['Statistischer Bezirk'] = df['Statistischer Bezirk'].map(mapping_dict)
    df=df.groupby(df['Statistischer Bezirk']).agg('sum')
    return(df)
