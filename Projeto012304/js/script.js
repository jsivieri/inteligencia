const professores = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ"];
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

    // Criar a primeira linha (cabeçalho ou representação dos horários)
    const linhaHorarios = Array.from({ length: numTotalHorarios }, (_, indice) => {
        const periodo = Math.floor(indice / horariosPorPeriodo) + 1;
        const horarioNoPeriodo = (indice % horariosPorPeriodo) + 1;
        return `P${periodo}-H${horarioNoPeriodo.toString().padStart(2, '0')}`;
    });
    gradeHoraria.push(linhaHorarios);

    // Criar as demais linhas e preencher aleatoriamente
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

function exibirGradeNoHTML(grade, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const tabela = document.createElement('table');
        grade.forEach((linha, rowIndex) => {
            const linhaTabela = document.createElement('tr');
            linha.forEach((celula, cellIndex) => {
                const celulaTabela = document.createElement(rowIndex === 0 ? 'th' : 'td');
                celulaTabela.textContent = celula;

                if (rowIndex === 0) {
                    const periodo = Math.floor(cellIndex / 20) + 1;
                    celulaTabela.classList.add(`periodo-${periodo}`);
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

const numLinhas = parseInt(prompt("Informe quantas linhas a grade horária terá:"));

if (!isNaN(numLinhas) && numLinhas > 0) {
    const minhaGrade = criarMatrizGradeHoraria(numLinhas);
    exibirGradeNoHTML(minhaGrade, 'grade-container');
} else {
    alert("Entrada inválida para o número de linhas.");
}