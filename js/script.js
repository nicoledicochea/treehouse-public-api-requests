const users = []
const gallery = document.querySelector('#gallery')
const body = document.querySelector('body')

// get and display 12 random users with US nationality from randomuser.me 
const url = 'https://randomuser.me/api/?nat=us&results=12'

// create fetch request function
async function fetchUsers() {
    try {
        const response = await fetch(url)
        const data = await response.json()
        generateGallery(data.results)
    } catch(error) {
        console.error(error)
    }
}

// return gallery card HTML
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

// return modal card HTML
function createModalCard(data) {
    return `<div class="modal-container">
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${data.picture.large}" alt="${data.name.first} ${data.name.last} profile picture">
            <h3 id="${data.name.first}" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="modal-text">${data.email}</p>
            <p class="modal-text cap">${data.location.city}</p>
            <hr>
            <p class="modal-text">${formatPhoneNums(data.cell)}</p>
            <p class="modal-text">123 ${data.location.street.name}, ${data.location.city}, ${data.location.state}, ${data.location.postcode}</p>
            <p class="modal-text">Birthday: ${formatBirthdates(data.dob.date)}</p>
        </div>
    </div>
    </div>`
}

// add gallery cards to the DOM
function generateGallery(data) {
    gallery.insertAdjacentHTML('beforeend', data.map(person => {
        // add each person object to galleryCards array
        if(users.length < 12) {
            users.push(person)
        }
        return createGalleryCard(person)
    }).join('')) 
}

// create event listener on gallery container
gallery.addEventListener('click', (e) => {
    const cardClicked = e.target.closest('.card')
    // ensure only gallery card selected
    if(cardClicked) {
        // find card that was clicked
        const data = users.find(person => {
            const cardName = cardClicked.querySelector('h3').id
            return cardName === person.name.first
        })

    // create modal card
    const card = createModalCard(data)

    // add modal HTML to the DOM
    gallery.insertAdjacentHTML('beforebegin', card)

    // add close modal functionality 
    const modalContainer = document.querySelector('.modal-container')
    const closeButton = document.querySelector('#modal-close-btn')
    // close modal when close button clicked
    closeButton.addEventListener('click', (e) => {
        modalContainer.remove()
    })  
    // close modal when escape key used
    addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            modalContainer.remove() 
        }
    })
    // close modal when outside of modal container clicked
    addEventListener('click', (e) => {
        if(e.target.parentElement === body) {
            modalContainer.remove() 
        }
    })
    }
})



// reference for help with regex for formatting
// Sean Bright's answer to this:
// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
const notDigits = /[\D]+/g

// format cell phone numbers
// (xxx) xxx-xxxx
function formatPhoneNums(phone) {
    phone = phone.replace(notDigits, '')
    const phoneFormat = /(\d{3})(\d{3})(\d{4})/
    return phone.replace(phoneFormat, '($1) $2-$3')
}

// format birthdates
// mm/dd/yyyy
function formatBirthdates(date) {
    date = date.replace(notDigits, '')
    date = date.slice(0, 8)
    const dateFormat = /(\d{4})(\d{2})(\d{2})/
    return date.replace(dateFormat, '$2/$3/$1')
}

// call fetchUsers()
fetchUsers()

// create and append elements needed for search bar
const searchContainer = document.querySelector('.search-container')

// const form = document.createElement('form')
// form.action = '#'
// form.method = 'GET'

const searchInput = document.createElement('input')
searchInput.type = 'search'
searchInput.id = 'search-input'
searchInput.classList.add('search-input')
searchInput.placeholder = 'Search...'

const searchSubmit = document.createElement('input')
searchSubmit.type = 'submit'
searchSubmit.id = 'search-submit'
searchSubmit.classList.add('search-submit')

searchContainer.appendChild(searchInput)
searchContainer.appendChild(searchSubmit)
// searchContainer.appendChild(form)

// create search function
function searchUsers(searchTerm) {
    const filteredUsers = users.filter(user => {
        const firstName = user.name.first.toLowerCase()
        const lastName = user.name.last.toLowerCase()
        return firstName.includes(searchTerm) || lastName.includes(searchTerm)
    })
    if (filteredUsers.length === 0) {
        const h2 = document.createElement('h2')
        h2.innerText = 'No results found.'
        gallery.appendChild(h2)
    } else {
        generateGallery(filteredUsers)
    }
}
// clear gallery cards from DOM
function removeGalleryCards() {
    while(gallery.lastElementChild) {
        gallery.lastChild.remove()
    }
}
// add change event to search input
searchInput.addEventListener('keyup', (e) => {
    removeGalleryCards()
    searchUsers(e.target.value.toLowerCase())
})
// add click event to search submit button
searchSubmit.addEventListener('click', (e) => {
    removeGalleryCards()
    searchUsers(searchInput.value)
})

