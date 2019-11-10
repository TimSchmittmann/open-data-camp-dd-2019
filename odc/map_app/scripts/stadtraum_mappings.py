import pandas as pd

#df = pd.read_csv("Amt86 - Umweltamt.csv", sep=";", header=0, encoding = 'ansi')

def create_mapping_dicts(input_file='de_sn_dresden_kleinraeumige_stru.csv'):
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
    print(df['Statistischer Bezirk'])
    df=df.groupby(df['Statistischer Bezirk']).agg('sum')
    return(df)

def agg_and_sum(statBezirkFileToTransform, transformTo = ''):
    pass

def build_mapping_js():
    teil_zu_raum_dict, bezirk_zu_raum_dict = create_mapping_dicts()
    #print(bezirk_zu_raum_dict.to_json())
    with open('stadtraumMappings.js', 'w+') as file:
        file.write('var stadtraumMappings = new Array('+str(len(bezirk_zu_raum_dict.keys()))+');\n');
        for key in bezirk_zu_raum_dict:
            file.write('stadtraumMappings["' + str(key) + '"] = "'+bezirk_zu_raum_dict[key]+'";\n')
#teil_zu_raum_dict, bezirk_zu_raum_dict = create_mapping_dicts()
#print(bezirk_zu_raum_dict)
#agg_and_sum_bezirk(df, bezirk_zu_raum_dict)
#build_mapping_js()