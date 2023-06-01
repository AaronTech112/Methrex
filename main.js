const showMenuButton = document.querySelector('.show-menu');
const hideMenuButton = document.querySelector('.hide-menu')
const mobileNavContainer = document.querySelector(".mobile-nav");
const mobileNav = document.querySelector(".mobile-nav-container");
const mobileNavOverlay = document.querySelector('.mobile-nav-blur-overlay');
const findMealModal = document.querySelector(".find-meal-modal");
const successModal = document.querySelector(".success-modal");
const allDownloadButtons = document.querySelectorAll(".download-btn");
const allCloseModalButtons = document.querySelectorAll(".close-modal-icon");
const allAccordion = document.querySelectorAll(".accordion > .top");
const allMobileNavLinks = document.querySelectorAll(".mobile-nav-container > .mobile-links > a");
const tabs = document.querySelectorAll(".tabs > a");
const roles = document.querySelectorAll('.clickable');
const wishListForm = document.querySelector('.wish-list-form');
const successModalButton = successModal.querySelector("button");

successModalButton.addEventListener("click", () => successModal.style.display = 'none')

allDownloadButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    roles.forEach(role => role.querySelector("svg").style.display = "none");
    findMealModal.style.display = "flex"
  })
})

allCloseModalButtons.forEach(btn => {
  btn.addEventListener("click", function(){
    this.parentElement.parentElement.style.display = "none"
  })
})

allMobileNavLinks.forEach(a => {
  a.addEventListener('click', () => {
    setTimeout(() => {
      hideMenu()
    }, 1000)
  })
});

const hideMenu = () => {
  mobileNavOverlay.style.background = "transparent"
  mobileNav.style.right = "-100%"
  mobileNav.addEventListener("transitionend", ()=> {
    mobileNavContainer.style.display = "none"
    mobileNav.removeEventListener("transitionend", hideMenu)
  })
}

// show mobile navigation
showMenuButton.addEventListener("click", ()=>{
  mobileNavContainer.style.display = "block"
  mobileNavOverlay.style.display = "block"
  
  setTimeout(()=> {
    mobileNavOverlay.style.background = "rgba(0, 0, 0, 0.4)"
    mobileNav.style.right = "0"
    mobileNav.addEventListener("transitionend", ()=> {
      mobileNavContainer.style.display = "block"
      mobileNavOverlay.style.display = "block"
    })
  }, 100)
})

mobileNavOverlay.addEventListener('click', hideMenu)

// hide mobile navigation
hideMenuButton.addEventListener("click", hideMenu)

// tabs functionality
tabs.forEach(tab => {
  tab.addEventListener("click", function(e){
    e.preventDefault()
    let selectedTab = e.target.innerText;
    tabs.forEach(tab => tab.classList.remove("active"))
    document.querySelectorAll('.accordions').forEach(accordionGroup => accordionGroup.style.display = "none");
    e.target.classList.toggle("active");
    switch(selectedTab) {
      case 'Homie':
        document.querySelector('.home-accordions').style.display = "block";
        break;
      case 'Buka':
        document.querySelector('.buka-accordions').style.display = "block";
        break;
      case 'Delivery Driver':
        document.querySelector('.driver-accordions').style.display = "block";
        break;
      default:
        document.querySelectorAll('.accordions').forEach(accordionGroup => accordionGroup.style.display = "none");
    }
  })
})

// Accordion funtionality
for(let i = 0; i < allAccordion.length; i++){
  allAccordion[i].addEventListener("click", function(){
    this.parentElement.querySelector("p").classList.toggle("active");
    const isOpen = [...this.parentElement.querySelector("p").classList].includes("active");
    if(isOpen) {
      this.querySelector("img").src = "./assets/images/accordion-minus.svg"
    }else {
      this.querySelector("img").src = "./assets/images/accordion-plus.svg"
    }
  })
}

// form submission
let formData = {
  name: '',
  email: '',
  role: ''
}

function selectRole(e) {
  formData.role = ""
  roles.forEach(role => role.querySelector("svg").style.display = "none");
  const selectedRole = this.querySelector('p').innerText;
  formData.role = selectedRole;
  this.querySelector("svg").style.display = "block";
  console.log(formData)
}

const handleSubmit = (e) => {
  e.preventDefault()
  const name = document.querySelector('.name-data');
  const email = document.querySelector('.email-data');
  formData.name = name.value;
  formData.email = email.value;
  
  fetch('https://staging.homebuka.com/api/v1/waitlists/waitlist', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({full_name: formData.name, email: formData.email, role: formData.role == 'Sell food' ? 'buka' : 'homie'})
  }).then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err.response));

  console.log(formData) // save data to database

  // show success modal
  findMealModal.style.display = "none"
  successModal.style.display = "flex"

  // reset form
  name.value = ""
  email.value = ""
  formData = {
    name: '',
    email: '',
    role: ''
  }
}

roles.forEach(role => role.addEventListener("click", selectRole))
wishListForm.addEventListener("submit", handleSubmit)
