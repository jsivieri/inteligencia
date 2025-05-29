const professores = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const disciplinas = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
const professorDisciplinaMap = {};
const constantesGeradas = {};

function sortearProfessor() {
    const indice = Math.floor(Math.random() * professores.length);
    return professores[indice];
}

function sortearDisciplina() {
    const indice = Math.floor(Math.random() * disciplinas.length);
    return disciplinas[indice];
}

for (const disciplina of disciplinas) {
    const professor = sortearProfessor();
    const constanteNome = `${professor.toLowerCase()}_${disciplina}`;
    const valorConcatenado = `${professor}-${disciplina}`;
    constantesGeradas[constanteNome] = valorConcatenado;

    professorDisciplinaMap[professor] = professorDisciplinaMap[professor] || [];
    professorDisciplinaMap[professor].push(disciplina);
}

function criarMatrizGradeHoraria(numLinhas) {
    const numPeriodos = 5;
    const horariosPorPeriodo = 20;
    const numTotalHorarios = numPeriodos * horariosPorPeriodo;
    const gradeHoraria = [];

        const linhaHorarios = Array.from({ length: numTotalHorarios }, (_, indice) => {
        const periodo = Math.floor(indice / horariosPorPeriodo) + 1;
        const horarioNoPeriodo = (indice % horariosPorPeriodo) + 1;
        return `P${periodo}-H${horarioNoPeriodo.toString().padStart(2, '0')}`;
    });
    gradeHoraria.push(linhaHorarios);

    
    for (let i = 0; i < numLinhas; i++) {
        const linha = Array(numTotalHorarios).fill('');
        for (let j = 0; j < numTotalHorarios; j++) {
            const professorDisciplina = Object.values(constantesGeradas)[Math.floor(Math.random() * Object.values(constantesGeradas).length)];
            linha[j] = professorDisciplina;
        }
        gradeHoraria.push(linha);
    }

    return gradeHoraria;
}
    function verificarChoquesHorario(grade) {
        const numLinhas = grade.length;
        const numHorariosPorPeriodo = 20;
        const numPeriodos = 5;
        const choquesPorLinha = Array(numLinhas - 1).fill(0);
        const matrizChoques = [];
        const diasDaSemana = [0, 1, 2, 3, 4]; 
        const horariosDoDia = [0, 1, 2, 3];   
    
        for (let i = 1; i < numLinhas; i++) { 
            const linhaChoques = Array(numHorariosPorPeriodo * numPeriodos).fill(false);
            const professoresAlocadosPorDia = {}; 
    
            for (const dia of diasDaSemana) {
                professoresAlocadosPorDia[dia] = {};
                for (let periodo = 0; periodo < numPeriodos; periodo++) {
                    for (let horarioIndex = 0; horarioIndex < horariosDoDia.length; horarioIndex++) {
                        
                        const coluna = periodo * numHorariosPorPeriodo + dia + horarioIndex * 5;
    
                        if (coluna < numHorariosPorPeriodo * numPeriodos) {
                            const professorDisciplina = grade[i][coluna];
                            if (professorDisciplina) {
                                const professor = professorDisciplina.split('-')[0];
                                const horarioDoDia = horariosDoDia[horarioIndex];
    
                                if (professoresAlocadosPorDia[dia][horarioDoDia]) {
                                    if (professoresAlocadosPorDia[dia][horarioDoDia] === professor) {
                                        linhaChoques[coluna] = true;
                                        choquesPorLinha[i - 1]++;
                                    }
                                } else {
                                    professoresAlocadosPorDia[dia][horarioDoDia] = professor;
                                }
                            }
                        }
                    }
                }
            }
            matrizChoques.push(linhaChoques);
        }
        return { choquesPorLinha, matrizChoques };
    }


function exibirGradeNoHTML(grade, containerId, matrizChoques) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
        const tabela = document.createElement('table');
        grade.forEach((linha, rowIndex) => {
            const linhaTabela = document.createElement('tr');
            if (rowIndex > 0) {
                linhaTabela.classList.add('data-row');
                linhaTabela.addEventListener('mouseover', () => {
                    linhaTabela.classList.add('highlight-row');
                });
                linhaTabela.addEventListener('mouseout', () => {
                    linhaTabela.classList.remove('highlight-row');
                });
            }
            
            linha.forEach((celula, cellIndex) => {
                const celulaTabela = document.createElement(rowIndex === 0 ? 'th' : 'td');
                celulaTabela.textContent = celula;

                if (rowIndex === 0) {
                    const periodo = Math.floor(cellIndex / 20) + 1;
                    celulaTabela.classList.add(`periodo-${periodo}`);
                } else if (matrizChoques && matrizChoques[rowIndex - 1] && matrizChoques[rowIndex - 1][cellIndex]) {
                    celulaTabela.classList.add('choque');
                }

                linhaTabela.appendChild(celulaTabela);
            });
            tabela.appendChild(linhaTabela);
        });
        container.appendChild(tabela);
    } else {
        console.error(`Elemento com ID "${containerId}" não encontrado no HTML.`);
    }
}

function exibirContagemChoques(contagemChoques, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const listaChoques = document.createElement('ul');
        contagemChoques.forEach((contagem, index) => {
            const itemLista = document.createElement('li');
            itemLista.textContent = `Linha ${index + 1}: ${contagem} `;
            listaChoques.appendChild(itemLista);
        });
        container.appendChild(listaChoques);
    } else {
        console.error(`Elemento com ID "${containerId}" não encontrado no HTML.`);
    }
}

function ordenarLinhasPorChoques(grade) {
    
    const { choquesPorLinha, matrizChoques } = verificarChoquesHorario(grade);
    
    
    const cabecalho = grade[0];
    const linhasDados = grade.slice(1);
    
    
    const linhasComChoques = linhasDados.map((linha, index) => ({
        linha,
        choques: choquesPorLinha[index],
        choquesDetalhados: matrizChoques[index]
    }));
    
    
    linhasComChoques.sort((a, b) => a.choques - b.choques);
    
    
    const gradeOrdenada = [cabecalho, ...linhasComChoques.map(item => item.linha)];
    
    
    const matrizChoquesOrdenada = linhasComChoques.map(item => item.choquesDetalhados);
    
    return {
        gradeOrdenada,
        choquesPorLinhaOrdenados: linhasComChoques.map(item => item.choques),
        matrizChoquesOrdenada
    };
}


function selecionarLinhasAleatorias(gradeOrdenada, choquesPorLinhaOrdenados) {
    const numLinhas = gradeOrdenada.length - 1; 
    const primeiraMetade = Math.floor(numLinhas * 0.5);
    
    
    const primeiraLinhaIndex = Math.floor(Math.random() * primeiraMetade) + 1;
    
    
    const segundaLinhaIndex = Math.floor(Math.random() * numLinhas) + 1;
    
    return {
        primeiraLinha: gradeOrdenada[primeiraLinhaIndex],
        primeiraLinhaIndex,
        segundaLinha: gradeOrdenada[segundaLinhaIndex],
        segundaLinhaIndex,
        choquesPrimeira: choquesPorLinhaOrdenados[primeiraLinhaIndex - 1],
        choquesSegunda: choquesPorLinhaOrdenados[segundaLinhaIndex - 1]
    };
}

function criarMatrizSelecao(linhasSelecionadas) {
    return [
        ["Seleção", "Linha", "Choques", "Valores"],
        ["Primeira", linhasSelecionadas.primeiraLinhaIndex, linhasSelecionadas.choquesPrimeira, linhasSelecionadas.primeiraLinha.join(", ")],
        ["Segunda", linhasSelecionadas.segundaLinhaIndex, linhasSelecionadas.choquesSegunda, linhasSelecionadas.segundaLinha.join(", ")]
    ];
}

function exibirSelecaoNoHTML(matrizSelecao, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '<h2>Seleção Aleatória</h2>';
    const tabela = document.createElement('table');
    
    matrizSelecao.forEach((linha, rowIndex) => {
        const tr = document.createElement('tr');
        linha.forEach((celula, cellIndex) => {
            const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
            td.textContent = cellIndex === 3 && rowIndex > 0 ? celula.substring(0, 50) + "..." : celula;
            if (rowIndex === 0) td.style.backgroundColor = "#f2f2f2";
            tr.appendChild(td);
        });
        tabela.appendChild(tr);
    });
    
    container.appendChild(tabela);
}

function criarContainerSelecao() {
    const container = document.createElement('div');
    container.id = 'selecao-container';
    container.style.marginTop = '30px';
    container.style.borderTop = '2px solid #ccc';
    container.style.paddingTop = '20px';
    document.body.appendChild(container);
    return container;
}


const numLinhas = parseInt(prompt("Informe quantas linhas a grade horária terá:"));




if (!isNaN(numLinhas) && numLinhas > 0) {
    
    const minhaGrade = criarMatrizGradeHoraria(numLinhas);
    const { gradeOrdenada, choquesPorLinhaOrdenados, matrizChoquesOrdenada } = ordenarLinhasPorChoques(minhaGrade);
    
    exibirGradeNoHTML(gradeOrdenada, 'grade-container', matrizChoquesOrdenada);
    exibirContagemChoques(choquesPorLinhaOrdenados, 'choques-container');
    
    
    criarContainerSelecao();
    
    
    const linhasSelecionadas = selecionarLinhasAleatorias(gradeOrdenada, choquesPorLinhaOrdenados);
    const matrizSelecao = criarMatrizSelecao(linhasSelecionadas);
    exibirSelecaoNoHTML(matrizSelecao, 'selecao-container');
}