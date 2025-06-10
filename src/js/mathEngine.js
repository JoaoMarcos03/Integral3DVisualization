// Motor de cálculo matemático para integrais
class MathEngine {
    constructor() {
        this.functionString = '';
        this.parsedFunction = null;
        this.validOperations = ['Math.sin', 'Math.cos', 'Math.tan', 'Math.exp', 'Math.log', 'Math.sqrt', 'Math.pow', 'Math.abs', 'Math.PI', 'Math.E'];
    }

    setFunction(funcStr) {
        this.functionString = funcStr;
        try {
            // Validate function string for security
            if (!this.validateFunction(funcStr)) {
                throw new Error("Função contém operações não permitidas");
            }
            this.parsedFunction = this.parseFunction(funcStr);
            return true;
        } catch (error) {
            console.error("Erro ao analisar função:", error);
            return false;
        }
    }

    validateFunction(funcStr) {
        // Basic security check - only allow mathematical operations
        const allowedPattern = /^[x\+\-\*\/\(\)\s\d\.\^yzMath\.sincoexplogqrtabwPIE,]+$/;
        return allowedPattern.test(funcStr);
    }

    parseFunction(funcStr) {
        // Replace ^ with Math.pow for exponentiation
        const processedFunc = funcStr.replace(/\^/g, '**');
        
        try {
            return new Function('x', 'y', 'z', `
                try {
                    const Math = window.Math;
                    const result = ${processedFunc};
                    return isNaN(result) || !isFinite(result) ? 0 : result;
                } catch (e) {
                    return 0;
                }
            `);
        } catch (e) {
            throw new Error(`Função inválida: ${e.message}`);
        }
    }

    // Improved Simpson's rule for single integration
    computeSingleIntegralSimpson(xMin, xMax, steps = 100) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        // Ensure even number of steps for Simpson's rule
        if (steps % 2 !== 0) steps++;
        
        const h = (xMax - xMin) / steps;
        let sum = this.parsedFunction(xMin, 0, 0) + this.parsedFunction(xMax, 0, 0);
        
        // Apply Simpson's 1/3 rule
        for (let i = 1; i < steps; i++) {
            const x = xMin + i * h;
            const coefficient = (i % 2 === 0) ? 2 : 4;
            sum += coefficient * this.parsedFunction(x, 0, 0);
        }
        
        return (h / 3) * sum;
    }

    // Cálculo de integral simples com método adaptativo
    computeSingleIntegral(xMin, xMax, steps = 100) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        // Use Simpson's rule for better accuracy
        return this.computeSingleIntegralSimpson(xMin, xMax, steps);
    }

    // Improved double integral with adaptive sampling
    computeDoubleIntegral(xMin, xMax, yMin, yMax, steps = 30) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        
        // Use Simpson's rule in both directions for better accuracy
        for (let i = 0; i <= steps; i++) {
            const x = xMin + i * dx;
            const xWeight = (i === 0 || i === steps) ? 1 : ((i % 2 === 0) ? 2 : 4);
            
            for (let j = 0; j <= steps; j++) {
                const y = yMin + j * dy;
                const yWeight = (j === 0 || j === steps) ? 1 : ((j % 2 === 0) ? 2 : 4);
                
                const funcValue = this.parsedFunction(x, y, 0);
                total += xWeight * yWeight * funcValue;
            }
        }
        
        return total * (dx * dy) / 9; // Simpson's rule normalization
    }

    // Improved triple integral
    computeTripleIntegral(xMin, xMax, yMin, yMax, zMin, zMax, steps = 20) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        const dz = (zMax - zMin) / steps;
        
        // Use midpoint rule for triple integrals (more stable)
        for (let i = 0; i < steps; i++) {
            const x = xMin + (i + 0.5) * dx;
            
            for (let j = 0; j < steps; j++) {
                const y = yMin + (j + 0.5) * dy;
                
                for (let k = 0; k < steps; k++) {
                    const z = zMin + (k + 0.5) * dz;
                    const funcValue = this.parsedFunction(x, y, z);
                    total += funcValue * dx * dy * dz;
                }
            }
        }
        
        return total;
    }
    
    // Calcula integral baseado na dimensão
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
            throw new Error(`Dimensão não suportada: ${dimension}`);
        }
    }
    
    // Gera pontos de amostra para visualização
    generateSamplePoints(dimension, limits, resolution = 10) {
        const points = [];
        
        if (dimension === 1) {
            // 1D: Gera pontos ao longo do eixo x
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
            // 2D: Gera grelha no plano xy
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
            // 3D: Gera volume
            const xStep = (limits.x[1] - limits.x[0]) / resolution;
            const yStep = (limits.y[1] - limits.y[0]) / resolution;
            const zStep = (limits.z[1] - limits.z[0]) / resolution;
            
            // First pass: find value range for better visualization
            let minVal = Infinity, maxVal = -Infinity;
            const tempPoints = [];
            
            for (let i = 0; i <= resolution; i++) {
                for (let j = 0; j <= resolution; j++) {
                    for (let k = 0; k <= resolution; k++) {
                        const x = limits.x[0] + i * xStep;
                        const y = limits.y[0] + j * yStep;
                        const z = limits.z[0] + k * zStep;
                        const value = this.parsedFunction(x, y, z);
                        
                        tempPoints.push({ x, y, z, value });
                        if (value < minVal) minVal = value;
                        if (value > maxVal) maxVal = value;
                    }
                }
            }
            
            // Second pass: filter points based on significance
            const threshold = minVal + (maxVal - minVal) * 0.1; // Show points above 10% of range
            
            for (const point of tempPoints) {
                if (Math.abs(point.value) > Math.abs(threshold)) {
                    points.push(point);
                }
            }
        }
        
        return points;
    }

    // Add method to estimate integration error
    estimateError(dimension, limits, steps) {
        // Compare results with different step sizes
        const result1 = this.computeIntegral(dimension, limits, steps);
        const result2 = this.computeIntegral(dimension, limits, steps * 2);
        
        return Math.abs(result2 - result1);
    }
}