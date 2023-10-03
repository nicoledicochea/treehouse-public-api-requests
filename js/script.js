// get and display 12 random users
// refer to: https://randomuser.me/documentation

// fetch data from randomuser.me 
// img, first/last name, email, city or location
// style it like html in index.html example

const url = 'https://randomuser.me/api/?nat=us&results=12'
const galleryCards = []
const gallery = document.querySelector('#gallery')
const body = document.querySelector('body')

async function fetchUsers() {
    try {
        const response = await fetch(url)
        const data = await response.json()
        generateGallery(data.results)
    } catch(error) {
        console.error(error)
    }
}

function createGalleryCard(data) {
    return `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${data.picture.large}" alt="${data.name.first} ${data.name.last} profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="${data.name.first}" class="card-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="card-text">${data.email}</p>
            <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
    </div>`
}


function createModalCard(data) {
    return `<div class="modal-container">
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${data.picture.large}" alt="${data.name.first} ${data.name.last} profile picture">
            <h3 id="${data.name.first}" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="modal-text">${data.email}</p>
            <p class="modal-text cap">${data.location.city},</p>
            <hr>
            <p class="modal-text">${formatPhoneNums(data.cell)}</p>
            <p class="modal-text">123 ${data.location.street.name}, ${data.location.city}, ${data.location.state} ${data.location.postcode}</p>
            <p class="modal-text">Birthday: ${formatBirthdates(data.dob.date)}</p>
        </div>
    </div>
    </div>`
}

function generateGallery(data) {
    gallery.insertAdjacentHTML('beforeend', data.map(person => {
        galleryCards.push(person)
        return createGalleryCard(person)
    }).join('')) 
}

// create event listener on gallery container
gallery.addEventListener('click', (e) => {
    const cardClicked = e.target.closest('.card')
    // ensure only gallery card selected
    if(cardClicked) {
        // find card that was clicked
        const data = galleryCards.find(person => {
            const cardName = cardClicked.querySelector('h3').id
            return cardName === person.name.first
        })
    // create a modal window
    const card = createModalCard(data)
    gallery.insertAdjacentHTML('beforebegin', card)

    // create close modal event listener
    const modalContainer = document.querySelector('.modal-container')

    const closeButton = document.querySelector('#modal-close-btn')
    closeButton.addEventListener('click', (e) => {
        modalContainer.remove()
    })  
    addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            modalContainer.remove() 
        }
    })
    addEventListener('click', (e) => {
        if(e.target.parentElement === body) {
            modalContainer.remove() 
        }
    })
    }
})

// format cell phone numbers
// (xxx) xxx-xxxx

function formatPhoneNums(phone) {
    const number = phone.split('').filter(item => {
        return Number.isInteger(+item) && item !== ' '
    }).join('')
    const expression = /(\d{3})(\d{3})(\d{4})/
    return number.replace(expression, '($1) $2-$3')
}


// format birthdates
// mm/dd/yyyy

function formatBirthdates(date) {
    const removeSpaces = /\D+/g
    date = date.replace(removeSpaces, '')
    date = date.slice(0, 8)
    const dateFormat = /(\d{4})(\d{2})(\d{2})/
    return date.replace(dateFormat, '$2/$3/$1')
}

// call fetchUsers()
fetchUsers()