(async function () {
  await populateAccordion();
  await addAccordionEventListeners();
  console.log("Outside", document.querySelectorAll('.card'));
})();

// populateAccordion Function
async function populateAccordion() {
  const accordion = document.getElementById("accordion");

  for (let index = 0; index < magazines.length; index++) {
    const magazineUrl = magazines[index];
    const json = await getJSON(magazineUrl);

    const accordionCarousel = getAccordionCarousel(index, json);
    const accordionItem = getAccordionItem(index, json, accordionCarousel);
    
    accordion.append(accordionItem);
  };
}


// getJSON Function
async function getJSON(url) {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
}


// getAccordionCarousel Function
function getAccordionCarousel(index, json) {
  const accordionCarousel = document.createElement("div");
  accordionCarousel.className = "carousel slide d-flex";
  accordionCarousel.id = `carousel${index}`;
  accordionCarousel.setAttribute("data-bs-ride", "carousel");
  
  accordionCarousel.innerHTML = `
  <button class="carousel-control" type="button" data-bs-target="#carousel${index}" data-bs-slide="prev">
  <i class="fas fa-chevron-left"></i>
  </button>
  
  <div class="carousel-inner">
  </div>
  
  <button class="carousel-control" type="button" data-bs-target="#carousel${index}" data-bs-slide="next">
  <i class="fas fa-chevron-right"></i>
  </button>
  `;
  
  const carouselInner = accordionCarousel.querySelector(".carousel-inner");
  json.items.forEach((item, index) => {
    carouselInner.innerHTML += `
    <div class="carousel-item${index === 0 ? " active" : ""}" data-link="${item.link}">
      <div class="card" data-link="${item.link}">
        <img src="${item.enclosure.link}" class="card-img-top carousel-image w-100" 
        data-link="${item.link}">
        <div class="card-body" data-link="${item.link}">
          <h5 class="card-title fw-bold" data-link="${item.link}">${item.title}</h5>
          <div class="d-flex align-items-center text-muted" data-link="${item.link}">
            <small data-link="${item.link}">${item.author}</small> 
            <div class="mx-2" id="dot" data-link="${item.link}"></div>
            <small data-link="${item.link}">${getDateInIso(new Date(item.pubDate))}</small> 
          </div>
          <p class="card-text" data-link="${item.link}">${item.content}</p>
      </div>
      </div>
    </div>  
    `;
  });
  
  return accordionCarousel;
}


// getDateInIso Function
function getDateInIso(date) {
  const dd = (date.getDate() < 10 ?
    ("0" + date.getDate()) : date.getDate().toString());
  const mm = (date.getMonth().length < 9 ?
    ("0" + (1 + date.getMonth())) : (1 + date.getMonth()).toString());
  const yyyy = date.getFullYear().toString();
  return dd + "/" + mm + "/" + yyyy;
}


// getAccordionItem Function
function getAccordionItem(index, json, accordionCarousel) {
  const accordionItem = document.createElement('div');
  accordionItem.className = "accordion-item border-0 mb-2";
  
  let buttonClassName = "accordion-button-m px-0";
  if (index !== 0) {
    buttonClassName += " collapsed";
  }
  
  let bodyClassName = "accordion-collapse collapse";
  if (index === 0) {
    bodyClassName += " show";
  }
  
  const arrow = (index === 0 ? `<i class="fas fa-angle-up"></i>` : `<i class="fas fa-angle-down"></i>`);
  
  accordionItem.innerHTML = `
  <h6 class="accordion-header" id="heading${index}">
  <button class="${buttonClassName}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
  ${arrow} ${json.feed.title}
  </button>
  </h6>
  
  <div id="collapse${index}" class="${bodyClassName}" aria-labelledby="heading${index}"
  data-bs-parent="#accordion">
  <div class="accordion-body">
  </div>
  </div>
  `;
  
  const accordionBody = accordionItem.querySelector(".accordion-body");
  accordionBody.append(accordionCarousel);

  return accordionItem;
}


// addAccordionEventListeners Function
function addAccordionEventListeners() {
  const accordion = document.querySelector(".accordion");

  accordion.addEventListener("click", eventObj => {
    eventObj.preventDefault();

    const accordionButtonClicked = eventObj.target.className.split(" ").includes("fas") ||
      eventObj.target.className.split(" ").includes("accordion-button-m");
    if (accordionButtonClicked) {
      const accordionButtons = document.querySelectorAll(".accordion-button-m");
      accordionButtons.forEach(accordionButton => {
        const accordionItemCollapsed = accordionButton.className.split(" ").includes("collapsed");
        if (accordionItemCollapsed) {
          accordionButton.firstElementChild.className = "fas fa-angle-down";
        } else {
          accordionButton.firstElementChild.className = "fas fa-angle-up";
        }
      });
    }

    // Inside Accordian Click (WORKING PROPERLY)
    console.log(document.querySelectorAll('.card'));

    const cardClicked = eventObj.target.getAttribute("data-link") !== null;
    if (cardClicked) {
      window.open(eventObj.target.getAttribute("data-link"), "_blank");
    }
  });

  // Outside Accordian Click (NOT WORKING)
  console.log("Inside", document.querySelectorAll('.card'));
}

// console.log("Outside", document.querySelectorAll('.card'));