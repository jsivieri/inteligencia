const professores = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const disciplinas = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
const professorDisciplinaMap = {};
const constantesGeradas = {};

// Organizar disciplinas por período
const disciplinasPorPeriodo = {
    1: ["01", "02", "03", "04", "05"],
    2: ["06", "07", "08", "09", "10"],
    3: ["11", "12", "13", "14", "15"],
    4: ["16", "17", "18", "19", "20"],
    5: ["21", "22", "23", "24", "25"]
};

// Mapeamento das disciplinas para seus nomes completos
const nomesDisciplinas = {
    "01": "EMPREENDEDORISMO",
    "02": "FUNDAMENTOS",
    "03": "LOGICA",
    "04": "PROJ. WEBSITE",
    "05": "SO",
    "06": "ALGORITMOS",
    "07": "FUNDAMENTOS BD",
    "08": "JS BASICO",
    "09": "POO",
    "10": "PROJ MVC E SQL",
    "11": "BD AVANCADO",
    "12": "POO 2",
    "13": "BACK END MONOLITICO",
    "14": "PROJETO FRONT",
    "15": "TESTES",
    "16": "BD NOSQL",
    "17": "IHC",
    "18": "DISP. MOVEIS",
    "19": "BACK END MICRO",
    "20": "SIST DISTRIBUIDOS",
    "21": "INT. COMPUTACIONAL",
    "22": "LIBRAS",
    "23": "MONOGRAFIA",
    "24": "SEGURANÇA",
    "25": "TOPICOS ESPECIAIS"
};

/**
 * FUNÇÃO: Sortear professores aleatoriamente de uma lista
 * PROPÓSITO: Implementa seleção aleatória para distribuição de professores nas disciplinas
 * ENTRADA: lista de professores e quantidade a sortear
 * SAÍDA: array com professores selecionados aleatoriamente
 */
function sortearProfessores(lista, quantidade) {
    const copia = [...lista];
    const selecionados = [];
    for (let i = 0; i < quantidade && copia.length > 0; i++) {
        const indice = Math.floor(Math.random() * copia.length);
        selecionados.push(copia.splice(indice, 1)[0]);
    }
    return selecionados;
}

/**
 * FUNÇÃO: Embaralhar array usando algoritmo Fisher-Yates
 * PROPÓSITO: Randomizar ordem das disciplinas para evitar padrões na associação professor-disciplina
 * ENTRADA: array a ser embaralhado
 * SAÍDA: novo array com elementos em ordem aleatória
 */
function embaralharArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Criar pool de professores disponíveis
let poolProfessores = [...professores];

// Primeiro semestre: 1º, 3º, 5º períodos
const periodosPrimeiroSemestre = [1, 3, 5];
for (const periodo of periodosPrimeiroSemestre) {
    const disciplinasDoPeriodo = disciplinasPorPeriodo[periodo];
    
    // Se não há professores suficientes no pool, reabastecê-lo
    if (poolProfessores.length < 5) {
        poolProfessores = [...professores];
    }
    
    // Sortear 5 professores para este período
    const professoresDoPeriodo = sortearProfessores(poolProfessores, 5);
    
    // Remover os professores sorteados do pool
    professoresDoPeriodo.forEach(prof => {
        const index = poolProfessores.indexOf(prof);
        if (index > -1) {
            poolProfessores.splice(index, 1);
        }
    });
    
    // Embaralhar as disciplinas do período
    const disciplinasEmbaralhadas = embaralharArray(disciplinasDoPeriodo);
    
    // Associar cada disciplina com um professor
    disciplinasEmbaralhadas.forEach((disciplina, index) => {
        const professor = professoresDoPeriodo[index];
        const constanteNome = `${professor.toLowerCase()}_${disciplina}`;
        const valorConcatenado = `${professor}-${disciplina}`;
        constantesGeradas[constanteNome] = valorConcatenado;
        professorDisciplinaMap[professor] = professorDisciplinaMap[professor] || [];
        professorDisciplinaMap[professor].push(disciplina);
    });
}

// Zerar pool e recomeçar para o segundo semestre: 2º, 4º períodos
poolProfessores = [...professores];
const periodosSegundoSemestre = [2, 4];
for (const periodo of periodosSegundoSemestre) {
    const disciplinasDoPeriodo = disciplinasPorPeriodo[periodo];
    
    // Se não há professores suficientes no pool, reabastecê-lo
    if (poolProfessores.length < 5) {
        poolProfessores = [...professores];
    }
    
    // Sortear 5 professores para este período
    const professoresDoPeriodo = sortearProfessores(poolProfessores, 5);
    
    // Remover os professores sorteados do pool
    professoresDoPeriodo.forEach(prof => {
        const index = poolProfessores.indexOf(prof);
        if (index > -1) {
            poolProfessores.splice(index, 1);
        }
    });
    
    // Embaralhar as disciplinas do período
    const disciplinasEmbaralhadas = embaralharArray(disciplinasDoPeriodo);
    
    // Associar cada disciplina com um professor
    disciplinasEmbaralhadas.forEach((disciplina, index) => {
        const professor = professoresDoPeriodo[index];
        const constanteNome = `${professor.toLowerCase()}_${disciplina}`;
        const valorConcatenado = `${professor}-${disciplina}`;
        constantesGeradas[constanteNome] = valorConcatenado;
        professorDisciplinaMap[professor] = professorDisciplinaMap[professor] || [];
        professorDisciplinaMap[professor].push(disciplina);
    });
}

/**
 * FUNÇÃO: Criar matriz da grade horária - NÚCLEO DO ALGORITMO GENÉTICO
 * PROPÓSITO: Gera população inicial de indivíduos (épocas/cromossomos) para o algoritmo genético
 * ENTRADA: número de épocas (indivíduos) a gerar
 * SAÍDA: matriz onde cada linha é um indivíduo com 100 genes (5 períodos × 20 horários)
 * LÓGICA: Cada gene contém uma combinação professor-disciplina respeitando período correto
 */
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

    // Separar as disciplinas por período
    const disciplinasPorPeriodoGeradas = {};
    for (let p = 1; p <= 5; p++) {
        disciplinasPorPeriodoGeradas[p] = [];
        disciplinasPorPeriodo[p].forEach(disciplina => {
            // Encontrar todas as combinações professor-disciplina deste período
            Object.values(constantesGeradas).forEach(combo => {
                if (combo.endsWith('-' + disciplina)) {
                    disciplinasPorPeriodoGeradas[p].push(combo);
                }
            });
        });
    }

    for (let i = 0; i < numLinhas; i++) {
        const linha = Array(numTotalHorarios).fill('');
        
        for (let j = 0; j < numTotalHorarios; j++) {
            // Determinar qual período esta posição pertence
            const periodo = Math.floor(j / horariosPorPeriodo) + 1;
            
            // Escolher uma disciplina aleatória do período correspondente
            const disciplinasDisponiveis = disciplinasPorPeriodoGeradas[periodo];
            if (disciplinasDisponiveis && disciplinasDisponiveis.length > 0) {
                const professorDisciplina = disciplinasDisponiveis[Math.floor(Math.random() * disciplinasDisponiveis.length)];
                linha[j] = professorDisciplina;
            }
        }
        gradeHoraria.push(linha);
    }
    return gradeHoraria;
}

/**
 * FUNÇÃO: Verificar choques de horário - AVALIAÇÃO DO FITNESS
 * PROPÓSITO: Calcula conflitos de mesmo professor em horários simultâneos por semestre
 * LÓGICA: 1 choque por slot temporal independente de repetições
 */
function verificarChoquesHorario(grade) {
    const numLinhas = grade.length;
    const numHorariosPorPeriodo = 20;
    const numPeriodos = 5;
    const choquesPorLinha = Array(numLinhas - 1).fill(0);
    const matrizChoques = [];
    const diasDaSemana = [0, 1, 2, 3, 4];
    const horariosDoDia = [0, 1, 2, 3];

    // Definir grupos de períodos por semestre
    const gruposSemestre = [
        [0, 2, 4], // 1º semestre: Períodos 1, 3, 5 (índices 0, 2, 4)
        [1, 3]     // 2º semestre: Períodos 2, 4 (índices 1, 3)
    ];

    for (let i = 1; i < numLinhas; i++) {
        const linhaChoques = Array(numHorariosPorPeriodo * numPeriodos).fill(false);
        
        // Para cada grupo de semestre, verificar choques apenas dentro do grupo
        for (const grupoSemestre of gruposSemestre) {
            // Para cada combinação de dia + horário
            for (const dia of diasDaSemana) {
                for (let horarioIndex = 0; horarioIndex < horariosDoDia.length; horarioIndex++) {
                    const professoresNoMesmoSlot = [];
                    const posicoesDoSlot = [];
                    let jaContouChoqueNesteSlot = false;
                    
                    // Verificar apenas os períodos deste semestre para este dia + horário específico
                    for (const periodo of grupoSemestre) {
                        const coluna = periodo * numHorariosPorPeriodo + dia + horarioIndex * 5;
                        if (coluna < numHorariosPorPeriodo * numPeriodos) {
                            const professorDisciplina = grade[i][coluna];
                            if (professorDisciplina) {
                                const professor = professorDisciplina.split('-')[0];
                                
                                // Verificar se este professor já apareceu neste mesmo dia + horário no semestre
                                if (professoresNoMesmoSlot.includes(professor)) {
                                    // Marcar como choque todas as posições deste professor no mesmo slot
                                    linhaChoques[coluna] = true;
                                    
                                    // Marcar também todas as posições anteriores deste professor no mesmo slot
                                    for (let j = 0; j < professoresNoMesmoSlot.length; j++) {
                                        if (professoresNoMesmoSlot[j] === professor) {
                                            linhaChoques[posicoesDoSlot[j]] = true;
                                        }
                                    }
                                    
                                    // Contar apenas 1 choque por slot (mesmo dia + horário), independente de quantas repetições
                                    if (!jaContouChoqueNesteSlot) {
                                        choquesPorLinha[i - 1]++;
                                        jaContouChoqueNesteSlot = true;
                                    }
                                } else {
                                    professoresNoMesmoSlot.push(professor);
                                    posicoesDoSlot.push(coluna);
                                }
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
                    celulaTabela.style.background = '#ffcccc';
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
            itemLista.textContent = `Época ${index + 1}: ${contagem} `;
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
        ["Seleção", "Época", "Choques", "Valores"],
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
    ['', 'Original', 'Mutação'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        cabecalho.appendChild(th);
    });
    tabela.appendChild(cabecalho);
    ['Primeira Época', 'Segunda Época'].forEach((label, i) => {
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
    window.ultimaOrdenacaoLinhas = linhasOrdenadas;
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
    tituloOrdenacao.textContent = 'Ordenação por Choques após Mutação (Crescente)';
    divOrdenacao.appendChild(tituloOrdenacao);
    
    const tabelaOrdenacao = document.createElement('table');
    tabelaOrdenacao.style.width = '100%';
    
    const cabecalhoOrdenacao = document.createElement('tr');
    ['Posição', 'Época', 'Choques', 'Valores'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        cabecalhoOrdenacao.appendChild(th);
    });
    tabelaOrdenacao.appendChild(cabecalhoOrdenacao);
    
    linhasOrdenadas.forEach((linha, index) => {
        const tr = document.createElement('tr');
        [`${index + 1}º`, linha.linhaIndex, linha.choques, linha.valores.substring(0, 80) + '...'].forEach((texto, i) => {
            const td = document.createElement('td');
            if (i === 3) td.setAttribute('data-valores', linha.valores);
            td.textContent = texto;
            tr.appendChild(td);
        });
        tabelaOrdenacao.appendChild(tr);
    });
    
    divOrdenacao.appendChild(tabelaOrdenacao);
    container.appendChild(divOrdenacao);
}

function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

function ensureSectionIds() {
    const grade = document.getElementById('grade-container');
    if (grade && !grade.id.includes('section')) grade.setAttribute('data-section', 'grade');
    grade.parentElement.id = 'section-grade';
    
    const choques = document.getElementById('choques-container');
    if (choques && !choques.id.includes('section')) choques.setAttribute('data-section', 'choques');
    choques.parentElement.id = 'section-choques';

    let ordenacao = document.getElementById('section-ordenacao');
    if (!ordenacao) {
        ordenacao = document.createElement('div');
        ordenacao.id = 'section-ordenacao';
        ordenacao.style.minHeight = '40px';
        document.querySelector('.container').appendChild(ordenacao);
    }
    let selecao = document.getElementById('section-selecao');
    if (!selecao) {
        selecao = document.createElement('div');
        selecao.id = 'section-selecao';
        selecao.style.minHeight = '40px';
        document.querySelector('.container').appendChild(selecao);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ensureSectionIds();
    document.querySelector('.btn-grade').onclick = () => scrollToSection('#grade-container');
    document.querySelector('.btn-choques').onclick = () => scrollToSection('#choques-container');
    document.querySelector('.btn-ordenacao').onclick = () => scrollToSection('#section-ordenacao');
    document.querySelector('.btn-selecao').onclick = () => scrollToSection('#section-selecao');
});

// Botão especial fixo no canto superior direito
const btnEspecial = document.createElement('button');
btnEspecial.id = 'btn-especial-fixo';
btnEspecial.title = 'Botão Especial';
btnEspecial.innerHTML = 'GERAR GRADE HORÁRIA';
document.body.appendChild(btnEspecial);

function garantirTitulosDinamicos() {
    let ordenacaoDiv = document.getElementById('section-ordenacao');
    if (ordenacaoDiv && !ordenacaoDiv.querySelector('h2')) {
        let h2Ordenacao = document.createElement('h2');
        h2Ordenacao.textContent = 'ORDENAÇÃO POR CHOQUES APOS MUTAÇÃO';
        h2Ordenacao.id = 'titulo-ordenacao';
        ordenacaoDiv.prepend(h2Ordenacao);
    }
    let selecaoDiv = document.getElementById('section-selecao');
    if (selecaoDiv && !selecaoDiv.querySelector('h2')) {
        let h2Selecao = document.createElement('h2');
        h2Selecao.textContent = 'SELEÇÃO ALEATÓRIA E MUTAÇÃO';
        h2Selecao.id = 'titulo-selecao';
        selecaoDiv.prepend(h2Selecao);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('grade-container').style.display = 'none';
    document.getElementById('choques-container').style.display = 'none';
    let ordenacaoDiv = document.getElementById('section-ordenacao');
    if (!ordenacaoDiv) {
        ordenacaoDiv = document.createElement('div');
        ordenacaoDiv.id = 'section-ordenacao';
        ordenacaoDiv.style.minHeight = '40px';
        document.querySelector('.container').appendChild(ordenacaoDiv);
    }
    let selecaoDiv = document.getElementById('section-selecao');
    if (!selecaoDiv) {
        selecaoDiv = document.createElement('div');
        selecaoDiv.id = 'section-selecao';
        selecaoDiv.style.minHeight = '40px';
        document.querySelector('.container').appendChild(selecaoDiv);
    }
    ordenacaoDiv.innerHTML = '';
    selecaoDiv.innerHTML = '';

    const selecaoContainer = document.createElement('div');
    selecaoContainer.id = 'selecao-container';
    selecaoContainer.style.display = 'none';
    document.querySelector('.container').appendChild(selecaoContainer);
    const numLinhas = parseInt(prompt("Informe quantas épocas a grade horária terá:"));
    
    if (!isNaN(numLinhas) && numLinhas > 0) {
        document.getElementById('grade-container').style.display = 'block';
        document.getElementById('choques-container').style.display = 'block';
        selecaoContainer.style.display = 'block';
        const minhaGrade = criarMatrizGradeHoraria(numLinhas);
        const { gradeOrdenada, choquesPorLinhaOrdenados, matrizChoquesOrdenada } = ordenarLinhasPorChoques(minhaGrade);
        exibirGradeNoHTML(gradeOrdenada, 'grade-container', matrizChoquesOrdenada);
        exibirContagemChoques(choquesPorLinhaOrdenados, 'choques-container');
        const linhasMutadas = [];
        if (selecaoDiv) {
            selecaoDiv.innerHTML = '';
            const numPares = Math.floor(numLinhas / 2);
            const tituloSelecao = document.createElement('h2');
            tituloSelecao.textContent = `SELEÇÃO ALEATÓRIA DE ${numPares} PARES (${numLinhas} ÉPOCAS)`;
            tituloSelecao.id = 'titulo-selecao';
            selecaoDiv.appendChild(tituloSelecao);
            
            for (let i = 0; i < numPares; i++) {
                const linhasSelecionadas = selecionarLinhasAleatorias(minhaGrade, ordenarLinhasPorChoques(minhaGrade).choquesPorLinhaOrdenados);
                const matrizSelecao = criarMatrizSelecao(linhasSelecionadas);
                const subtitulo = document.createElement('h3');
                subtitulo.textContent = `Par ${i + 1}`;
                selecaoDiv.appendChild(subtitulo);
                const divPar = document.createElement('div');
                divPar.className = 'par-selecionado';
                selecaoDiv.appendChild(divPar);
                exibirSelecaoNoHTML(matrizSelecao, divPar.id = `par-${i}`);
                const { primeiraLinha, segundaLinha } = linhasSelecionadas;
                const { novaLinha1, novaLinha2, intervalosTrocados } = criarNovasLinhasComTrocas(primeiraLinha, segundaLinha);
                const gradeTemp = [minhaGrade[0], novaLinha1, novaLinha2];
                const { choquesPorLinha } = verificarChoquesHorario(gradeTemp);
                const parModificado = {
                    primeiraLinha: novaLinha1,
                    segundaLinha: novaLinha2,
                    choquesPrimeira: choquesPorLinha[0],
                    choquesSegunda: choquesPorLinha[1]
                };
                exibirResultadoTrocas(linhasSelecionadas, parModificado, intervalosTrocados, divPar);
                
                const gradeTemp1 = [minhaGrade[0], novaLinha1];
                const { matrizChoques: choques1 } = verificarChoquesHorario(gradeTemp1);
                const gradeTemp2 = [minhaGrade[0], novaLinha2];
                const { matrizChoques: choques2 } = verificarChoquesHorario(gradeTemp2);
                
                linhasMutadas.push({
                    linha: novaLinha1,
                    linhaIndex: `Par ${i + 1} - Época 1`,
                    choques: choquesPorLinha[0],
                    choquesDetalhados: choques1[0] || []
                });
                linhasMutadas.push({
                    linha: novaLinha2,
                    linhaIndex: `Par ${i + 1} - Época 2`,
                    choques: choquesPorLinha[1],
                    choquesDetalhados: choques2[0] || []
                });
            }
        }
        
        if (ordenacaoDiv) {
            ordenacaoDiv.innerHTML = '';
            linhasMutadas.sort((a, b) => a.choques - b.choques);
            const linhasOrdenadas = linhasMutadas.map(item => ({
                linha: item.linha,
                linhaIndex: item.linhaIndex,
                choques: item.choques,
                valores: item.linha.join(', '),
                choquesDetalhados: item.choquesDetalhados
            }));
            exibirOrdenacaoFinal(linhasOrdenadas, 'section-ordenacao');
        }
    } else {
        alert('Por favor, insira um número válido de épocas.');
        location.reload();
    }
});

// Evento do botão especial
btnEspecial.onclick = function() {
    let primeiraLinha = null;
    let choquesArray = [];
    let choques = 0;
    
    if (window.ultimaOrdenacaoLinhas && window.ultimaOrdenacaoLinhas[0]) {
        primeiraLinha = window.ultimaOrdenacaoLinhas[0].linha;
        choquesArray = window.ultimaOrdenacaoLinhas[0].choquesDetalhados || [];
        choques = window.ultimaOrdenacaoLinhas[0].choques || 0;
        
        if (!choquesArray || choquesArray.length === 0) {
            const gradeTemp = [Array.from({length: 100}, (_, i) => `P${Math.floor(i/20)+1}-H${(i%20)+1}`), primeiraLinha];
            const { matrizChoques } = verificarChoquesHorario(gradeTemp);
            choquesArray = matrizChoques[0] || [];
        }
    } else {
        const ordenacaoDiv = document.getElementById('section-ordenacao');
        if (ordenacaoDiv) {
            const tabelas = ordenacaoDiv.getElementsByTagName('table');
            if (tabelas.length > 0) {
                const tr = tabelas[0].querySelectorAll('tr')[1];
                if (tr) {
                    const tds = tr.querySelectorAll('td');
                    if (tds.length > 3) {
                        let valores = tds[3].getAttribute('data-valores') || tds[3].textContent;
                        valores = valores.replace('...', '').split(',');
                        primeiraLinha = valores.map(v => v.trim());
                        choques = parseInt(tds[2].textContent) || 0;
                        
                        const gradeTemp = [Array.from({length: 100}, (_, i) => `P${Math.floor(i/20)+1}-H${(i%20)+1}`), primeiraLinha];
                        const { matrizChoques } = verificarChoquesHorario(gradeTemp);
                        choquesArray = matrizChoques[0] || [];
                    }
                }
            }
        }
    }
    
    if (primeiraLinha && primeiraLinha.length >= 20) {
        exibirHorarioPrimeiroOrdenado(primeiraLinha, choquesArray, choques);
    } else {
        alert('Não foi possível encontrar a primeira colocação da ordenação. Gere a grade primeiro!');
    }
};

/**
 * FUNÇÃO: Exibir horário da primeira colocação - APRESENTAÇÃO DO RESULTADO
 * PROPÓSITO: Mostra grade final formatada com professores e disciplinas por período
 * LAYOUT: 2 períodos por linha, cores diferenciadas, nomes completos das disciplinas
 */
function exibirHorarioPrimeiroOrdenado(linha, choquesArray, choques) {
    const antigo = document.getElementById('modal-horario-especial');
    if (antigo) antigo.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-horario-especial';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 3000;

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.borderRadius = '16px';
    box.style.padding = '8px 12px 8px 12px';
    box.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
    box.style.minWidth = '1400px';
    box.style.maxWidth = '98vw';
    box.style.maxHeight = '95vh';
    box.style.overflow = 'auto';

    const titulo = document.createElement('h2');
    titulo.textContent = `Horário - Tivemos ${choques} ${choques === 1 ? 'choque' : 'choques'}`;
    titulo.style.textAlign = 'center';
    titulo.style.marginBottom = '8px';
    titulo.style.fontSize = '1.4em';
    titulo.style.color = '#2c3e50';
    titulo.style.marginTop = '0px';
    box.appendChild(titulo);

    const containerPeriodos = document.createElement('div');
    containerPeriodos.style.display = 'grid';
    containerPeriodos.style.gridTemplateColumns = 'repeat(2, 1fr)';
    containerPeriodos.style.gap = '8px';
    containerPeriodos.style.marginBottom = '8px';

    const coresPeriodos = ['#ff9ff3', '#feca57', '#1dd1a1', '#54a0ff', '#5f27cd'];
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    for (let periodo = 1; periodo <= 5; periodo++) {
        const divPeriodo = document.createElement('div');
        divPeriodo.style.border = '2px solid ' + coresPeriodos[periodo - 1];
        divPeriodo.style.borderRadius = '8px';
        divPeriodo.style.overflow = 'hidden';

        const tituloPeriodo = document.createElement('h3');
        tituloPeriodo.textContent = `Período ${periodo}`;
        tituloPeriodo.style.background = coresPeriodos[periodo - 1];
        tituloPeriodo.style.color = periodo === 5 ? '#fff' : '#2c3e50';
        tituloPeriodo.style.margin = '0';
        tituloPeriodo.style.padding = '4px';
        tituloPeriodo.style.textAlign = 'center';
        tituloPeriodo.style.fontSize = '1em';
        divPeriodo.appendChild(tituloPeriodo);

        const tabela = document.createElement('table');
        tabela.style.width = '100%';
        tabela.style.borderCollapse = 'collapse';
        tabela.style.background = '#f8f9fa';
        tabela.style.tableLayout = 'fixed';
        
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const thVazio = document.createElement('th');
        thVazio.style.padding = '4px 2px';
        thVazio.style.background = '#34495e';
        thVazio.style.color = '#fff';
        thVazio.style.border = '1px solid #ddd';
        thVazio.style.width = '50px';
        thVazio.style.fontSize = '0.8em';
        trHead.appendChild(thVazio);
        
        dias.forEach(dia => {
            const th = document.createElement('th');
            th.textContent = dia;
            th.style.padding = '4px 2px';
            th.style.background = '#34495e';
            th.style.color = '#fff';
            th.style.border = '1px solid #ddd';
            th.style.textAlign = 'center';
            th.style.fontSize = '0.8em';
            th.style.width = '120px';
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tabela.appendChild(thead);

        for (let h = 0; h < 4; h++) {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = `H${h + 1}`;
            th.style.background = '#eaeaea';
            th.style.padding = '2px';
            th.style.border = '1px solid #ddd';
            th.style.fontSize = '0.8em';
            th.style.textAlign = 'center';
            th.style.verticalAlign = 'middle';
            th.style.height = '28px';
            tr.appendChild(th);
            
            for (let d = 0; d < 5; d++) {
                const td = document.createElement('td');
                // Corrigir o cálculo do índice: período base + dia + (horário * 5 dias)
                const idx = (periodo - 1) * 20 + d + h * 5;
                let conteudoCelula = linha[idx] || '-';
                
                // Criar estrutura com professor em cima e disciplina embaixo
                if (conteudoCelula !== '-' && conteudoCelula.includes('-')) {
                    const [professor, disciplina] = conteudoCelula.split('-');
                    const nomeDisciplina = nomesDisciplinas[disciplina] || disciplina;
                    
                    // Criar div container para professor e disciplina
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.flexDirection = 'column';
                    container.style.alignItems = 'center';
                    container.style.justifyContent = 'center';
                    container.style.height = '100%';
                    container.style.lineHeight = '1';
                    container.style.padding = '0px';
                    
                    // Professor em cima
                    const divProfessor = document.createElement('div');
                    divProfessor.textContent = professor;
                    divProfessor.style.fontWeight = 'bold';
                    divProfessor.style.fontSize = '1em';
                    divProfessor.style.color = '#2c3e50';
                    divProfessor.style.marginBottom = '0px';
                    
                    // Disciplina embaixo
                    const divDisciplina = document.createElement('div');
                    divDisciplina.textContent = nomeDisciplina;
                    divDisciplina.style.fontSize = '0.65em';
                    divDisciplina.style.color = '#34495e';
                    divDisciplina.style.wordWrap = 'break-word';
                    divDisciplina.style.hyphens = 'auto';
                    divDisciplina.style.textAlign = 'center';
                    divDisciplina.style.maxWidth = '100%';
                    divDisciplina.style.lineHeight = '1';
                    
                    container.appendChild(divProfessor);
                    container.appendChild(divDisciplina);
                    td.appendChild(container);
                } else {
                    td.textContent = conteudoCelula;
                    td.style.textAlign = 'center';
                    td.style.verticalAlign = 'middle';
                    td.style.fontSize = '0.7em';
                }
                
                td.style.padding = '0px 1px';
                td.style.border = '1px solid #ddd';
                td.style.textAlign = 'center';
                td.style.verticalAlign = 'middle';
                td.style.minWidth = '110px';
                td.style.maxWidth = '120px';
                td.style.height = '28px';
                td.style.overflow = 'hidden';
                
                if (choquesArray && choquesArray[idx]) {
                    td.style.background = '#ffcccc';
                    td.style.fontWeight = 'bold';
                } else {
                    td.style.background = '#fff';
                }
                tr.appendChild(td);
            }
            tabela.appendChild(tr);
        }
        
        divPeriodo.appendChild(tabela);
        containerPeriodos.appendChild(divPeriodo);
    }
    
    box.appendChild(containerPeriodos);

    const btnFechar = document.createElement('button');
    btnFechar.textContent = 'Fechar';
    btnFechar.style.margin = '12px auto 0 auto';
    btnFechar.style.display = 'block';
    btnFechar.style.background = '#ff6b6b';
    btnFechar.style.color = '#fff';
    btnFechar.style.border = 'none';
    btnFechar.style.borderRadius = '24px';
    btnFechar.style.padding = '10px 32px';
    btnFechar.style.fontSize = '1.1em';
    btnFechar.style.cursor = 'pointer';
    btnFechar.onclick = () => overlay.remove();
    box.appendChild(btnFechar);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}