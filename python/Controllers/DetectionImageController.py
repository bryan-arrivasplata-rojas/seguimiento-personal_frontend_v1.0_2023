import cv2,os,time,winsound,pyttsx3
import pymsgbox

class DetectionImageController(object):
    engine = pyttsx3.init()

    camera = 0
    format_result_information = ''
    
    def __init__(self,list_codes,route_file_model):
        self.list_codes = list_codes
        self.route_file_model = route_file_model
        self.engine.setProperty("rate", 150)
        self.video_capture = cv2.VideoCapture(self.camera)

    def identify_image(self):
        if not os.path.isfile(self.route_file_model):
            pymsgbox.alert('No existe archivo modelo')
            exit(0)

        list_user = []
        for i in range(len(self.list_codes)):
            list_user
            list_user.append(self.list_codes[i][0])

        if self.video_capture.isOpened():
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            recognizer.read(self.route_file_model)
            face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades+'haarcascade_frontalface_default.xml')
            starter_time = time.time()
            counter = 0
            while True:
                self.inprogress_time = time.time() - starter_time
                if (self.inprogress_time >= 10):
                    winsound.PlaySound("SystemExclamation", winsound.SND_ALIAS)
                    #pymsgbox.alert('Supero sus 10 segundos, intentelo nuevamente')
                    self.video_capture.release()
                    cv2.destroyAllWindows()
                    return "0|Falla|Detection"
                
                ret, frame = self.video_capture.read()

                if ret == False: break

                cv2_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                aux_frame = cv2_gray.copy()

                face_detection_multiscale = face_classifier.detectMultiScale(cv2_gray,1.3,5)

                for (x,y,w,h) in face_detection_multiscale:
                    face = aux_frame[y:y+h,x:x+w]
                    face = cv2.resize(face,(150,150),interpolation= cv2.INTER_CUBIC)
                    recognizer_predict_face = recognizer.predict(face)
                    
                    if counter == 1:
                        self.video_capture.release()
                        cv2.destroyAllWindows()
                        return "1|"+self.format_result_information

                    if recognizer_predict_face[1] < 70:
                        self.format_result_information = list_user[recognizer_predict_face[0]]
                        self.cv2_frame_detection(x,y,w,h,frame,recognizer_predict_face, "Ud. es:"+'{}'.format(list_user[recognizer_predict_face[0]]))
                        counter = counter + 1

                    elif recognizer_predict_face[1]>70 and recognizer_predict_face[1]<85:
                        self.cv2_frame_undetection(x,y,w,h,frame,recognizer_predict_face, 'Desconocido')
                    else:
                        self.cv2_frame_undetection(x,y,w,h,frame,recognizer_predict_face, 'No humano')

                cv2.imshow('Detection Face',frame)
			    
                cv2_key_press = cv2.waitKey(1)
                if cv2_key_press == 27 or cv2_key_press ==ord('q'):
                    break

            self.video_capture.release()
            cv2.destroyAllWindows()
            return "1|"+self.format_result_information

        return "0|Falla" #Falla  { 'flag' : 0, 'code' : "20172657B"}
    
    def cv2_frame_undetection(self,x,y,w,h,frame,recognizer_predict_face, type_user='No humano'):
        cv2.putText(frame,'{}'.format(recognizer_predict_face),(x,y-5),1,1.3,(255,255,0),1,cv2.LINE_AA)
        cv2.putText(frame, type_user,(x,y-20),2,0.8,(0,0,255),1,cv2.LINE_AA)
        cv2.rectangle(frame, (x,y),(x+w,y+h),(0,0,255),2)
    
    def cv2_frame_detection(self,x,y,w,h,frame,recognizer_predict_face, type_user='Ud. es:'):
        cv2.putText(frame,'{}'.format(recognizer_predict_face),(x,y-5),1,1.3,(255,255,0),1,cv2.LINE_AA)
        cv2.putText(frame, type_user,(x,y-25),2,1.1,(0,255,0),1,cv2.LINE_AA)
        cv2.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)