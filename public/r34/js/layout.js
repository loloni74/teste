function hamburguerW3(x) {
    x.classList.toggle("change");
    document.getElementById('mobileNavModal').classList.toggle('activeMobileNav')
}


// Changing the color acordding the page
var url = window.location.href || document.URL
url = url.split('/')
url = url[url.length-1]
possible = document.getElementsByClassName('possibleSelected')
Array.from(possible).map((eita) =>{
    if (eita.innerHTML.toLowerCase()  === url.split('?')[0]){
        eita.classList.add('selected')
    }
})
