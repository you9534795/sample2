class PokemonList {
	constructor() {
		this.collection = new Map();
	}
	add(pokemon) {
		this.collection.set(pokemon.name, pokemon);
	}
	findByName(name) {
		return this.collection.get(name);
	}
	findUseabelOne(currentPokemon = null) {
		let useableList = Array.from(this.collection.values());
		useableList = useableList.filter(pokemon => !pokemon.isLastN() && !pokemon.isUsed);
		if (currentPokemon) {
			useableList = useableList.filter(pokemon => currentPokemon.isMatchWith(pokemon));
		}
		const nextPokemon = useableList[Math.floor(Math.random() * useableList.length)];
		return nextPokemon;
	}
}
class Pokemon {
	constructor(name, yomigana) {
		this.name = name;
		this.yomigana = yomigana;
		this.isUsed = false;
	}
	getLastChar() {
		return this.yomigana.substr(-1);
	}
	getFirstChar() {
		return this.yomigana.substr(0, 1);
	}
	use() {
		this.isUsed = true;
	}
	isMatchWith(nextPokemon) {
		return nextPokemon.getFirstChar().normalize('NFD')[0] === this.getLastChar().normalize('NFD')[0];
	}
	isLastN() {
		return this.getLastChar() === 'ン';
	}
}
class Game {
	constructor(data) {
		this.data = data;
		this.pokemonList = null;
		this.currentPokemon = null;
	}
	createNewGame() {
		$('.fukidashi_row_list').empty();
		this.pokemonList = new PokemonList();
		for (let row of this.data) {
			this.pokemonList.add(new Pokemon(row['name'], row['yomigana']));
		}
		this.cupTalk('ポケモンしりとり');
		$('.input_area__input').prop('disabled', false);
		this.cupTurn();
	}
	cupTurn() {
		const nextPokemon = this.pokemonList.findUseabelOne(this.currentPokemon);
		if (!nextPokemon) {
			this.cupTalk('参りました・・・');
			this.cupTalk('もう一度遊ぶ場合は右上の更新アイコンをクリックしてね');
			this.end();
		} else {
			nextPokemon.use();
			this.cupTalk(nextPokemon.name);
			this.currentPokemon = nextPokemon;
			if (!this.pokemonList.findUseabelOne(this.currentPokemon)) {
				this.cupTalk('もう出せるポケモンがいないので、あなたの負けです')
				this.cupTalk('もう一度遊ぶ場合は右上の更新アイコンをクリックしてね');
				this.end();
			}
		}
	}
	playerTurn(name) {
		const nextPokemon = this.pokemonList.findByName(name);
		if (!nextPokemon) {
			this.playerTalk(name);
			this.cupTalk('そんなポケモンいないよ');
		} else if (nextPokemon.isUsed) {
			this.playerTalk(nextPokemon.name);
			this.cupTalk('すでに使われているよ');
		} else if (nextPokemon.isLastN()) {
			this.playerTalk(nextPokemon.name);
			this.cupTalk('「ン」で終わるよ');
		} else {
			nextPokemon.use();
			this.playerTalk(nextPokemon.name);
			this.currentPokemon = nextPokemon;
			this.cupTurn();
		}
	}
	cupTalk(text) {
		this.talk(text, true);
	}
	playerTalk(text) {
		this.talk(text);
	}
	end() {
		$('.input_area__input').prop('disabled', true);
	}
	talk(text, isLeft = false) {
		const leftOrRight = isLeft ? 'left' : 'right';
		const $talk = $(`<li class="fukidashi_row fukidashi_row--${leftOrRight}">
		<div class="fukidashi_group fukidashi_group--${leftOrRight}">
			<div class="fukidashi_group__icon">
				<img src="common/img/${leftOrRight}.jpg" alt="">
			</div>
			<div class="fukidashi_group__fukidashi fukidashi_group__fukidashi--${leftOrRight}">
				<p>${text}</p>
			</div>
		</div>
	</li>`);
		$('.fukidashi_row_list').append($talk);
		$talk.get(0).scrollIntoView();
	}
}

$(function() {
	const game = new Game(data);
	game.createNewGame();
	
	$('#form').on('submit', function(e) {
		e.preventDefault();
		const data = $(this).serializeArray();
		const value = data[0].value;
		if (!value)
		{
			return false;
		}
		this.reset();
		game.playerTurn(value);
		$('.input_area__input').focus();
		return false;
	});

	$('.modal').on('click', function(e) {
		e.preventDefault();
		var $target = $(e.target);
		if ($target.is('.modal_panel, .modal_panel *:not(.modal_panel__close):not(.modal_panel__close *)')) {
			return false;
		}
		$('.modal').removeClass('active');
		return false;
	});

	$('.header__icon__refresh').on('click', function(e) {
		e.preventDefault();
		$('.modal.modal--1').addClass('active');
		return false;
	});
	$('.header__icon__help').on('click', function(e) {
		e.preventDefault();
		$('.modal.modal--2').addClass('active');
		return false;
	});

	$('#reset_btn').on('click', function(e) {
		e.preventDefault();
		game.createNewGame();
		$('.modal_panel__close').click();
		return false;
	});

});

