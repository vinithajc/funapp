window.twttr = (function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0],
	    t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);
	
	  t._e = [];
	  t.ready = function(f) {
	    t._e.push(f);
	  };
	
	  return t;
}(document, "script", "twitter-wjs"));

twttr.ready(function(event){

	twttr.events.bind('loaded',function (event) {
		event.widgets.forEach(function (widget) {
			if(widget.id == "twitter-widget-0"){
				widget.contentWindow.addEventListener("click", function(event1){
					event1.preventDefault();
					twitterSection.openTwitterModal(common.parentNodeOfClass(event1.target, "timeline-Tweet").dataset.tweetId);
				});
			}
			else{
				document.getElementById("modal-body").classList.remove("dN");
			}
		});			   
	});
	
});

document.addEventListener("DOMContentLoaded", function(event) { 
	
	// Set Theme
	sessionStorage.setItem('theme', 'orange');
	//document.getElementById("tictactoe").style.display = "none";
	
	//Bind Events
	document.getElementById("themePickerOptions").addEventListener("click", common.changeTheme);
	document.getElementById("dropdown-content-logo").addEventListener("click", svgSection.applyAnimation);
	document.getElementById("dropbtn-logo").addEventListener("click", svgSection.showOptions);
	document.getElementById("game-list").addEventListener("click", common.switchTab);
	document.getElementById("gameBoard").addEventListener("click", tictactoe.userTurn);
	document.getElementById("restartGame").addEventListener("click", tictactoe.restartGame);
	document.getElementById("gameHeader").addEventListener("click", tictactoe.settings);
	document.getElementById("backToHome").addEventListener("click", common.backToHome);
	
	//Close Modal on ESC and Click outside
	document.body.addEventListener("keyup", common.closeModalonEsc, true);	
	document.getElementById("myModal").addEventListener("click", function(event){
		if(event.target.id != "modal-body"){
			twitterSection.closeTwitterModal();
		}
	});
		
	// Load Video and Audio Content
	mediaSection.loadMediaContent('video');
	mediaSection.loadMediaContent('audio');
		
});

let common = new function(){
	
	this.closeModalonEsc = function(event){
		console.log(event);
		if(document.getElementById('myModal').getClientRects().length != 0 && event.key == "Escape"){
			twitterSection.closeTwitterModal();
		}
	}
	
	this.changeTheme = function(event){	
		
		let newTheme = event.target.dataset.theme;		
		let oldTheme = sessionStorage.getItem('theme');
		
		if((newTheme != oldTheme) && event.target.children[0]){
			
			let oldThemeDiv = document.getElementsByClassName("ticMark");
			oldThemeDiv[0].classList.remove("svgIconsImg");
			oldThemeDiv[0].classList.remove("ticMark");			
			let body = document.querySelector('body');			
			event.target.children[0].classList.add("svgIconsImg");
			event.target.children[0].classList.add("ticMark");				
			body.classList.remove("theme-"+oldTheme);						
			body.classList.add("theme-"+newTheme);
			sessionStorage.setItem('theme', newTheme);
			
		}	
	}
	
	this.parentNodeOfClass = function(element, classname) {
		
	    if (element.className.split(' ').indexOf(classname)>=0){
	    		return element;
	    } else {
	    	 	return element.parentNode && this.parentNodeOfClass(element.parentNode, classname);
	    }
	    
	}
	
	this.switchTab = function(){
		document.getElementById("container").style.display = "none";
		document.getElementById("tictactoe").style.display = "block";
		document.getElementById("backToHome").style.display = "block";
	}
	
	this.backToHome = function(){
		document.getElementById("container").style.display = "block";
		document.getElementById("tictactoe").style.display = "none";
		document.getElementById("backToHome").style.display = "none";
	}
}

let twitterSection = new function(){
	
	this.openTwitterModal = function(tweetId){
		
		if(sessionStorage.getItem('lastTwitterId') != tweetId) {
			let script = document.createElement('script');
			let url = "https://publish.twitter.com/oembed?url=https://twitter.com/zoho/status/"+tweetId;
			script.src = url + "&callback=twitterSection.createTweet";
			document.getElementsByTagName('head')[0].appendChild(script);
		}
		
		let modal = document.getElementById('myModal');	
		modal.style.display = "block";
		sessionStorage.setItem('lastTwitterId', tweetId);

		
	}

	this.closeTwitterModal = function(){
		
		let modal = document.getElementById('myModal');
		modal.style.display = "none";
		
	}

	this.createTweet = function(response){
		
		let modelContent = document.getElementById("modal-body");
		
		modelContent.classList.add("dN");
		modelContent.innerHTML = response.html;
		twttr.widgets.load();
		
	}
	
}

let mediaSection = new function(){
	
	this.loadMediaContent = function(tag){
		
		 let element = document.querySelector(tag);
		 
	     let mediaSource = new MediaSource;
	     element.src = URL.createObjectURL(mediaSource);
	     mediaSource.addEventListener('sourceopen', this.sourceOpen);
	     
	}


	this.sourceOpen = function() {
		
	    let mediaSource = event.target;
	    
	    let mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
	    let assetURL = 'http://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4';
	    
	    let sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
	    mediaSection.fetchMediaStream(assetURL, function (buf) {
	      sourceBuffer.addEventListener('updateend', function () {
	        mediaSource.endOfStream();
	      });
	      sourceBuffer.appendBuffer(buf);
	    });
	    
	}

	this.fetchMediaStream = function(url, mediaBuffer) {

	    let xhr = new XMLHttpRequest;
	    xhr.open('get', url);
	    xhr.responseType = 'arraybuffer';
	    xhr.onload = function () {
	    		mediaBuffer(xhr.response);
	    };
	    xhr.send();
	    
	}
	
}

let svgSection = new function(){
	
	this.showOptions = function(){
		
		let dropdownContentLogo = document.getElementById("dropdown-content-logo");
		dropdownContentLogo.classList.remove("dN");
		dropdownContentLogo.classList.add("dB");
		
	}

	this.applyAnimation = function(event){
		
		if(event.target.dataset.animate){
			
			let dropdownContentLogo = document.getElementById("dropdown-content-logo");
			dropdownContentLogo.classList.remove("dB");
			dropdownContentLogo.classList.add("dN");
			
			let animation = event.target.dataset.animate;	
			let source = document.getElementById("zoho-logo");
			
			
			let promise = new Promise((resolve, reject) => {	
				 source.classList = [];
				 void source.offsetWidth;
				 source.classList.add("svg-div");
				 resolve(source);			 
			});
			
			promise.then((src) => {
				  src.classList.add('animate-'+animation);
			});
		}
		
	}
	
}