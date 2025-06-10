function parseMathExpression(expression) {
    // Um analisador simples para expressões matemáticas
    return new Function('x', 'y', 'z', `return ${expression};`);
}

function formatResult(result) {
    return result.toFixed(4); // Formata o resultado para quatro casas decimais
}

function createGridPoints(xRange, yRange, zRange, step) {
    const points = [];
    for (let x = xRange[0]; x <= xRange[1]; x += step) {
        for (let y = yRange[0]; y <= yRange[1]; y += step) {
            for (let z = zRange[0]; z <= zRange[1]; z += step) {
                points.push({ x, y, z });
            }
        }
    }
    return points;
}

// Função de exemplo: Esfera com raio 1 centrada na origem
function sphereExample() {
    // Configura o formulário para o exemplo da esfera
    const form = document.querySelector('form');
    if (!form) return;
    
    // Define dimensão para 3D (integral triplo)
    const dimensionSelect = form.querySelector('#dimension-select');
    if (dimensionSelect) {
        dimensionSelect.value = "3";
        dimensionSelect.dispatchEvent(new Event('change'));
    }
    
    // Define função para a equação da esfera: se x²+y²+z² ≤ 1 então 1, caso contrário 0
    const funcInput = form.querySelector('#function');
    if (funcInput) {
        funcInput.value = "(x*x + y*y + z*z <= 1) ? 1 : 0";
    }
    
    // Define limites de integração para conter a esfera
    if (form.querySelector('#xMin')) form.querySelector('#xMin').value = -1;
    if (form.querySelector('#xMax')) form.querySelector('#xMax').value = 1;
    if (form.querySelector('#yMin')) form.querySelector('#yMin').value = -1;
    if (form.querySelector('#yMax')) form.querySelector('#yMax').value = 1;
    if (form.querySelector('#zMin')) form.querySelector('#zMin').value = -1;
    if (form.querySelector('#zMax')) form.querySelector('#zMax').value = 1;
    
    // Aumenta resolução para melhor visualização
    const resolutionInput = form.querySelector('#resolution');
    const resolutionSlider = form.querySelector('#resolution-slider');
    if (resolutionInput) {
        resolutionInput.value = 20;
    }
    if (resolutionSlider) {
        resolutionSlider.value = 20;
    }
    
    // Submete o formulário
    form.dispatchEvent(new Event('submit'));
    
    // Mostra resultado esperado
    console.log("Resultado esperado (Volume da esfera unitária): 4π/3 ≈ 4.18879");
}

// Exemplo de cone
function coneExample() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const dimensionSelect = form.querySelector('#dimension-select');
    if (dimensionSelect) {
        dimensionSelect.value = "3";
        dimensionSelect.dispatchEvent(new Event('change'));
    }
    
    const funcInput = form.querySelector('#function');
    if (funcInput) {
        funcInput.value = "(x*x + y*y <= (1-z)*(1-z) && z >= 0 && z <= 1) ? 1 : 0";
    }
    
    if (form.querySelector('#xMin')) form.querySelector('#xMin').value = -1;
    if (form.querySelector('#xMax')) form.querySelector('#xMax').value = 1;
    if (form.querySelector('#yMin')) form.querySelector('#yMin').value = -1;
    if (form.querySelector('#yMax')) form.querySelector('#yMax').value = 1;
    if (form.querySelector('#zMin')) form.querySelector('#zMin').value = 0;
    if (form.querySelector('#zMax')) form.querySelector('#zMax').value = 1;
    
    // Set resolution
    const resolutionInput = form.querySelector('#resolution');
    const resolutionSlider = form.querySelector('#resolution-slider');
    if (resolutionInput) resolutionInput.value = 15;
    if (resolutionSlider) resolutionSlider.value = 15;
    
    form.dispatchEvent(new Event('submit'));
    console.log("Resultado esperado (Volume do cone): π/3 ≈ 1.0472");
}

// Exemplo de cilindro
function cylinderExample() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const dimensionSelect = form.querySelector('#dimension-select');
    if (dimensionSelect) {
        dimensionSelect.value = "3";
        dimensionSelect.dispatchEvent(new Event('change'));
    }
    
    const funcInput = form.querySelector('#function');
    if (funcInput) {
        funcInput.value = "(x*x + y*y <= 1) ? 1 : 0";
    }
    
    if (form.querySelector('#xMin')) form.querySelector('#xMin').value = -1;
    if (form.querySelector('#xMax')) form.querySelector('#xMax').value = 1;
    if (form.querySelector('#yMin')) form.querySelector('#yMin').value = -1;
    if (form.querySelector('#yMax')) form.querySelector('#yMax').value = 1;
    if (form.querySelector('#zMin')) form.querySelector('#zMin').value = 0;
    if (form.querySelector('#zMax')) form.querySelector('#zMax').value = 2;
    
    // Set resolution
    const resolutionInput = form.querySelector('#resolution');
    const resolutionSlider = form.querySelector('#resolution-slider');
    if (resolutionInput) resolutionInput.value = 15;
    if (resolutionSlider) resolutionSlider.value = 15;
    
    form.dispatchEvent(new Event('submit'));
    console.log("Resultado esperado (Volume do cilindro): 2π ≈ 6.2832");
}
