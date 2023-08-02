import cv2,os,time,winsound,pyttsx3
import pymsgbox
import pyzbar.pyzbar as pyzbar
import requests,os
from Config.base import url_api

class DetectionQrController():
    engine = pyttsx3.init()

    camera = 0
    format_result_information = ''
    def __init__(self):
        self.engine.setProperty("rate", 150)
        self.video_capture = cv2.VideoCapture(self.camera)

    def identify_qr(self):
        if self.video_capture.isOpened():
            starter_time = time.time()
            while True:
                self.inprogress_time = time.time() - starter_time
                if (self.inprogress_time >= 10):
                    winsound.PlaySound("SystemExclamation", winsound.SND_ALIAS)
                    #pymsgbox.alert('Supero sus 10 segundos, intentelo nuevamente')

                    self.video_capture.release()
                    cv2.destroyAllWindows()
                    return "0|Falla|Detection"
                
                ret, frame = self.video_capture.read()
                decode_objects = pyzbar.decode(frame)
                for obj in decode_objects:
                    
                    self.format_result_information = str(obj.data)
                    l = len(self.format_result_information)
                    try:
                        self.format_result_information = self.format_result_information[2:l - 1]
                        return "1|"+self.format_result_information
                    except:
                        break
                    
                cv2.imshow('Detection QR',frame)
			    
                cv2_key_press = cv2.waitKey(1)
                if cv2_key_press == 27 or cv2_key_press ==ord('q'):
                    break

            self.video_capture.release()
            cv2.destroyAllWindows()
            return "1|"+self.format_result_information

        return "0|Falla" #Falla  { 'flag' : 0, 'code' : "20172657B"}
    