import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const camera = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  /* Flip Camera */
  const handlePressFlipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  /* Take Picture */
  const handleTakePicture = async () => {
    let photo = await camera.current.takePictureAsync();
    console.log("photo", photo)
  }

  /* Pick Image */
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });
    console.log("result >>", result)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePickImage}
          >
            <MaterialIcons name="my-library-add" style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePicture}
          >
            <MaterialIcons name="camera-alt" style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePressFlipCamera}
          >
            <MaterialIcons name="flip-camera-android" style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    color: "white",
  },
  buttonImage: {
    fontSize: 28,
    color: "white",
  },
});
