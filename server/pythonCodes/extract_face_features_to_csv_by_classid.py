import os
import sys
import dlib # type: ignore
import cv2  # type: ignore
import numpy as np # type: ignore
import csv

predictor = dlib.shape_predictor(os.path.join(os.getcwd(),'pythonCodes','models',"shape_predictor_68_face_landmarks.dat"))
face_reco_model_address = os.path.join(os.getcwd(),'pythonCodes','models',"dlib_face_recognition_resnet_model_v1.dat")
face_reco_model = dlib.face_recognition_model_v1(face_reco_model_address)

def return_128d_features(path_img):
    img_rd = cv2.imread(path_img)

    shape = predictor(img_rd, dlib.rectangle(0, 0, img_rd.shape[1], img_rd.shape[0]))
    face_descriptor = face_reco_model.compute_face_descriptor(img_rd, shape)

    return face_descriptor


def get_folders(classid):
    current_dir = os.getcwd()
    target_directory = os.path.join(current_dir, 'data', classid, 'students', 'original')
    
    if not os.path.isdir(target_directory):
        print(f"Error: '{target_directory}' is not a valid directory.")
        return
    
    dir_list = []
    for entry in os.listdir(target_directory):
        if os.path.isdir(os.path.join(target_directory, entry)):
            dir_list.append(entry)
    return dir_list


def return_features_mean_by_roll(classid, roll):
    features_list_personX = []
    path_face_personX = os.path.join(os.getcwd(),'data',classid,'students','cropped',roll)

    photos_list = os.listdir(path_face_personX)
    if photos_list:
        for photo in photos_list:
            features_128d = return_128d_features(os.path.join(path_face_personX, photo))
            features_list_personX.append(features_128d)
   
    if features_list_personX:
        features_mean_personX = np.array(features_list_personX, dtype=object).mean(axis=0)
    else:
        features_mean_personX = np.zeros(128, dtype=object, order='C')
    return features_mean_personX

def extract_feature_and_save_to_csv(classid):
    rolls = get_folders(classid = classid)
    csv_file_path = os.path.join(os.getcwd(),'data',classid,'student_featues.csv')

    os.makedirs(os.path.dirname(csv_file_path), exist_ok=True)
    with open(csv_file_path, 'w') as csvfile:
        pass

    try:
        with open(csv_file_path, 'w', newline="") as csvfile:
            writer = csv.writer(csvfile)
            for roll in rolls:
                features_mean_personX = return_features_mean_by_roll(classid, roll)
                features_mean_personX = np.insert(features_mean_personX, 0, roll, axis=0)
                writer.writerow(features_mean_personX)
    except Exception as e:
        print(f"Error occurred: {e}")



if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory>")
        sys.exit(1)
    classid = sys.argv[1]
    
    extract_feature_and_save_to_csv(classid = classid)
    
    
    
