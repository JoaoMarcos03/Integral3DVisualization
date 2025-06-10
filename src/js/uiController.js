// Controlador da interface do utilizador
class UIController {
    constructor() {
        this.mathEngine = new MathEngine();
        this.visualization = new Visualization();
        this.inputForm = new InputForm(this.handleFormSubmit.bind(this));
        
        // Cria o elemento de apresentação de resultados
        this.resultElement = document.getElementById('numerical-result');
        if (!this.resultElement) {
            this.resultElement = document.createElement('div');
            this.resultElement.id = 'numerical-result';
            document.getElementById('result-container').prepend(this.resultElement);
        }
        
        // Esconde o elemento de resultado por defeito
        this.resultElement.style.display = 'none';
    }
    
    handleFormSubmit(data) {
        const { function: funcText, dimension, limits, visualization: visualOptions } = data;
        
        // Define a função no motor matemático
        const success = this.mathEngine.setFunction(funcText);
        if (!success) {
            this.showError('Expressão de função inválida');
            return;
        }
        
        try {
            // Calcula o resultado numérico com diferentes resoluções para estimativa de erro
            const steps = visualOptions.resolution * 5;
            const result = this.mathEngine.computeIntegral(dimension, limits, steps);
            const errorEstimate = this.mathEngine.estimateError(dimension, limits, steps);
            
            // Apresenta o resultado com estimativa de erro
            this.displayResult(funcText, dimension, limits, result, errorEstimate);
            
            // Gera pontos para visualização
            const points = this.mathEngine.generateSamplePoints(dimension, limits, visualOptions.resolution);
            
            // Atualiza visualização
            this.visualization.updateVisualization({
                points,
                dimension,
                limits,
                showBounds: visualOptions.showBounds,
                showPoints: visualOptions.showPoints
            });
        } catch (error) {
            console.error('Erro de cálculo:', error);
            this.showError(`Erro ao calcular integral: ${error.message}`);
        }
    }
    
    displayResult(funcText, dimension, limits, result, errorEstimate) {
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
        const integralType = dimension === 1 ? 'dx' : (dimension === 2 ? 'dA' : 'dV');
        
        // Format result with appropriate precision
        const precision = Math.max(3, Math.ceil(-Math.log10(Math.abs(result) + 1e-10)) + 2);
        const formattedResult = result.toFixed(Math.min(precision, 8));
        
        this.resultElement.innerHTML = `
            <div class="result-card">
                <h3>Resultado do Integral</h3>
                <div class="math-expression">
                    ${dimensionSymbol} ${funcText} ${integralType} = <strong>${formattedResult}</strong>
                </div>
                <div class="limits">
                    onde ${limitText}
                </div>
                ${errorEstimate ? `<div class="error-estimate">
                    <small>Estimativa de erro: ±${errorEstimate.toExponential(2)}</small>
                </div>` : ''}
            </div>
        `;
        
        // Garante que o resultado está visível
        this.resultElement.style.display = 'block';
    }
    
    showError(message) {
        this.resultElement.innerHTML = `
            <div class="error-card">
                <h3>Erro</h3>
                <p>${message}</p>
            </div>
        `;
        
        // Garante que o erro está visível
        this.resultElement.style.display = 'block';
    }
}