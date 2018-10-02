class Interpreter {
    constructor() {
        this.AC = [];
        this.PC = 0;
        this.N = 0;
        this.Z = 0;
        this.X = 0;
        this.Y = 0;
        this.finished = false;
        this.memory = [];
        this.labels = [];
        this.instructions = null;
    }

    transformRgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    setInstructions(data) {
        this.instructions = data;  
    }

    setMemory(pos, data) {
        this.memory[pos] = data;
    }

    setLabel(label, value) {
        this.labels[label] = value;
    }

    setPC(data) {
        this.PC = data;
    }

    setN() {
        if(this.AC[0] < 0) {
            this.N = 1;
        } else {
            this.N = 0;
        }
    }

    setZ() {
        if(this.AC[0] === 0) {
            this.Z = 1;
        } else {
            this.Z = 0;
        }
    }

    setAC(pos, data) {
        this.AC[pos] = data;
    }

    commandST(pos, operator) {
        if(this.memory[pos] = operator) {
            return true;
        } else { return false; }
    }

    commandLD(operator) {
        return this.memory[operator];
    }

    commandADD(ac, operator) {
        let calc = ac + operator;
        return calc;
    }

    commandSUB(ac, operator) {
        let calc = ac - operator;
        return calc;
    }

    commandJMP(operator) {
        this.PC = operator;
    }

    commandJN(operator) {
        if(this.N === 1) {
            this.PC = operator;
            return true;
        } else {
            return false;
        }
    }

    commandJP(operator) {
        if(this.N === 0) {
            this.PC = operator;
            return true;
        } else {
            return false;
        }
    }

    commandJZ(operator) {
        if(this.Z === 1) {
            this.PC = operator;
            return true;
        } else {
            return false;
        }
    }

    commandJNZ(operator) {
        if(this.Z === 0) {
            this.PC = operator;
            return true;
        } else {
            return false;
        }
    }

    commandHALT() {
        this.finished = true;
        return true;
    }

    commandPOS() {
        this.X = this.AC[0];
        this.Y = this.AC[1];
        return true;
    }

    commandPXL() {
        let pixel = 5;
        let c = document.getElementById("canvas");
        let ctx = c.getContext("2d");
        let color = "#" + ((1 << 24) + (this.AC[0] << 16) + (this.AC[1] << 8) + this.AC[2]).toString(16).slice(1);
        ctx.fillStyle = color;
        ctx.fillRect(this.X, this.Y, pixel, pixel);
        return true;
    }

    commandRND(pos) {
        let rand = Math.floor((Math.random() * this.AC[1]) + this.AC[0]);
        this.memory[pos] = rand;
    }
}