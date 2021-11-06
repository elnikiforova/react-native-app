import React, { useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import Filter from "./Filter";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ImageFilters from "react-native-gl-image-filters";
import { Surface } from "gl-react-expo";

const initialColors = [
  {
    name: "Red",
    value: 0,
    minValue: 0,
    maxValue: 255,
    step: 1,
  },
  {
    name: "Green",
    value: 0,
    minValue: 0,
    maxValue: 255,
    step: 1,
  },
  {
    name: "Blue",
    value: 0,
    minValue: 0,
    maxValue: 255,
    step: 1,
  },
  {
    name: "Alpha",
    value: 0,
    minValue: 0,
    maxValue: 1,
    step: 0.1,
  },
];

const reducerColors = (state, color) => {
  const newState = state.map((c) => {
    if (c.name === color.name) {
      c.value = color.value;
    }
    return c;
  });
  return newState;
};

const initialFilters = {
  colorOverlay: [0.0, 0.0, 0.0, 0.0],
};

const reducerFilters = (state, filter) => {
    const newFilters = {...state, ...filter}
    return newFilters;
}

export default function App({ navigation }) {
  const [photoGalleryUri, setPhotoGalleryUri] = useState(null);
  const [colors, setColors] = useReducer(reducerColors, initialColors);
  const [filters, setFilters] = useReducer(reducerFilters,initialFilters);

  useEffect(() => {
    setFilters({colorOverlay: [colors[0].value, colors[1].value, colors[2].value, colors[3].value]});
  }, [colors[0].value, colors[1].value, colors[2].value, colors[3].value]);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoGalleryUri(result.uri);
    }
    console.log("result >>", result);
  };

  return (
    <View style={styles.container}>
      {photoGalleryUri && (
        <Surface style={{ width:300, height:300 }}>
            <ImageFilters {...filters} width={300} height={300}>
              {{ uri: photoGalleryUri }}
            </ImageFilters>
          </Surface>

      )}
      <Button title="Go to Home" onPress={() => navigation.navigate('Camera')} />
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <MaterialIcons name="my-library-add" style={styles.buttonImage} />
      </TouchableOpacity>
      {colors.map((filter) => {
        return (
          <Filter
            key={filter.name}
            name={filter.name}
            value={filter.value}
            minimum={filter.minValue}
            maximum={filter.maxValue}
            step={filter.step}
            onChange={(value) => {
              setColors({
                ...filter,
                value,
              });
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  camera: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
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
    color: "red",
  },
});
