// Acessa os elementos dos inputs de configuração
let acao = document.getElementById('acao')
let pausa = document.getElementById('pausa')
let sessoes = document.getElementById('sessoes')

// Variável para controle dos segundos
let segundos

// Carrega os áudios de alertas
var bell = new Audio("./audio/bell.mp3")
var volta = new Audio("./audio/volta.mp3")
var final = new Audio("./audio/final.mp3")

// Acessa os controles de música de fundo
var lofi = document.getElementById('lofi')
var pause = document.getElementById('pause')
var play = document.getElementById('play')

// Função para pausar a música e atualizar os botões de controle
function pausar() {
   lofi.pause()
   play.style.setProperty('display', 'block', 'important')
   pause.style.setProperty('display', 'none', 'important')
}

// Função para tocar a música e atualizar os botões de controle
function executar() {
   lofi.play()
   play.style.setProperty('display', 'none', 'important')
   pause.style.setProperty('display', 'block', 'important')
}

// Inicia o timer de ações e pausas com base nas configurações inseridas
function iniciar() {
   // Valida se todos os campos estão preenchidos
   if (acao.value == 0) {
      document.getElementById('erro_acao').innerHTML = "Adicione os minutos"
      acao.focus()
   } else if (pausa.value == 0) {
      document.getElementById('erro_pausa').innerHTML = "Adicione a pausa"
      pausa.focus()
   } else if (sessoes.value == 0) {
      document.getElementById('erro_sessoes').innerHTML = "Adicione as sessões"
      sessoes.focus()
   } else {
      // Inicia a música automaticamente
      lofi.play()
      pause.style.setProperty('display', 'block', 'important')

      // Armazena as configurações no localStorage
      localStorage.setItem('acao', String(acao.value))
      localStorage.setItem('pausa', String(pausa.value))
      localStorage.setItem('sessoes', String(sessoes.value))

      // Alterna a exibição entre as seções de configuração e o timer
      document.getElementById('config').style.setProperty('display', 'none', 'important')
      document.getElementById('timer').style.setProperty('display', 'block', 'important')

      momentoAcao()
   }
}

// Função para controlar o período de "Ação"
function momentoAcao() {
   let sessoes_valor = localStorage.getItem('sessoes')
   document.getElementById('title_sessao').innerHTML = sessoes_valor != '1'
      ? sessoes_valor + ' sessões restantes'
      : sessoes_valor + ' sessão restante'

   // Configura o título da seção como "AÇÃO"
   let title = document.getElementById('title')
   title.innerHTML = "AÇÃO"
   title.style.fontSize = '25pt'
   title.style.fontWeight = 'bold'
   title.style.setProperty('color', '#28a745', 'important')

   // Define os valores iniciais para minutos e segundos
   let min = Number(localStorage.getItem('acao')) - 1
   segundos = 59

   document.getElementById('minutes_ok').innerHTML = min
   document.getElementById('seconds_ok').innerHTML = segundos

   // Configura intervalos para atualização de minutos e segundos
   var min_interval = setInterval(minTimer, 60000)
   var seg_interval = setInterval(segTimer, 1000)

   function minTimer() {
      min -= 1
      document.getElementById('minutes_ok').innerHTML = min
   }

   function segTimer() {
      segundos -= 1
      document.getElementById('seconds_ok').innerHTML = segundos

      if (segundos <= 0) {
         if (min <= 0) {
            clearInterval(min_interval)
            clearInterval(seg_interval)
            bell.play()
            momentoPausa()
         }
         segundos = 60
      }
   }
}

// Função para controlar o período de "Pausa"
function momentoPausa() {
   // Configura o título da seção como "PAUSA"
   let title = document.getElementById('title')
   title.innerHTML = "PAUSA"
   title.style.fontSize = '25pt'
   title.style.fontWeight = 'bold'
   title.style.setProperty('color', '#dc3545', 'important')

   // Define os valores iniciais para minutos e segundos
   let min_pausa = Number(localStorage.getItem('pausa')) - 1
   segundos = 59

   document.getElementById('minutes_ok').innerHTML = min_pausa
   document.getElementById('seconds_ok').innerHTML = segundos

   // Configura intervalos para atualização de minutos e segundos
   var min_interval = setInterval(minTimer, 60000)
   var seg_interval = setInterval(segTimer, 1000)

   function minTimer() {
      min_pausa -= 1
      document.getElementById('minutes_ok').innerHTML = min_pausa
   }

   function segTimer() {
      segundos -= 1
      document.getElementById('seconds_ok').innerHTML = segundos

      if (segundos <= 0) {
         if (min_pausa <= 0) {
            let ses = Number(localStorage.getItem('sessoes')) - 1
            localStorage.setItem('sessoes', String(ses))
            clearInterval(min_interval)
            clearInterval(seg_interval)

            if (ses <= 0) {
               final.play()
               localStorage.clear()
               document.getElementById('config').style.setProperty('display', 'none', 'important')
               document.getElementById('timer').style.setProperty('display', 'none', 'important')
               document.getElementById('fim').style.setProperty('display', 'block', 'important')
            } else {
               volta.play()
               momentoAcao()
            }
         }
         segundos = 60
      }
   }
}
