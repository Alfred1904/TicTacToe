var cells = document.querySelectorAll('.cell')        
var turnIndicator = document.querySelector('#turn-indicator span')
var restartBtn = document.getElementById('restart')
var modeSelector = document.getElementById('mode')
var container = document.querySelector('.sakura-container')

var currentPlayer = 'X'
var board = Array(9)          
board.fill(null)                
var gameActive = true
var gameMode = 'pvp'

var scores = JSON.parse(localStorage.getItem('tresEnRayaScores') || '{"wins":0,"losses":0,"draws":0}')

var scoreContainer = document.createElement('div')
scoreContainer.className = 'scoreboard'
scoreContainer.style.display = 'inline-flex'
scoreContainer.style.gap = '8px'
scoreContainer.style.marginLeft = '8px'
scoreContainer.style.flexWrap = 'wrap'
scoreContainer.style.border = '1px solid #333'

function makeScoreBtn(id, label, value){
  var btn = document.createElement('button')
  btn.id = id
  btn.type = 'button'
  btn.innerText = label + ': ' + value 
  btn.setAttribute('disabled','disabled')
  btn.style.opacity = '0.9'
  btn.style.cursor = 'default'
  btn.style.userSelect = 'none'
  btn.style.padding = '6px 10px'
  btn.style.borderRadius = '10px'
  return btn
}

var winsBtn   = makeScoreBtn('btn-wins',   'Partidas ganadas',  scores.wins)
var lossesBtn = makeScoreBtn('btn-losses', 'Partidas perdidas', scores.losses)
var drawsBtn  = makeScoreBtn('btn-draws',  'Empates',           scores.draws)

scoreContainer.appendChild(winsBtn)
scoreContainer.appendChild(lossesBtn)
scoreContainer.appendChild(drawsBtn)

var anchor = (restartBtn && restartBtn.parentElement) || document.body
anchor.appendChild(scoreContainer)

function updateScoreUI(){
  winsBtn.innerHTML   = 'Partidas ganadas: ' + scores.wins
  lossesBtn.innerHTML = 'Partidas perdidas: ' + scores.losses
  drawsBtn.innerHTML  = 'Empates: ' + scores.draws
}
function saveScores(){
  localStorage.setItem('tresEnRayaScores', JSON.stringify(scores))
}

if (modeSelector) {
  modeSelector.addEventListener('change', function(e){
    gameMode = e.target.value
    restartGame()
  })
}

cells.forEach(function(cell){
  cell.addEventListener('click', function(){
    handleCellClick(cell)
  })
})

if (restartBtn) restartBtn.addEventListener('click', restartGame)

function handleCellClick(cell){
  var index = cell.dataset.index
  if (board[index] || !gameActive) return

  board[index] = currentPlayer
  cell.textContent = currentPlayer
  cell.classList.add(currentPlayer.toLowerCase())

  if (checkWinner()){ 
    if (currentPlayer == 'X') { scores.wins++ } else { scores.losses++ } // uso ==
    updateScoreUI(); saveScores()

    turnIndicator.textContent = '🎉 ¡' + currentPlayer + ' ganó!'
    gameActive = false
    return
  }

  if (board.every(function(v){ return v })) { 
    scores.draws++; updateScoreUI(); saveScores()
    turnIndicator.textContent = '😮 ¡Empate!'
    gameActive = false
    return
  }

  currentPlayer = currentPlayer == 'X' ? 'O' : 'X'
  turnIndicator.innerText = currentPlayer

  if (gameMode == 'cpu' && currentPlayer == 'O') {
    setTimeout(cpuMove, 500)
  }
}

function cpuMove(){
  var emptyCells = board.map(function(val, idx){ return val == null ? idx : null }).filter(function(v){ return v != null })
  if (emptyCells.length == 0) return

  randomIndex = parseInt(Math.random() * emptyCells.length, 10) 
  var cpuCell = cells[ emptyCells[randomIndex] ]

  var pos = emptyCells[randomIndex]
  board[pos] = 'O'
  cpuCell.textContent = 'O'
  cpuCell.classList.add('o')

  if (checkWinner()){
    scores.losses++; updateScoreUI(); saveScores()
    turnIndicator.textContent = '🤖 ¡La computadora ganó!'
    gameActive = false
    return
  }

  if (board.every(function(v){ return v })) {
    scores.draws++; updateScoreUI(); saveScores()
    turnIndicator.textContent = '😮 ¡Empate!'
    gameActive = false
    return
  }

  currentPlayer = 'X'
  turnIndicator.textContent = currentPlayer
}

function restartGame(){
  board.fill(null)
  gameActive = true
  currentPlayer = 'X'
  turnIndicator.textContent = currentPlayer

  cells.forEach(function(cell){ cell.textContent = '' })
  cells.forEach(function(cell){ cell.classList.remove('x','o') })
}

function checkWinner(){
  var winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ]
  for (i = 0; i < winPatterns.length; i++){
    var a = winPatterns[i][0], b = winPatterns[i][1], c = winPatterns[i][2]
    if (board[a] && board[a] == board[b] && board[a] == board[c]){ // ==
      return true
    }
  }
  return false
}

function crearPetalo(){
  var petalo = document.createElement('div')
  petalo.classList.add('sakura')
  petalo.style.left = (Math.random() * window.innerWidth) + 'px'
  var size = 20 + Math.random() * 20
  petalo.style.width = size + 'px'
  petalo.style.height = size + 'px'
  var duracion = 6 + Math.random() * 5
  petalo.style.animationDuration = duracion + 's'
  petalo.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2)
  container.appendChild(petalo)
  setTimeout(function(){ petalo.remove() }, duracion * 1000)
}
setInterval(crearPetalo, 700)

updateScoreUI()