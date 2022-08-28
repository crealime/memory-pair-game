const URL = 'json/images.json' // Json file with images urls
const main = document.querySelector('.main')
const back = document.querySelector('.header__link_back')
const reload = document.querySelector('.header__link_reload')
const pair = []
let pairCounter = 0

function cardTemplate([url, id]) {
  return `
    <div class="game__card flip id-${id}" data-id="${id}">
      <div class="game__front">
        <img src="${url}" alt="" class="game__img">
      </div>
      <div class="game__back">${id}</div>
    </div>
  `
}

function flipCard(e) {
  const card = e.target.closest('.game__card')

  if (card) {
    const id = card.dataset.id

    if (pair.length === 0) {
      card.classList.toggle('flip')
      pair.push(card)
    }
    else if (pair.some(el => el === card)) {
      pair.forEach(el => {
        el.classList.toggle('flip')
      })
      pair.splice(0, 2)
    }
    else if (pair.length === 1 && pair[0].classList.contains(`id-${id}`)) {
      card.classList.toggle('flip')
      pair.splice(0, 2)
      pairCounter--
      setTimeout(() => {
        document.querySelectorAll(`.id-${id}`).forEach(el => {
          el.classList.add('hidden')
        })
        if (pairCounter === 0) setTimeout(() => alert('You won!'), 700)
      }, 600)

    }
    else if (pair.length === 1 && pair[0] !== id) {
      card.classList.toggle('flip')
      pair.push(card)
    }
    else {
      pair.forEach(el => {
        el.classList.toggle('flip')
      })
      card.classList.toggle('flip')
      pair.splice(0, 2)
      pair.push(card)
    }
  }
}

function renderCards(data, num = 6) {
  main.innerHTML =''
  pairCounter = num

  const game = document.createElement('div')

  game.classList.add('game')
  game.classList.add(`num-${num * 2}`)

  let cardsData = data.sort(() => 0.5 - Math.random()).slice(0, num).reduce((acc, el, i) => {
    acc.push([el, i + 1])
    return acc
  }, [])

  cardsData = [...cardsData, ...cardsData].sort(() => 0.5 - Math.random())

  cardsData.forEach(el => {
    const card = cardTemplate(el)
    game.insertAdjacentHTML('beforeend', card)
  })

  game.addEventListener('click', flipCard)

  main.appendChild(game)
}

function initGame(num) {

  // Get data from json
  async function getImagesData(url) {
    return await fetch(url).then(response => response.json())
  }

  getImagesData(URL)
    .then(data => {
      renderCards(data, num)
    })
    .catch(error => console.log(error))
}

function initStartInfo() {

}

// document.addEventListener("DOMContentLoaded", function() {initGame(6)})