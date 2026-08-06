class ImageClass {
    constructor() {
      this.timesImage = 3;
      this.imageSize = 10;
      this.spaceBetweenImage = 50;
      this.imageRotation = 0;
      this.spaceAlongLanyard = 0;
      this.printableArea = false;
      this.linkImage = "";
      this.imagePosition = 0;





      document.addEventListener("DOMContentLoaded", function () {
        previewManual.addImageLanyard();
      });
      const printable_area_image = document.getElementById("printable_area_image");

      printable_area_image.addEventListener('click', function() {
        if (printable_area_image.checked) {
          imageClass.setPrintableAreaImage(true);
          previewManual.showPrintableAreaImage();

          textClass.setPrintableAreaText(false);
          previewManual.showPrintableAreaText();
        } else {
          imageClass.setPrintableAreaImage(false);
          previewManual.showPrintableAreaImage();
        }
      });





      const move_down_image = document.getElementById("move_down_image");
      const move_up_image = document.getElementById("move_up_image");

      move_down_image.addEventListener("click", function(){
        if (imageClass.getImagePosition() > -100) {
          console.log(imageClass.getImagePosition());

          imageClass.setImagePosition(imageClass.getImagePosition() - 0.2);
          previewManual.refreshImageLanyard();
        }

      })


      move_up_image.addEventListener("click", function(){
        if (imageClass.getImagePosition() <0) {
          console.log(imageClass.getImagePosition());
          imageClass.setImagePosition(imageClass.getImagePosition() + 0.2);
          previewManual.refreshImageLanyard();

        }

      })







      const decrease_space_between_image = document.getElementById("decrease_space_between_image");
      const increase_space_between_image = document.getElementById("increase_space_between_image");

      decrease_space_between_image.addEventListener("click", function(){
        if (imageClass.getSpaceBetweenImage() > 0) {
          imageClass.setSpaceBetweenImage(imageClass.getSpaceBetweenImage() - 0.2);
          previewManual.refreshImageLanyard();
        }

      })


      increase_space_between_image.addEventListener("click", function(){
        if (imageClass.getSpaceBetweenImage() <=220) {
          imageClass.setSpaceBetweenImage(imageClass.getSpaceBetweenImage() + 0.2);
          previewManual.refreshImageLanyard();

        }

      })








  /*    const decrease_space_along_lanyard = document.getElementById("decrease_space_along_lanyard_image");
      const increase_space_along_lanyard = document.getElementById("increase_space_along_lanyard_image");
      //const spaceAlongLanyard = this.getSpaceAlongLanyard();

      decrease_space_along_lanyard.addEventListener("click", function(){
        if (imageClass.getSpaceAlongLanyard() > 0) {
          imageClass.setSpaceAlongLanyard(imageClass.getSpaceAlongLanyard() - 1);
          previewManual.modifySpaceAlongLanyardImage();
        }

      })


      increase_space_along_lanyard.addEventListener("click", function(){
        if (imageClass.getSpaceAlongLanyard() <=900) {
          imageClass.setSpaceAlongLanyard(imageClass.getSpaceAlongLanyard() + 1);
          previewManual.modifySpaceAlongLanyardImage();
        }

      })*/













      const repeatImageBox = document.getElementById("repeat-image-box");

      repeatImageBox.addEventListener("click", function(){
        if (imageClass.getTimesImage() <=19) {
          imageClass.setTimesImage(imageClass.getTimesImage() + 1);
          previewManual.refreshImageLanyard();

        }
      })

      const decreaseImageBox = document.getElementById("decrease-image-box");
      decreaseImageBox.addEventListener("click", function(){
        if (imageClass.getTimesImage() >=0) {

          imageClass.setTimesImage(imageClass.getTimesImage() - 1);
          previewManual.refreshImageLanyard();

        }

      })







      const increaseImageSize = document.getElementById("increase-image-size");

      increaseImageSize.addEventListener("click", function(){
        if (imageClass.getImageSize() <=100) {
          imageClass.setImageSize(imageClass.getImageSize() + 0.2);
          previewManual.refreshImageLanyard();
        }
      })

      const decreaseImageSize = document.getElementById("decrease-image-size");
      decreaseImageSize.addEventListener("click", function(){
        if (imageClass.getImageSize() >=0) {
          imageClass.setImageSize(imageClass.getImageSize() - 0.2);
          previewManual.refreshImageLanyard();
        }

      })












      const rotate_image_left = document.getElementById("rotate_image_left");
      const rotate_image_right = document.getElementById("rotate_image_right");

      rotate_image_left.addEventListener("click", function(){
          imageClass.setImageRotation(imageClass.getImageRotation() - 10);
          previewManual.refreshImageLanyard();
      })


      rotate_image_right.addEventListener("click", function(){
          imageClass.setImageRotation(imageClass.getImageRotation() + 10);
          previewManual.refreshImageLanyard();
      })







      const imageInput = document.getElementById('imageUpload');

      imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (!file || !file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          return;
        }

        // 🚫 Validate size: maximum 1MB
        if (file.size > 1048576) {
          alert('The image must not be larger than 1MB.');
          return;
        }

        const formData = new FormData();
        formData.append('image', file);

        fetch('../../controller/uploads/upload.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const imageUrl = data.imageUrl;
            imageClass.setLinkImage(imageUrl); // Set the image URL
            previewManual.uploadImage();       // Display the image
          } else {
            alert('There was an error uploading the image: ' + data.message);
          }
        })
        .catch(err => {
          console.error('Upload error:', err);
          alert('There was a problem connecting to the server.');
        });
      });





    }

    getTimesImage(){
      return this.timesImage;
    }
    setTimesImage(value) {
      this.timesImage = value;
    }

    getLinkImage() {
        return this.linkImage;
    }
    setLinkImage(value) {
      this.linkImage = value;
    }


    getImageSize() {
      return this.imageSize;
    }
    setImageSize(value) {
      this.imageSize = value;
    }

    getSpaceBetweenImage(){
      return this.spaceBetweenImage;
    }
    setSpaceBetweenImage(value){
      this.spaceBetweenImage = value;
    }

    getImageRotation() {
      return this.imageRotation;
    }

    setImageRotation(value) {
      this.imageRotation = value;
    }

    setSpaceAlongLanyard(value){
      this.spaceAlongLanyard = value;
    }
    getSpaceAlongLanyard(){
      return this.spaceAlongLanyard;
    }

    setPrintableAreaImage(value){
      const printable_area_image = document.getElementById("printable_area_image");

      printable_area_image.checked = value;
      this.printableAreaImage = value;
    }

    getPrintableAreaImage(){
      return this.printableAreaImage;
    }

    setImagePosition(value){
      this.imagePosition = value;
    }
    getImagePosition(){
      return this.imagePosition;
    }


        // Link image
  /*

     // Size image


     // Spacing between image
     getSpacingBetweenImage() {
       return this.spacingBetweenImage;
     }

     setSpacingBetweenImage(value) {
       this.spacingBetweenImage = value;
     }

     // Rotation image
     getRotationImage() {
       return this.rotationImage;
     }

     setRotationImage(value) {
       this.rotationImage = value;
     }*/


}

// Create an instance of ImageClass
const imageClass = new ImageClass();
