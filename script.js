if(window.location.href.replace(/^.*[\\/]/, '') == 'index.html'){
    var fileInput = document.getElementById('file_input');
    document.getElementById('file_input_button').addEventListener('click', () => fileHandler());
}

function processJson(url){
    import(url,{with:{type: 'json'}}).then((mod) => {
        let data = mod.default;
        compressData(data);
    });
}

/*function splitData(data){
    sessionStorage.setItem('dataChunks',Math.ceil(data.length/2500));
    let curChunk = 0;
    let chunk = [];
    for(let song of data){
        if(!data.indexOf(song)+1 % 2500 === 0){
            chunk.push(song);
        } else {
            sessionStorage.setItem(`uncompressed-song-data-${curChunk}`,JSON.stringify(chunk));
            chunk = [];
            curChunk++;
        }
    }
}*/

function compressData(data){
    let compressedData = {};
    for(let song of data){
        song.title = song.master_metadata_track_name;
        song.artist = song.master_metadata_album_artist_name;
        if(song.title && song.artist){
            if(!Object.keys(compressedData).includes(`${song.title}_${song.artist}`)){
                song.streams = 1;
                compressedData[`${song.title}_${song.artist}`] = song;
            } else {
                compressedData[`${song.title}_${song.artist}`].streams++;
            }
        }
    }
    createSortedArray(compressedData);
}

function createSortedArray(data){
    array = Object.values(data).sort((a,b) => {
        return b.streams - a.streams;
    });
    sessionStorage.setItem('song-data',JSON.stringify(array));
    window.location = 'display.html';
}


