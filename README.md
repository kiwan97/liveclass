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
    - AI : Cascading Classifiers(https://en.wikipedia.org/wiki/Cascading_classifiers)
        얼굴 인식 및 눈을 감김 여부를 확인하는 프로젝트(https://github.com/GangYuanFan/Closed-Eye-Detection-with-opencv)를 가져와서 사용
        서버(NodeJs)와 cv2(python)간 이미지 전달을 위해서 python-shell(https://github.com/extrabacon/python-shell)을 사용
        Client에게서 받은 얼굴 이미지를 Server로 전달해주고 Server는 해당 이미지를 Python cv2에 전달해줍니다.
    - Socket : Socket.IO(https://socket.io/)
    - DB : MongoDB(https://www.mongodb.com/)
    - templates : BootStrap(https://getbootstrap.com/)