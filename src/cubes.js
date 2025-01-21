const CONFIG = {
    cubeCount: 10,
    direction: { x: 0.05, y: 0, z: 0 },
    rotationSpeed: { x: 0.01, y: 0.01, z: 0 },
    randomizeColor: true,
    cubeColor: "#00ff00",
    resetBoundary: 20,
    cubeSize: 1,
};

function setupControls(scene, camera, cubes) {
    const controlsContainer = document.getElementById("controls");

    const colorGroup = document.createElement("div");
    colorGroup.classList.add("topic");
    colorGroup.innerHTML = `
        <label>
            Randomize Colors:
            <input type="checkbox" id="randomizeColor" ${CONFIG.randomizeColor ? "checked" : ""}>
        </label>
        <div id="colorPickerGroup" style="margin-top: 10px; ${CONFIG.randomizeColor ? "display: none;" : ""}">
            <label>
                Cube Color:
                <input type="color" id="cubeColor" value="${CONFIG.cubeColor}">
            </label>
        </div>
    `;
    controlsContainer.appendChild(colorGroup);

    const randomizeColorCheckbox = document.getElementById("randomizeColor");
    const colorPickerGroup = document.getElementById("colorPickerGroup");
    const colorPicker = document.getElementById("cubeColor");

    randomizeColorCheckbox.addEventListener("change", (e) => {
        CONFIG.randomizeColor = e.target.checked;
        colorPickerGroup.style.display = CONFIG.randomizeColor ? "none" : "block";
    
        updateCubeColors(cubes);
    });
    

    colorPicker.addEventListener("input", (e) => {
        CONFIG.cubeColor = e.target.value;
    
        if (!CONFIG.randomizeColor) {
            updateCubeColors(cubes); // Immediately apply the selected color to all cubes
        }
    });
    

    const cubeCountGroup = document.createElement("div");
    cubeCountGroup.classList.add("topic");
    cubeCountGroup.innerHTML = `
        <label>
            Cube Count:
            <input type="number" id="cubeCount" value="${CONFIG.cubeCount}" min="1" step="1" max="5000">
        </label>
    `;
    controlsContainer.appendChild(cubeCountGroup);

    document.getElementById("cubeCount").addEventListener("input", (e) => {
        CONFIG.cubeCount = parseInt(e.target.value, 10);
        adjustCubes(scene, camera, cubes);
    });

   const directionGroup = document.createElement("div");
   directionGroup.classList.add("topic");
   directionGroup.innerHTML = `
       <label>
           Direction X:
           <input type="number" id="directionX" value="${CONFIG.direction.x}" step="0.01">
       </label>
       <label>
           Direction Y:
           <input type="number" id="directionY" value="${CONFIG.direction.y}" step="0.01">
       </label>
   `;
   controlsContainer.appendChild(directionGroup);

   document.getElementById("directionX").addEventListener("input", (e) => {
       CONFIG.direction.x = parseFloat(e.target.value);
   });
   document.getElementById("directionY").addEventListener("input", (e) => {
       CONFIG.direction.y = parseFloat(e.target.value);
   });

   const rotationGroup = document.createElement("div");
   rotationGroup.classList.add("topic");
   rotationGroup.innerHTML = `
       <label>
           Rotation Speed X:
           <input type="number" id="rotationX" value="${CONFIG.rotationSpeed.x}" step="0.01">
       </label>
       <label>
           Rotation Speed Y:
           <input type="number" id="rotationY" value="${CONFIG.rotationSpeed.y}" step="0.01">
       </label>
       <label>
           Rotation Speed Z:
           <input type="number" id="rotationZ" value="${CONFIG.rotationSpeed.z}" step="0.01">
       </label>
   `;
   controlsContainer.appendChild(rotationGroup);

   document.getElementById("rotationX").addEventListener("input", (e) => {
       CONFIG.rotationSpeed.x = parseFloat(e.target.value);
   });
   document.getElementById("rotationY").addEventListener("input", (e) => {
       CONFIG.rotationSpeed.y = parseFloat(e.target.value);
   });
   document.getElementById("rotationZ").addEventListener("input", (e) => {
       CONFIG.rotationSpeed.z = parseFloat(e.target.value);
   });
}

function createCube(scene, camera) {
    const geometry = new THREE.BoxGeometry(CONFIG.cubeSize, CONFIG.cubeSize, CONFIG.cubeSize);
    const material = new THREE.MeshBasicMaterial({
        color: CONFIG.randomizeColor ? Math.random() * 0xffffff : CONFIG.cubeColor,
        wireframe: true,
    });

    const cube = new THREE.Mesh(geometry, material);
    const position = generateCubePosition(camera);
    cube.position.set(position.x, position.y, position.z);

    scene.add(cube);
    return cube;
}


function generateCubePosition(camera) {
    return {
        x: Math.random() * 20 - 10,
        y: Math.random() * 10 - 5,
        z: camera.position.z - CONFIG.resetBoundary,
    };
}

function adjustCubes(scene, camera, cubes) {
    const currentCount = cubes.length;

    if (CONFIG.cubeCount > currentCount) {
        const additionalCubes = CONFIG.cubeCount - currentCount;
        for (let i = 0; i < additionalCubes; i++) {
            const newCube = createCube(scene, camera);
            cubes.push(newCube);
        }
    } else if (CONFIG.cubeCount < currentCount) {
        const cubesToRemove = currentCount - CONFIG.cubeCount;
        for (let i = 0; i < cubesToRemove; i++) {
            const cube = cubes.pop();
            scene.remove(cube);
        }
    }
}

function updateCubeColors(cubes) {
    cubes.forEach((cube) => {
        cube.material = new THREE.MeshBasicMaterial({
            color: CONFIG.randomizeColor ? Math.random() * 0xffffff : CONFIG.cubeColor,
            wireframe: true,
        });
    });
}

function animateScene(cubes, renderer, scene, camera) {
    function animate() {
        requestAnimationFrame(animate);

        cubes.forEach((cube) => {
            cube.rotation.x += CONFIG.rotationSpeed.x;
            cube.rotation.y += CONFIG.rotationSpeed.y;
            cube.position.x += CONFIG.direction.x;
            cube.position.y += CONFIG.direction.y;
            cube.position.z += CONFIG.direction.z;

            if (cube.position.x > CONFIG.resetBoundary) {
                cube.position.x = -CONFIG.resetBoundary;
            }
        });

        renderer.render(scene, camera);
    }

    animate();
}


function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let cubes = [];
    adjustCubes(scene, camera, cubes);

    setupControls(scene, camera, cubes);
    animateScene(cubes, renderer, scene, camera);
}

main();