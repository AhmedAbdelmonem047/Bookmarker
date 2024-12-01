// ----------All variables---------- //
var siteName = document.getElementById("siteName");
var siteURL = document.getElementById("siteURL");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
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
        Swal.fire({
            title: "Added!",
            text: "The bookmark has been added successfully",
            icon: "success"
        });

        bookmarkList.push(bookmark);
        clearInputs();
        saveToLocalStorage();
        displayBookmarks();
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
        e.preventDefault();
        if (updateBtn.classList.contains('d-none'))
            addBookmark();
        else if (addBtn.classList.contains('d-none'))
            updateBookmark();
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
                    <i class="fas fa-globe pe-2"></i>Visit
                </button>
            </td>
            <td>
                <button class="btn modify-btn" data-index="${i}">
                    <i class="fas fa-cog pe-2"></i>Modify
                 </button>
            </td>
            <td>
                <button class="btn delete-btn" data-index="${i}">
                    <i class="far fa-trash-alt pe-2"></i>Delete
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
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            bookmarkList.splice(index, 1);
            saveToLocalStorage();
            displayBookmarks();
            clearInputs();
            if (!updateBtn.classList.contains('d-none')) {
                updateBtn.classList.add('d-none');
                addBtn.classList.remove('d-none');
            }
            Swal.fire({
                title: "Deleted!",
                text: "The bookmark has been deleted.",
                icon: "success"
            });
        }
    });
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
    siteName.classList.remove('is-invalid');
    siteURL.classList.remove('is-invalid');
}

// updates the bookmark and saves it
function updateBookmark() {
    if ((validate(siteName, nameRegex) && validate(siteURL, urlRegex) && checkDuplication()) || (siteName.value == bookmarkList[globalIndex].name) && validate(siteURL, urlRegex)) {
        Swal.fire({
            title: "Updated!",
            text: "The bookmark has been updated successfully",
            icon: "success"
        });
        bookmarkList[globalIndex].name = siteName.value;
        bookmarkList[globalIndex].url = siteURL.value;
        saveToLocalStorage();
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


// ----------Opening the modal box---------- //
function openModalBox() {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        html: `
        <h5 class="py-1">Something went wrong!</h5>
        <span>Rules:</span>
        <ul class="rules pt-3 list-unstyled ">
            <li>
                <p>No Duplicates</p>
            </li>
            <li>
                 <p>Site name must contain at least 3 characters</p>
            </li>
            <li>
                <p>Site URL must be a valid one (with or without "https://")</p>
            </li>
        </ul>
      `,
    });
}
// --------------------------------------- //