// Motor de cálculo matemático para integrais
class MathEngine {
    constructor() {
        this.functionString = '';
        this.parsedFunction = null;
    }

    setFunction(funcStr) {
        this.functionString = funcStr;
        try {
            // Cria uma função que pode avaliar a expressão
            this.parsedFunction = this.parseFunction(funcStr);
            return true;
        } catch (error) {
            console.error("Erro ao analisar função:", error);
            return false;
        }
    }

    parseFunction(funcStr) {
        // Cria uma função segura a partir da string
        // Envolvemos numa estrutura try-catch para tratar expressões inválidas
        try {
            return new Function('x', 'y', 'z', `
                try {
                    const Math = window.Math;
                    return ${funcStr};
                } catch (e) {
                    console.error('Erro ao avaliar função:', e);
                    return 0;
                }
            `);
        } catch (e) {
            throw new Error(`Função inválida: ${e.message}`);
        }
    }

    // Cálculo de integral simples
    computeSingleIntegral(xMin, xMax, steps = 100) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        
        // Regra dos trapézios para melhor aproximação
        let prev = this.parsedFunction(xMin, 0, 0);
        
        for (let i = 1; i <= steps; i++) {
            const x = xMin + i * dx;
            const current = this.parsedFunction(x, 0, 0);
            total += (prev + current) / 2 * dx;
            prev = current;
        }
        
        return total;
    }

    // Cálculo de integral duplo
    computeDoubleIntegral(xMin, xMax, yMin, yMax, steps = 30) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        
        for (let i = 0; i < steps; i++) {
            const x = xMin + (i + 0.5) * dx; // Regra do ponto médio
            
            for (let j = 0; j < steps; j++) {
                const y = yMin + (j + 0.5) * dy; // Regra do ponto médio
                total += this.parsedFunction(x, y, 0) * dx * dy;
            }
        }
        
        return total;
    }

    // Cálculo de integral triplo
    computeTripleIntegral(xMin, xMax, yMin, yMax, zMin, zMax, steps = 20) {
        if (!this.parsedFunction) {
            throw new Error("Função não definida");
        }
        
        let total = 0;
        const dx = (xMax - xMin) / steps;
        const dy = (yMax - yMin) / steps;
        const dz = (zMax - zMin) / steps;
        
        for (let i = 0; i < steps; i++) {
            const x = xMin + (i + 0.5) * dx; // Regra do ponto médio
            
            for (let j = 0; j < steps; j++) {
                const y = yMin + (j + 0.5) * dy; // Regra do ponto médio
                
                for (let k = 0; k < steps; k++) {
                    const z = zMin + (k + 0.5) * dz; // Regra do ponto médio
                    total += this.parsedFunction(x, y, z) * dx * dy * dz;
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
            
            for (let i = 0; i <= resolution; i++) {
                for (let j = 0; j <= resolution; j++) {
                    for (let k = 0; k <= resolution; k++) {
                        const x = limits.x[0] + i * xStep;
                        const y = limits.y[0] + j * yStep;
                        const z = limits.z[0] + k * zStep;
                        const value = this.parsedFunction(x, y, z);
                        // Só adiciona pontos onde a função é positiva (para clareza visual)
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