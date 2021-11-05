import { GLView } from "expo-gl"
import { Renderer, TextureLoader } from "expo-three"
import * as React from "react"
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { Asset } from "expo-asset"

export default function Tre() {
  let timeout

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout)
  }, [])

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={async (gl) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
        const sceneColor = (0xffffff, 0)

        // Declare renderer
        const renderer = new Renderer({ gl })
        renderer.setSize(width, height)
        renderer.setClearColor(sceneColor)

        // Declare camera
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000)
        camera.position.set(2, 5, 5)
        // Declare scene - root element
        const scene = new Scene()

        const ambientLight = new AmbientLight(0x101010)
        scene.add(ambientLight)

        const pointLight = new PointLight(0xffffff, 2, 1000, 1)
        pointLight.position.set(0, 100, 300)
        scene.add(pointLight)

        const spotLight = new SpotLight(0xffffff, 0.5)
        spotLight.position.set(0, 500, 100)
        spotLight.lookAt(scene.position)
        scene.add(spotLight)

        const asset = Asset.fromModule(require("./assets/Skull.obj"))
        await asset.downloadAsync()

        const material = new THREE.MeshBasicMaterial({ color: "grey" })

        const loader = new OBJLoader()
        loader.setMaterials(material)
        loader.load("./assets/Skull.obj", (object) => {
          let customModel = object
          customModel.position.setY(3)
          customModel.scale.set(0.05, 0.05, 0.05)
          scene.add(customModel)
          console.log("loaded")
        })

        //

        // camera.lookAt(customModel.position)

        function update() {
          // customModel.rotation.z += 0.025
        }

        // Setup an animation loop
        const render = () => {
          timeout = requestAnimationFrame(render)
          update()
          renderer.render(scene, camera)
          gl.endFrameEXP()
        }
        render()
      }}
    />
  )
}
