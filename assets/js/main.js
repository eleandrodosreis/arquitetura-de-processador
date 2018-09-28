window.onload = function() {
    
    // Initialize the layout
    let memoryTable = '';
    for (let j = 0; j < 80; j++) {
        memoryTable += '<div class="memory_item"><span>'+j+'</span><div></div></div>';
    }

    // Wrapper
    const wrapper = document.getElementById("memory");
    wrapper.innerHTML = memoryTable;

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

    while(!stop) {
        let command = data.memory[data.PC].split(" ");

        if(command[0] !== "HALT") {

            // Set PC
            data.setPC(data.PC + 1);

            let exec = command[0];
            let value = null;

            if(command[1].includes("#")) {
                console.log("OPERAÇÃO MATEMÁTICA");

                let number = command[1].replace(/#|,|:/g, "");
                number = parseInt(number, 10);

                switch (exec) {
                    case "ADD":
                        value = data.commandADD(data.AC[0], number);
                        data.setAC(0, value);
                        break;
                    case "SUB":
                        value = data.commandSUB(data.AC[0], number);
                        data.setAC(0, value);
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
                    case "LD":
                        value = data.commandLD(label);
                        data.setAC(0, value);
                        break;
                    case "ADD":
                        value = data.commandADD(data.AC[0], data.memory[label]);
                        data.setAC(0, value);
                        break;
                    case "SUB":
                        value = data.commandSUB(data.AC[0], data.memory[label]);
                        data.setAC(0, value);
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

                console.log(exec);
                

            } else {
                console.log(command);
            }

            data.setZ();
            data.setN();

        } else {
            stop = true;
            console.log("ACABOU!!!!!!");
        }

        console.log("PC:"+ data.PC, "AC:"+data.AC[0], "Z:"+data.Z, "N:"+data.N, "Operando:"+command[1]);
        
        /*let resp = parseInt(prompt("Continuar? 1 Sim 0 Não"));

        if(!resp) {
            stop = true;
        }*/
    }
}