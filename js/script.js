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
    container.innerHTML = '';
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

function dividirEmIntervalos(linha) {
    const tamanhoIntervalo = Math.floor(linha.length / 4);
    return [
        linha.slice(0, tamanhoIntervalo),
        linha.slice(tamanhoIntervalo, tamanhoIntervalo * 2),
        linha.slice(tamanhoIntervalo * 2, tamanhoIntervalo * 3),
        linha.slice(tamanhoIntervalo * 3)
    ];
}

function trocarIntervalos(linha1, linha2, intervalosParaTrocar) {
    const intervalos1 = dividirEmIntervalos(linha1);
    const intervalos2 = dividirEmIntervalos(linha2);
    const novaLinha1 = [];
    const novaLinha2 = [];
    for (let i = 0; i < 4; i++) {
        if (intervalosParaTrocar.includes(i)) {
            novaLinha1.push(...intervalos2[i]);
            novaLinha2.push(...intervalos1[i]);
        } else {
            novaLinha1.push(...intervalos1[i]);
            novaLinha2.push(...intervalos2[i]);
        }
    }
    return { novaLinha1, novaLinha2 };
}

function criarNovasLinhasComTrocas(primeiraLinha, segundaLinha) {
    const numIntervalosParaTrocar = Math.floor(Math.random() * 3) + 1;
    const intervalosParaTrocar = [];
    while (intervalosParaTrocar.length < numIntervalosParaTrocar) {
        const intervalo = Math.floor(Math.random() * 4);
        if (!intervalosParaTrocar.includes(intervalo)) {
            intervalosParaTrocar.push(intervalo);
        }
    }
    const { novaLinha1, novaLinha2 } = trocarIntervalos(primeiraLinha, segundaLinha, intervalosParaTrocar);
    return {
        novaLinha1,
        novaLinha2,
        intervalosTrocados: intervalosParaTrocar.map(i => `${i+1}º`).join(', ')
    };
}

function exibirResultadoTrocas(parOriginal, parModificado, intervalosTrocados, container) {
    const divResultado = document.createElement('div');
    divResultado.className = 'resultado-trocas';
    const titulo = document.createElement('h4');
    titulo.textContent = `Trocas realizadas nos intervalos: ${intervalosTrocados}`;
    divResultado.appendChild(titulo);
    const tabela = document.createElement('table');
    const cabecalho = document.createElement('tr');
    ['', 'Original', 'Modificado'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        cabecalho.appendChild(th);
    });
    tabela.appendChild(cabecalho);
    ['Primeira Linha', 'Segunda Linha'].forEach((label, i) => {
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.textContent = label;
        tr.appendChild(tdLabel);
        const tdOriginal = document.createElement('td');
        tdOriginal.textContent = i === 0 ? `Choques: ${parOriginal.choquesPrimeira}` : `Choques: ${parOriginal.choquesSegunda}`;
        tr.appendChild(tdOriginal);
        const tdModificado = document.createElement('td');
        tdModificado.textContent = i === 0 ? `Choques: ${parModificado.choquesPrimeira}` : `Choques: ${parModificado.choquesSegunda}`;
        tr.appendChild(tdModificado);
        tabela.appendChild(tr);
    });
    divResultado.appendChild(tabela);
    container.appendChild(divResultado);
}

function exibirOrdenacaoFinal(linhasOrdenadas, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const divOrdenacao = document.createElement('div');
    divOrdenacao.className = 'resultado-ordenacao';
    divOrdenacao.style.marginTop = '30px';
    divOrdenacao.style.padding = '15px';
    divOrdenacao.style.backgroundColor = '#f0f8ff';
    divOrdenacao.style.borderRadius = '5px';
    divOrdenacao.style.border = '1px solid #d0e0f0';
    
    const tituloOrdenacao = document.createElement('h2');
    tituloOrdenacao.textContent = 'Linhas Ordenadas por Choques (Crescente)';
    divOrdenacao.appendChild(tituloOrdenacao);
    
    const tabelaOrdenacao = document.createElement('table');
    tabelaOrdenacao.style.width = '100%';
    
    const cabecalhoOrdenacao = document.createElement('tr');
    ['Posição', 'Linha', 'Choques', 'Valores'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        cabecalhoOrdenacao.appendChild(th);
    });
    tabelaOrdenacao.appendChild(cabecalhoOrdenacao);
    
    linhasOrdenadas.forEach((linha, index) => {
        const tr = document.createElement('tr');
        [`${index + 1}º`, linha.linhaIndex, linha.choques, linha.valores.substring(0, 80) + '...'].forEach(texto => {
            const td = document.createElement('td');
            td.textContent = texto;
            tr.appendChild(td);
        });
        tabelaOrdenacao.appendChild(tr);
    });
    
    divOrdenacao.appendChild(tabelaOrdenacao);
    container.appendChild(divOrdenacao);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('grade-container').style.display = 'none';
    document.getElementById('choques-container').style.display = 'none';
    const selecaoContainer = document.createElement('div');
    selecaoContainer.id = 'selecao-container';
    selecaoContainer.style.display = 'none';
    document.querySelector('.container').appendChild(selecaoContainer);
    const numLinhas = parseInt(prompt("Informe quantas linhas a grade horária terá:"));
    
    if (!isNaN(numLinhas) && numLinhas > 0) {
        document.getElementById('grade-container').style.display = 'block';
        document.getElementById('choques-container').style.display = 'block';
        selecaoContainer.style.display = 'block';
        const minhaGrade = criarMatrizGradeHoraria(numLinhas);
        const { gradeOrdenada, choquesPorLinhaOrdenados, matrizChoquesOrdenada } = ordenarLinhasPorChoques(minhaGrade);
        exibirGradeNoHTML(gradeOrdenada, 'grade-container', matrizChoquesOrdenada);
        exibirContagemChoques(choquesPorLinhaOrdenados, 'choques-container');
        const numPares = Math.floor(numLinhas / 2);
        const tituloSelecao = document.createElement('h2');
        tituloSelecao.textContent = `Seleção Aleatória de ${numPares} Pares de Linhas`;
        selecaoContainer.appendChild(tituloSelecao);
        
        const todasLinhasModificadas = [];
        
        for (let i = 0; i < numPares; i++) {
            const linhasSelecionadas = selecionarLinhasAleatorias(gradeOrdenada, choquesPorLinhaOrdenados);
            const matrizSelecao = criarMatrizSelecao(linhasSelecionadas);
            const subtitulo = document.createElement('h3');
            subtitulo.textContent = `Par ${i + 1}`;
            selecaoContainer.appendChild(subtitulo);
            const divPar = document.createElement('div');
            divPar.className = 'par-selecionado';
            selecaoContainer.appendChild(divPar);
            exibirSelecaoNoHTML(matrizSelecao, divPar.id = `par-${i}`);
            const { primeiraLinha, segundaLinha } = linhasSelecionadas;
            const { novaLinha1, novaLinha2, intervalosTrocados } = criarNovasLinhasComTrocas(primeiraLinha, segundaLinha);
            const gradeTemp = [gradeOrdenada[0], novaLinha1, novaLinha2];
            const { choquesPorLinha } = verificarChoquesHorario(gradeTemp);
            const parModificado = {
                primeiraLinha: novaLinha1,
                segundaLinha: novaLinha2,
                choquesPrimeira: choquesPorLinha[0],
                choquesSegunda: choquesPorLinha[1]
            };
            exibirResultadoTrocas(linhasSelecionadas, parModificado, intervalosTrocados, divPar);
            
            todasLinhasModificadas.push(
                { linha: novaLinha1, choques: choquesPorLinha[0], linhaIndex: `Par ${i+1} - Linha 1`, valores: novaLinha1.join(', ') },
                { linha: novaLinha2, choques: choquesPorLinha[1], linhaIndex: `Par ${i+1} - Linha 2`, valores: novaLinha2.join(', ') }
            );
        }
        
        todasLinhasModificadas.sort((a, b) => a.choques - b.choques);
        exibirOrdenacaoFinal(todasLinhasModificadas, 'selecao-container');
        
    } else {
        alert('Por favor, insira um número válido de linhas.');
        location.reload();
    }
});