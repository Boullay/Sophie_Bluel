const gallery = document.querySelector('.gallery');
const listWorks = document.querySelector('.list_works');
let works = [];
let worksFiltered = [];

async function CategoriesId() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
    
        categories.map((category) => {
            const categoryItem = document.createElement('button');
            categoryItem.textContent = category.name
            categoryItem.className = 'btn_filtre';
            categoryItem.dataset.id = category.id;
            const projects = document.querySelector('.projects');
            projects.appendChild(categoryItem);

            const categoryModal = document.querySelector("#categorie");
            const option = document.createElement('option');
            option.textContent = category.name;
            option.value = category.id
            categoryModal.appendChild(option);
        })
    } catch (error) {
        console.log(error);
    }
}

CategoriesId();

async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const worksData = await response.json();
        works = worksData;
        worksFiltered = worksData;

        displayworks();
        filtrecategory();
        displayModal();
    } catch (error) {
        console.log(error);
    }
}

getWorks();

function filtrecategory() {
    const projects = document.querySelectorAll('.btn_filtre')
    projects.forEach((project) => project.addEventListener("click", () => {
        projects.forEach(project2 => project2.classList.remove("active"))
        project.classList.add("active");
        
        if (project.classList.contains("all")) {
            worksFiltered = works
        } else {
            worksFiltered = works.filter(work => work.categoryId == project.dataset.id)
        }
        gallery.innerHTML = "";
        displayworks();
    }))
}

function displayworks() {
    gallery.innerHTML = '';
    listWorks.innerHTML = '';
    worksFiltered.map((work) => {
        // HomePage
        const workItem = document.createElement('figure');
        workItem.dataset.id = work.id;
        workItem.innerHTML = `<img src=${work.imageUrl} alt=${work.title}>
            <figcaption>${work.title}</figcaption>`
        gallery.appendChild(workItem);
        // Modal
        const workItemModal = document.createElement('div');
        workItemModal.dataset.id = work.id;
        workItemModal.innerHTML = `<img src=${work.imageUrl} alt=${work.title}>
            <span id="trash" class="delete-work" data-id=${work.id}><i class="fa-solid fa-trash-can"></i></span>
            <span>Editer</span>`
        listWorks.appendChild(workItemModal)
    })
}

const login = document.getElementById("login");
const module = document.getElementById("module");
const cross = document.querySelectorAll('.cross');
const modale = document.querySelector('#modale');
const edition = document.querySelector('.edition');
const text = document.querySelector('#text');
const blue = document.querySelector('.blue');
const span = document.querySelector('#m');
const span2 = document.querySelector('#m1');
const logout = document.querySelector('#logout');
const btnValid = document.querySelector("#valid");
const validBtn = document.querySelector(".display_form");
const alertM = document.querySelector("#errM");

const photo = document.querySelector('#modulphoto');
const modGallery = document.querySelector('#modulGallery');

function Logout() {
    if (window.localStorage.getItem("accessToken")) {
        const filtre = document.querySelector(".projects");
        filtre.style.display = "none";
        login.style.display = "none";
        logout.addEventListener('click', () => {
            window.localStorage.removeItem('accessToken');
            login.style.display = "block";
            logout.style.display = "none";
            module.style.display = "none";
            edition.style.display = "none";
            filtre.style.display = "flex";
            span.style.display = "none";
            span2.style.display = "none";
        });
    }
}

Logout();

function Login() {
    if(window.localStorage.getItem("accessToken")){
        login.style.display = "none";
        module.style.display = "block";
        edition.style.display = "flex";
    } else {
        module.style.display = "none";
        login.style.display = "block";
        edition.style.display = "none";
        span.style.display = "none";
        span2.style.display = "none";
        logout.style.display = "none";
    }
}
Login();



function displayModal() {
    module.addEventListener("click", () => {
        modale.style.display = "block";
    })
    cross.forEach((closeBtn) => {
        closeBtn.addEventListener("click", () => {
            modale.style.display = "none";
        })
    })
    const arrow = document.querySelector("#arrow");
    arrow.addEventListener("click", () => {
        photo.style.display = "none";
        modGallery.style.display = "flex";
        preview.removeChild(preview.firstChild);
        resetForm();

    })
    const btnphoto = document.querySelector(".green");
    btnphoto.addEventListener("click", () => {
        photo.style.display = "flex";
        modGallery.style.display = "none";
        if (btnValid.classList.contains("green")) {
            btnValid.classList.remove("green");
        }
        alertM.innerHTML = "";
    })
    const deleteBtns = document.querySelectorAll("#trash")
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            deleteFile(btn.dataset.id);
        })
    })
    green();

    validBtn.addEventListener("submit", (e) => {
        e.preventDefault();
        createFile();
        validation();
        if (validation()) {
            resetForm();
        }
    })
}

async function deleteFile(workId) {
    await fetch(
        `http://localhost:5678/api/works/${workId}`,
        {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`}
        },
    ).then((response) => {
        if (response.ok && response.status === 204) {
            works = works.filter(work => work.id != workId);
            const workDiv = document.querySelector(`div[data-id="${workId}"]`);
            const workFigure = document.querySelector(`figure[data-id="${workId}"]`);
            workDiv.remove();
            workFigure.remove();
        }
    })
}

async function createFile() {
    const formData = new FormData();
    const img = document.querySelector('#newimg');
    const title = document.querySelector('#titre');
    const categoryId = document.querySelector('#categorie');

    formData.append('image', img.files[0]);
    formData.append('title', title.value);
    formData.append('category', categoryId.value);

    await fetch('http://localhost:5678/api/works',
        {
            body: formData,
            method: 'POST',
            headers: {'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`}
        }
    ).then((res) => {
        if (res.ok && res.status === 201) {
            return res.json();
        }
    }).then((data) => {
        works.push(data);
        displayworks()
        const workTrashSpan = document.querySelector(`span[data-id="${data.id}"]`);
        workTrashSpan.addEventListener("click", () => {
            deleteFile(workTrashSpan.dataset.id);
        })
    })
}

function resetForm() {
    document.getElementById("titre").value = '';
    document.getElementById("newimg").value = '';
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    text.style.opacity = 1;
    blue.style.opacity = 1;
}

const preview = document.querySelector('#preview');
const input = document.querySelector('input');
const title = document.querySelector('#titre');

input.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    const curFiles = input.files;
    if (curFiles.length === 0) {
    } else {
        for (let i = 0; i < curFiles.length; i++) {
            const image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[i]);
    
            preview.appendChild(image);
            text.style.opacity = 0;
            blue.style.opacity = 0;
        }
    }
}
function validation() {
    const img = document.querySelector('#newimg');

    if(title.value == ""){
        alert("Titre incorrect"); 
        title.focus();
        return false;
    }
    if(!img.files[0] || img.files[0] == ""){

        alertM.innerHTML = "Selectionner une image";
        alertM.className = 'alert';
        preview.focus();
        return false;
    }
    if(title.value != ""){
        photo.style.display = "none";
        modGallery.style.display = "flex";
    }
    return true;
}

function green() {
    const img = document.querySelector('#newimg');
    title.addEventListener("input" , () => {
        if(title.value != "" && img.files[0] != "" && img.files[0]) {
            btnValid.classList.add('green');
        }else{
            btnValid.classList.remove('green');
        }
    })
    img.addEventListener("change", () => {
        if(title.value != "" && img.files[0] != "" && img.files[0]) {
            btnValid.classList.add('green');
        }else{
            btnValid.classList.remove('green');
        }
    })
    validBtn.addEventListener("submit", validation);
}