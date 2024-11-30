// ----------All variables---------- //
var siteName = document.getElementById("siteName");
var siteURL = document.getElementById("siteURL");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var closeBtn = document.getElementById("closeBtn");
var modalBoxOverlay = document.querySelector(".overlay");
var bookmarkList;
var visitBtns;
var modifyBtns;
var deleteBtns;
var globalIndex = 0;
// -------------------------------- //


// ----------If local storage isn't empty, display all stored bookmarks---------- //
if (localStorage.getItem("bookmarkList")) {
    bookmarkList = JSON.parse(localStorage.getItem("bookmarkList"));
    displayBookmarks();
}
else {
    bookmarkList = [];
}
// ----------------------------------------------------------------------------- //


// ----------Clear function---------- //
function clearInputs() {
    siteName.value = null;
    siteURL.value = null;
    siteName.classList.remove('is-valid');
    siteURL.classList.remove('is-valid');
}
// ---------------------------------- //


// ----------Save to local storage function---------- //
function saveToLocalStorage() {
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
}
// ------------------------------------------------- //


// ----------Validation function---------- //
// name and url Regex
var nameRegex = /^[a-zA-Z0-9][\w &()]{2,}$/;
var urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/;

// validation function
function validate(input, regex) {
    var flag = false;
    if (regex.test(input.value)) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        flag = true;
    }
    else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
    return flag;
}

siteName.addEventListener('input', () => {
    validate(siteName, nameRegex);
    if (siteName.value === '')
        siteName.classList.remove('is-invalid');
})
siteURL.addEventListener('input', () => {
    validate(siteURL, urlRegex);
    if (siteURL.value === '')
        siteURL.classList.remove('is-invalid');
})
// -------------------------------------- //


// ----------Duplication function---------- //
function checkDuplication() {
    var flag = true;
    for (var i = 0; i < bookmarkList.length; i++) {
        if (bookmarkList[i].name.toLowerCase() == siteName.value.toLowerCase())
            flag = false
    }
    return flag;
}
// ---------------------------------------- //


// ----------Add function for submit button--------- //
function addBookmark() {
    if (validate(siteName, nameRegex) && validate(siteURL, urlRegex) && checkDuplication()) {
        var bookmark = {
            name: siteName.value,
            url: siteURL.value,
        }

        bookmarkList.push(bookmark);
        clearInputs();
        saveToLocalStorage();
        displayBookmarks();
        closeModalBox();
    }
    else {
        openModalBox();
    }
}
// Adding by either clicking the button or pressing enter
addBtn.addEventListener('click', addBookmark);
// Pressing enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addBookmark();
    }
});
// ------------------------------------------------- //


// ----------Display function---------- //
function displayBookmarks() {
    var tableContent = document.getElementById('tableContent');
    tableContent.innerHTML = '';
    var box = ``;
    for (var i = 0; i < bookmarkList.length; i++) {
        box += `
        <tr>
            <td>${i + 1}</td>
            <td class="text-capitalize">${bookmarkList[i].name}</td>
            <td>
                <button class="btn visit-btn" data-index="${i}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                </button>
            </td>
            <td>
                <button class="btn modify-btn" data-index="${i}">
                    <i class="fa-solid fa-trash-can pe-2"></i>Modify
                 </button>
            </td>
            <td>
                <button class="btn delete-btn" data-index="${i}">
                    <i class="fa-solid fa-trash-can pe-2"></i>Delete
                 </button>
            </td>
        </tr>
    `;
    }
    tableContent.innerHTML = box;
    addAllEventListeners();
}
// ----------------------------------- //


// ----------Adds event liseners to all visit and delete buttons---------- //
function addAllEventListeners() {
    // Visit buttons
    visitBtns = Array.from(document.querySelectorAll(".visit-btn"));
    visitBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            visitWebsite(index);
        });
    });
    // Modify buttons
    modifyBtns = Array.from(document.querySelectorAll(".modify-btn"));
    modifyBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            setInputsForUpdate(index);
        });
    });
    // Delete buttons
    deleteBtns = Array.from(document.querySelectorAll(".delete-btn"));
    deleteBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            deleteBookmark(index);
        });
    });
}
// ----------------------------------------------------------------------- //


// ----------Delete bookmark function---------- //
function deleteBookmark(index) {
    bookmarkList.splice(index, 1);
    saveToLocalStorage();
    displayBookmarks();
    console.log(index);
}
// -------------------------------------------- //


// ----------Visit website function---------- //
function visitWebsite(index) {
    var openURL = bookmarkList[index].url;
    if (openURL.includes('https://') || openURL.includes('http://'))
        open(openURL)
    else {
        openURL = 'https://' + openURL;
        open(openURL)
    }
}
// ----------------------------------------- //


// ----------Update Function---------- //
// puts the desired bookmark in the input field to be modified
function setInputsForUpdate(index) {
    globalIndex = index;
    siteName.value = bookmarkList[index].name;
    siteURL.value = bookmarkList[index].url;
    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

// updates the bookmark and saves it
function updateBookmark() {
    if (validate(siteName, nameRegex) && validate(siteURL, urlRegex) && checkDuplication()) {
        bookmarkList[globalIndex].name = siteName.value;
        bookmarkList[globalIndex].url = siteURL.value;
        saveToLocalStorage();
        displayBookmarks();
        clearInputs();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }
    else if ((siteName.value == bookmarkList[globalIndex].name) && (siteURL.value == bookmarkList[globalIndex].url)) {
        displayBookmarks();
        clearInputs();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }
    else {
        openModalBox()
    }
}
updateBtn.addEventListener('click', updateBookmark);
// ----------------------------------- //


// ----------Give each of the 3 circles a different color---------- //
// An array with predefined colors 
const colors = ['#f15f5d', '#febe2e', '#4db748'];
var circles = document.querySelectorAll('.circle');
circles.forEach((circle, index) => {
    circle.style.backgroundColor = colors[index];
});
// --------------------------------------------------------------- //


// ----------Closing the modal box---------- //
// close function
function closeModalBox() {
    modalBoxOverlay.classList.replace('d-flex', 'd-none');
}
// open function
function openModalBox() {
    modalBoxOverlay.classList.replace('d-none', 'd-flex');
}

// Close Button
closeBtn.addEventListener("click", closeModalBox);

// Clicking outside the box (clicking on the overlay)
window.addEventListener('click', (e) => {
    if (e.target === modalBoxOverlay) {
        closeModalBox();
    }
});

// Pressing escape 
window.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape')) {
        closeModalBox();
    }
});
// --------------------------------------- //