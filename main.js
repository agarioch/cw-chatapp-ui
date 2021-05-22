// Placenames from Index of Place Names in Great Britain (July 2016), Office for National Statistics
$.support.cors = true

const username = 'You'
const botname = 'CountryBot'
const messages = $('#messages')
const messagebox = $('#messages-window')
const countryNames = countries.map((e) => e.Name.toLowerCase())
const letters = Array.from('abcdefghijklmnopqrstuvwxyz')
let currentLetter = 0

$(document).ready(function () {
    welcome()
})

$("form[name='message-form']").submit(function (event) {
    event.preventDefault()
    const msg = $(this).find('input[name="input-message"]').val()
    if (msg) {
        appendMessage(msg, username)
        setTimeout(reply, 300, msg)
        this.reset()
    }
})

function reply(msg) {
    const lowerMsg = msg.toLowerCase().trim()
    if (countryNames.includes(lowerMsg)) {
        if (lowerMsg.charAt(0) === letters[currentLetter]) {
            currentLetter = nextLetter(currentLetter)
            appendMessage(
                randomCountry(letters[currentLetter]) +
                    nextLetterMessage(currentLetter),
                botname
            )
            currentLetter = nextLetter(currentLetter)
        } else {
            appendMessage(
                `Sorry, ${msg} doesn't begin with ${letters[
                    currentLetter
                ].toUpperCase()}`,
                botname
            )
        }
    } else {
        appendMessage(
            `Sorry I can't find "${msg}" on the iso country list. Try to name a country starting with letter ${letters[
                currentLetter
            ].toUpperCase()}`,
            botname
        )
    }
}

function scrollWindow() {
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
        return `. There are no X countries, let's go to ${letters[
            currentLetter + 1
        ].toUpperCase()}.`
    } else {
        return `, now we are on ${letters[currentLetter + 1].toUpperCase()}...`
    }
}

function welcome() {
    const welcome =
        "Hi, I'm CountryBot. Name a country beginning with the letter A and I'll reply with one beginning with letter B and so on down the alphabet."
    appendMessage(welcome, botname)
}

function randomCountry(letter) {
    if (!letter) {
        return cleanCountryName(
            countryNames[Math.floor(Math.random() * countryNames.length)]
        )
    } else {
        const validCountries = countryNames.filter(
            (c) => c.charAt(0) === letter
        )
        console.log(validCountries)
        if (validCountries.length > 0) {
            return cleanCountryName(
                validCountries[
                    Math.floor(Math.random() * validCountries.length)
                ]
            )
        } else {
            return `Let's skip ${letters[currentLetter].toUpperCase()}`
        }
    }
}

function cleanCountryName(str) {
    console.log(typeof str)
    return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
}

function appendMessage(text, user) {
    const time = new Date().toLocaleString('en-GB')
    const msg = $(`<div class="${user === botname ? '' : 'user'} message-line">
        <div class="message">
            <span class="metadata">
                <h3>${user}</h3>
                <h6>${time}</h6>
            </span>
            <p>${text}</p>
        </div>
    </div>`)
    messages.append(msg)
    scrollWindow()
}
