## liveclass
AI를 통한 온라인 화상 수업 웹 사이트<br>
AI를 통해 학생을 모니터링 합니다.<br>
이때 학생의 얼굴, 눈을 확인하여 학생의 현재 얼굴 상태를 표시합니다.<br>
이외에 학생의 수업기록, 클래스 등 부차적인 요소가 있습니다.<br>

1. 사용 방법
    - Step1. git clone h<span>t</span>tps://github.com/kiwan97/liveclass.git 을 통해 프로젝트를 받아줍니다.
    - Step2. npm install을 통해 필요한 package를 받습니다.
    - Step3. 해당 프로젝트 경로에서 "node index.js"를 통해 실행시켜줍니다.
    - Step4. localhost:3000에 접속 해줍니다.
2. 사용된 기술
    - AI : [Cascading Classifiers](https://en.wikipedia.org/wiki/Cascading_classifiers)<br>
        얼굴 인식 및 눈을 감김 여부를 확인하는 [프로젝트](https://github.com/GangYuanFan/Closed-Eye-Detection-with-opencv)를 가져와서 사용<br>
        서버(NodeJs)와 cv2(python)간 이미지 전달을 위해서 [python-shell](https://github.com/extrabacon/python-shell)을 사용<br>
        Client에게서 받은 얼굴 이미지를 Server로 전달해주고 Server는 해당 이미지를 Python cv2에 전달해줍니다.<br>
    - Image Processing : [OpenCV](https://ko.wikipedia.org/wiki/OpenCV)<br>
        위에 제시한 [프로젝트](https://github.com/GangYuanFan/Closed-Eye-Detection-with-opencv)에서 python opencv를 사용합니다.<br>
        OpenCV를 통해 받은 얼굴 이미지에 대해 얼굴의 유무, 눈의 감김 여부를 확인합니다.<br>
    - Socket : [Socket.IO](https://socket.io/)<br>
        선생과 학생, 학생과 학생간 이미지전달(화상영상)에 사용됩니다.<br>
    - DB : [MongoDB](https://www.mongodb.com/)<br>
        [Passport.js](http://www.passportjs.org/)와 함께 사용되어 가입된 사용자 정보를 관리합니다.<br>
    - templates : [BootStrap](https://getbootstrap.com/)<br>
        제가 직접 해당 기술을 사용한 것은 아니고 오픈되어 있는 [템블릿](https://colorlib.com/wp/template/courses/)을 가져와 사용했습니다.<br>
3. 세부구현 설명
    - AI<br>
        ## 기존코드
        [링크](https://github.com/GangYuanFan/Closed-Eye-Detection-with-opencv/blob/master/cv_close_eye_detect.py)
        <pre>
        <code>
            import cv2
            eye_cascPath = 'D:/DeepLearning/face/opencv-face-recognition-python-master/opencv-files/                    haarcascade_eye_tree_eyeglasses.xml'  #eye detect model
            face_cascPath = 'D:/DeepLearning/face/opencv-face-recognition-python-master/opencv-files/haarcascade_frontalface_alt.xml'  #face detect model
            faceCascade = cv2.CascadeClassifier(face_cascPath)
            eyeCascade = cv2.CascadeClassifier(eye_cascPath)

            cap = cv2.VideoCapture(0)
            while 1:
                ret, img = cap.read()
                if ret:
                    frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    # Detect faces in the image
                    faces = faceCascade.detectMultiScale(
                        frame,
                        scaleFactor=1.1,
                        minNeighbors=5,
                        minSize=(30, 30),
                        # flags = cv2.CV_HAAR_SCALE_IMAGE
                    )
                    # print("Found {0} faces!".format(len(faces)))
                    if len(faces) > 0:
                        # Draw a rectangle around the faces
                        for (x, y, w, h) in faces:
                            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
                        frame_tmp = img[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1, :]
                        frame = frame[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1]
                        eyes = eyeCascade.detectMultiScale(
                            frame,
                            scaleFactor=1.1,
                            minNeighbors=5,
                            minSize=(30, 30),
                            # flags = cv2.CV_HAAR_SCALE_IMAGE
                        )
                        if len(eyes) == 0:
                            print('no eyes!!!')
                        else:
                            print('eyes!!!')
                        frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
                        cv2.imshow('Face Recognition', frame_tmp)
                    waitkey = cv2.waitKey(1)
                    if waitkey == ord('q') or waitkey == ord('Q'):
                        cv2.destroyAllWindows()
                        break
        </code>
        </pre>
        ## 수정된 코드
        [링크](https://github.com/kiwan97/liveclass/blob/master/facedetect-py/cv_close_eye_detect2.py)
        <pre>
        <code>
            import sys
            sys.path.append('/usr/local/lib/python3.7/site-packages')
            from PIL import Image
            import base64
            from time import sleep
            import cv2
            import json
            eye_cascPath = 'facedetect-py/haarcascade_eye_tree_eyeglasses.xml'  #eye detect model
            face_cascPath = 'facedetect-py/haarcascade_frontalface_alt.xml'  #face detect model
            faceCascade = cv2.CascadeClassifier(face_cascPath)
            eyeCascade = cv2.CascadeClassifier(eye_cascPath)

            # cap = cv2.VideoCapture(0)
            # img = cv2.imread('/Users/kiwankim/Downloads/Chrome/eye_py/Closed-Eye-Detection-with-opencv/test.jpeg',cv2.IMREAD_COLOR)
            ttt = []
            while(True):
                lines = sys.stdin.readline()
                if lines is ttt:
                    continue
                _string = json.loads(lines)
                data = _string["arg"]
                room = _string["room"]
                email = _string["email"]

                imgdata = base64.decodebytes(bytes(data[22:],'utf-8'))
                filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
                with open(filename, 'wb') as f:
                    f.write(imgdata)
                    f.close()
                sleep(0.5)
                print("saved")
                img = cv2.imread('some_image.jpg', cv2.IMREAD_COLOR);
                frame = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                # Detect faces in the image
                faces = faceCascade.detectMultiScale(
                    frame,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(30, 30),
                    # flags = cv2.CV_HAAR_SCALE_IMAGE
                )
                # print("Found {0} faces!".format(len(faces)))
                if len(faces) > 0:
                    # Draw a rectangle around the faces
                    for (x, y, w, h) in faces:
                        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    frame_tmp = img[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1, :]
                    frame = frame[faces[0][1]:faces[0][1] + faces[0][3], faces[0][0]:faces[0][0] + faces[0][2]:1]
                    eyes = eyeCascade.detectMultiScale(
                        frame,
                        scaleFactor=1.1,
                        minNeighbors=5,
                        minSize=(30, 30),
                        # flags = cv2.CV_HAAR_SCALE_IMAGE
                    )
                    if len(eyes) == 0:
                        print('no eyes!!!'+'@' + room + '@' + email)
                    else:
                        print('eyes!!!'+'@' + room + '@' + email)    
                    # frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
                    # cv2.imshow('Face Recognition', frame_tmp)
                else:
                    print('no Face!!!'+'@' + room + '@' + email)
                sys.stdout.flush()

        </code>
        </pre>

        차이점에 하는 부분은 다음과 같습니다.
        <pre>
        <code>
            lines = sys.stdin.readline()
            if lines is ttt:
                continue
            _string = json.loads(lines)
            data = _string["arg"]
            room = _string["room"]
            email = _string["email"]

            imgdata = base64.decodebytes(bytes(data[22:],'utf-8'))
            filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
            with open(filename, 'wb') as f:
                f.write(imgdata)
                f.close()
            sleep(0.5)
            print("saved")
        </code>
        </pre>

        기존 코드는 "cap = cv2.VideoCapture(0)"와 같이 바로 비디오사진을 받아온 반면<br>
        제가 변경한 부분은 Server(NodeJs)에서 보낸 json형태의 정보에 대해 이미지로 변경 후 사용해야했습니다.<br>
        json형태로 온 img는 [base64](https://ko.wikipedia.org/wiki/%EB%B2%A0%EC%9D%B4%EC%8A%A464)형태로 전달되어 옵니다.<br>
        이를 다시 imgdata로 만들기 위해 [base64.decodebytes(...)](https://docs.python.org/ko/3.7/library/base64.html)메소드를 사용했습니다.<br>
        이렇게 imgdata에 저장된 이미지 데이터를 'some_image.jpg'로 저장하고 다시 해당 이미지를 가져와 기존코드와 동일한 프로세스를 사용합니다.<br>
        번거롭게 imgdata를 다시 저장하고 불러오는 이유는 imgdata에 담겨있는 이미지 데이터를 기존코드에서 사용되게 하기위해서 마땅한 방법이 떠오르지 않아 그렇게 하였습니다...<br>

        그외의 다른점은 얼굴 유무와 눈 감김 여부 연산 결과를 print(...)로 출력하고 sys.stdout.flush()를 통해 Server(NodeJS)에 넘겨주었다는 점입니다.<br>
        이때 print(...)한 내용은 json과 함께 넘어온 client정보와 이미지 연산 결과(no face등등)을 함께 출력합니다.<br>

    - Socket