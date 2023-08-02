import requests,os
import urllib
from Config.base import url_api, route_file_model

def file_model():
    file_model = requests.get(url_api + 'ia/file-model')
    open_file_model = open(os.path.join(os.path.dirname(__file__), '../'+route_file_model),"w")
    open_file_model.write(file_model.content.decode("utf-8"))
        
def split_character(format_result_information):
    separator = '|'
    characters = format_result_information.split(separator)
    if(len(characters)==3):
        if (characters[0]=='1'):
            user = characters[1]
            password = characters[2]
            return ([user,password])
        else:
            return "0|Falla"
    elif(len(characters)==2):
        if (characters[0]=='1'):
            user = characters[1]
            return ([user])
        else:
            return "0|Falla"
    else:
        return "0|Falla"