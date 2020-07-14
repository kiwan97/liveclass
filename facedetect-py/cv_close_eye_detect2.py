import sys
sys.path.append('/usr/local/lib/python3.7/site-packages')
from PIL import Image
import base64
from time import sleep
import cv2
import json
eye_cascPath = 'haarcascade_eye_tree_eyeglasses.xml'  #eye detect model
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
	        print('no eyes!!!')
	    else:
	        print('eyes!!!')    
	    # frame_tmp = cv2.resize(frame_tmp, (400, 400), interpolation=cv2.INTER_LINEAR)
	    # cv2.imshow('Face Recognition', frame_tmp)
	else:
		print('no Face!!!')
	sys.stdout.flush()
