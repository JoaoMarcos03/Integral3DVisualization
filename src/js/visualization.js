// Classe de visualização 3D
class Visualization {
    constructor() {
        this.container = document.getElementById('visualization');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.points = [];
        this.boundingBox = null;
        this.animationId = null;
        
        // Aguarda que o contentor tenha o tamanho apropriado
        setTimeout(() => this.init(), 100);
    }

    init() {
        // Obtém dimensões do contentor após o layout estar completo
        this.updateDimensions();
        
        // Cria cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Cria câmera
        this.camera = new THREE.PerspectiveCamera(
            60, 
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Cria renderizador
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Limpa contentor e adiciona renderizador
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // Adiciona controlos
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Adiciona iluminação básica
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Adiciona eixos coordenados
        this.addAxes();
        
        // Trata redimensionamento da janela
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Inicia ciclo de animação
        this.animate();
    }
    
    updateDimensions() {
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(rect.width, 400);
        this.height = Math.max(rect.height, 300);
    }
    
    onWindowResize() {
        this.updateDimensions();
        
        if (this.camera && this.renderer) {
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        }
    }
    
    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    addAxes(limits = null) {
        // Determine axis lengths based on limits or use default
        let axisLength = 2;
        if (limits) {
            const maxRange = Math.max(
                limits.x ? Math.abs(limits.x[1] - limits.x[0]) : 2,
                limits.y ? Math.abs(limits.y[1] - limits.y[0]) : 2,
                limits.z ? Math.abs(limits.z[1] - limits.z[0]) : 2
            );
            axisLength = Math.max(maxRange * 1.2, 2); // 20% larger than the largest range
        }
        
        // Remove existing axes
        this.removeAxes();
        
        // Eixo X - vermelho
        const xAxis = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            axisLength,
            0xff0000,
            axisLength * 0.1,
            axisLength * 0.05
        );
        xAxis.name = 'axis-x';
        this.scene.add(xAxis);
        
        // Eixo Y - verde
        const yAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            axisLength,
            0x00ff00,
            axisLength * 0.1,
            axisLength * 0.05
        );
        yAxis.name = 'axis-y';
        this.scene.add(yAxis);
        
        // Eixo Z - azul
        const zAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            axisLength,
            0x0000ff,
            axisLength * 0.1,
            axisLength * 0.05
        );
        zAxis.name = 'axis-z';
        this.scene.add(zAxis);
        
        // Adiciona rótulos com tamanho proporcional
        const labelScale = Math.max(axisLength * 0.1, 0.3);
        this.addAxisLabels(axisLength, labelScale);
        
        // Add grid lines for better reference
        this.addGridLines(limits, axisLength);
    }
    
    addAxisLabels(axisLength, scale) {
        const addLabel = (text, position, color) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 32;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 32, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(scale, scale * 0.5, 1);
            sprite.name = `label-${text}`;
            this.scene.add(sprite);
        };
        
        const labelOffset = axisLength * 1.1;
        addLabel('X', new THREE.Vector3(labelOffset, 0, 0), '#ff0000');
        addLabel('Y', new THREE.Vector3(0, labelOffset, 0), '#00ff00');
        addLabel('Z', new THREE.Vector3(0, 0, labelOffset), '#0000ff');
    }
    
    addGridLines(limits, axisLength) {
        if (!limits) return;
        
        const gridGroup = new THREE.Group();
        gridGroup.name = 'grid-lines';
        
        // Add grid lines for each plane
        const gridSize = Math.ceil(axisLength);
        const divisions = Math.min(gridSize * 2, 20);
        
        // XY plane grid
        if (limits.x && limits.y) {
            const xyGrid = new THREE.GridHelper(gridSize * 2, divisions, 0xcccccc, 0xcccccc);
            xyGrid.rotateX(Math.PI / 2);
            xyGrid.material.transparent = true;
            xyGrid.material.opacity = 0.2;
            gridGroup.add(xyGrid);
        }
        
        this.scene.add(gridGroup);
    }
    
    removeAxes() {
        // Remove existing axes and labels
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.name && (
                child.name.startsWith('axis-') || 
                child.name.startsWith('label-') ||
                child.name === 'grid-lines'
            )) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
    }
    
    clearVisualization() {
        // Remove all objects except axes, lights, and grid
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            const obj = this.scene.children[i];
            if (!(obj instanceof THREE.ArrowHelper) && 
                !(obj instanceof THREE.AmbientLight) && 
                !(obj instanceof THREE.DirectionalLight) && 
                !(obj instanceof THREE.Sprite) &&
                !(obj instanceof THREE.Group && obj.name === 'grid-lines')) {
                this.scene.remove(obj);
                
                // Dispose of geometry and materials to prevent memory leaks
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
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
    
    visualize1D(points, showPoints = true) {
        // Cria uma linha para função 1D
        const lineGeometry = new THREE.BufferGeometry();
        
        // Extrai vértices
        const vertices = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        lineGeometry.setFromPoints(vertices);
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        
        if (showPoints) {
            // Adiciona pontos
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
    }
    
    visualize2D(points, showPoints = true) {
        // Cria superfícies para função 2D
        const resolution = Math.sqrt(points.length);
        const xMin = Math.min(...points.map(p => p.x));
        const xMax = Math.max(...points.map(p => p.x));
        const yMin = Math.min(...points.map(p => p.y));
        const yMax = Math.max(...points.map(p => p.y));
        
        const width = xMax - xMin;
        const height = yMax - yMin;
        
        // Cria uma superfície paramétrica
        const geometry = new THREE.PlaneGeometry(width, height, resolution - 1, resolution - 1);
        const vertices = geometry.attributes.position.array;
        
        // Mapeia vértices aos valores da função
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            
            // Encontra o ponto correspondente
            const xIndex = Math.floor(((x - xMin) / width) * (resolution - 1));
            const yIndex = Math.floor(((y - yMin) / height) * (resolution - 1));
            const index = yIndex * resolution + xIndex;
            
            if (index < points.length && points[index]) {
                vertices[i + 2] = points[index].value || points[index].z;
            }
        }
        
        // Move geometry to correct position
        geometry.translate((xMax + xMin) / 2, (yMax + yMin) / 2, 0);
        
        // Atualiza geometria
        geometry.computeVertexNormals();
        
        // Cria material da superfície
        const material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            side: THREE.DoubleSide,
            flatShading: false,
            transparent: true,
            opacity: 0.7
        });
        
        const surface = new THREE.Mesh(geometry, material);
        this.scene.add(surface);
        
        if (showPoints) {
            // Adiciona estrutura aramada
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
            this.scene.add(wireframe);
        }
    }
    
    visualize3D(points, showPoints = true) {
        // Para 3D, usa pontos coloridos com tamanhos baseados no valor da função
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(points.length * 3);
        const colors = new Float32Array(points.length * 3);
        const sizes = new Float32Array(points.length);
        
        const color = new THREE.Color();
        
        // Encontra valores mínimo/máximo para normalização
        let minValue = Infinity;
        let maxValue = -Infinity;
        
        for (let i = 0; i < points.length; i++) {
            if (points[i].value < minValue) minValue = points[i].value;
            if (points[i].value > maxValue) maxValue = points[i].value;
        }
        
        for (let i = 0; i < points.length; i++) {
            // Posição
            positions[i * 3] = points[i].x;
            positions[i * 3 + 1] = points[i].y;
            positions[i * 3 + 2] = points[i].z;
            
            // Normaliza valor entre 0 e 1
            const normalizedValue = (points[i].value - minValue) / (maxValue - minValue || 1);
            
            // Cor - de azul (0) a vermelho (1)
            color.setHSL(0.7 * (1 - normalizedValue), 1, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Tamanho baseado no valor (escalado entre 0.05 e 0.2)
            sizes[i] = 0.05 + normalizedValue * 0.15;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            sizeAttenuation: true,
            transparent: true,
            opacity: showPoints ? 1.0 : 0.0
        });
        
        const pointCloud = new THREE.Points(geometry, material);
        this.scene.add(pointCloud);
    }
    
    updateVisualization(data) {
        this.clearVisualization();
        
        const { points, dimension, limits, showBounds, showPoints } = data;
        
        // Update axes to match the limits
        this.addAxes(limits);
        
        if (showBounds) {
            this.addBoundingBox(limits);
        }
        
        if (points && points.length > 0) {
            // Calculate appropriate camera distance based on limits
            const maxRange = Math.max(
                limits.x ? Math.abs(limits.x[1] - limits.x[0]) : 2,
                limits.y ? Math.abs(limits.y[1] - limits.y[0]) : 2,
                limits.z ? Math.abs(limits.z[1] - limits.z[0]) : 2
            );
            const cameraDistance = maxRange * 2;
            
            // Escolhe visualização baseada na dimensão
            if (dimension === 1) {
                this.visualize1D(points, showPoints);
                // Ajusta câmera para visualização 1D
                this.camera.position.set(0, cameraDistance * 0.8, cameraDistance * 0.8);
                this.controls.target.set((limits.x[0] + limits.x[1]) / 2, 0, 0);
            } else if (dimension === 2) {
                this.visualize2D(points, showPoints);
                // Ajusta câmera para visualização 2D
                this.camera.position.set(0, 0, cameraDistance);
                this.controls.target.set(
                    (limits.x[0] + limits.x[1]) / 2,
                    (limits.y[0] + limits.y[1]) / 2,
                    0
                );
            } else if (dimension === 3) {
                this.visualize3D(points, showPoints);
                // Ajusta câmera para visualização 3D
                this.camera.position.set(cameraDistance, cameraDistance, cameraDistance);
                this.controls.target.set(
                    (limits.x[0] + limits.x[1]) / 2,
                    (limits.y[0] + limits.y[1]) / 2,
                    (limits.z[0] + limits.z[1]) / 2
                );
            }
            
            this.camera.lookAt(this.controls.target);
            this.controls.update();
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
}