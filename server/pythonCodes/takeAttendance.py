import os
import sys
import dlib # type: ignore
import cv2  # type: ignore
import numpy as np # type: ignore
import csv
import json
import asyncio

########### SSETTING THE THRESHOLD #########
THRESHOLD = 0.4

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(os.path.join(os.getcwd(),'pythonCodes','models',"shape_predictor_68_face_landmarks.dat"))
face_reco_model_address = os.path.join(os.getcwd(),'pythonCodes','models',"dlib_face_recognition_resnet_model_v1.dat")
face_reco_model = dlib.face_recognition_model_v1(face_reco_model_address)

class_student_rolls = []
class_student_features = []

attendance_student_features = []
students_present = []

async def return_128d_features(img_rd):
    shape = predictor(img_rd, dlib.rectangle(0, 0, img_rd.shape[1], img_rd.shape[0]))
    face_descriptor = face_reco_model.compute_face_descriptor(img_rd, shape)
    return face_descriptor

async def return_euclidean_distance(feature_1, feature_2):
        feature_1 = np.array(feature_1)
        feature_2 = np.array([float(feature_2[i]) for i in range(len(feature_2))])
        
        dist = np.sqrt(np.sum(np.square(feature_1 - feature_2)))
        print('dist : '+str(dist))
        return dist

async def set_class_student_datas(classid):
    csv_file_path = os.path.join(os.getcwd(), 'data', classid, 'student_featues.csv')
    with open(csv_file_path, 'r') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            class_student_rolls.append(row[0])
            class_student_features.append(row[1:])

async def get_faces(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    return faces

async def set_temp_image_features(classid):
    image_path = os.path.join(os.getcwd(), 'data', classid, 'temp_files', 'attendance_image.png')
    attendance_image = cv2.imread(image_path)

    faces = await get_faces(image_path)

    for face in faces:
        x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
        face_img = attendance_image[y1:y2, x1:x2]
        face_feature = await return_128d_features(face_img)
        attendance_student_features.append(face_feature)

async def take_attendance():
    for feature in attendance_student_features:
        feature_dist = []
        for std_feature in class_student_features:
            feature_dist.append(await return_euclidean_distance(feature, std_feature))
        
        min_dist = min(feature_dist)
        if(min_dist <= THRESHOLD):
            index = feature_dist.index(min_dist)
            present_student_roll = class_student_rolls[index]
            if present_student_roll not in students_present:
                students_present.append(present_student_roll)


async def mark_attendance(classid):
    json_file_path = os.path.join(os.getcwd(), 'data', classid, 'temp_files', 'attendance_data.json')
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    if "total" in data:
        data["total"] += 1
    else:
        data["total"] = 1

    for roll in students_present:
        if roll in data:
            data[roll] += 1
        else:
            data[roll] = 1

    with open(json_file_path, 'w') as file:
        json.dump(data, file, indent=4)


async def saveAttandance(classid):
    await set_class_student_datas(classid)
    await set_temp_image_features(classid)
    await take_attendance()
    await mark_attendance(classid)

async def main(classid):
    await saveAttandance(classid=classid)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory>")
        sys.exit(1)
    classid = sys.argv[1]
    
    asyncio.run(main(classid))