// Using the global THREE object directly without re-declaring it
document.addEventListener('DOMContentLoaded', () => {
    // Create the UI Controller which will initialize all components
    const controller = new UIController();
    
    // Start animation loop
    function animate() {
        requestAnimationFrame(animate);
        controller.visualization.renderer.render(
            controller.visualization.scene, 
            controller.visualization.camera
        );
    }
    animate();
    
    // Add some examples to the page to help users get started
    addExamples();
});

// Helper function to add example buttons
function addExamples() {
    const container = document.createElement('div');
    container.id = 'examples';
    container.innerHTML = `
        <h3>Try These Examples:</h3>
        <div class="example-buttons">
            <button class="example-btn" data-dimension="1" data-func="Math.sin(x)" data-limits='{"x":[-3.14,3.14]}'>sin(x) from -π to π</button>
            <button class="example-btn" data-dimension="2" data-func="x*y" data-limits='{"x":[-1,1],"y":[-1,1]}'>x*y over [-1,1]×[-1,1]</button>
            <button class="example-btn" data-dimension="3" data-func="x*y*z" data-limits='{"x":[-1,1],"y":[-1,1],"z":[-1,1]}'>x*y*z over unit cube</button>
        </div>
    `;
    
    // Insert after form container
    const formContainer = document.getElementById('form-container');
    formContainer.parentNode.insertBefore(container, formContainer.nextSibling);
    
    // Add click handlers to example buttons
    const buttons = container.querySelectorAll('.example-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const dimension = parseInt(button.dataset.dimension);
            const funcText = button.dataset.func;
            const limits = JSON.parse(button.dataset.limits);
            
            // Set form values
            const form = document.querySelector('form');
            form.querySelector('#dimension-select').value = dimension;
            form.querySelector('#function').value = funcText;
            
            // Trigger the change event to update the form
            const event = new Event('change');
            form.querySelector('#dimension-select').dispatchEvent(event);
            
            // Set the limits based on dimension
            if (dimension >= 1 && limits.x) {
                form.querySelector('#xMin').value = limits.x[0];
                form.querySelector('#xMax').value = limits.x[1];
            }
            
            if (dimension >= 2 && limits.y) {
                form.querySelector('#yMin').value = limits.y[0];
                form.querySelector('#yMax').value = limits.y[1];
            }
            
            if (dimension >= 3 && limits.z) {
                form.querySelector('#zMin').value = limits.z[0];
                form.querySelector('#zMax').value = limits.z[1];
            }
            
            // Submit the form
            form.dispatchEvent(new Event('submit'));
        });
    });
}