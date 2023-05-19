const search = document.getElementById("search")
const button = document.getElementById("button")
const input = document.getElementById("input")

const closeBtn = document.getElementById("closeBtn")
closeBtn.addEventListener("click", closeModal)

const visitBtn = document.getElementById("visitBtn")

const modal = document.querySelector(".modal")
const modalTitle = document.querySelector(".modalTitle")
const modalView = document.querySelector(".modalView")
const modalImage = document.querySelector(".modalImage")

function formatNumberIntoUnits(num) {
    const suffixes = ["", "K", "M", "B", "T"]
    const suffixIndex = Math.floor(Math.log10(num) / 3)
    const shortNum = (num / Math.pow(1000, suffixIndex)).toFixed(1)
    return shortNum + " " + suffixes[suffixIndex]
}

function openModal(obj) {
    // console.log(obj)
    modalTitle.innerText = obj.richSnippet.videoobject.name
    modalView.innerText = formatNumberIntoUnits(
        obj.richSnippet.videoobject.interactioncount
    )
    modalImage.src = obj.richSnippet.imageobject.url
    visitBtn.href = obj.richSnippet.videoobject.url

    window.scrollTo(0, 0)
    modal.classList.add("requires-no-scroll")
    modal.style.display = "block"
    visitBtn.addEventListener("click", closeModal)
}

function closeModal() {
    modal.classList.remove("requires-no-scroll")
    modal.style.display = "none"
}

function loading() {
    search.classList.add("loading")

    setTimeout(function () {
        search.classList.remove("loading")
    }, 1500)
}

button.addEventListener("click", loading)

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") loading()
})

const myResultsReadyCallback = function (name, q, promos, results, resultsDiv) {
    if (results) {
        const filteredAndSorted = results
            .filter(
                (item) =>
                    item.richSnippet &&
                    item.richSnippet.videoobject &&
                    item.richSnippet.videoobject.interactioncount
            )
            .sort(
                (a, b) =>
                    b.richSnippet.videoobject.interactioncount -
                    a.richSnippet.videoobject.interactioncount
            )
            .slice(0, 10)

        function eachClick(e) {
            const clickedObject = filteredAndSorted.find(
                (obj) => obj.richSnippet.videoobject.name === e.target.innerText
            )
            // console.log(clickedObject)

            openModal(clickedObject)
        }

        if (filteredAndSorted.length < 0) {
            const msg = document.createElement("h2")
            msg.innerText = "No search results found..."
            msg.classList.add("msg")
            resultsDiv.appendChild(msg)
        }

        for (const result of filteredAndSorted) {
            // console.log(result)
            const imgWrapper = document.createElement("div")
            const img = document.createElement("img")
            img.src =
                result?.thumbnailImage?.url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKlBJZ9YpI9sYwqF8-9Flt6DnqZbWLI0h0uRgs-3h-VA&usqp=CAU&ec=48665701"
            img.classList.add("thumbnail")
            imgWrapper.classList.add("wrapper")
            imgWrapper.appendChild(img)

            if (result?.richSnippet?.videoobject?.duration) {
                const durationString =
                    result?.richSnippet?.videoobject?.duration.toString()
                const minutes = parseInt(
                    durationString.substring(2, durationString.indexOf("M"))
                )
                const seconds = parseInt(
                    durationString.substring(
                        durationString.indexOf("M") + 1,
                        durationString.indexOf("S")
                    )
                )
                // Formatting the duration
                const formattedDuration = `${String(minutes).padStart(
                    2,
                    "0"
                )}:${String(seconds).padStart(2, "0")}`

                const p = document.createElement("p")
                p.innerText = formattedDuration
                p.classList.add("duration")
                imgWrapper.appendChild(p)
            }

            const textWrapper = document.createElement("div")
            textWrapper.classList.add("textWrapper")
            const title = document.createElement("h4")
            title.classList.add("videoTitle")
            title.style.cursor = "pointer"
            title.classList.add("line-clamp")
            title.innerText = result?.richSnippet?.videoobject?.name

            title.addEventListener("click", eachClick)

            textWrapper.appendChild(title)
            const name = document.createElement("p")
            name.style.color = "#9499A6"
            name.innerText = result?.richSnippet?.person?.name
            textWrapper.appendChild(name)

            const textBox = document.createElement("div")
            textBox.classList.add("textBox")
            const part1 = document.createElement("p")
            const part2 = document.createElement("p")
            part1.innerHTML = `<div style="display: flex; gap: 5px; align-items: center;"><p class="ytIcon"></p><p>Youtube.com</p></div>`
            part2.innerText = `${formatNumberIntoUnits(
                result?.richSnippet?.videoobject?.interactioncount || 0
            )} views`
            textBox.appendChild(part1)
            textBox.appendChild(part2)
            textWrapper.appendChild(textBox)

            const rowWrapper = document.createElement("div")
            rowWrapper.classList.add("rowWrapper")

            rowWrapper.appendChild(imgWrapper)
            rowWrapper.appendChild(textWrapper)

            resultsDiv.appendChild(rowWrapper)
        }
    }

    return true
}

myWebResultsRenderedCallback = function () {
    const searchresults = document.getElementsByClassName("gsc-cursor-page")
    const index = document.getElementsByClassName("gsc-cursor-current-page")
    if (index.item(0).innerHTML == searchresults.length) {
        alert("This is the last results page")
    }
}

window.__gcse || (window.__gcse = {})
window.__gcse.searchCallbacks = {
    web: {
        ready: myResultsReadyCallback,
        rendered: myWebResultsRenderedCallback,
    },
}
