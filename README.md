# inputCropper
jQuery plugin to cropper image selected in an input file
Plubin jQuery para recortar imagen seleccionada en un input file

## Dependencies
* jQuery
* Cropper: https://github.com/fengyuanchen/cropper

# Usage

	<form method="post" action="">
		<input type="hidden" name="cropper[x]" class="input-x"/>
		<input type="hidden" name="cropper[y]" class="input-y"/>
		<input type="hidden" name="cropper[w]" class="input-w"/>
		<input type="hidden" name="cropper[h]" class="input-h"/>

		<input type="file" name="img" required="required" accept="image/jpg, image/jpeg, image/png" class="form-control input-img">
	
	</form>

	<div id="thb-preview"></div>    

	<div id="image-wrapper" class="hide">
    	<img id="image-preview" src="#" alt="preview"/>
   	</div>

	<script>
		$(".input-img").inputCropper({
            aspectRatio: 4 / 3,
            zoomable: true,
            maxSize: 1048576
        });
	</script>