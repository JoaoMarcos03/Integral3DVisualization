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
    if (resolutionInput) {
        resolutionInput.value = 20;
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
    
    form.dispatchEvent(new Event('submit'));
    console.log("Resultado esperado (Volume do cilindro): 2π ≈ 6.2832");
}

// Adiciona botões de teste à página
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.style.margin = '10px 0';
    
    const sphereButton = document.createElement('button');
    sphereButton.textContent = "Teste: Volume da Esfera Unitária";
    sphereButton.className = "example-btn";
    sphereButton.onclick = sphereExample;
    
    const coneButton = document.createElement('button');
    coneButton.textContent = "Teste: Volume do Cone";
    coneButton.className = "example-btn";
    coneButton.onclick = coneExample;
    
    const cylinderButton = document.createElement('button');
    cylinderButton.textContent = "Teste: Volume do Cilindro";
    cylinderButton.className = "example-btn";
    cylinderButton.onclick = cylinderExample;
    
    container.appendChild(sphereButton);
    container.appendChild(coneButton);
    container.appendChild(cylinderButton);
    
    // Insere após a secção de exemplos
    setTimeout(() => {
        const examplesDiv = document.getElementById('examples');
        if (examplesDiv) {
            examplesDiv.appendChild(container);
        } else {
            // Como alternativa, insere após o formulário
            const formContainer = document.getElementById('form-container');
            if (formContainer) {
                formContainer.parentNode.insertBefore(container, formContainer.nextSibling);
            }
        }
    }, 500); // Pequeno atraso para garantir que os exemplos já foram criados
});