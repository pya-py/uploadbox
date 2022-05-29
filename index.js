const uploadedFiles = [];
const $ = (id) => document.getElementById(`#${id}`);
const inputFile = $('inputFile');
const progressBar = $('progressBar');
const progressBarContainer = $('progressBarContainer');
const progressBarWidth = 200;

convertFileSize = (fsize) => {
    const labels = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    while(fsize >= 1024 && index < labels.length - 1){
        fsize /= 1024;
        index++;
    }
    return (Math.round(fsize * 100) / 100).toFixed(2) + " " + labels[index];
}
function upload(file, shortFileName){
    const formData = new FormData();
    formData.append("file", file);
    const request = new XMLHttpRequest();
    request.open('POST', 'upload.php');
    request.setRequestHeader("Content-Type","multipart/form-data");
    var fileSize = 0;
    request.upload.addEventListener('progress', ({loaded, total}) => {
        if(!fileSize) {
            fileSize = total;
            progressBarContainer.style.opacity = 1;
        }
        const progress = 100 * loaded / total;
        progressBar.style.width = progress * progressBarWidth / 100 + 'px';
    });

    request.onreadystatechange = function(e) {
        if (this.readyState === 4) {
            uploadedFiles.push({name: shortFileName, size: convertFileSize(fileSize)});
            $('fileList').innerHTML = fileListElements().join(' ');
            setTimeout(() => {
                progressBarContainer.style.opacity = 0
            }, [5000])

        }
    };
    request.send(formData);

}
function openFileDialog() {
    inputFile.click();
}

fileListElements = () =>
    uploadedFiles.map(uf => `<li class="file-row">
                                <div class="--col--2">
                                    <i class="fas fa-file file-icon" ></i>
                                </div>
                                <div class="--col--8">
                                    <div class="file-name">
                                        ${uf.name}
                                    </div>
                                    <div class="file-size">
                                        ${uf.size}
                                    </div>
                                </div>
                                <div class="--col--2">
                                    <i class="fas fa-check check-icon" ></i>
                                </div>
                            </li>`);
function onChange() {
    const newFile = this.files[0];
    if(newFile){
        if(newFile.name.length > 17){
            const names = newFile.name.split('.');

            if(names && names instanceof Array) {
                const fileFormat = names[names.length - 1];
                var shortFilename = newFile.name.substring(0, 18) + "... ." + fileFormat;
            }
        }
        upload(newFile,shortFilename || newFile.name);

    }
}

function onLoad() {
    $('dragArea').addEventListener('click', openFileDialog);
    inputFile.addEventListener('change', onChange);
}

window.addEventListener('load', onLoad);
