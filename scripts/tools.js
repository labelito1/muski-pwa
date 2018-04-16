function track(src, title, number) {
    this.src = src;
    this.title = title;
    this.number = number;
}

function clearString(s) {
    return s.replace(/[|&;$%@"<>()+,?:\/]/g, "_");
};

function downloadAlbum(id, quality) {
    var zip = new JSZip();
    var count = 0;
    var name = clearString(getAlbum(id).title) + ".zip";
    var tracks = [];
    var ext;
    for (i = 0; i < __tracks__.length; i++) {
        if (__tracks__[i].album_id == id) {
            var src = "";
            switch (quality) {
                case 0:
                    src = __tracks__[i].hq_src;
                    ext = "m4a";
                    break;
                case 1:
                    src = __tracks__[i].mq_src;
                    ext = "mp3";
                    break;
                case 2:
                    src = __tracks__[i].lq_src;
                    ext = "opus";
                    break;
                default:
                    src = __tracks__[i].mq_src;
                    ext = "mp3";
            }
            var t = new track(src, __tracks__[i].title, __tracks__[i].tracknumber);
            tracks.push(t);
        }
    }
    tracks.forEach(function (track) {
        JSZipUtils.getBinaryContent(track.src, function (err, data) {
            if (err) {
                throw err;
            }
            zip.file(track.number + " " + clearString(track.title) + "." + ext, data, {
                binary: true
            });
            count++;
            if (count == tracks.length) {
                zip.generateAsync({
                    type: 'blob'
                }).then(function (content) {
                    //                    if (window.chrome) {
                    var reader = new FileReader();
                    reader.onload = function (event) {

                        var save = document.createElement('a');
                        var url = window.URL.createObjectURL(content);
                        save.style.display = "none";
                        save.href = url;
                        save.download = name;

                        document.body.appendChild(save);
                        save.click();
                        document.body.removeChild(save);
                        window.URL.revokeObjectURL(url);

                    };
                    reader.readAsDataURL(content);
                    //                    } else {
                    //                        saveAs(content, name);
                    //                    }
                });
            }
        });
    });
};
