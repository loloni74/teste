let datas = document.getElementsByTagName("data");
const data = JSON.parse(datas[0].innerHTML);
const query = JSON.parse(datas[1].innerHTML);
localStorage.removeItem('starred')
if (!localStorage.getItem('starreds')){
  localStorage.setItem('starreds', JSON.stringify([{src:'placeholder'}]))
}

console.log(JSON.parse(localStorage.getItem('starreds')))


import htmlBuilder from "./generalUse/htmlBuilder.js";
String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

class page {
  constructor() {
    this.DOMImageBoard = document.getElementById("imageBoard");
    this.renderPosts("r34");

  }
  renderPosts(source) {
    let contador = 1
    data.forEach((element) => {
      let div = document.createElement("div");
      let figure = document.createElement("figure");
      let figCaption = document.createElement("figcaption");
      let star = document.createElement('span')
      let img = document.createElement("img");
      img.alt = 'HentaiImage'

      contador++
      div.setAttribute("imgCounter",contador)

      img.id = element.id;
      figCaption.innerHTML = element.score;
      figure.style.display = "none";

      star.classList.add("fa")
      star.classList.add("fa-star")
      star.classList.add("star")

      let beforeStarredList = JSON.parse(localStorage.getItem('starreds'))
      star.onclick = ()=>{
        star.classList.add('clicked')
        let currentStarredList = JSON.parse(localStorage.getItem('starreds'))
        currentStarredList.push(r34.src(element))
        localStorage.setItem('starreds',JSON.stringify(currentStarredList))
        console.log(JSON.parse(localStorage.getItem('starreds')))
      }
      for (let x=0; x< beforeStarredList.length;x++){

        if (r34.src(element).src == beforeStarredList[x].src){
          star.classList.add('clicked')
          star.onclick = ()=>{
            star.classList.remove('clicked')
            let currentStarredList = JSON.parse(localStorage.getItem('starreds'))
            for(let x = 0; x<currentStarredList.length; x++){
              console.log(currentStarredList[x])
              console.warn(r34.src(element))
              if(currentStarredList[x].src == r34.src(element).src){
                currentStarredList.splice(x,1)
                console.log(currentStarredList)
              }
            }
            localStorage.setItem('starreds',JSON.stringify(currentStarredList))
            console.log(JSON.parse(localStorage.getItem('starreds')))
          }
        }
      }
      
      if (source === "r34") {
        var { file_Src, src, classe } = r34.src(element);
        if (true){
          img.onerror = r34.imgErrorFix(img);
        }
      }

      img.setAttribute("file_Src", file_Src);

      let load = document.createElement("img")
      load.setAttribute('file_Src',file_Src)
      load.onerror = r34.imgErrorFix(load)
      load.style.width = '0px'
      load.style.height = '0px'
      document.getElementById('imgLoadCache').appendChild(load)
      document.getElementById('imgLoadCache').style.display = 'none'

      img.src = src;
      figure.classList.add(classe);

      img.onload = () => {
        img.classList.add("imgCarregada");
        figure.style.display = "block";
      };
      img.onclick = () => {
        modalMedia.openModal(element.id);
        console.log(element)
      };
      img.classList.add("imagemDoCatalogo");

      figure.appendChild(img);
      figCaption.appendChild(star)
      figure.appendChild(figCaption);
      div.appendChild(figure);
      this.DOMImageBoard.appendChild(div);
    });
  }
}
class r34 {
  constructor() {}
  src(element) {
    let ext = element.extension;
    let src, classe;
    if (ext === "webm" || ext === "mp4") {
      src = element.preview_url;
      classe = "figureVideo";
    } else if (ext === "gif") {
      src = "/image?url=" + element.preview_url.replace(".xxx", ".xxx/");
      classe = "figureGif";
    } else {
      src = "/image?url=" + element.preview_url.replace(".xxx", ".xxx/");
      classe = "figureImage";
    }
    if (src[src.length - 1] === "/") {
      src = src.slice(0, -1);
    }
    return {
      file_Src: "/image?url=" + element.sample_url.replace('.xxx','.xxx/'),
      src: src,
      classe: classe
    };
  }
  imgErrorFix(img) {
    return () => {
      console.error('IMAGEM DEU ERRO')
      console.log(img.src)
      let parent = img.parentElement;
      img.onerror = () => {
        img.src = img.src + "?" + img.id;
        img.onerror = () => {
          if (parent.noneName == 'figure'){
            parent.style.display = "none";
          }
          img.onerror = null;
          console.warn(img.src);
        };
      };
      img.src = img.src.replace("https://us.", "https://img.");
    };
  }
}
// Modal class
class modalMedia {
  constructor() {
    this.DOMmodal = document.getElementById("modalMedia");
    this.DOMmodalContent = document.getElementById("modalMediaContent");
    this.actualId = 0;

    this.listaDeImagens = [];
    this.idAtual = 0;
    this.modalOn = false;
    this.atualizarLista();
  }
  atualizarLista() {
    this.listaDeImagens = [];
    Array.from(document.querySelectorAll(".imgCarregada")).forEach(
      (element) => {
        if (element.style.display !== "none") {
          this.listaDeImagens.push(element);
        }
      }
    );
  }
  openModal(id) {
    this.atualizarLista();
    console.log("Apresentation opened");
    this.modalOn = true;
    this.DOMmodal.style.display = "flex";
    this.changeImageModal(id);
  }

  searchForElement(id) {
    var result = {
      element: "",
      dados: "",
    };
    this.listaDeImagens.forEach((element) => {
      if (element.id == id) {
        data.forEach((dado) => {
          if (dado.id === id) {
            result.dados = dado;
          }
        });
        result.element = element;
      }
    });
    return result;
  }
  changeImageModal(id) {
    this.DOMmodal.innerHTML = ''
    let modalContent = document.createElement('div')
    modalContent.id ='modalMediaContent'
    this.DOMmodal.appendChild(modalContent)
    this.DOMmodalContent = document.getElementById("modalMediaContent");
    this.atualizarLista();
    this.DOMmodalContent.innerHTML = "";
    let { element, dados } = this.searchForElement(id);
    this.idAtual = dados.id;

    let ext = dados.extension;
    if (ext === "webm" || ext === "mp4") {
      this.createVideo(dados);
    } else {
      this.createImage(element, dados);
    }
  }

  createinfo(dados){
    let info = document.createElement("div");
    info.classList.add("infoContainer");
    let listadetags = dados.tags.split(' ')
    listadetags.pop()
    listadetags.splice(0,1)
    listadetags.forEach(element => {
      let tag = document.createElement('a')
      tag.innerHTML = element
      tag.href = 'https://vitaodelicia.herokuapp.com/r34/posts?quality=0&tags=' + element
      info.appendChild(tag)
      info.appendChild(document.createElement('br'))
    })

    return info
  }

  createVideo(dados) {
    console.log("Opening Video + ", dados);

    let div = document.createElement("div");
    let video = document.createElement("video");
    let source = document.createElement("source");

    div.classList.add("imgContainer");

    source.src =
      "http://" +
      window.location.href.split("/")[2] +
      "/image?url=" +
      dados.file_url.replace(".xxx", ".xxx/");
    console.log(source.src)

    video.controls = "controls";
    video.autoplay = true;

    video.appendChild(source);
    div.appendChild(video);
    this.DOMmodalContent.appendChild(this.createinfo(dados));
    this.DOMmodalContent.appendChild(div);

  }

  createImage(element, dados) {
    console.log("Opening image + ", dados);
    let div = document.createElement("div");
    let img = document.createElement("img");
    let download = document.createElement("a")
    img.alt = 'hentaiImage'

    div.classList.add("imgContainer");
    img.src = element.getAttribute("file_Src")
    download.href = element.getAttribute("file_Src")
    console.log(img.src);
    img.id = element.id;
    img.onerror = r34.imgErrorFix(img);
    download.appendChild(img)
    download.setAttribute("download",dados.id)
    div.appendChild(download);
    this.DOMmodalContent.appendChild(this.createinfo(dados));
    this.DOMmodalContent.appendChild(div);
  }

  nextModal(modalMedia) {
    
    modalMedia.atualizarLista();
    console.log("Next image");
    let listaDeImagens = modalMedia.listaDeImagens;
    let id = modalMedia.idAtual;
    for (let x = 0; x < listaDeImagens.length; x++) {
      if (listaDeImagens[x].id === id) {
        try{
          modalMedia.changeImageModal(listaDeImagens[x + 1].id);
        }catch{
          modalMedia.closeModal(modalMedia)
        }
        
      }
    }
  }
  previusModal(modalMedia) {
    modalMedia.atualizarLista();
    console.log("Previus image");
    let listaDeImagens = modalMedia.listaDeImagens;
    let id = modalMedia.idAtual;
    for (let x = 0; x < listaDeImagens.length; x++) {
      if (listaDeImagens[x].id === id) {
        modalMedia.changeImageModal(listaDeImagens[x - 1].id);
      }
    }
  }

  closeModal(modalMedia) {
    modalMedia.modalOn = false;
    modalMedia.DOMmodal.style.display = "none";
    modalMedia.DOMmodalContent.innerHTML = "";
  }

  setCursor(cursor) {
    this.DOMmodal.style.cursor = cursor;
  }
}
class qualityHandling {
  constructor(){
    var slider = document.getElementById('inputMinQuality')
    var displayQualidade = document.getElementById('displayQualidade')
    slider.oninput = ()=> displayQualidade.innerHTML = slider.value
    slider.onchange = () => this.changeQuality(slider.value)
    this.returnQuality()
  }
  changeQuality(newQuality){
    console.log(tagsHandling.query)
    tagsHandling.query.forEach( element =>{
      if (element[0] == "quality") {
        element[1] = newQuality
      }
    })
    tagsHandling.updateApply()
  }
  returnQuality(){
    tagsHandling.query.forEach (element =>{
      if (element[0] == "quality"){
        displayQualidade.innerHTML = element[1]
        document.getElementById('inputMinQuality').setAttribute('value', element[1])
      }
    })
  }
}


class tagsHandling {
  constructor() {
    this.DOMtags = document.getElementById("tagsSection");
    this.query = htmlBuilder.objToList(query);
    console.log(this.query)

    this.renderTags();

    document.getElementById("addTag").onclick = () => {
      this.addTagFromInput();
    };
    document.getElementById("tagInputForm").onsubmit = (event) => {
      event.preventDefault();
      this.addTagFromInput();
    };
    this.updateNextPrevius();
  }

  addTag(tagName, tagContent) {
    let formatedTagName = tagName.toString().trim();
    let formatedTagContent = tagContent.toString().replace(" ", "+");

    let alreadyHave = this.query.some((element) => {
      return element[0] == formatedTagName;
    });
    if (alreadyHave) {
      this.query.forEach((element) => {
        if (element[0] == formatedTagName) {
          element[1] = formatedTagContent;
        }
      });
    } else {
      this.query.push([formatedTagName, formatedTagContent]);
    }
    console.log(this.query);
  }

  updateApply() {
    let applyButton = document.getElementById("applySearchQuery");
    applyButton.style.display = "flex";
    this.addTag("pid", "0");
    applyButton.firstElementChild.href = this.getFullUrl();
  }
  updateNextPrevius() {
    let pageNumber = document.getElementById("pageNumber");
    let next = document.getElementById("nextLink");
    let previus = document.getElementById("previusLink");
    this.query.forEach((element) => {
      if (element[0] === "pid") {
        pageNumber.innerHTML = element[1];
        if (element[1] == "0") {
        }
        element[1] = parseInt(element[1]) + 1;
      }
    });
    next.href = this.getFullUrl();
    this.query.forEach((element) => {
      if (element[0] === "pid") {
        element[1] = parseInt(element[1]) - 2;
        if (element[1] == -1) {
          element[1] = 0;
          previus.style.pointerEvents = "none";
          previus.children[0].backgroundColor = "grey";
        } else {
          previus.href = this.getFullUrl();
        }
      }
    });
  }

  getFullUrl() {
    let url = htmlBuilder.build(this.getBaseUrl(), this.query);
    return url;
  }
  getBaseUrl() {
    let rawUrl = window.location.href;
    return rawUrl.slice(0, rawUrl.indexOf("?"));
  }

  deleteTag(tag) {
    this.query.forEach((element) => {
      if (element[0] == "tags") {
        console.log(element[0]);
        element[1] = element[1].replace(" " + tag, "");
        element[1] = element[1].replace(tag, "");
      }
    });
    this.renderTags(true);
  }
  addTagFromInput() {
    let input = document.getElementById("domTagInput");
    let tag = input.value;
    if (input.value !== "") {
      this.query.forEach((element) => {
        if (element[0] == "tags") {
          element[1] = element[1] + " " + tag;
        }
      });
    }
    input.value = "";
    this.renderTags(true);
  }
  renderTags(iHaveToRender) {
    let tags;
    this.query.forEach((element) => {
      if (element[0] == "tags") {
        tags = element[1];
      }
    });
    tags = tags.split(" ");
    this.DOMtags.innerHTML = "";
    tags.forEach((element) => {
      if (element != "") {
        let tag = document.createElement("span");
        let tagName = document.createElement("span");
        let tagDelete = document.createElement("a");
        tagName.innerHTML = element;
        tagName.classList.add("tagName");
        tagDelete.classList.add("tagDelete");

        tagDelete.innerHTML = "-";
        tagDelete.onclick = () => {
          this.deleteTag(element);
        };

        tag.appendChild(tagName);
        if (element == 'sort:score:desc'){
          document.getElementById('turnToBest').style.display = 'none';
        }
        tag.appendChild(tagDelete);

        this.DOMtags.appendChild(tag);
      }
    });
    if (iHaveToRender) {
      this.updateApply();
    }
  }
}

// Setting the r34 class
r34 = new r34();

// Page image loading setup
page = new page();

// Tags system loading
tagsHandling = new tagsHandling();

// Tags system loading
qualityHandling = new qualityHandling();

// Creating the page dynamically
modalMedia = new modalMedia();

// Setting up the modal open on click function
window.onclick = function (event) {
  if (event.target == modalMedia.DOMmodal) {
    modalMedia.closeModal(modalMedia);
  }
};

//Modal mouse configuration
window.onmouseover = function (event) {
  if (event.target == modalMedia.DOMmodal) {
    modalMedia.setCursor("crosshair");
  } else {
    modalMedia.setCursor("default");
  }
};

document.addEventListener("keydown", (event) => {
  let key = event.key;
  let events = {
    Right: modalMedia.nextModal,
    ArrowRight: modalMedia.nextModal,
    Left: modalMedia.previusModal,
    ArrowLeft: modalMedia.previusModal,
    Esc: modalMedia.closeModal,
    Down: modalMedia.closeModal,
    ArrowDown: modalMedia.closeModal,
    Up: modalMedia.closeModal,
    ArrowUp: modalMedia.closeModal,
    Escape: modalMedia.closeModal,
  };
  if (modalMedia.modalOn && events[key]) {
    events[key](modalMedia);
  }
});

document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);
var initialX = null;
var initialY = null;
function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
}
function moveTouch(e) {
  if (initialX === null) {
    return;
  }
  if (initialY === null) {
    return;
  }
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
  
  console.log(diffX, diffY)
  if (Math.abs(2*diffX) > Math.abs(diffY)-5) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
      modalMedia.nextModal(modalMedia);
    } else if(diffX < 0) {
      // swiped right
      console.log("swiped rigth");
      modalMedia.previusModal(modalMedia);
    }
  }else{
      modalMedia.closeModal(modalMedia)
  }
  initialX = null;
  initialY = null;
}


// Load images at cache
window.onload = ()=>{
  loadAllImagesAtCache()
}

function loadAllImagesAtCache(){
  let allImages = document.getElementById('imgLoadCache').children
  for (let x = 0; x < allImages.length; x++){
    let element = allImages[x]
    loadImage(element)
    
  }
}

function loadImage(element){
  if (element.getAttribute('file_Src').endsWith('.png') || element.getAttribute('file_Src').endsWith('.jpg') || element.getAttribute('file_Src').endsWith('.jpeg')){
    element.src = element.getAttribute('file_Src')
  }
}

let best = document.getElementById('turnToBest')
best.href = tagsHandling.getFullUrl().replace('tags=','tags=sort:score:desc+')
best.innerHTML = 'Sort By Best';