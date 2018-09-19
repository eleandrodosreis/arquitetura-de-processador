class Interpreter {
    constructor() {
        this.AC = [];
        this.PC = 0;
        this.N = 0;
        this.Z = 0;
        this.finished = false;
        this.memory = [];
        this.labels = [];
        this.instructions = null;
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

    setAC(pos, data) {
        this.AC[pos] = data;
    }

    commandST(pos, operator) {
        if(this.memory[pos] = operator) {
            return true;
        } else { return false; }
    }

    LD(operator) {
        return this.memory[operator];
    }

    commandADD(ac, operator) {
        return ac + operator;
    }

    commandSUB(ac, operator) {
        return ac - operator;
    }

    commandJMP(operator) {
        if(this.PC = operator){
            return true;
        } else { return false; }
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
}


window.onload = function() {
    
    let interpreter = new Interpreter;
    let instructions = document.getElementById("instructions").value.trim().split(/\r?\n/);
    interpreter.setInstructions(clearInstructions(instructions));

    memoryDataInit(interpreter);
    execInstructions(interpreter);
}

/* Function clean the instructions
 * @param: object  
 */
function clearInstructions( instructions ) {
    let newArray = [];
    instructions.map(function(elem, index) {
        newArray.push(elem.trim());
    });
    return newArray;
}

function memoryDataInit( data ) {
    let label = [];
    let codeBegin = false;
    data.instructions.map(function(value, index) {
        if(index != 0) {
            // Verify Labels
            if(value.includes(":")) {
                if(!codeBegin) {
                    let dataSplited = value.replace(/#|,|:/g, "");
                    dataSplited = dataSplited.split(" ");
                    dataSplited.map(function(v, i){
                        if(dataSplited[i-1] === "DB") {
                            data.setLabel(dataSplited[0], parseInt(v, 10));
                            data.setMemory(parseInt(v), parseInt(dataSplited[i+1]));
                        }
                    })
                } else {
                    let dataSplited = value.split(":");
                    let keepValue = false
                    let iterator = 0;
                    while(!keepValue) {
                        if(!data.memory[iterator]) {
                            data.setLabel(dataSplited[0].trim(), iterator);
                            data.setMemory(iterator, dataSplited[1].trim());
                            keepValue = true;
                        } else {
                            iterator++;
                        }
                    }
                }
            } else {
                if(value !== ".data" && value !== ".enddata" && value !== ".code" && value !== ".endcode" && value) {
                    let keepValue = false
                    let iterator = 0;
                    while(!keepValue) {
                        if(!data.memory[iterator]) {
                            data.setMemory(iterator, value.trim());
                            keepValue = true;
                        } else {
                            iterator++;
                        }
                    }
                }
            }
            if(value === ".code") { codeBegin = true; }
        } else {
            console.log("Inicializando a memória");
        }
    })
    console.log("Memória pronta");
}

function execInstructions( instructions ) {
    const data = instructions;
    let stop = false;

    console.log(data);

    while(!stop) {
        let command = data.memory[data.PC].split(" ");
        
        if(command[1].includes("#")) {
            console.log("OPERAÇÃO MATEMÁTICA");
        } else if(data.labels[command[1]]) {
            console.log('LABEL');
            data.setAC = parseInt(command[1], 10);
            let value = data.LD(31);
            console.log(value);
        } else {
            console.log('ELSE');
        }
        
        stop = true;
    }
}