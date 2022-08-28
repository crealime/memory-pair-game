const URL = 'json/images.json' // Json file with images urls
const pair = []
const GAME_TIME = {
  start: '',
  end: '',
  diff: '',
  setStartTime() {
    this.start = new Date().getTime() / 1000
  },
  setEndTime() {
    this.end = new Date().getTime() / 1000
  },
  setDiffTime() {
    const timeDiff = this.end - this.start
    let hours = String(Math.floor(timeDiff / 60 / 60))
    if (hours.length < 2) hours = 0 + hours
    let minutes = String(Math.floor(timeDiff / 60))
    if (minutes.length < 2) minutes = 0 + minutes
    let seconds = String(Math.floor(timeDiff % 60))
    if (seconds.length < 2) seconds = 0 + seconds
    this.diff = `${hours}:${minutes}:${seconds}`
  },
  getDiffTime() {
    return this.diff
  }
}
let numOfPairs = 0
let pairCounter = 0

const main = document.querySelector('.main')

function startPageTemplate() {
  return `
    <div class="start-page">
      <div class="start-page__title">Select number of&nbsp;pairs</div>
      <div class="start-page__select-box">
        <nav class="start-page__nav">
          <ul class="start-page__ul">
            <li class="start-page__li"><a href="#" data-pair="6" class="start-page__link">6</a></li>
            <li class="start-page__li"><a href="#" data-pair="8" class="start-page__link">8</a></li>
            <li class="start-page__li"><a href="#" data-pair="10" class="start-page__link">10</a></li>
            <li class="start-page__li"><a href="#" data-pair="12" class="start-page__link">12</a></li>
            <li class="start-page__li"><a href="#" data-pair="15" class="start-page__link">15</a></li>
            <li class="start-page__li"><a href="#" data-pair="18" class="start-page__link">18</a></li>
            <li class="start-page__li"><a href="#" data-pair="21" class="start-page__link">21</a></li>
            <li class="start-page__li"><a href="#" data-pair="28" class="start-page__link">28</a></li>
          </ul>
        </nav>
      </div>
    </div>
  `
}

function cardTemplate([url, id]) {
  return `
    <div class="game__card flip id-${id}" data-id="${id}">
      <div class="game__front">
        <img src="${url}" alt="" class="game__img">
      </div>
      <div class="game__back"></div>
    </div>
  `
}

function resultTemplate(time, pairs) {
  return `
    <div class="result-page">
      <div class="result-page__message">Your result is<br>${time}<br>for ${pairs} pairs</div>
      <a href="#" class="result-page__link">Play again</a>
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
        if (pairCounter === 0) {
          GAME_TIME.setEndTime()
          GAME_TIME.setDiffTime()
          setTimeout(() => initResultPage(), 650)
        }
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

function initStartPage() {
  main.innerHTML = ''

  main.insertAdjacentHTML('afterbegin', startPageTemplate())

  const startPageUl = document.querySelector('.start-page__ul')

  startPageUl.addEventListener('click', function(e) {
    e.preventDefault()
    initGame(e.target.dataset.pair)
  })
}

function initGame(num) {

  // Get data from json
  async function getImagesData(url) {
    return await fetch(url).then(response => response.json())
  }

  getImagesData(URL)
    .then(data => {
      renderCards(data, num)
      GAME_TIME.setStartTime()
      pairCounter = num
      numOfPairs = num
    })
    .catch(error => console.log(error))
}

function initResultPage() {
  main.innerHTML = ''

  main.insertAdjacentHTML('afterbegin', resultTemplate(GAME_TIME.getDiffTime(), numOfPairs))

  const resultPageLink = document.querySelector('.result-page__link')

  resultPageLink.addEventListener('click', function(e) {
    e.preventDefault()
    initStartPage()
  })

}

document.addEventListener("DOMContentLoaded", function() {initStartPage()})