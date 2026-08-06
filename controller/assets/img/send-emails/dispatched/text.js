class TextClass {

  constructor() {
    this.contentText = "";
    this.timesText = 3;
    this.spaceBetweenText = 50;
    this.spaceAlongLanyard = 0;
    this.colourText = "black";
    this.fontFamilyText = "sans-serif";
    this.sizeText = 6;
    this.boldText = false;
    this.italicText = false;
    this.underlineText = false;
    this.printableArea = false;
    this.textPosition = 0;


    const textInput = document.getElementById("textInput");
    textInput.addEventListener('input', function() {
      textClass.setContentText(textInput.value);
      previewManual.refreshTextLanyard();
    });


    const printable_area = document.getElementById("printable_area");

    printable_area.addEventListener('click', function() {
      if (printable_area.checked) {
        textClass.setPrintableAreaText(true);
        previewManual.showPrintableAreaText();

        imageClass.setPrintableAreaImage(false);
        previewManual.showPrintableAreaImage();
      } else {
        textClass.setPrintableAreaText(false);
        previewManual.showPrintableAreaText();
      }
    });





    const repeatTextBox = document.getElementById("repeat-text-box");
    const labelRepeatText = document.getElementById("label-repeat-text");

    repeatTextBox.addEventListener("click", function(){
      if (textClass.getTimesText() <=19) {
        textClass.setTimesText(textClass.getTimesText() + 1);
        previewManual.refreshTextLanyard();

      }
    })

    const decreaseTextBox = document.getElementById("decrease-text-box");
    decreaseTextBox.addEventListener("click", function(){
      if (textClass.getTimesText() >=0) {
        textClass.setTimesText(textClass.getTimesText() - 1);
        previewManual.refreshTextLanyard();

      }

    })








    const move_down_text = document.getElementById("move_down_text");
    const move_up_text = document.getElementById("move_up_text");

    move_down_text.addEventListener("click", function(){
      if (textClass.getTextPosition() > -100) {
        textClass.setTextPosition(textClass.getTextPosition() - 0.2);
        previewManual.refreshTextLanyard();
      }

    })


    move_up_text.addEventListener("click", function(){
      if (textClass.getTextPosition() <4) {
        textClass.setTextPosition(textClass.getTextPosition() + 0.2);
        previewManual.refreshTextLanyard();

      }

    })














    const decrease_space_between_text = document.getElementById("decrease_space_between_text");
    const increase_space_between_text = document.getElementById("increase_space_between_text");
    const spaceBetweenText = this.getSpaceBetweenText();

    decrease_space_between_text.addEventListener("click", function(){
      if (textClass.getSpaceBetweenText() > 0) {
        textClass.setSpaceBetweenText(textClass.getSpaceBetweenText() - 0.2);
        previewManual.refreshTextLanyard();
      }

    })


    increase_space_between_text.addEventListener("click", function(){
      if (textClass.getSpaceBetweenText() <=220) {
        textClass.setSpaceBetweenText(textClass.getSpaceBetweenText() + 0.2);
        previewManual.refreshTextLanyard();
      }

    })









  /*  const decrease_space_along_lanyard = document.getElementById("decrease_space_along_lanyard");
    const increase_space_along_lanyard = document.getElementById("increase_space_along_lanyard");
    //const spaceAlongLanyard = this.getSpaceAlongLanyard();

    decrease_space_along_lanyard.addEventListener("click", function(){
      if (textClass.getSpaceAlongLanyard() > 0) {
        textClass.setSpaceAlongLanyard(textClass.getSpaceAlongLanyard() - 1);
        previewManual.modifySpaceAlongLanyard();
      }

    })


    increase_space_along_lanyard.addEventListener("click", function(){
      if (textClass.getSpaceAlongLanyard() <=900) {
        textClass.setSpaceAlongLanyard(textClass.getSpaceAlongLanyard() + 1);
        previewManual.modifySpaceAlongLanyard();
      }

    })*/











    const pantoneColors = [
     { pantone: "White", html: "#FFFFFF" },
     { pantone: "Black", html: "#2D2926" },
     { pantone: "425", html: "#585C5F" },
     { pantone: "Cool Gray 6", html: "#A8AAAB" },
     { pantone: "Yellow", html: "#FCE300" },
     { pantone: "809", html: "#E4E400" },
     { pantone: "1235", html: "#FFBF29" },
     { pantone: "1355", html: "#FFCA84" },
     { pantone: "142", html: "#F9C26D" },
     { pantone: "Orange 021", html: "#FE5000" },
     { pantone: "Bright Orange", html: "#FF7F2A" },
     { pantone: "485", html: "#DA291C" },
     { pantone: "1795", html: "#D93600" },
     { pantone: "186", html: "#E4002B" },
     { pantone: "Red 032", html: "#EF3340" },
     { pantone: "201", html: "#920021" },
     { pantone: "193", html: "#BF003D" },
     { pantone: "208", html: "#930032" },
     { pantone: "212", html: "#FF5C8A" },
     { pantone: "226", html: "#FF006E" },
     { pantone: "249", html: "#80004F" },
     { pantone: "252", html: "#FF66CC" },
     { pantone: "Purple", html: "#BB29BB" },
     { pantone: "2607", html: "#8700BF" },
     { pantone: "281", html: "#002147" },
     { pantone: "Reflex Blue", html: "#001489" },
     { pantone: "293", html: "#0033A0" },
     { pantone: "289", html: "#001B3A" },
     { pantone: "3015", html: "#005387" },
     { pantone: "Process Blue", html: "#0084D1" },
     { pantone: "3302", html: "#005258" },
     { pantone: "3278", html: "#008C93" },
     { pantone: "348", html: "#00A370" },
     { pantone: "354", html: "#00B35A" },
     { pantone: "361", html: "#00BF26" },
     { pantone: "7481", html: "#1AB87A" },
     { pantone: "382", html: "#AEDD00" },
     { pantone: "478", html: "#6B3300" },
     { pantone: "471", html: "#E6CF6B" }
 ];
    const colourTextSelectContainer = document.getElementById("colour-text-select-container");
    const colourTextSelect = document.getElementById("colour-text-select");
    colourTextSelectContainer.style.display = "none";


    for (let i = 0; i < pantoneColors.length; i++) {
      colourTextSelectContainer.innerHTML +=
        '<div class="colour-text-select-boxes" style="background-color:' + pantoneColors[i].html + ';" ' +
        'onclick="textClass.changeColourText(\'' + pantoneColors[i].pantone + '\', \'' + pantoneColors[i].html + '\')">' +
        '<h3 class="name-colour-text-selected" >' + pantoneColors[i].pantone + '</h3>' +
      //  '<img src="../../views/assets/img/global/customize-lanyard/sections/image/top.png" alt="">' +

        '</div>';
    }

    colourTextSelect.addEventListener("click", () => {
      colourTextSelectContainer.style.display = colourTextSelectContainer.style.display === "block" ? "none" : "block";
    });










    const fontStyles = [
        { fontName: "Arial", fontFamily: "Arial, sans-serif" },
        { fontName: "Verdana", fontFamily: "Verdana, sans-serif" },
        { fontName: "Helvetica", fontFamily: "Helvetica, sans-serif" },
        { fontName: "Tahoma", fontFamily: "Tahoma, sans-serif" },
        { fontName: "Trebuchet MS", fontFamily: "Trebuchet MS, sans-serif" },
        { fontName: "Times New Roman", fontFamily: "Times New Roman, serif" },
        { fontName: "Georgia", fontFamily: "Georgia, serif" },
        { fontName: "Garamond", fontFamily: "Garamond, serif" },
        { fontName: "Courier New", fontFamily: "Courier New, monospace" },
        { fontName: "Brush Script MT", fontFamily: "Brush Script MT, cursive" },
        { fontName: "Lucida Console", fontFamily: "Lucida Console, monospace" },
        { fontName: "Impact", fontFamily: "Impact, sans-serif" },
        { fontName: "Comic Sans MS", fontFamily: "Comic Sans MS, cursive" },
        { fontName: "Palatino Linotype", fontFamily: "Palatino Linotype, serif" },
        { fontName: "Book Antiqua", fontFamily: "Book Antiqua, serif" },
        { fontName: "Arial Black", fontFamily: "Arial Black, sans-serif" },
        { fontName: "Lucida Sans Unicode", fontFamily: "Lucida Sans Unicode, sans-serif" },
        { fontName: "Century Gothic", fontFamily: "Century Gothic, sans-serif" },
        { fontName: "Franklin Gothic Medium", fontFamily: "Franklin Gothic Medium, sans-serif" },
        { fontName: "Gill Sans", fontFamily: "Gill Sans, sans-serif" },
        { fontName: "Futura", fontFamily: "Futura, sans-serif" },
        { fontName: "Rockwell", fontFamily: "Rockwell, serif" },
        { fontName: "Candara", fontFamily: "Candara, sans-serif" },
        { fontName: "Optima", fontFamily: "Optima, sans-serif" },
        { fontName: "Didot", fontFamily: "Didot, serif" },
        { fontName: "Calisto MT", fontFamily: "Calisto MT, serif" },
        { fontName: "Bodoni MT", fontFamily: "Bodoni MT, serif" },
        { fontName: "Bookman", fontFamily: "Bookman, serif" },
        { fontName: "Copperplate", fontFamily: "Copperplate, serif" },
        { fontName: "Papyrus", fontFamily: "Papyrus, fantasy" }
    ];
    const typeTextSelectContainer = document.getElementById("type-text-select-container");
    const typeTextSelect = document.getElementById("type-text-select");
    typeTextSelectContainer.style.display = "none";

    for (let i = 0; i < fontStyles.length; i++) {
        typeTextSelectContainer.innerHTML +=
            '<div class="type-text-select-boxes" ' +
            'onclick="textClass.changeFontFamilyText(\'' + fontStyles[i].fontName + '\', \'' + fontStyles[i].fontFamily + '\')">' +
            '<h3 class="name-colour-text-selected"  style="font-family: '+fontStyles[i].fontFamily+'"   >' + fontStyles[i].fontName + '</h3>' +
            '</div>';
    }

    typeTextSelect.addEventListener("click", () => {
      typeTextSelectContainer.style.display = typeTextSelectContainer.style.display === "block" ? "none" : "block";
    });











    const increase_size_text = document.getElementById("increase-size-text");
    const decrease_size_text = document.getElementById("decrease-size-text");

    decrease_size_text.addEventListener("click", () => {
      if (textClass.getSizeText() > 0) {
        textClass.setSizeText(textClass.getSizeText() - 0.2);
        previewManual.refreshTextLanyard();
      }
    });

    increase_size_text.addEventListener("click", () => {
      textClass.setSizeText(textClass.getSizeText() + 0.2);
      previewManual.refreshTextLanyard();
    });







    const styling_bold_text = document.getElementById("styling-bold-text");


    styling_bold_text.addEventListener("click", ()=>{
      if (styling_bold_text.style.border === "2px solid white") {
        styling_bold_text.style.border = "2px solid transparent";
        textClass.setBoldText(false);
      } else {
        styling_bold_text.style.border = "2px solid white";
        textClass.setBoldText(true);
      }

      previewManual.refreshTextLanyard();


    });









    const styling_italic_text = document.getElementById("styling-italic-text");


    styling_italic_text.addEventListener("click", ()=>{
      if (styling_italic_text.style.border === "2px solid white") {
        styling_italic_text.style.border = "2px solid transparent";
        textClass.setItalicText(false);
      } else {
        styling_italic_text.style.border = "2px solid white";
        textClass.setItalicText(true);
      }

      previewManual.refreshTextLanyard();


    });






    const styling_underline_text = document.getElementById("styling-underline-text");


    styling_underline_text.addEventListener("click", ()=>{
      if (styling_underline_text.style.border === "2px solid white") {
        styling_underline_text.style.border = "2px solid transparent";
        textClass.setUnderlineText(false);
      } else {
        styling_underline_text.style.border = "2px solid white";
        textClass.setUnderlineText(true);
      }
      previewManual.refreshTextLanyard();
    });

  }

  getContentText() {
    return this.contentText;
  }
  setContentText(value) {
    this.contentText = value;
  }

  setTimesText(newTimes) {
  if (typeof newTimes === 'number' && newTimes > 0) {
      this.timesText = newTimes;
  }
  }
  getTimesText() {
      return this.timesText;
  }

  setSpaceBetweenText(value){
    this.spaceBetweenText = value;
  }
  getSpaceBetweenText(){
    return this.spaceBetweenText;
  }

  setSpaceAlongLanyard(value){
    this.spaceAlongLanyard = value;
  }
  getSpaceAlongLanyard(){
    return this.spaceAlongLanyard;
  }

  setColourText(value){
    this.colourText = value;
  }
  getColourText(){
    return this.colourText;
  }

  setFontFamilyText(value){
    this.fontFamilyText = value;
  }
  getFontFamilyText(){
    return this.fontFamilyText;
  }

  setSizeText(value){
    this.sizeText = value;
  }
  getSizeText(){
    return this.sizeText;
  }

  setBoldText(value){
    this.boldText = value;
  }
  getBoldText(){
    return this.boldText;
  }

  setItalicText(value){
    this.italicText = value;
  }
  getItalicText(){
    return this.italicText;
  }

  setUnderlineText(value){
    this.underlineText = value;
  }
  getUnderlineText(){
    return this.underlineText;
  }

  setPrintableAreaText(value){
    const printable_area = document.getElementById("printable_area");

    printable_area.checked = value;
    this.printableAreaText = value;
  }
  getPrintableAreaText(){
    return this.printableAreaText;
  }

  setTextPosition(value){
    this.textPosition = value;
  }
  getTextPosition(){
    return this.textPosition;
  }

//

  changeColourText(name, colour){
      this.setColourText(colour);
      previewManual.changeColourText();

      const colourTextSelect = document.getElementById("colour-text-select");
      const h3Element = colourTextSelect.querySelector('h3');
      const colourTextSelectContainer = document.getElementById("colour-text-select-container");

      colourTextSelect.style.background = colour;
      h3Element.innerHTML = name;
      colourTextSelectContainer.style.display = "none";

  }

  changeFontFamilyText(name, fontFamily) {
      this.setFontFamilyText(fontFamily);
      previewManual.changeFontFamilyText();


      const typeTextSelect = document.getElementById("type-text-select");
      const h3Element = typeTextSelect.querySelector('h3');
      const typeTextSelectContainer = document.getElementById("type-text-select-container");

      typeTextSelect.style.fontFamily = fontFamily;
      h3Element.innerHTML = name;
      typeTextSelectContainer.style.display = "none";

  }

}

const textClass = new TextClass();
