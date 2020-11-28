let datas = document.getElementsByTagName("data");
const data = JSON.parse(datas[0].innerHTML);
const query = JSON.parse(datas[1].innerHTML);

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
    data.forEach((element) => {
      let div = document.createElement("div");
      let figure = document.createElement("figure");
      let figCaption = document.createElement("figcaption");
      let img = document.createElement("img");

      img.id = element.id;
      figCaption.innerHTML = element.score;
      figure.style.display = "none";

      if (source === "r34") {
        var { src, classe } = r34.src(element);
        img.onerror = r34.imgErrorFix(element, figure);
      }

      img.src = src;
      figure.classList.add(classe);

      img.onload = () => {
        img.classList.add("imgCarregada");
        figure.style.display = "block";
      };
      img.onclick = () => {
        modalMedia.openModal(element.id);
      };
      img.classList.add("imagemDoCatalogo");

      figure.appendChild(img);
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
      src = element.sample_url.splice(22, 0, "/");
      classe = "figureGif";
    } else {
      src = element.sample_url.splice(22, 0, "/");
      classe = "figureImage";
    }

    if (src[src.length - 1] === "/") {
      src = src.slice(0, -1);
    }
    return {
      src: src,
      classe: classe,
    };
  }
  imgErrorFix(element, figure) {
    return () => {
      let img = document.getElementById(element.id);
      let parent = figure;
      img.onerror = () => {
        img.onerror = () => {
          img.onerror = () => {
            parent.style.display = "none";
            console.warn(img.src);
          };
          img.src = "/image?url=" + img.src;
        };
        img.src = img.src.replace("https://us.", "https://img.");
      };
      img.src = img.src + "?" + element.id;
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

    let info = document.createElement("div");
    info.classList.add("infoContainer");
    info.innerHTML = JSON.stringify(dados);
    video.controls = "controls";
    video.autoplay = true;

    video.appendChild(source);
    div.appendChild(video);
    this.DOMmodalContent.appendChild(div);
    this.DOMmodalContent.appendChild(info);
  }

  createImage(element, dados) {
    console.log("Opening image + ", dados);
    let div = document.createElement("div");
    let img = document.createElement("img");

    div.classList.add("imgContainer");
    img.src = element.src;
    div.appendChild(img);

    let info = document.createElement("div");
    info.classList.add("infoContainer");
    info.innerHTML = JSON.stringify(dados);

    this.DOMmodalContent.appendChild(div);
    this.DOMmodalContent.appendChild(info);
  }

  nextModal(modalMedia) {
    modalMedia.atualizarLista();
    console.log("Next image");
    let listaDeImagens = modalMedia.listaDeImagens;
    let id = modalMedia.idAtual;
    for (let x = 0; x < listaDeImagens.length; x++) {
      if (listaDeImagens[x].id === id) {
        modalMedia.changeImageModal(listaDeImagens[x + 1].id);
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

class tagsHandling {
  constructor() {
    this.DOMtags = document.getElementById("tagsSection");
    this.query = htmlBuilder.objToList(query);
    console.log(this.query)

    this.renderTags();

    document.getElementById("addTag").onclick = () => {
      this.addTagFromInput();
    };
    document.getElementById('tagInputForm').onsubmit = (event)=>{
      event.preventDefault()
      this.addTagFromInput()
    }
    this.updateNextPrevius()
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
    this.addTag('pid','0')
    applyButton.firstElementChild.href = this.getFullUrl();
  }
  updateNextPrevius(){
    let pageNumber = document.getElementById('pageNumber')
    let next = document.getElementById('nextLink')
    let previus = document.getElementById('previusLink')
    this.query.forEach(element =>{
      if (element[0] === 'pid'){
        pageNumber.innerHTML = element[1]
        if (element[1] == '0'){
        }
        element[1] = parseInt(element[1])+1
      }
    })
    next.href = this.getFullUrl()
    this.query.forEach(element =>{
      if (element[0] === 'pid'){
        element[1] = parseInt(element[1])-2
        if (element[1] == -1){
          element[1] = 0
          previus.style.pointerEvents = 'none'
        }else{
          previus.href = this.getFullUrl()
        }
      }
    })


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
    Escape: modalMedia.closeModal,
  };
  if (modalMedia.modalOn) {
    events[key](modalMedia);
  }
});

document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
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

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
      modalMedia.nextModal(modalMedia);
    } else {
      // swiped right
      console.log("swiped left");
      modalMedia.previusModal(modalMedia);
    }
  }

  initialX = null;
  initialY = null;
}
