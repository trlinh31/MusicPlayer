const songRunning = document.getElementById('song-running');
const dashboard = document.getElementById('dashboard');
const playlist = document.querySelector('.playlist');
const player = document.querySelector('.player');
const playBtn = document.querySelector('.btn-toggle-play');
const heading = document.querySelector('.info h2');
const singer = document.querySelector('.info h5');
const thumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('#audio');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const progress = document.getElementById('progress');
const btnRandom = document.querySelector('.btn-random');
const btnRepeat = document.querySelector('.btn-repeat');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Lan Man',
            singer: 'Ronboogz',
            path: './assets/music/lan-man.mp3',
            image: './assets/img/lan-man.jpg'
        },
        {
            name: 'Đưa Em Về Nhà',
            singer: 'Grey D',
            path: './assets/music/dua-em-ve-nha.mp3',
            image: './assets/img/dua-em-ve-nha.jpg'
        },
        {
            name: 'Flower',
            singer: 'Jisoo',
            path: './assets/music/flower.mp3',
            image: './assets/img/flower.jpg'
        },
        {
            name: 'Mưa Tháng Sáu',
            singer: 'Văn Mai Hương',
            path: './assets/music/mua-thang-sau.mp3',
            image: './assets/img/mua-thang-sau.jpg'
        }
    ],
    handleEvents: function(){
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }else{ 
                audio.play();
            } 
        }

        const cdThumbAnimate = thumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });

        cdThumbAnimate.pause();

        audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        audio.ontimeupdate = function(){
            progress.value = audio.currentTime / audio.duration * 100
            
        }

        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        btnPrev.onclick = function(){
            if(app.isRandom){
                app.playRandomSong();
            }else{
                app.prevSong();
            }
            audio.play();  
            app.render();
            app.scrollIntoView(); 
        }

        btnNext.onclick = function(){   
            if(app.isRandom){
                app.playRandomSong();
            }else{
                app.nextSong();
            }
            audio.play(); 
            app.render();
            app.scrollIntoView(); 
        }

        btnRandom.onclick = function(e){
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle('active', app.isRandom);      
        }

        btnRepeat.onclick = function(e){
            app.isRepeat = !app.isRepeat;
            btnRepeat.classList.toggle('active', app.isRepeat);   
        }

        audio.onended = function(){
            if(app.isRandom){
                app.playRandomSong();
            }else if(app.isRepeat){
                audio.play();
            }else{
                app.nextSong();
            }
            audio.play(); 
        }
    },
    prevSong: function(){
        if(this.currentIndex <= 0){
            this.currentIndex = this.songs.length - 1;
        }else{
            this.currentIndex--;
        }
        this.loadCurrentSong();
        
    },
    nextSong: function(){
        if(this.currentIndex >= this.songs.length - 1){
            this.currentIndex = 0;
        }else{
            this.currentIndex++;
        }
        this.loadCurrentSong(); 
    },
    playRandomSong: function(){
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomIndex === this.currentIndex);
        console.log(randomIndex);
        
        this.currentIndex = randomIndex;
        this.loadCurrentSong(); 
    },
    defindProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        singer.textContent = this.currentSong.singer;
        thumb.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <img src="${song.image}" class="song-thumb">
                <div class="song-info">
                    <h4 class="title">${song.name}</h4>
                    <p class="author">${song.singer}</p>
                </div>
            </div>`
        });
        playlist.innerHTML = htmls.join('');
    },
    scrollIntoView: function(){
        const songActive = document.querySelector('.song.active');
        songActive.scrollIntoView({
            behavior: 'smooth',
            block : 'center',
        })
    },
    clickSong: function(){
        playlist.onclick = function(e){
            const songNode = e.target.closest(".song:not(.active)");
            if(songNode){
                app.currentIndex = Number(songNode.dataset.index);
                app.loadCurrentSong();
                app.render();
                audio.play();
            }
        }
    },
    start: function(){
        this.handleEvents();
        this.defindProperties();
        this.loadCurrentSong();
        this.clickSong();

        this.render();
    }
}

app.start();
