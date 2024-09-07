class RecintosZoo {
    
    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'], tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: ['floresta'], tamanho: 5, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: ['rio'], tamanho: 8, animais: [] },
            { numero: 5, bioma: ['savana'], tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }
    
    analisaRecintos(animal, quantidade) {

        // Verifica se o animal é válido
        if (!this.animais[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }
        // Verifica se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }
        const especie = this.animais[animal];
        const recintosViaveis = [];
        
        for (const recinto of this.recintos) {
            
            let espacoOcupado = recinto.animais.reduce((total, a) => total + this.animais[a.especie].tamanho * a.quantidade, 0);
            let espacoDisponivel = recinto.tamanho - espacoOcupado;
            
            // Verifica bioma adequado
            if (!especie.biomas.some(bioma => recinto.bioma.includes(bioma))) {
                continue; // O recinto não é compatível em bioma
            }
            // Verifica se o recinto é adequado para carnívoros
            if (especie.carnivoro && recinto.animais.length > 0) {
                // Permite apenas a própria espécie
                if (!recinto.animais.every(a => a.especie === animal)) {
                    continue;
                }
            }
            // Verifica espaço necessário para o número de animais
            let espacoNecessario = especie.tamanho * quantidade;
            
            // Se já houver outra espécie diferente, adiciona 1 ao espaço necessário
            const especiesPresentes = recinto.animais.map(a => a.especie);
            if (recinto.animais.length > 0 && !especiesPresentes.includes(animal)) {
                espacoNecessario += 1; // Aumenta o espaço necessário em 1 se já houver outra espécie diferente
            }
            
            // Não pode separar lotes de animais
            if (espacoDisponivel < espacoNecessario) {
                continue; // Não há espaço suficiente para todos os animais
            }

            // Adiciona recinto à lista de viáveis se houver espaço disponível
            recintosViaveis.push({
                numero: recinto.numero,
                espacoLivre: espacoDisponivel - espacoNecessario,
                total: recinto.tamanho
            });
        }

        // Se não houver recintos viáveis, retorna erro
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        // Ordena os recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const resposta = recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.total})`);

        return { erro: null, recintosViaveis: resposta };
    }
}

export { RecintosZoo as RecintosZoo };

// Exemplificando erro "Animal inválido"

// const teste = new RecintosZoo().analisaRecintos('VACA', 2);
// console.log(teste); 
