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
        this.memoryOperators = [];
        this.loadMemoryOperators();
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

    loadMemoryOperators() {
        this.memoryOperators = {
            "ST": function(pos, operator) {
                if(this.memory[pos] = operator) {
                    return true;
                } else { return false; }
            },
            "LD": function(operator) {
                return this.memory[operator];
            },
            "ADD": function(ac, operator) {
                return ac + operator;
            },
            "SUB": function(ac, operator) {
                return ac - operator;
            },
            "JMP": function(operator) {
                if(this.PC = operator){
                    return true;
                } else { return false; }
            },
            "JN": function(operator) {
                if(this.N === 1) {
                    this.PC = operator;
                    return true;
                } else {
                    return false;
                }
            },
            "JP": function(operator) {
                if(this.N === 0) {
                    this.PC = operator;
                    return true;
                } else {
                    return false;
                }
            },
            "JZ": function(operator) {
                if(this.Z === 1) {
                    this.PC = operator;
                    return true;
                } else {
                    return false;
                }
            },
            "JNZ": function(operator) {
                if(this.Z === 0) {
                    this.PC = operator;
                    return true;
                } else {
                    return false;
                }
            },
            "HALT": function() {
                this.finished = true;
                return true;
            }
        }
    }
}


window.onload = function() {
    
    let interpreter = new Interpreter;
    let instructions = document.getElementById("instructions").value.trim().split(/\r?\n/);
    interpreter.setInstructions(clearInstructions(instructions));

    memoryDataInit(interpreter);

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
    console.log(data);
}

function execInstructions( instructions ) {
     
}