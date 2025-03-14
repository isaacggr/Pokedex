const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const cache = {};

var searchPokemon = 1;

// Seletores do Card
const pokemonCard = document.createElement('div');
pokemonCard.classList.add('pokemon-card', 'hidden');
pokemonCard.innerHTML = `
   
   <img class="pokemon-card__image" src="#" alt="Imagem do Pokémon" />
   <p class="pokemon-card__info">Tipo: <span class="pokemon-card__type"></span></p>
   <p class="pokemon-card__info">Altura: <span class="pokemon-card__height"></span></p>
   <p class="pokemon-card__info">Peso: <span class="pokemon-card__weight"></span></p>
   <button class="pokemon-card__close">Fechar</button>
`;

// Adiciona o card ao <body>
document.body.appendChild(pokemonCard);

// Seleciona os elementos do card
const pokemonCardImage = pokemonCard.querySelector('.pokemon-card__image');
const pokemonType = pokemonCard.querySelector('.pokemon-card__type');
const pokemonHeight = pokemonCard.querySelector('.pokemon-card__height');
const pokemonWeight = pokemonCard.querySelector('.pokemon-card__weight');
const closeButton = pokemonCard.querySelector('.pokemon-card__close');

// Função para obter os dados do Pokémon
const fetchPokemon = async (pokemon) => {
    if (cache[pokemon]) {
        return cache[pokemon];
    }

    try {
        const APIresponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (!APIresponse.ok) throw new Error("Pokémon não encontrado");

        const data = await APIresponse.json();
        cache[pokemon] = data;
        return data;
    } catch (error) {
        console.log("Erro:", error);
        return null;
    }
};

// Função para renderizar os dados do Pokémon
const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading ...';
    pokemonNumber.innerHTML = '';
    input.value = '';

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;

        // Remover a classe 'loaded' para reiniciar a animação de fade
        pokemonImage.classList.remove('loaded');

        // Limpar a imagem e dar um delay para iniciar a transição de fade-out
        pokemonImage.style.opacity = 0;

        // Definir um pequeno delay para simular a transição de desaparecimento
        setTimeout(() => {
            pokemonImage.src =
                data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

            // Após definir a nova imagem, aguarda o carregamento para aplicar a animação
            pokemonImage.onload = () => {
                pokemonImage.classList.add('loaded'); // Ativa a animação de fade-in
                pokemonImage.style.opacity = 1; // A imagem se torna visível novamente
            };
        }, 600); // Delay de 600ms antes de atualizar a imagem

        // Atualizando o card de status
     
        pokemonCardImage.src = data.sprites.other['official-artwork'].front_default;
        pokemonType.textContent = data.types.map(type => type.type.name).join(', ');
        pokemonHeight.textContent = (data.height / 10) + 'm';
        pokemonWeight.textContent = (data.weight / 10) + 'kg';

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = ''; // Evita exibir um id indefinido
    }
};

// Função para atualizar a posição do card de forma dinâmica usando top/left
function updateCardPosition() {
    const imageRect = pokemonImage.getBoundingClientRect();

    // Atualiza a posição do card diretamente com top/left
    pokemonCard.style.position = 'absolute';
    pokemonCard.style.top = `${imageRect.top + window.scrollY -30}px`;  // Ajusta o top com o scroll
    pokemonCard.style.left = `${imageRect.left + window.scrollX - 75}px`;  // Ajusta o left com o scroll

}

// Função para abrir o card com fade-in
const showPokemonCard = async () => {
    const data = await fetchPokemon(searchPokemon);

    if (data) {
        pokemonCardImage.src = data.sprites.other['official-artwork'].front_default;
        pokemonType.textContent = data.types.map(type => type.type.name).join(', ');
        pokemonHeight.textContent = (data.height / 10) + 'm';
        pokemonWeight.textContent = (data.weight / 10) + 'kg';

        // Remove a classe 'hidden' e aplica o fade-in
        pokemonCard.classList.remove('hidden');
        pokemonCard.classList.add('visible');
    }
};

// Função para fechar o card com fade-out
closeButton.addEventListener('click', () => {
    // Aplica fade-out
    pokemonCard.classList.remove('visible');
    pokemonCard.classList.add('hidden');
});


// Atualiza o Pokémon ao submeter o formulário
form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

// Navegação para o Pokémon anterior
buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

// Navegação para o próximo Pokémon
buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

// Detecção de teclas de navegação
document.addEventListener('keydown', (event) => {
    // Verifica se a tecla pressionada é a seta para a esquerda (37) ou para a direita (39)
    if (event.key === 'ArrowLeft') {
        if (searchPokemon > 1) {
            searchPokemon -= 1;
            renderPokemon(searchPokemon);
        }
    } else if (event.key === 'ArrowRight') {
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    }
});

// Exibe o card de status ao clicar na imagem e ajusta a posição
pokemonImage.addEventListener('click', () => {
    showPokemonCard();
    updateCardPosition();
});

// Atualizar posição sempre que a tela for redimensionada
window.addEventListener("resize", updateCardPosition);

// Inicializa a renderização do primeiro Pokémon
renderPokemon(searchPokemon);

// Adiciona uma classe que altera o tamanho ao invés de mudar diretamente o estilo
pokemonCard.classList.add('card-larger');
