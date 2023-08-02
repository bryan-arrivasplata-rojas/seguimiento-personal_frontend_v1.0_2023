
from Controllers.DetectionImageController import DetectionImageController
from Config.base import url_api, route_file_model
from Utils.util import file_model
import requests,os
from io import open
import sys
from Utils.util import split_character


def auth_face(format_result_information):
    if format_result_information!="0|Falla":
        if format_result_information!="0|Falla|Detection":
            separator = split_character(format_result_information)
            code = separator[0]
            response = requests.get(url_api + 'recognitions?code='+code).json()['response']
            if response['flag'] == 1 :
                data = {
                    'idUser':response['idUser'],
                    'idRecognition':3
                }
                requests.post(url_api+ 'histories',data)
            print(response)
        else:
           print({'error':'detection','flag':0}) 
    else:
        print({'error':'camara','flag':0})

if __name__ == "__main__":
    list_codes = requests.get(url_api + 'recognitions').json()['response']
    route_file_model = os.path.join(os.path.dirname(__file__), route_file_model)
    data = DetectionImageController(list_codes,route_file_model).identify_image()
    auth_face(data)
    sys.stdout.flush()
