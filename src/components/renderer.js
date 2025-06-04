// Using the global THREE object directly
class Renderer {
    constructor(domElement) {
        this.domElement = domElement || document.createElement('div');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.init();
    }

    init() {
        // Set renderer properties
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add renderer to DOM
        if (!this.domElement.querySelector('canvas')) {
            this.domElement.appendChild(this.renderer.domElement);
        }
        
        // Set camera position
        this.camera.position.z = 5;
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    addObject(object) {
        this.scene.add(object);
    }

    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}