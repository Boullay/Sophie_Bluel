const myImage = document.querySelector('img');

fetch('http://localhost:5678/images/abajour-tahina1651286843956.png').then(function(response) {
    if(response.ok) {
        response.blob().then(function(myBlob) {
            var objectURL = URL.createObjectURL(myBlob);
            myImage.src = objectURL;
        });
    } else {
        console.log('Mauvaise réponse du réseau');
    }
})
console.log(myImage)

const Filtre = new Set();
Filtre.add('Tous');
Filtre.add('Objets');
Filtre.add('Appartements');
Filtre.add('Hotel');

console.log(Filtre);
/*const myImage = document.querySelector('img');

fetch('http://localhost:5678/works').then(function(response) {
    if(response.ok) {
        console.log(response)
        response.blob().then(function(myBlob) {
            var objectURL = URL.createObjectURL(myBlob);
            myImage.src = objectURL;
        });
    } else {
        console.log('Mauvaise réponse du réseau');
    }
})
console.log(myImage)

const blocGallery = document.querySelector('.gallery');

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => works.map((work) => {
        fetch(work.imageUrl).then(function (response) {
            if (response.ok) {
                response.blob().then(function (myBlob) {
                    image = URL.createObjectURL(myBlob);
                    let figure = document.createElement('figure');
                    figure.innerHTML = `<img src=${image}/>
                    <figcaption>${work.title}</figcaption>`
                    const test = document.querySelector('figure img');
                    test.src = image;
                    blocGallery.appendChild(figure)
                });
            } else {
                console.log('Mauvaise réponse du réseau');
            }
        })
    }));*/

           /* worksfilter = project.classList.contains("all")
        ? works
        : works.filter(work => work.category.id == project.dataset.id)*/