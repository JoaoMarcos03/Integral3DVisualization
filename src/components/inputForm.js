class InputForm {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.dimension = 3; // Por defeito 3D (integral triplo)
        this.createForm();
    }

    createForm() {
        // Cria o contentor do formulário
        const formContainer = document.getElementById('form-container');
        formContainer.innerHTML = '';
        
        this.form = document.createElement('form');
        this.form.classList.add('integral-form');
        
        // Adiciona seletor de dimensão
        const dimensionDiv = document.createElement('div');
        dimensionDiv.classList.add('form-group');
        dimensionDiv.innerHTML = `
            <label>Dimensão da Integração:</label>
            <select id="dimension-select">
                <option value="1">Integral Simples (1D)</option>
                <option value="2">Integral Duplo (2D)</option>
                <option value="3" selected>Integral Triplo (3D)</option>
            </select>
        `;
        this.form.appendChild(dimensionDiv);
        
        // Adiciona campo da função
        const functionDiv = document.createElement('div');
        functionDiv.classList.add('form-group');
        functionDiv.innerHTML = `
            <label for="function">Função a Integrar:</label>
            <input type="text" id="function" name="function" placeholder="ex: x*y*z ou Math.sin(x)" required>
            <small>Use x, y, z como variáveis. Funções Math disponíveis (Math.sin, Math.exp, etc.)</small>
        `;
        this.form.appendChild(functionDiv);
        
        // Adiciona contentores de limites
        this.limitsContainer = document.createElement('div');
        this.limitsContainer.id = 'limits-container';
        this.form.appendChild(this.limitsContainer);
        
        // Adiciona opções de visualização
        const visualDiv = document.createElement('div');
        visualDiv.classList.add('form-group');
        visualDiv.innerHTML = `
            <label>Opções de Visualização:</label>
            <div class="visual-options">
                <label>
                    <input type="checkbox" id="show-bounds" checked>
                    Mostrar Limites de Integração
                </label>
                <label>
                    <input type="checkbox" id="show-points" checked>
                    Mostrar Pontos de Amostra (3D)
                </label>
                <div class="resolution-control">
                    <label for="resolution">Resolução:</label>
                    <div class="slider-container">
                        <input type="range" id="resolution-slider" min="5" max="50" value="10" class="resolution-slider">
                        <input type="number" id="resolution" min="5" max="50" value="10" class="resolution-input">
                    </div>
                    <small>Maior resolução = mais pontos de cálculo (mais lento)</small>
                </div>
            </div>
        `;
        this.form.appendChild(visualDiv);
        
        // Adiciona botão de submissão
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Calcular e Visualizar Integral';
        this.form.appendChild(submitBtn);
        
        // Adiciona ouvintes de eventos
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        const dimensionSelect = this.form.querySelector('#dimension-select');
        dimensionSelect.addEventListener('change', (e) => {
            this.dimension = parseInt(e.target.value);
            this.updateLimitsInputs();
        });

        // Sync resolution slider and input
        const resolutionSlider = this.form.querySelector('#resolution-slider');
        const resolutionInput = this.form.querySelector('#resolution');
        
        resolutionSlider.addEventListener('input', (e) => {
            resolutionInput.value = e.target.value;
        });
        
        resolutionInput.addEventListener('input', (e) => {
            const value = Math.max(5, Math.min(50, parseInt(e.target.value) || 10));
            e.target.value = value;
            resolutionSlider.value = value;
        });
        
        // Configuração inicial dos campos de limites
        this.updateLimitsInputs();
        
        // Adiciona formulário ao contentor
        formContainer.appendChild(this.form);
    }
    
    updateLimitsInputs() {
        // Limpa limites atuais
        this.limitsContainer.innerHTML = '';
        
        if (this.dimension >= 1) {
            // Limites de X
            const xLimitsDiv = document.createElement('div');
            xLimitsDiv.classList.add('limits-group');
            xLimitsDiv.innerHTML = `
                <label>Limites de Integração para X:</label>
                <div class="limits-inputs">
                    <input type="number" id="xMin" name="xMin" value="-1" step="0.1" required>
                    <span>até</span>
                    <input type="number" id="xMax" name="xMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(xLimitsDiv);
        }
        
        if (this.dimension >= 2) {
            // Limites de Y
            const yLimitsDiv = document.createElement('div');
            yLimitsDiv.classList.add('limits-group');
            yLimitsDiv.innerHTML = `
                <label>Limites de Integração para Y:</label>
                <div class="limits-inputs">
                    <input type="number" id="yMin" name="yMin" value="-1" step="0.1" required>
                    <span>até</span>
                    <input type="number" id="yMax" name="yMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(yLimitsDiv);
        }
        
        if (this.dimension >= 3) {
            // Limites de Z
            const zLimitsDiv = document.createElement('div');
            zLimitsDiv.classList.add('limits-group');
            zLimitsDiv.innerHTML = `
                <label>Limites de Integração para Z:</label>
                <div class="limits-inputs">
                    <input type="number" id="zMin" name="zMin" value="-1" step="0.1" required>
                    <span>até</span>
                    <input type="number" id="zMax" name="zMax" value="1" step="0.1" required>
                </div>
            `;
            this.limitsContainer.appendChild(zLimitsDiv);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Obtém valores do formulário
        const functionText = this.form.querySelector('#function').value;
        
        // Obtém limites baseados na dimensão
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
        
        // Obtém opções de visualização
        const visualization = {
            showBounds: this.form.querySelector('#show-bounds').checked,
            showPoints: this.form.querySelector('#show-points').checked,
            resolution: parseInt(this.form.querySelector('#resolution').value)
        };
        
        // Chama a função de retorno onSubmit
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