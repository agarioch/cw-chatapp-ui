const USERNAME = 'You'
const BOTNAME = 'CountryBot'
const messages = $('#messages')
const messagebox = $('#messages-window')
const countryNames = countries.map((e) => e.Name.toLowerCase())
const letters = Array.from('abcdefghijklmnopqrstuvwxyz')
let currentLetter = 0

$(document).ready(function () {
    appendWelcomeMessage()
})

$("form[name='message-form']").submit(function (event) {
    event.preventDefault()
    const msg = $(this).find('input[name="input-message"]').val()
    if (msg) {
        appendMessage(msg, USERNAME)
        setTimeout(appendBotReply, 300, msg)
        this.reset()
    }
})

function appendBotReply(msg) {
    const lowerMsg = msg.toLowerCase().trim()
    if (countryNames.includes(lowerMsg)) {
        if (lowerMsg.charAt(0) === letters[currentLetter]) {
            currentLetter = nextLetter(currentLetter)
            appendMessage(
                randomCountry(letters[currentLetter]) +
                    nextLetterMessage(currentLetter),
                BOTNAME
            )
            currentLetter = nextLetter(currentLetter)
        } else {
            appendMessage(
                `Sorry, ${msg} doesn't begin with ${letters[
                    currentLetter
                ].toUpperCase()}`,
                BOTNAME
            )
        }
    } else {
        appendMessage(
            `Sorry I can't find "${msg}" on the iso country list. Try to name a country starting with letter ${letters[
                currentLetter
            ].toUpperCase()}`,
            BOTNAME
        )
    }
}

function scrollToLastMessage() {
    messagebox
        .get(0)
        .scroll({ left: 0, top: messages.height(), behavior: 'smooth' })
}

function nextLetter(n) {
    return (n + 1) % 26
}

function nextLetterMessage(n) {
    if (n + 1 === letters.length) {
        currentLetter = nextLetter(currentLetter)
        return "! Let's go round again? This time I'll start; Angola. Now we are on B..."
    }
    if (n + 1 === letters.indexOf('x')) {
        currentLetter = nextLetter(currentLetter)
        currentLetter = nextLetter(currentLetter)
        return `. There are no X countries, let's go to Y.`
    } else {
        return `, now we are on ${letters[currentLetter + 1].toUpperCase()}...`
    }
}

function appendWelcomeMessage() {
    const welcome =
        "Hi, I'm CountryBot. Name a country beginning with the letter A and I'll reply with one beginning with letter B and so on down the alphabet."
    appendMessage(welcome, BOTNAME)
}

function randomCountry(letter) {
    const validCountries = countryNames.filter((c) => c.charAt(0) === letter)
    if (validCountries.length > 0) {
        return cleanCountryName(
            validCountries[Math.floor(Math.random() * validCountries.length)]
        )
    } else {
        return `Let's skip ${letters[currentLetter].toUpperCase()}`
    }
}

function cleanCountryName(str) {
    // capitalize first letter of every word
    return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
}

function appendMessage(text, user) {
    const time = new Date().toLocaleString('en-GB')
    const msg = $(`<div class="${user === BOTNAME ? '' : 'user'} message-line">
        <div class="message">
            <span class="metadata">
                <h3>${user}</h3>
                <h6>${time}</h6>
            </span>
            <p>${text}</p>
        </div>
    </div>`)
    messages.append(msg)
    scrollToLastMessage()
}
