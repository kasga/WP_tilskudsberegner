$(document).ready(function() {
  var $container = $('.uploader')

  $container.find('input[name="files"]').fileuploader({
    theme: 'onebutton',
    maxSize: 25,
    fileMaxSize: 25,
    enableApi: true,
    upload: {
      url: 'https://upload.de-dynamisk.dk/',
      type: 'POST',
      enctype: 'multipart/form-data',
      start: true,
      onSuccess: function (result, item) {
        item.data = JSON.parse(result)
        setTimeout(function() {
          item.html.find('.progress-bar2').fadeOut(400)
        }, 400)
      },
      onError: function (item) {
        var progressBar = item.html.find('.progress-bar2')
        if(progressBar.length > 0) {
          progressBar.find('span').html(0 + "%")
          progressBar.find('.fileuploader-progressbar .bar').width(0 + "%")
          progressBar.fadeOut(400)
        }
      },
      onProgress: function(data, item) {
        var progressBar = item.html.find('.progress-bar2');
        if(progressBar.length > 0) {
          progressBar.show();
          progressBar.find('span').html(data.percentage + "%");
          progressBar.find('.fileuploader-progressbar .bar').width(data.percentage + "%");
        }
      },
      onComplete: null
    },
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'pdf'],
    captions: {
      button: function() {
        return 'Tryk her for at uploade dit billede'
      },
      removeConfirmation: 'Er du sikker på at du vil fjerne denne fil?',
      errors: {
        filesLimit: 'Kun ${limit} filer er tilladt at blive uploadet.',
        filesType: 'Kun ${extensions} filer er tilladt at blive uploadet.',
        fileSize: '${name} er for stor! Vælg en fil på op til ${fileMaxSize}MB.',
        filesSizeAll: 'De filer, du har valgt er for store! Upload filer op til ${maxSize} MB.',
        fileName: 'Fil med navnet ${name} allerede er valgt.',
        folderUpload: 'Det er ikke tilladt at uploade mapper.'
      }
    }
  });
});