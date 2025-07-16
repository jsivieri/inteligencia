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
    box.style.padding = '32px 24px 24px 24px';
    box.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
    box.style.minWidth = '900px';
    box.style.maxWidth = '95vw';
    box.style.maxHeight = '90vh';
    box.style.overflow = 'auto';

    const titulo = document.createElement('h2');
    titulo.textContent = `Horário - tivemos ${choques} choques`;
    titulo.style.textAlign = 'center';
    titulo.style.marginBottom = '20px';
    box.appendChild(titulo);

    const containerPeriodos = document.createElement('div');
    containerPeriodos.style.display = 'grid';
    containerPeriodos.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    containerPeriodos.style.gap = '20px';
    containerPeriodos.style.marginBottom = '20px';

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
        tituloPeriodo.style.padding = '10px';
        tituloPeriodo.style.textAlign = 'center';
        tituloPeriodo.style.fontSize = '1.1em';
        divPeriodo.appendChild(tituloPeriodo);

        const tabela = document.createElement('table');
        tabela.style.width = '100%';
        tabela.style.borderCollapse = 'collapse';
        tabela.style.background = '#f8f9fa';

        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        const thVazio = document.createElement('th');
        thVazio.style.padding = '8px 12px';
        thVazio.style.background = '#34495e';
        thVazio.style.color = '#fff';
        thVazio.style.border = '1px solid #ddd';
        trHead.appendChild(thVazio);
        
        dias.forEach(dia => {
            const th = document.createElement('th');
            th.textContent = dia;
            th.style.padding = '8px 12px';
            th.style.background = '#34495e';
            th.style.color = '#fff';
            th.style.border = '1px solid #ddd';
            th.style.textAlign = 'center';
            th.style.fontSize = '0.9em';
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tabela.appendChild(thead);

        for (let h = 0; h < 4; h++) {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = `H${h + 1}`;
            th.style.background = '#eaeaea';
            th.style.padding = '8px 12px';
            th.style.border = '1px solid #ddd';
            th.style.fontSize = '0.9em';
            tr.appendChild(th);
            
            for (let d = 0; d < 5; d++) {
                const td = document.createElement('td');
                const idx = (periodo - 1) * 20 + d + h * 5;
                td.textContent = linha[idx] || '-';
                td.style.padding = '8px 6px';
                td.style.border = '1px solid #ddd';
                td.style.textAlign = 'center';
                td.style.fontSize = '0.8em';
                
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
    btnFechar.style.margin = '24px auto 0 auto';
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