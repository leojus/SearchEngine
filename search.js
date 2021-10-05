const form = document.querySelector('form');
// Making the buttons accessible to the javascript
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("previous");
// Declaring a varaible to keep count of the current page
let page;
let searchTerm;
let color;

// Code that runs when pressing the "search" button
form.onsubmit = event => {
    searchTerm = form.elements.search_text.value;
    color = form.elements.color_select.value.toLowerCase();
    page = 1;
    event.preventDefault();
    clearList();
    search(searchTerm, color);

};;


// A function clearing the current page before loading a new page
function clearList() {
    let currentDiv = document.getElementById("search_results");
    while (currentDiv.firstChild) {
        currentDiv.removeChild(currentDiv.firstChild);
    }

}

// A function connecting to the api and drawing the page
async function search(search_term, color) {



    const apiKey = "23503426-95c41653fd2b45b3725cf6f10"

    const params = new URLSearchParams({
        key: apiKey,
        q: search_term,
        colors: color,
        per_page: 10,
        page: page
    });

    const response = await fetch('https://pixabay.com/api/?' + params.toString());
    const images = await response.json();


    // Calculating the total number of pages
    const totalPages = Math.ceil(images.totalHits / 10);


    // Checking to see if the "next" and "previous" buttons should be visible/enabled or not
    if (totalPages > 1) {
        document.getElementById("previous").style.display = 'inline';
        document.getElementById("next").style.display = 'inline';

        if (page == 1) {
            const nextButton = document.getElementById("next");
            nextButton.disabled = false;
            const prevButton = document.getElementById("previous");
            prevButton.disabled = true;
        } else if (page < totalPages) {
            const prevButton = document.getElementById("previous");
            prevButton.disabled = false;
            const nextButton = document.getElementById("next");
            nextButton.disabled = false;
        } else {
            const prevButton = document.getElementById("previous");
            prevButton.disabled = false;
            const nextButton = document.getElementById("next");
            nextButton.disabled = true;
        }

    } else {
        document.getElementById("previous").style.display = 'none';
        document.getElementById("next").style.display = 'none';

    }

    // Looping through the api results and putting content on the page
    for (let i = 0; i < 10; i++) {


        // try/catch to stop looping when going through the last page
        try {
            const newDiv = document.createElement("div");

            let img = document.createElement("img");

            img.src = images.hits[i].largeImageURL;
            let src = document.getElementById("img_holder");

            let tags = document.createElement("p");
            tags.textContent = images.hits[i].tags;

            let user = document.createElement("p");
            user.textContent = "Taken by: " + images.hits[i].user;

            newDiv.appendChild(img);
            newDiv.appendChild(tags);
            newDiv.appendChild(user);

            const currentDiv = document.getElementById("search_results");
            currentDiv.appendChild(newDiv);
        } catch {
            break;
        }



    }


    // Code running when pressing the "next" button
    nextButton.onclick = event => {
        page++;
        clearList();
        search(search_term, color);
    }


    // Code running when pressing the "previous" button
    prevButton.onclick = event => {

        page--;
        clearList();
        search(search_term, color);
    }


}
