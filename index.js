let slider = document.getElementById('slider')
let prevImage = document.getElementById('prev-slider')
let nextImage = document.getElementById('next-slider')
let prevImageButton = document.getElementById('prev-button')
let nextImageButton = document.getElementById('next-button')
let statisticBlock = document.getElementById('static-block')

let currentCarouselSlide = document.getElementsByClassName('current')[0]
let nextCarouselSlide = document.getElementsByClassName('next')[0]
let prevCarouselSlide = document.getElementsByClassName('prev')[0]

let nextImageCarouselButton = document.getElementById('next-button_carousel')
let prevImageCarouselButton = document.getElementById('prev-button_carousel')
let closePopUp = document.getElementById('close-popup')
let contactBar = document.getElementById('contact-bar')
let isVisibleContactBar = false

let currentSlide = 0
let currentCarouselImgIndex
let idOfSetTiomeout
let content

let moreLessPriceButton = document.getElementById('more-less-button')

fetch(`${window.location.origin}/content.json`, {
    method: 'GET'
}).then(response => {
    if (!response.status === 200) {
        throw new Error('Oops! Something got broken')
    } else {
        return response.json()
    }
}).then(body => {
    content = body
    startAnimation()
    window.addEventListener('scroll', scrollController)
    scrollController()
    setGallery(content.gallery)
    fillPrice(content.pricing)

    document.getElementById('about-info__heading').textContent = content.aboutMe.heading
    document.getElementById('about-info__article').innerHTML = content.aboutMe.article
})

window.onscroll = () => {

    if (document.getElementById('slide__refer-button').getBoundingClientRect().bottom <= 0) {
        if (!isVisibleContactBar) {
            changeContactBarVisibility('contact-bar--hidden', 'contact-bar--visible', true)
        }
    } else {
        if (isVisibleContactBar) {
            changeContactBarVisibility('contact-bar--visible', 'contact-bar--hidden', false)
        }
    }
}

function changeContactBarVisibility(removeClass, addClass, booleanVisibilityValue) {
    contactBar.classList.remove(removeClass)
    contactBar.classList.add(addClass)
    isVisibleContactBar = booleanVisibilityValue
}


nextImageButton.onclick = () => {
    clearTimeout(idOfSetTiomeout)
    changeSliderData(true)
    setTimer()
}

prevImageButton.onclick = () => {
    clearTimeout(idOfSetTiomeout)
    changeSliderData(false)
    setTimer()

}

moreLessPriceButton.onclick = (event) => {
    let offset = window.pageYOffset
    let heightOfColumn = document.getElementById('more-less').offsetHeight

    let hiddenColumn = document.getElementsByClassName('pricing__column')[1]
    hiddenColumn.classList.toggle('pricing__column--colapsed')
    hiddenColumn.classList.toggle('pricing__column--expanded')

    // event.target.textContent = event.target.textContent === 'more' ? 'less' : 'more'
    if (event.target.textContent === 'more') {
        event.target.textContent = 'less'
    } else {
        event.target.textContent = 'more'
        window.scrollTo(0, offset - heightOfColumn)
    }
}

nextImageCarouselButton.onclick = (event) => { slideCarousel(true, event.target) }
prevImageCarouselButton.onclick = (event) => { slideCarousel(false, event.target) }
closePopUp.onclick = openPopUp

function animate() {

    prevImage.animate([
        { opacity: 1 },
        { opacity: 0 }
    ], 500);
    nextImage.animate([
        { opacity: 0 },
        { opacity: 1 }
    ], 500);
}



function changeSliderData(direction) {
    let nextSlide = defineNextIndex(direction, currentSlide, content.slides)

    changeBGImage(currentSlide, content.slides, prevImage)
    changeBGImage(nextSlide, content.slides, nextImage)

    fillSliderText('prev', currentSlide, content.slides)
    fillSliderText('next', nextSlide, content.slides)

    currentSlide = nextSlide

    animate()
}

function defineNextIndex(direction, currentIndex, array) {
    return direction ? (currentIndex + 1) % array.length : ((currentIndex - 1) + array.length) % array.length

}


function changeBGImage(index, arrayOfResources, block) {
    block.style = `background-image:url('${arrayOfResources[index].imageUrl}')`
}

function setImageSRC(index, arrayOfResources, block) {
    block.setAttribute('src', `${arrayOfResources[index].imageUrl}`)

}


function fillSliderText(id, slideIndex, slides) {
    let title = document.getElementById(`${id}-slide__title`)
    title.textContent = slides[slideIndex].title
    let subTitle = document.getElementById(`${id}-slide__sub-title`)
    subTitle.textContent = slides[slideIndex].subTitle
    let description = document.getElementById(`${id}-slide__description`)
    description.textContent = slides[slideIndex].description

}


function startAnimation() {
    changeSliderData(true)
    setTimer()

}
function setTimer() {
    idOfSetTiomeout = setTimeout(() => {
        startAnimation()
    }, 6000);
}


function animateStatistic(amount) {
    let statisticBlocks = document.getElementsByClassName('static-element__amount')
    let counts = Array(statisticBlocks.length)
    for (let i = 0; i < counts.length; i++) { counts[i] = 0 }
    let currentStep = 0
    let maxStep = 100
    let interval = setInterval(() => {
        if (currentStep <= maxStep) {
            for (let i = 0; i < statisticBlocks.length; i++) {
                {
                    statisticBlocks[i].textContent = `${Math.round(counts[i])}`
                    counts[i] += amount[i] / maxStep
                }
            }
            currentStep++
        } else {
            clearInterval(interval)
        }
    }, 0)
}



function scrollController() {
    if (statisticBlock.getBoundingClientRect().bottom - (statisticBlock.offsetHeight * 2 / 3) <= window.innerHeight) {
        animateStatistic(content.statisticBlocks)
        window.removeEventListener('scroll', scrollController)
    }
}


function changePositionClasses(direction) {
    let slides = ['prev', 'current', 'next']
    slides.forEach((slideName, index) => {
        let newSlideName = slides[defineNextIndex(!direction, index, slides)]
        let slide = document.getElementById(`${slideName}_carousel_slide`)
        slide.classList = `slider__slide ${newSlideName}`
    })
    slides.forEach((item) => {
        document.getElementsByClassName(`${item}`)[0].id = `${item}_carousel_slide`
    })

    currentCarouselSlide = document.getElementsByClassName('current')[0]
    nextCarouselSlide = document.getElementsByClassName('next')[0]
    prevCarouselSlide = document.getElementsByClassName('prev')[0]

}

function slideCarousel(direction, button) {
    button.setAttribute('disabled', 'true')

    direction ? setMovementClassesToCarouselSliders('left', direction) : setMovementClassesToCarouselSliders('right', direction)

    currentCarouselImgIndex = defineNextIndex(direction, currentCarouselImgIndex, content.gallery)


    if (direction) {
        changeBGImage(defineNextIndex(direction, currentCarouselImgIndex, content.gallery), content.gallery, prevCarouselSlide)

    } else {
        changeBGImage(defineNextIndex(direction, currentCarouselImgIndex, content.gallery), content.gallery, nextCarouselSlide)

    }

    setTimeout(() => {
        changePositionClasses(direction)
        button.removeAttribute('disabled')
    }, 300);
}


function setMovementClassesToCarouselSliders(directionString, direction) {

    currentCarouselSlide.classList.add(`${directionString}_current`)

    nextCarouselSlide.classList.add(`${directionString}_next`)

    prevCarouselSlide.classList.add(`${directionString}_prev`)

    let frontSlide = direction ? nextCarouselSlide : prevCarouselSlide

    frontSlide.classList.add('front-on')

}



function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove()
    }
}




// function fillGalleryImages(imagesURLArray) {
//     let images = [...document.getElementsByClassName('gallery__img')]
//     images.forEach((item, index) => {

//     })
// }

function setGallery(imagesURLArray) {
    let items = [...document.getElementsByClassName('gallery__item')]
    items.forEach((item, index) => {
        let image = item.getElementsByClassName('gallery__img')[0]
        setImageSRC(index, imagesURLArray, image)

        item.onclick = () => {
            currentCarouselImgIndex = index
            changeBGImage(currentCarouselImgIndex, content.gallery, currentCarouselSlide)

            changeBGImage(defineNextIndex(true, currentCarouselImgIndex, content.gallery), content.gallery, nextCarouselSlide)
            changeBGImage(defineNextIndex(false, currentCarouselImgIndex, content.gallery), content.gallery, prevCarouselSlide)

            openPopUp()

        }
    })
}


function openPopUp() {
    document.getElementsByTagName('body')[0].classList.toggle('stopScroll');
    document.getElementById('popup').classList.toggle('display-flex')
}

function fillPrice(pricing) {
    let priceColumns = [...document.getElementsByClassName('pricing__column')]
    let devideIndex = pricing.length % 2 === 0 ? pricing.length / 2 : Math.ceil(pricing.length / 2)
    let arrayOfPriceArrays = [pricing.slice(0, devideIndex), pricing.slice(devideIndex, pricing.length)]
    // pricing.forEach((item, index) => {
    //     index % 2 === 0 ? arrayOfPriceArrays[0].push(item) : arrayOfPriceArrays[1].push(item)
    // })
    priceColumns.forEach((column, index) => {
        arrayOfPriceArrays[index].forEach((priceObject) => {
            column.innerHTML += `<div class="pricing__column-item">
            <h5 class="column-item__heading">${priceObject.title}</h5>
            <p class="column-item__price">${priceObject.price}</p>
            </div>`
        })
    })
}

