import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ImageFilters from "react-native-gl-image-filters";
import { GLView } from "expo-gl";

const vertShaderSource = `#version 300 es
precision highp float;
in vec2 position;
out vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;

const fragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D cameraTexture;
in vec2 uv;
out vec4 fragColor;
void main() {
  fragColor = vec4(1.0 - texture(cameraTexture, uv).rgb, 1.0);
}`;

export default function App({ navigation }) {
  const camera = useRef();
  const glView = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [photoGalleryUri, setPhotoGalleryUri] = useState(null);

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
    setPhoto(photo);
    setPhotoGalleryUri(photo.uri);
    console.log("photo", photo);
  };

  /* Pick Image */
  const handlePickImage = () => {
    navigation.navigate("Filters");
  };

  // async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setPhotoGalleryUri(result.uri);
  //   }
  //   console.log("result >>", result);
  // };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const createCameraTexture = () => {
    return glView.current.createCameraTextureAsync(camera.current);
  };

  const onContextCreate = async (gl) => {
    // Create texture asynchronously
    const texture = await createCameraTexture();
    const cameraTexture = texture;

    // Compile vertex and fragment shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);

    // Link, use program, save and enable attributes
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    gl.useProgram(program);

    const positionAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttrib);

    // Create, bind, fill buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Bind 'position' attribute
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // Set 'cameraTexture' uniform
    gl.uniform1i(gl.getUniformLocation(program, "cameraTexture"), 0);

    // Activate unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Render loop
    const loop = () => {
      requestAnimationFrame(loop);

      // Clear
      gl.clearColor(0, 0, 1, 1);
      // tslint:disable-next-line: no-bitwise
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // // Bind texture if created
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

      // // Draw!
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

      // Submit frame
      gl.endFrameEXP();
    };
    loop();
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camera}></Camera>
      <GLView
        style={styles.camera}
        onContextCreate={onContextCreate}
        ref={glView}
      ></GLView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <MaterialIcons name="my-library-add" style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
          <MaterialIcons name="camera-alt" style={styles.buttonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePressFlipCamera}>
          <MaterialIcons
            name="flip-camera-android"
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
      {photoGalleryUri && (
        <Image
          source={{ uri: photoGalleryUri }}
          style={{ width: 300, height: 300 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 40,
    color: "white",
  },
});
