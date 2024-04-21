import os
import sys
import dlib

print('dlib version :: ' + dlib.__version__)
face_reco_model_address = os.path.join(os.getcwd(),'pythonCodes','models',"dlib_face_recognition_resnet_model_v1.dat")
print(face_reco_model_address)

dlib.deserialize(face_reco_model_address)