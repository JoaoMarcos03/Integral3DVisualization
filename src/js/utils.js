function parseMathExpression(expression) {
    // A simple parser for mathematical expressions
    return new Function('x', 'y', 'z', `return ${expression};`);
}

function formatResult(result) {
    return result.toFixed(4); // Format the result to four decimal places
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

// Example test function: Sphere with radius 1 centered at the origin
function sphereExample() {
    // Set up the form for a sphere example
    const form = document.querySelector('form');
    if (!form) return;
    
    // Set dimension to 3D (triple integral)
    const dimensionSelect = form.querySelector('#dimension-select');
    if (dimensionSelect) {
        dimensionSelect.value = "3";
        dimensionSelect.dispatchEvent(new Event('change'));
    }
    
    // Set function to the sphere equation: if x²+y²+z² ≤ 1 then 1, otherwise 0
    const funcInput = form.querySelector('#function');
    if (funcInput) {
        funcInput.value = "(x*x + y*y + z*z <= 1) ? 1 : 0";
    }
    
    // Set integration limits to contain the sphere
    if (form.querySelector('#xMin')) form.querySelector('#xMin').value = -1;
    if (form.querySelector('#xMax')) form.querySelector('#xMax').value = 1;
    if (form.querySelector('#yMin')) form.querySelector('#yMin').value = -1;
    if (form.querySelector('#yMax')) form.querySelector('#yMax').value = 1;
    if (form.querySelector('#zMin')) form.querySelector('#zMin').value = -1;
    if (form.querySelector('#zMax')) form.querySelector('#zMax').value = 1;
    
    // Increase resolution for better visualization
    const resolutionInput = form.querySelector('#resolution');
    if (resolutionInput) {
        resolutionInput.value = 20;
    }
    
    // Submit the form
    form.dispatchEvent(new Event('submit'));
    
    // Show expected result
    console.log("Expected result (Volume of unit sphere): 4π/3 ≈ 4.18879");
}

// Add a test button to the page
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.style.margin = '10px 0';
    
    const button = document.createElement('button');
    button.textContent = "Test: Unit Sphere Volume";
    button.className = "example-btn";
    button.onclick = sphereExample;
    
    container.appendChild(button);
    
    // Insert after the examples section
    setTimeout(() => {
        const examplesDiv = document.getElementById('examples');
        if (examplesDiv) {
            examplesDiv.appendChild(container);
        } else {
            // As fallback, insert after form
            const formContainer = document.getElementById('form-container');
            if (formContainer) {
                formContainer.parentNode.insertBefore(container, formContainer.nextSibling);
            }
        }
    }, 500); // Small delay to ensure examples are already created
});