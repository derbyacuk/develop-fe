import $ from 'jquery'
import owlCarousel from 'owl.carousel'

let carouselContainers = document.querySelectorAll('.carousel');

for (let i = 0; i < carouselContainers.length; i++) {
  let owlClass = `owl-carousel-${i}`
  let navId = `nextSlide-${i}`;

  let navButton = `<a href="" id="${navId}" class="carousel-control"><i class="uod-icons uod-icons-chevron-right"></i></a>`
  carouselContainers[i].insertAdjacentHTML('afterend', navButton);

  let carousel = carouselContainers[i].querySelector('.owl-carousel');
  carousel.classList.add(owlClass);

  let owl = $('.' + owlClass).owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1.3,
        nav: false,
        loop: true,
        margin: 10
      },
      900: {
        items: 2.8,
        nav: false,
        loop: true,
        margin: 20,
      },
      1200: {
        items: 1.8,
        nav: false,
        loop: true,
        margin: 20,
      },
      1380: {
        items: 2.8,
        nav: false,
        loop: true,
        margin: 20,
      }
    }
  });

  $(`#${navId}`).click((e) => {
    e.preventDefault();
    owl.trigger('next.owl.carousel');
  });
}


/*$("#next").click((e) => {
  e.preventDefault();
  owl.trigger('next.owl.carousel');
})*/