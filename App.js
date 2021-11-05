import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader, THREE } from 'expo-three';

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
        <GLView style={{ width: 300, height: 300 }} onContextCreate={onContextCreate} />
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

function onContextCreate(gl) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    1000
  );

  const renderer = new Renderer({ gl });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  renderer.setClearColor(0xffffff, 0);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: new TextureLoader().load(require('./assets/ar-image.png')),
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 3;

  const animate = () => {
    this.rafID = requestAnimationFrame(animate);

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;
    cube.position.x = Math.sin(cube.rotation.x);
    cube.position.y = Math.cos(cube.rotation.y);

    renderer.render(scene, camera);

    gl.endFrameEXP();
  };
  animate();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
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
  // redMask: {
  //   position: 'absolute',
  //   top: 0,
  //   right: 0,
  //   left: 0,
  //   bottom: 50,
  //   opacity: 0.2,
  //   zIndex: 99,
  //   backgroundColor: 'red',
  // }
});

{/* <View style={styles.redMask}>
  <Text style={{ padding: 20 }}>I'm a mask!!!</Text>
</View> */}
