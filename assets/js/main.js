window.onload = function() {
    
    // Initialize the layout
    let memoryTable = '';
    for (let j = 0; j < 80; j++) {
        memoryTable += '<div class="memory_item"><span>'+j+'</span><div></div></div>';
    }
    memoryTable += '<div class="register">';
    memoryTable += '<span>AC:</span><span class="operator_ac">0</span>';
    memoryTable += '<span>AC2:</span><span class="operator_ac2">0</span>';
    memoryTable += '<span>AC3:</span><span class="operator_ac3">0</span>';
    memoryTable += '<span>PC:</span><span class="operator_pc">0</span>';
    memoryTable += '<span>N:</span><span class="operator_n">0</span>';
    memoryTable += '<span>Z:</span><span class="operator_z">0</span>';
    memoryTable += '</div>';

    memoryTable += '<div class="outputs"><div id="console"></div>';
    memoryTable += '<canvas id="canvas" width="400" height="200" style="border:1px solid #000000;"></canvas>';
    memoryTable += '</div>';

    // Wrapper
    const wrapper = document.getElementById("memory");
    wrapper.innerHTML = memoryTable;
}

function initProgram() {
    let interpreter = new Interpreter;
    let instructions = document.getElementById("instructions").value.trim().split(/\r?\n/);
    interpreter.setInstructions(clearInstructions(instructions));

    memoryDataInit(interpreter);
    updateView(interpreter);
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

function updateView( data ) {
    let memory = data.memory;

    memory.map(function( instruction, i ){
        let space = document.getElementsByClassName("memory_item");
        space[i].innerHTML = '<span>'+i+'</span><div>'+instruction+'</div>';
    });

    let AC = document.getElementsByClassName("operator_ac");
    let AC2 = document.getElementsByClassName("operator_ac2");
    let AC3 = document.getElementsByClassName("operator_ac3");
    let PC = document.getElementsByClassName("operator_pc");
    let N = document.getElementsByClassName("operator_n");
    let Z = document.getElementsByClassName("operator_z");
    let result = document.getElementById("console");
    AC[0].innerHTML = data.AC[0];
    AC2[0].innerHTML = data.AC[1];
    AC3[0].innerHTML = data.AC[2];
    PC[0].innerHTML = data.PC;
    N[0].innerHTML = data.N;
    Z[0].innerHTML = data.Z;
    result.innerHTML = data.AC[0];
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
    let acIndex = 0;
    let stop = false;

    while(!stop) {
        let command = data.memory[data.PC].split(" ");

        if(command[0] !== "HALT") {

            // Set PC
            data.setPC(data.PC + 1);

            let exec = command[0];
            let value = null;

            if(command.length > 1) {
                if(command[1].includes("#")) {
                    console.log("OPERAÇÃO MATEMÁTICA");
    
                    let number = command[1].replace(/#|,|:/g, "");
                    number = parseInt(number, 10);
    
                    switch (exec) {
                        case "ADD":
                            value = data.commandADD(data.AC[acIndex], number);
                            data.setAC(acIndex, value);
                            break;
                        case "SUB":
                            value = data.commandSUB(data.AC[acIndex], number);
                            data.setAC(acIndex, value);
                            break;
                        default:
                            break;
                    }
    
                } else if(data.labels[command[1]] >= 0) {
                    console.log('LABEL');
                    let label = data.labels[command[1]];
    
                    switch (exec) {
                        case "ST":
                            value = data.commandST(label, data.AC[0]);
                            break;
                        case "ST2":
                            value = data.commandST(label, data.AC[1]);
                            break;
                        case "ST3":
                            value = data.commandST(label, data.AC[2]);
                            break;
                        case "LD":
                            value = data.commandLD(label);
                            data.setAC(0, value);
                            acIndex = 0;
                            break;
                        case "LD2":
                            value = data.commandLD(label);
                            data.setAC(1, value);
                            acIndex = 1;
                            break;
                        case "LD3":
                            value = data.commandLD(label);
                            data.setAC(2, value);
                            acIndex = 2;
                            break;
                        case "ADD":
                            value = data.commandADD(data.AC[acIndex], data.memory[label]);
                            data.setAC(acIndex, value);
                            break;
                        case "SUB":
                            value = data.commandSUB(data.AC[acIndex], data.memory[label]);
                            data.setAC(acIndex, value);
                            break;
                        case "JMP":
                            value = data.commandJMP(label);
                            break;
                        case "JN":
                            value = data.commandJN(label);
                            break;
                        case "JP":
                            value = data.commandJP(label);
                            break;
                        case "JZ":
                            value = data.commandJZ(label);
                            break;
                        case "JNZ":
                            value = data.commandJNZ(label);
                            break;
                        default:
                            break;
                    }

                } else {
                    console.log(command);
                }
            } else {
                switch (exec) {
                    case "POS":
                        value = data.commandPOS();
                        break;
                    case "PXL":
                        value = data.commandPXL();
                        break;
                    default:
                        break;
                }
            }
            data.setZ();
            data.setN();
        } else {
            stop = true;
            console.log("ACABOU!!!!!!");
        }

        updateView(data);

        console.log("X:"+data.X, "Y:"+data.Y);
    }

}