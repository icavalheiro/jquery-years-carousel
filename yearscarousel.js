import addSwipeListener from "./swipe"

let rtl = false; // = $('html[dir='rtl']').length > 0

//add RTL classes
if(rtl){
    $('.years-carousel').addClass('rtl');
    $('.years-carousel .year i').addClass('rtl');
    $('.year-dots').addClass('rtl');
    $('.years-carousel .year-slides .slide').addClass('rtl');
}

//add the years dots scroller
let dotsBaseX = 0;
let dots = $('.years-carousel .year');
let dotsContainer = $('.year-dots');
let getMaxX = () => {
    return (dotsContainer.width() + 30) - $(window).width();
}

function getCenterPositionForIndex(i){
    let indexOffset = (i * (dots.width() + 100));
    let halfWidth = $(window).width()/2;
    let val = halfWidth - indexOffset;
    return val - 100;
}

function updateDelta(value){
    if(value){
        
        if(rtl) value = -1 * value;

        dotsBaseX -= value; 
    }
    if(dotsBaseX > 0) dotsBaseX = 0;

    if(dotsBaseX < -getMaxX()) dotsBaseX = -getMaxX();

    let prop = 'left';
    if(rtl) prop = 'right';

    dotsContainer.css(prop, dotsBaseX);
}

addSwipeListener(dotsContainer[0], updateDelta, () => {
    dotsContainer.addClass('dont-animate');
}, () => {
    dotsContainer.removeClass('dont-animate');
});

//setup the slides
let currentIndex = 0;
let offset = 0;
let dragOffset = 0;
let slides = $('.year-slides .slide');
let slideWidth = slides.width() + 30;


dots.on('click', function(){
    let dot = $(this);
    let index = 0;
    slides.each(function(i){
        if($(this).attr('data-year') == dot.attr('data-year')){
            index = i;
        }
    })

    currentIndex = index;
    updateIndex();
})

//stop drag on img
slides.find('img').on('dragstart', (e) => e.preventDefault())

function updateSlidesPosition(){
    slides.each(function(index) {
        let slide = $(this);

        let prop = 'left';
        if(rtl) prop = 'right';
        slide.css(prop, ((index * slideWidth) + offset + dragOffset) + 'px')
    });
}

function updateIndex(val){
    if(val){
        currentIndex += val;
    }

    if(currentIndex < 0){
        currentIndex = 0;
    }

    if(currentIndex >= slides.length){
        currentIndex = slides.length -1;
    }

    offset = -(currentIndex * slideWidth);

    let currentSlide = $(slides[currentIndex]);
    let dataYear = currentSlide.attr('data-year');
    
    
    //manage active class
    dots.removeClass('active');
    $('.years-carousel .year[data-year='+dataYear+']').addClass('active');

    slides.removeClass('active');
    currentSlide.addClass('active');

    //set the current scroll on the parallax
    let translate = Math.ceil((currentIndex / slides.length) * 100) +'%';
    if(!rtl) translate = '-' + translate;
    $('.parallax').css('transform', 'translateX(' + translate+')');

    dotsBaseX = getCenterPositionForIndex(currentIndex);
    updateDelta(0);
    updateSlidesPosition();
}

updateIndex();

addSwipeListener($('.year-slides')[0], (delta) => {
    if(rtl){
        dragOffset += delta;
    } else {
        dragOffset -= delta;
    }
    updateSlidesPosition();
}, () => {
    slides.addClass('dont-animate');
}, () => {
    slides.removeClass('dont-animate');
    if(dragOffset > 100){
        updateIndex(-1);
        
    }
    if(dragOffset < -100){
        updateIndex(1)
    }

    dragOffset = 0;
    updateSlidesPosition();
});

$('.left-arrow').on('click', () => {
    updateIndex(-1);
    updateSlidesPosition();
});

$('.right-arrow').on('click', () => {
    updateIndex(1);
    updateSlidesPosition();
});

$(window).on('resize', () => {
    slideWidth = slides.width() + 30;
    updateIndex();
    updateSlidesPosition();
})