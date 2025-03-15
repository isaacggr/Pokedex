const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// Inicializa o cache a partir do localStorage ou cria um novo objeto vazio
let cache = {};
try {
   const savedCache = localStorage.getItem('pokemonCache');
   if (savedCache) {
      cache = JSON.parse(savedCache);
   }
} catch (error) {
   console.log('Erro ao carregar cache:', error);
}

let searchPokemon = 1;

// Seleciona o card existente no HTML ao invés de criar um novo
const pokemonCard = document.querySelector('.pokemon-card');
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
      // Adiciona um indicador de carregamento
      pokemonName.innerHTML = 'Carregando...';
      pokemonNumber.innerHTML = '';

      const APIresponse = await fetch(
         `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );

      if (!APIresponse.ok) throw new Error('Pokémon não encontrado');

      const data = await APIresponse.json();
      cache[pokemon] = data;

      // Salva o cache atualizado no localStorage
      try {
         localStorage.setItem('pokemonCache', JSON.stringify(cache));
      } catch (e) {
         console.log('Cache muito grande para localStorage ou outro erro:', e);
         // Limpa o cache se ficar muito grande
         if (e.name === 'QuotaExceededError') {
            cache = {};
            localStorage.setItem('pokemonCache', JSON.stringify(cache));
         }
      }

      return data;
   } catch (error) {
      console.log('Erro:', error);
      // Melhora o feedback de erro
      pokemonName.innerHTML = 'Não encontrado :(';
      pokemonNumber.innerHTML = '';
      pokemonImage.style.display = 'none';

      // Se for um erro de conexão, mostre uma mensagem diferente
      if (!navigator.onLine) {
         pokemonName.innerHTML = 'Sem conexão!';
      }

      return null;
   }
};

// Função para renderizar os dados do Pokémon
const renderPokemon = async (pokemon) => {
   pokemonName.innerHTML = 'Carregando...';
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
         // Tenta obter a imagem animada, se não existir, usa a versão estática
         const animatedSprite =
            data['sprites']['versions']['generation-v']['black-white'][
               'animated'
            ]['front_default'];
         pokemonImage.src = animatedSprite || data.sprites.front_default;

         // Após definir a nova imagem, aguarda o carregamento para aplicar a animação
         pokemonImage.onload = () => {
            pokemonImage.classList.add('loaded'); // Ativa a animação de fade-in
            pokemonImage.style.opacity = 1; // A imagem se torna visível novamente
         };
      }, 600); // Delay de 600ms antes de atualizar a imagem

      // Atualizando o card de status
      pokemonCardImage.src =
         data.sprites.other['official-artwork'].front_default ||
         data.sprites.front_default;
      pokemonType.textContent = data.types
         .map((type) => type.type.name)
         .join(', ');
      pokemonHeight.textContent = data.height / 10 + 'm';
      pokemonWeight.textContent = data.weight / 10 + 'kg';

      input.value = '';
      searchPokemon = data.id;
   }
};

// Função para ajustar o tamanho e posição do card para corresponder exatamente ao retângulo da Pokedex
function updateCardPosition() {
   // Obtém as dimensões da Pokedex
   const pokedexImage = document.querySelector('.pokedex');
   const pokedexRect = pokedexImage.getBoundingClientRect();

   // Calculando a largura com base no tamanho da tela
   let widthPercentage = 0.59; // Valor padrão (58%)

   // Novo: controle dinâmico da altura
   let heightPercentage = 0.26; // Valor padrão (25%)

   // Ajusta o percentual de largura e altura baseado no tamanho da tela
   if (window.innerWidth <= 320) {
      widthPercentage = 0.59; // 63% para telas muito pequenas
      heightPercentage = 0.26; // Altura reduzida para telas muito pequenas
   } else if (window.innerWidth <= 375) {
      widthPercentage = 0.58; // 62% para telas de iPhone SE/6/7/8
      heightPercentage = 0.26; // Altura ligeiramente reduzida
   } else if (window.innerWidth <= 425) {
      widthPercentage = 0.59; // 60% para telas pequenas
      heightPercentage = 0.26; // Altura ligeiramente reduzida para telas pequenas
   }

   const displayWidth = pokedexRect.width * widthPercentage;
   const displayHeight = pokedexRect.height * heightPercentage; // Calcula a altura com base na porcentagem

   // Aplica o tamanho calculado
   pokemonCard.style.width = `${displayWidth}px`;
   pokemonCard.style.height = `${displayHeight}px`; // Aplica a altura calculada

   // Mantém os ajustes manuais para a posição
   pokemonCard.style.bottom = '44.3%';
   pokemonCard.style.left = '46%';
   pokemonCard.style.transform = `translate(-50%, -12%)`;

   // Ajuste fino para telas muito pequenas
   if (window.innerWidth <= 320) {
      // Em telas muito pequenas, movemos o card um pouco para cima
      pokemonCard.style.transform = `translate(-50%, -14%)`;
   }

   // Garante que todo o conteúdo do card esteja centralizado
   const infoElements = pokemonCard.querySelectorAll('.pokemon-card__info');
   infoElements.forEach((el) => {
      el.style.textAlign = 'center';
   });

   // Imagem centralizada
   const pokemonCardImage = pokemonCard.querySelector('.pokemon-card__image');
   if (pokemonCardImage) {
      pokemonCardImage.style.display = 'block';
      pokemonCardImage.style.marginLeft = 'auto';
      pokemonCardImage.style.marginRight = 'auto';
   }
}

// Função para abrir o card com fade-in
const showPokemonCard = async () => {
   const data = await fetchPokemon(searchPokemon);

   if (data) {
      pokemonCardImage.src =
         data.sprites.other['official-artwork'].front_default ||
         data.sprites.front_default;
      pokemonType.textContent = data.types
         .map((type) => type.type.name)
         .join(', ');
      pokemonHeight.textContent = data.height / 10 + 'm';
      pokemonWeight.textContent = data.weight / 10 + 'kg';

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
window.addEventListener('resize', updateCardPosition);

// Inicializa a renderização do primeiro Pokémon
renderPokemon(searchPokemon);

// Atualiza a posição do card imediatamente quando as imagens da Pokedex carregarem
document.querySelector('.pokedex').onload = updateCardPosition;

// Adicionar verificação para garantir que o card seja posicionado quando visível
const observer = new MutationObserver((mutations) => {
   mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('visible')) {
         updateCardPosition();
      }
   });
});

// Observar mudanças nas classes do card
observer.observe(pokemonCard, { attributes: true, attributeFilter: ['class'] });
