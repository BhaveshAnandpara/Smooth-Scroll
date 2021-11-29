import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

//Empty Commit 2



//TextureLoader
const textureLoader = new THREE.TextureLoader() //Step 1

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Geomerty

const geomerty = new THREE.PlaneBufferGeometry(1.2,1.8) //Step 2



//Step 3


for(let i = 0 ; i < 5 ; i++){


        const material = new THREE.MeshBasicMaterial({
            map : textureLoader.load(`${i}.jpg`)
        })
    
        const img = new THREE.Mesh(geomerty , material)
        img.position.set(Math.random() - 0.6 , -(i * 2.5))
    
        scene.add(img)
        

}

let objs = []

scene.traverse((object) => {

        if(object.isMesh){
           
            objs.push(object)

        }

})

// Lights 1

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

window.addEventListener('resize', () =>
{
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)



// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Mouse

window,addEventListener('wheel' , onMouseWheel)

let y = 0 
let position = 0 

function onMouseWheel(event){

    y= event.deltaY * 0.0014 //0.0007 is using to decrease the speed of scrolling

}

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener('mousemove' , (event)=>{

    mouse.x = (event.clientX/sizes.width) *2 - 1
    // console.log(mouse.x)
    mouse.y = -(event.clientY/sizes.height) *2 + 1

})

/**
 * Animate
 */


const clock = new THREE.Clock()

const tick = () =>
{
    position += y 
    y *= 0.95

    let text = document.querySelector('h1');

    //Raycaster
    raycaster.setFromCamera(mouse , camera)

    const intersects = raycaster.intersectObjects(objs)

    for(const intersect of intersects){
        gsap.to(intersect.object.scale , {x:1.1 , y:1.1})
    }

    for(const object of objs){

        if(!intersects.find((intersect) => intersect.object === object)){
            gsap.to(object.scale , {x:1 , y: 1})
        }

    }


    camera.position.y = - position

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()