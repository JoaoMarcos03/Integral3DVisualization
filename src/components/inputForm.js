class InputForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.dimension = 3; // Default to 3D (triple integral)
        this.createForm();
    }

    createForm() {
        // Create the form container
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = '';
        
        this.form = document.createElement('form');
        this.form.classList.add('integral-form');
        
        // Add dimension selector
        const dimensionDiv = document.createElement('div');
        dimensionDiv.classList.add('form-group');
        dimensionDiv.innerHTML = `
            <label>Integration Dimension:</label>
            <select id="dimension-select">
                <option value="1">Single Integral (1D)</option>
                <option value="2">Double Integral (2D)</option>
                <option value="3" selected>Triple Integral (3D)</option>
            </select>
        `;
        this.form.appendChild(dimensionDiv);
        
        // Add function input
        const functionDiv = document.createElement('div');
        functionDiv.classList.add('form-group');
        functionDiv.innerHTML = `
            <label for="function">Function:</label>
            <input type="text" id="function" name="function" placeholder="e.g., x*y*z or Math.sin(x)" required>
            <small>Use x, y, z as variables. Math functions available (Math.sin, Math.exp, etc)</small>
        `;
        this.form.appendChild(functionDiv);
        
        // Add limits containers
        this.limitsContainer = document.createElement('div');
        this.limitsContainer.id = 'limits-container';
        this.form.appendChild(this.limitsContainer);
        
        // Add the visualization options
        const visualDiv = document.createElement('div');
        visualDiv.classList.add('form-group');
        visualDiv.innerHTML = `
            <label>Visualization Options:</label>
            <div class="visual-options">
                <label>
                    <input type="checkbox" id="show-bounds" checked>
                    Show Boundaries
                </label>
                <label>
                    <input type="checkbox" id="show-points" checked>
                    Show Sample Points
                </label>
                <label>
                    <input type="number" id="resolution" value="10" min="5" max="50">
                    Resolution
                </label>
            </div>
        `;
        this.form.appendChild(visualDiv);
        
        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Calculate & Visualize';
        this.form.appendChild(submitBtn);
        
        // Add event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        const dimensionSelect = this.form.querySelector('#dimension-select');
        dimensionSelect.addEventListener('change', (e) => {
            this.dimension = parseInt(e.target.value);
            this.updateLimitsInputs();
        });
        
        // Initial setup of limits inputs
        this.updateLimitsInputs();
        
        // Add form to container
        formContainer.appendChild(this.form);
    }
    
    updateLimitsInputs() {
        // Clear current limits
        this.limitsContainer.innerHTML = '';
        
        if (this.dimension >= 1) {
            // X limits
            const xLimitsDiv = document.createElement('div');
            xLimitsDiv.classList.add('limits-group');
            xLimitsDiv.innerHTML = `
                <label>X Limits:</label>
                <div class="limits-inputs">
                    <input type="number" id="xMin" name="xMin" value="-1" step="0.1" required>
                    <span>to</span>
                    <input type="number" id="xMax" name="xMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(xLimitsDiv);
        }
        
        if (this.dimension >= 2) {
            // Y limits
            const yLimitsDiv = document.createElement('div');
            yLimitsDiv.classList.add('limits-group');
            yLimitsDiv.innerHTML = `
                <label>Y Limits:</label>
                <div class="limits-inputs">
                    <input type="number" id="yMin" name="yMin" value="-1" step="0.1" required>
                    <span>to</span>
                    <input type="number" id="yMax" name="yMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(yLimitsDiv);
        }
        
        if (this.dimension >= 3) {
            // Z limits
            const zLimitsDiv = document.createElement('div');
            zLimitsDiv.classList.add('limits-group');
            zLimitsDiv.innerHTML = `
                <label>Z Limits:</label>
                <div class="limits-inputs">
                    <input type="number" id="zMin" name="zMin" value="-1" step="0.1" required>
                    <span>to</span>
                    <input type="number" id="zMax" name="zMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(zLimitsDiv);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const functionText = this.form.querySelector('#function').value;
        
        // Get limits based on dimension
        const limits = {};
        
        if (this.dimension >= 1) {
            limits.x = [
                parseFloat(this.form.querySelector('#xMin').value),
                parseFloat(this.form.querySelector('#xMax').value)
            ];
        }
        
        if (this.dimension >= 2) {
            limits.y = [
                parseFloat(this.form.querySelector('#yMin').value),
                parseFloat(this.form.querySelector('#yMax').value)
            ];
        }
        
        if (this.dimension >= 3) {
            limits.z = [
                parseFloat(this.form.querySelector('#zMin').value),
                parseFloat(this.form.querySelector('#zMax').value)
            ];
        }
        
        // Get visualization options
        const visualization = {
            showBounds: this.form.querySelector('#show-bounds').checked,
            showPoints: this.form.querySelector('#show-points').checked,
            resolution: parseInt(this.form.querySelector('#resolution').value)
        };
        
        // Call the onSubmit callback
        if (this.onSubmit) {
            this.onSubmit({
                function: functionText,
                dimension: this.dimension,
                limits,
                visualization
            });
        }
    }
}