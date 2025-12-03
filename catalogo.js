// catalogo.js - Versión final con Cubo de Prueba y Corrección de Temporización (setTimeout)

/**
 * Inicializa la escena 3D en un contenedor HTML específico.
 * Utilizamos las variables globales: THREE, OrbitControls.
 */
function setup3DViewer(containerId, isTestCube = false) {
    // 📢 THREE, OrbitControls y GLTFLoader son accesibles globalmente
    // ya que se cargan a través de CDN en index.html.

    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Configuración de la Escena
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 2); // Posición de la cámara para que el cubo sea visible

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    
    // 2. Luces
    scene.add(new THREE.AmbientLight(0xffffff, 1.5)); // Luz suave general
    const pointLight = new THREE.PointLight(0xffffff, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // 3. Objeto de Prueba (Cubo Rojo)
    let productModel;
    if (isTestCube) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // Usamos MeshBasicMaterial para una prueba simple que no requiere sombras complejas.
        const material = new THREE.MeshBasicMaterial({ color: 0xcc0000 }); 
        const cube = new THREE.Mesh(geometry, material);
        cube.name = 'CuboDePrueba';
        scene.add(cube);
        productModel = cube;
    }
    
    // 4. Controles (Interacción)
    // 📢 OrbitControls DEBE ESTAR DEFINIDO AQUÍ
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 5;
    
    // 5. Bucle de Animación
    function animate() {
        requestAnimationFrame(animate);

        controls.update();
        
        // Rotación de prueba (si no hay interacción del usuario, rotamos automáticamente)
        if (productModel && !controls.isMoving) {
             productModel.rotation.y += 0.005; 
        }

        renderer.render(scene, camera);
    }

    animate();

    // 6. Responsive
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ------------------------------------------------------------------
// --- INICIALIZACIÓN DE VISUALIZADORES CON CORRECCIÓN DE TEMPORIZACIÓN ---
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    
    // 🏆 ¡ESTA ES LA SOLUCIÓN!
    // Esperamos 500 ms para dar tiempo a que los scripts de la CDN carguen 
    // y definan THREE y OrbitControls, evitando el error ReferenceError.
    setTimeout(() => {
        try {
            console.log("Intentando inicializar 3D...");
            
            // 🛑 ¡CUBO DE PRUEBA ACTIVO!
            setup3DViewer('product-1-container', true);
            
            // Los demás, solo inicializan la escena base:
            setup3DViewer('product-2-container', false);
            setup3DViewer('product-3-container', false);
            setup3DViewer('product-4-container', false);
            setup3DViewer('product-5-container', false);
            setup3DViewer('product-6-container', false);
            setup3DViewer('product-7-container', false);
            setup3DViewer('product-8-container', false);
            setup3DViewer('product-9-container', false);
            setup3DViewer('product-10-container', false);
            
            console.log("Inicialización 3D completada.");
        } catch (error) {
            console.error("Fallo la inicialización 3D. Error:", error);
            // Si el error es 'OrbitControls is not defined', el problema es la carga.
        }
    }, 500); // 500 milisegundos de espera
});