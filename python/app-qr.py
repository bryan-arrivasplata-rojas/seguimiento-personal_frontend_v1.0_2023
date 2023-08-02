
from flask import request
from Controllers.DetectionQrController import DetectionQrController
from Config.base import url_api
import requests,os
from io import open
import sys

from Utils.util import split_character


def auth_user(format_result_information):
    if format_result_information!="0|Falla":
        if format_result_information!="0|Falla|Detection":
            separator = split_character(format_result_information)
            code = separator[0]
            password = separator[1]
            response = requests.get(url_api + 'users?code='+code+'&password='+password).json()['response']
            if response['flag'] == 1 :
                data = {
                    'idUser':response['idUser'],
                    'idRecognition':2
                }
                #print("1|"+response['code']+"|3")
                requests.post(url_api+ 'histories',data)
            print(response)
        else:
           print({'error':'detection','flag':0}) 
    else:
        print({'error':'camara','flag':0})

if __name__ == "__main__":
    data = DetectionQrController().identify_qr()
    auth_user(data)
    sys.stdout.flush()

