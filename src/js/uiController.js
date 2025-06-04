// Using the global THREE object directly
class UIController {
    constructor() {
        this.mathEngine = new MathEngine();
        this.visualization = new Visualization();
        this.inputForm = new InputForm(this.handleFormSubmit.bind(this));
        
        // Create result display
        this.resultElement = document.getElementById('numerical-result');
        if (!this.resultElement) {
            this.resultElement = document.createElement('div');
            this.resultElement.id = 'numerical-result';
            document.getElementById('result-container').prepend(this.resultElement);
        }
    }
    
    handleFormSubmit(data) {
        const { function: funcText, dimension, limits, visualization: visualOptions } = data;
        
        // Set the function in the math engine
        const success = this.mathEngine.setFunction(funcText);
        if (!success) {
            this.showError('Invalid function expression');
            return;
        }
        
        try {
            // Calculate the numerical result
            const steps = visualOptions.resolution * 5; // Use higher resolution for calculation
            const result = this.mathEngine.computeIntegral(dimension, limits, steps);
            
            // Display the result
            this.displayResult(funcText, dimension, limits, result);
            
            // Generate points for visualization
            const points = this.mathEngine.generateSamplePoints(dimension, limits, visualOptions.resolution);
            
            // Update visualization
            this.visualization.updateVisualization({
                points,
                dimension,
                limits,
                showBounds: visualOptions.showBounds
            });
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError(`Error calculating integral: ${error.message}`);
        }
    }
    
    displayResult(funcText, dimension, limits, result) {
        let limitText = '';
        
        if (dimension >= 1) {
            limitText += `x ∈ [${limits.x[0]}, ${limits.x[1]}]`;
        }
        
        if (dimension >= 2) {
            limitText += `, y ∈ [${limits.y[0]}, ${limits.y[1]}]`;
        }
        
        if (dimension >= 3) {
            limitText += `, z ∈ [${limits.z[0]}, ${limits.z[1]}]`;
        }
        
        const dimensionSymbol = dimension === 1 ? '∫' : (dimension === 2 ? '∬' : '∭');
        
        this.resultElement.innerHTML = `
            <div class="result-card">
                <h3>Integral Result</h3>
                <div class="math-expression">
                    ${dimensionSymbol} ${funcText} ${dimension > 1 ? 'd' + (dimension === 3 ? 'V' : 'A') : 'dx'} = <strong>${result.toFixed(6)}</strong>
                </div>
                <div class="limits">
                    where ${limitText}
                </div>
            </div>
        `;
        
        // Make sure the result is visible
        this.resultElement.style.display = 'block';
    }
    
    showError(message) {
        this.resultElement.innerHTML = `
            <div class="error-card">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
        
        // Make sure the error is visible
        this.resultElement.style.display = 'block';
    }
}