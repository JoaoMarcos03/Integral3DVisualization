// Using the global THREE object directly
class MathEngine {
    constructor() {
        this.functionString = '';
        this.parsedFunction = null;
    }

    setFunction(funcStr) {
        this.functionString = funcStr;
        try {
            // Create a function that can evaluate the expression
            this.parsedFunction = this.parseFunction(funcStr);
            return true;
        } catch (error) {
            console.error("Error parsing function:", error);
            return false;
        }
    }

    parseFunction(funcStr) {
        // Create a safe function from the string
        // We wrap it in a try-catch to handle potential invalid expressions
        try {
            return new Function('x', 'y', 'z', `
                try {
                    const Math = window.Math;
                    return ${funcStr};
                } catch (e) {
                    console.error('Error evaluating function:', e);
                    return 0;
                }
            `);
        } catch (e) {
            throw new Error(`Invalid function: ${e.message}`);
        }
    }

    // Single integral computation
    computeSingleIntegral(xMin, xMax, steps = 100) {
        if (!this.parsedFunction) {
            throw new Error("Function not set");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        
        // Trapezoidal rule for better approximation
        let prev = this.parsedFunction(xMin, 0, 0);
        
        for (let i = 1; i <= steps; i++) {
            const x = xMin + i * dx;
            const current = this.parsedFunction(x, 0, 0);
            total += (prev + current) / 2 * dx;
            prev = current;
        }
        
        return total;
    }

    // Double integral computation
    computeDoubleIntegral(xMin, xMax, yMin, yMax, steps = 30) {
        if (!this.parsedFunction) {
            throw new Error("Function not set");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        
        for (let i = 0; i < steps; i++) {
            const x = xMin + (i + 0.5) * dx; // Midpoint rule
            
            for (let j = 0; j < steps; j++) {
                const y = yMin + (j + 0.5) * dy; // Midpoint rule
                total += this.parsedFunction(x, y, 0) * dx * dy;
            }
        }
        
        return total;
    }

    // Triple integral computation
    computeTripleIntegral(xMin, xMax, yMin, yMax, zMin, zMax, steps = 20) {
        if (!this.parsedFunction) {
            throw new Error("Function not set");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        const dz = (zMax - zMin) / steps;
        
        for (let i = 0; i < steps; i++) {
            const x = xMin + (i + 0.5) * dx; // Midpoint rule
            
            for (let j = 0; j < steps; j++) {
                const y = yMin + (j + 0.5) * dy; // Midpoint rule
                
                for (let k = 0; k < steps; k++) {
                    const z = zMin + (k + 0.5) * dz; // Midpoint rule
                    total += this.parsedFunction(x, y, z) * dx * dy * dz;
                }
            }
        }
        
        return total;
    }
    
    // Compute integral based on dimension
    computeIntegral(dimension, limits, steps = 20) {
        if (dimension === 1) {
            return this.computeSingleIntegral(limits.x[0], limits.x[1], steps);
        } else if (dimension === 2) {
            return this.computeDoubleIntegral(
                limits.x[0], limits.x[1],
                limits.y[0], limits.y[1],
                steps
            );
        } else if (dimension === 3) {
            return this.computeTripleIntegral(
                limits.x[0], limits.x[1],
                limits.y[0], limits.y[1],
                limits.z[0], limits.z[1],
                steps
            );
        } else {
            throw new Error(`Unsupported dimension: ${dimension}`);
        }
    }
    
    // Generate sample points for visualization
    generateSamplePoints(dimension, limits, resolution = 10) {
        const points = [];
        
        if (dimension === 1) {
            // 1D: Generate points along x-axis
            const xStep = (limits.x[1] - limits.x[0]) / resolution;
            for (let i = 0; i <= resolution; i++) {
                const x = limits.x[0] + i * xStep;
                const value = this.parsedFunction(x, 0, 0);
                points.push({
                    x: x,
                    y: 0,
                    z: value,
                    value: value
                });
            }
        } else if (dimension === 2) {
            // 2D: Generate grid in xy-plane
            const xStep = (limits.x[1] - limits.x[0]) / resolution;
            const yStep = (limits.y[1] - limits.y[0]) / resolution;
            
            for (let i = 0; i <= resolution; i++) {
                for (let j = 0; j <= resolution; j++) {
                    const x = limits.x[0] + i * xStep;
                    const y = limits.y[0] + j * yStep;
                    const value = this.parsedFunction(x, y, 0);
                    points.push({
                        x: x,
                        y: y,
                        z: value,
                        value: value
                    });
                }
            }
        } else if (dimension === 3) {
            // 3D: Generate volume
            const xStep = (limits.x[1] - limits.x[0]) / resolution;
            const yStep = (limits.y[1] - limits.y[0]) / resolution;
            const zStep = (limits.z[1] - limits.z[0]) / resolution;
            
            for (let i = 0; i <= resolution; i++) {
                for (let j = 0; j <= resolution; j++) {
                    for (let k = 0; k <= resolution; k++) {
                        const x = limits.x[0] + i * xStep;
                        const y = limits.y[0] + j * yStep;
                        const z = limits.z[0] + k * zStep;
                        const value = this.parsedFunction(x, y, z);
                        // Only add points where the function is positive (for visualization clarity)
                        if (value > 0) {
                            points.push({
                                x: x,
                                y: y,
                                z: z,
                                value: value
                            });
                        }
                    }
                }
            }
        }
        
        return points;
    }
}