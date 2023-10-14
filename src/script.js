import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * debug
 */
const gui = new dat.GUI()

/**
 *
 */
const cubeTextureLoader = new THREE.CubeTextureLoader

/**
 * textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/color.jpg`)
const doorAlphaTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/alpha.jpg`)
const doorAmbientOcclusionTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/ambientOcclusion.jpg`)
const doorHeightTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/height.jpg`)
const doorNormalTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/normal.jpg`)
const doorMetalnessTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/metalness.jpg`)
const doorRoughnessTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/door/roughness.jpg`)

const matcapTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/matcaps/3.png`)
const gradientTexture = textureLoader.load(`${import.meta.env.BASE_URL}/textures/gradients/5.jpg`)
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/px.jpg`,
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/nx.jpg`,
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/py.jpg`,
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/nx.jpg`,
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/pz.jpg`,
    `${import.meta.env.BASE_URL}/textures/environmentMaps/3/nx.jpg`,
])


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * objects
 */
//const material = new THREE.MeshBasicMaterial()
//const material = new THREE.MeshNormalMaterial()
/*const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture*/
//const material = new THREE.MeshDepthMaterial()
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 50
// material.specular = new THREE.Color(0x1188ff)
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture
const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0
material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// gui.add(material, 'aoMapIntensity').min(1).max(10).step(.1)
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
//
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
//
//
//material.color.set(0xffffff)
material.wireframe = false
material.flatShading = false
material.opacity = 0.5
material.transparent = false
// //material.alphaMap = doorAlphaTexture
material.side = THREE.DoubleSide

gui.add(material, 'transparent')
gui.add(material, 'opacity').min(.2).max(1).step(0.0001)

gui.add(material, 'wireframe')
//gui.add(material, 'flatShading')


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 128, 128),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)

sphere.position.x = -1.5
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

//gui.add(ambientLight, 'intensity').min(0).max(1).step(0.0001).name('ambient light intensity')

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
//renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.25 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
