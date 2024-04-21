import os
import sys
import dlib # type: ignore
import cv2  # type: ignore
import numpy as np # type: ignore

detector = dlib.get_frontal_face_detector()

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

def crop_faces_and_save(image_path, save_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    if(len(faces) > 0):
        face = faces[0]

        x1 = face.left()
        y1 = face.top()
        x2 = face.right()
        y2 = face.bottom()

        cropped_face = image[y1:y2, x1:x2]
        cv2.imwrite(save_path, cropped_face)

def crop_faces_by_classid(classid):
    folders = get_folders(classid)
    target_directory = os.path.join(os.getcwd(), 'data', classid, 'students', 'cropped')
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)
    
    for folder in folders:
        dest_directory = os.path.join(os.getcwd(), 'data', classid, 'students', 'cropped',folder)
        if not os.path.exists(dest_directory):
            os.makedirs(dest_directory)
        files = os.listdir(os.path.join(os.getcwd(), 'data', classid, 'students', 'original',folder))
        for file in files:
            if file.endswith('.png'):
                img_src_url = os.path.join(os.getcwd(), 'data', classid, 'students', 'original', folder, file)
                img_dest_url = os.path.join(os.getcwd(), 'data', classid, 'students', 'cropped', folder, file)
                crop_faces_and_save(img_src_url, img_dest_url)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory>")
        sys.exit(1)
        
    classid = sys.argv[1]
    crop_faces_by_classid(classid)
    

