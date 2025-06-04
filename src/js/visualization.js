class Visualization {
    constructor() {
        this.container = document.getElementById('visualization');
        this.width = this.container.clientWidth || 600;
        this.height = this.container.clientHeight || 400;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.points = [];
        this.boundingBox = null;
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add coordinate axes
        this.addAxes();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Start animation loop
        this.animate();
    }
    
    addAxes() {
        // X axis - red
        const xAxis = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            2,
            0xff0000
        );
        this.scene.add(xAxis);
        
        // Y axis - green
        const yAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            2,
            0x00ff00
        );
        this.scene.add(yAxis);
        
        // Z axis - blue
        const zAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            2,
            0x0000ff
        );
        this.scene.add(zAxis);
        
        // Add labels
        const addLabel = (text, position, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 32;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '24px Arial';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 32, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(0.5, 0.25, 1);
            this.scene.add(sprite);
        };
        
        addLabel('X', new THREE.Vector3(2.2, 0, 0), '#ff0000');
        addLabel('Y', new THREE.Vector3(0, 2.2, 0), '#00ff00');
        addLabel('Z', new THREE.Vector3(0, 0, 2.2), '#0000ff');
    }
    
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    clearVisualization() {
        // Remove all objects except axes
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            const obj = this.scene.children[i];
            if (!(obj instanceof THREE.ArrowHelper) && !(obj instanceof THREE.AmbientLight) && 
                !(obj instanceof THREE.DirectionalLight)) {
                this.scene.remove(obj);
            }
        }
    }
    
    addBoundingBox(limits) {
        const xMin = limits.x?.[0] || 0;
        const xMax = limits.x?.[1] || 0;
        const yMin = limits.y?.[0] || 0;
        const yMax = limits.y?.[1] || 0;
        const zMin = limits.z?.[0] || 0;
        const zMax = limits.z?.[1] || 0;
        
        const geometry = new THREE.BoxGeometry(
            Math.abs(xMax - xMin),
            Math.abs(yMax - yMin),
            Math.abs(zMax - zMin)
        );
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        this.boundingBox = new THREE.Mesh(geometry, material);
        this.boundingBox.position.set(
            (xMax + xMin) / 2,
            (yMax + yMin) / 2,
            (zMax + zMin) / 2
        );
        
        this.scene.add(this.boundingBox);
    }
    
    visualize1D(points) {
        // Create a line for 1D function
        const lineGeometry = new THREE.BufferGeometry();
        
        // Extract vertices
        const vertices = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        lineGeometry.setFromPoints(vertices);
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        
        // Add points
        const pointGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(points.length * 3);
        
        for (let i = 0; i < points.length; i++) {
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
        }
        
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pointMaterial = new THREE.PointsMaterial({ color: 0x0000ff, size: 0.1 });
        const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
        this.scene.add(pointCloud);
    }
    
    visualize2D(points) {
        // Create surfaces for 2D function
        const xCount = Math.sqrt(points.length);
        const yCount = xCount;
        
        // Create a parametric surface
        const geometry = new THREE.PlaneGeometry(2, 2, xCount - 1, yCount - 1);
        const vertices = geometry.attributes.position.array;
        
        // Map vertices to function values
        for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
            const x = vertices[i];
            const y = vertices[i + 1];
            
            // Find the corresponding point
            const xIndex = Math.floor((x + 1) / 2 * (xCount - 1));
            const yIndex = Math.floor((y + 1) / 2 * (yCount - 1));
            const index = yIndex * xCount + xIndex;
            
            if (index < points.length) {
                vertices[i + 2] = points[index].value;
            }
        }
        
        // Update geometry
        geometry.computeVertexNormals();
        
        // Create surface material
        const material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            side: THREE.DoubleSide,
            flatShading: false,
            transparent: true,
            opacity: 0.7
        });
        
        const surface = new THREE.Mesh(geometry, material);
        this.scene.add(surface);
        
        // Add wireframe
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
        this.scene.add(wireframe);
    }
    
    visualize3D(points) {
        // For 3D, use colored points with sizes based on function value
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(points.length * 3);
        const colors = new Float32Array(points.length * 3);
        const sizes = new Float32Array(points.length);
        
        const color = new THREE.Color();
        
        // Find min/max values for normalization
        let minValue = Infinity;
        let maxValue = -Infinity;
        
        for (let i = 0; i < points.length; i++) {
            if (points[i].value < minValue) minValue = points[i].value;
            if (points[i].value > maxValue) maxValue = points[i].value;
        }
        
        for (let i = 0; i < points.length; i++) {
            // Position
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
            
            // Normalize value between 0 and 1
            const normalizedValue = (points[i].value - minValue) / (maxValue - minValue || 1);
            
            // Color - from blue (0) to red (1)
            color.setHSL(0.7 * (1 - normalizedValue), 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Size based on value (scaled between 0.05 and 0.2)
            sizes[i] = 0.05 + normalizedValue * 0.15;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            sizeAttenuation: true
        });
        
        const pointCloud = new THREE.Points(geometry, material);
        this.scene.add(pointCloud);
    }
    
    updateVisualization(data) {
        this.clearVisualization();
        
        const { points, dimension, limits, showBounds } = data;
        
        if (showBounds) {
            this.addBoundingBox(limits);
        }
        
        if (points && points.length > 0) {
            // Choose visualization based on dimension
            if (dimension === 1) {
                this.visualize1D(points);
                // Adjust camera for 1D visualization
                this.camera.position.set(0, 3, 3);
                this.controls.target.set((limits.x[0] + limits.x[1]) / 2, 0, 0);
            } else if (dimension === 2) {
                this.visualize2D(points);
                // Adjust camera for 2D visualization
                this.camera.position.set(0, 0, 5);
                this.controls.target.set(0, 0, 0);
            } else if (dimension === 3) {
                this.visualize3D(points);
                // Adjust camera for 3D visualization
                this.camera.position.set(3, 3, 3);
                this.controls.target.set(0, 0, 0);
            }
            
            this.camera.lookAt(this.controls.target);
            this.controls.update();
        }
    }
}