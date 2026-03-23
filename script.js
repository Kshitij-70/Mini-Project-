const form = document.querySelector("form")
const amountInput = document.getElementById("amount")
const fromCurrency = document.getElementById("fromCurrency")
const toCurrency = document.getElementById("toCurrency")

const tableBody = document.querySelector("tbody")

const historyList = document.getElementById("historyList")
const favList = document.getElementById("favList")

form.addEventListener("submit", async (e) => {

    e.preventDefault()

    const amount = amountInput.value
    const baseCurrency = fromCurrency.value
    const targetCurrency = toCurrency.value

    if (!amount || amount <= 0) {
        alert("Enter valid amount")
        return
    }

    tableBody.innerHTML = `<tr><td colspan="3">Loading...</td></tr>`

    try {

        const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)

        const data = await res.json()

        const rate = data.rates[targetCurrency]

        const result = (amount * rate).toFixed(2)

        tableBody.innerHTML = `
<tr>
<td>${baseCurrency}</td>
<td>${targetCurrency}</td>
<td>${result} ${targetCurrency}</td>
</tr>
`

        saveHistory(`${amount} ${baseCurrency} → ${targetCurrency} = ${result}`)

        saveFavorite(`${baseCurrency} → ${targetCurrency}`)

    }
    catch (err) {

        tableBody.innerHTML = `<tr><td colspan="3">API Error</td></tr>`
        console.log(err)

    }

})



/* HISTORY */

function saveHistory(text) {

    let history = JSON.parse(localStorage.getItem("history")) || []

    history.unshift(text)

    history = history.slice(0, 5)

    localStorage.setItem("history", JSON.stringify(history))

    renderHistory()

}

function renderHistory() {

    const history = JSON.parse(localStorage.getItem("history")) || []

    historyList.innerHTML = ""

    history.forEach(h => {

        historyList.innerHTML += `<li>${h}</li>`

    })

}

/* FAVORITES */

function saveFavorite(pair) {

    let favs = JSON.parse(localStorage.getItem("favorites")) || []

    if (!favs.includes(pair)) {
        favs.push(pair)
    }

    localStorage.setItem("favorites", JSON.stringify(favs))

    renderFavorites()

}

function renderFavorites() {

    const favs = JSON.parse(localStorage.getItem("favorites")) || []

    favList.innerHTML = ""

    favs.forEach(f => {

        favList.innerHTML += `<li>${f}</li>`

    })

}

renderHistory()
function clearHistory(){
    localStorage.removeItem("history")
    renderHistory()
}
renderFavorites()