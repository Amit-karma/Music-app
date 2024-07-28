
let songs;
let currFolder;
let currentSongs = new Audio;
async function getSongs(folder){
    currFolder = folder;
    let x = await fetch(` /${folder}/`)
    let respone = await x.text();
    let div = document.createElement("div")
    div.innerHTML = respone;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    } 
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li class=" li flex cursor">
                        <img class="invert" src="logo/music.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20", "")}</div>
                            <div>Amit</div>
                        </div>
                        <div class="flex justify-content align-items">

                            <div>Play Now</div>
                            <img class="invert" src="logo/plays.svg" alt="">
                        </div>
                  
        
       </li>`;
        
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{

            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusci(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    // 1:39:07
    return songs;


}

// const playMusci = (track) =>{
//  let audio = new Audio ("/songs/" + track);
//  audio.play()
// }
function formatTime(seconds) {
    // Ensure input is a number
    seconds = parseInt(seconds, 10);

    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format with leading zeros if needed
    var formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

    return formattedTime;
}


const playMusci = (track , pause=false) =>{
//  let audio = new Audio ("/songs/" + track);
currentSongs.src = (`/${currFolder}/`+ track);
// decodeURI helps to give text from url
document.querySelector(".songinfo").innerHTML = decodeURI(track)
if (!pause) {
    
    play.src = "logo/pause.svg";
     currentSongs.play()
}

}

async function displayAlbum() {
    let a = await fetch(` /songs/`)
    let respone = await a.text();
    let div = document.createElement("div")
    div.innerHTML = respone;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
   let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        if ( e.href.includes("/songs")) {
            let folder =  e.href.split("/").splice(-2)[0] ; 
            let a = await fetch(` /songs/${folder}/info.json`)
            let respone = await a.json();
            // console.log(respone);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="cont ">
                        <div class="img effect grid ">
                            <img src="/songs/${folder}/cover.jfif" alt="">
                            <div class="play flex justify-content ">
                                <img id="alnext"  src="logo/play.svg" alt="">
                            </div>
                        </div>
                        
                        <div class="text flex ">
                            <div>${respone.title}</div>
                            <div class="font1 grey">${respone.Discription}</div>
                        </div>
                    </div>`
        }

        //  currentTarget helps to target entier content on which its applied ands show as one
    Array.from(document.getElementsByClassName("cont")).forEach(e=>{
        e.addEventListener("click" , async items=>{
            document.querySelector(".manage").style.opacity = 1;
            songs = await getSongs(`songs/${ items.currentTarget.dataset.folder}`);

            // for (let i = 0; i < songs.length-1 ; i++) {
                // const element = array[i];
                playMusci(songs[0]);
                
            // }
           
        })

        

    })
    }
    // console.log(anchors);
   
    // comeback
}


async function main() {
    
     await getSongs(`songs/${currFolder}`);
    playMusci(songs[0] , true)
    // console.log(songs);
    // display album
    displayAlbum()


//  attaching eventlistener to play perivious next 
// if we give id then we can directly use it in js like this 
    play.addEventListener("click" , element =>{
        if (currentSongs.paused) {
            currentSongs.play()
            // this how we access/change svg
            play.src = "logo/pause.svg"
        }
        else{
            
            currentSongs.pause()
            play.src ="logo/plays.svg"
        }
    })
    currentSongs.addEventListener("timeupdate" , element=>{
        // currentTime/duration are fuctions in js 
        document.querySelector(".songTime").innerHTML =`${formatTime(currentSongs.currentTime)}/${formatTime(currentSongs.duration)}`;
        document.querySelector(".circle").style.left = ((currentSongs.currentTime / currentSongs.duration)*100) - 1 + "%";
            
        
        
    //    console.log(a);
    })
    document.querySelector(".line").addEventListener("click" , e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left = percent  + "%";
        currentSongs.currentTime = ((currentSongs.duration)* percent)/100;
    })
    // humberger
    document.querySelector(".humb").firstElementChild.addEventListener("click" , e=>{
        // let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".left").style.left = 0 + "%";
        document.querySelector(".left").style.width = 100 + "%";
        document.querySelector(".backbox").firstElementChild.style.display = "block";
        // currentSongs.currentTime = ((currentSongs.duration)* percent)/100;
    })
    // backburger
    document.querySelector(".backbox").firstElementChild.addEventListener("click" , e=>{
        // let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".left").style.left = -100 + "%";
        // document.querySelector(".left").style.width = 100 + "%";
        // currentSongs.currentTime = ((currentSongs.duration)* percent)/100;
    })
    // previous
    previous.addEventListener("click" , e=>{
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
    //  console.log(songs , index);
    if (index > 0) {
        playMusci(songs[index-1]);
        
    }
    else{
        
        playMusci(songs[songs.length - 1]);
    }
    })

    // next
   next.addEventListener("click" , e=>{
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
    //  console.log(songs , index);
    if (index < songs.length -1) {
        playMusci(songs[index+1]);
        
    }
    else{
        
        playMusci(songs[0]);
    }
    })

    volume.addEventListener("click" , e=>{
        if (e.target.src.includes("logo/volume.svg")) {


            e.target.src = "logo/mute.svg"
            currentSongs.volume = 0;
            document.querySelector(".volume input").value = 0;
            // document.querySelector(".volume").lastElementChild.style.display = "none";
        }else{
            
            e.target.src = "logo/volume.svg"
            currentSongs.volume = .10;
            document.querySelector(".volume input").value = 10;
        }

       
    })
    // .volume helps to manage audio volume
    document.querySelector(".volume").lastElementChild.addEventListener("change", e=>{
        currentSongs.volume = parseInt(e.target.value)/100;
        if ( currentSongs.volume == 0) {
            document.querySelector(".volume>img").src = "logo/mute.svg";
        }else{
            document.querySelector(".volume>img").src = "logo/volume.svg";
        }

    })
    
   
  
}

main()

