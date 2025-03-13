const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const cache = {};

var searchPokemon = 1;

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
        }, 600); // Delay de 200ms antes de atualizar a imagem
        

        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = ''; // Evita exibir um id indefinido
    }
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});



buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});
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

renderPokemon(searchPokemon);

const buttons = document.querySelectorAll('.button');

buttons.forEach((button) => {
    button.addEventListener('click', function () {
        button.classList.add('clicked');

        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    });
});
