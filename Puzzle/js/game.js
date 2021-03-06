var game = {};

game.board = $("#board");
game.boardSize = $("#board").width();
game.menuButton = $("#menuButton").append("<button class=\"level\" difficulty=\"3\">MENU</button>");
game.counter = 0; //the number of moves
game.tmpScore = $("#tmpScore");
game.componentSize = 0; //the size of one component
game.tabPosition = []; //positions of all elements
game.lastIndex = 0; //index to an empty component
game.emptyTop = 0; //the position of the empty component
game.emptyLeft = 0;
game.difficulty = 0; //level of difficulty of the game (easy: 3, medium: 4, hard: 5)
game.timeAnimation = 500; // 400ms
game.start = false; 

game.startMenu = function()
{	
	this.image = 'url("img/main.jpg")';
	this.tmpScore.empty();
    this.board.empty();
    this.board.css({'background-image': game.image});
    this.board.append("<div id=\"menu\"></div>");
	this.tmpScore.css({'display': 'none'});
    this.menuButton.css({'display': 'none'});
    var menu = $("#menu");
	menu.append("<div id=\"title\">Cities at night</div>")
    menu.append("<div id=\"title\">Puzzles</div>")
    menu.append("<button class=\"level\" difficulty=\"3\">Easy</button>");
    menu.append("<button class=\"level\" difficulty=\"4\">Medium</button>");
    menu.append("<button class=\"level\" difficulty=\"5\">Hard</button>");

	game.imgDraw();	
	
    $(".level").click(function(){
		game.showElement($(this).attr("difficulty"));
    });
}

game.showElement = function(difficulty)
{		
	this.board.empty();
    this.board.css({'background-image': game.gameImage});
	this.board.append("<div id=\"menu\"></div>");
    var menu = $("#menu");
	menu.append("<button class=\"level\">START</button>");
	menu.showElement;
	$(".level").click(function(){
        game.startGame(difficulty);
    });
}

game.imgDraw = function()
{
	var str1 = "url(\"img/";
	var imgNumber = Math.floor((Math.random() * 10) + 1);
	var str2 = str1.concat(imgNumber);
	this.gameImage = str2.concat('.jpg\")');
}

game.startGame = function(difficulty)
{	
	this.tmpScore.append("Number of moves: " +this.counter);
    this.start = true;
    this.counter = 0;
    this.board.empty();
    this.board.css({'background-image': 'none'});
	this.tmpScore.fadeIn(1500);
    this.menuButton.fadeIn(1500);
    this.componentSize = Math.floor(this.boardSize/difficulty);
    this.difficulty = difficulty;
    this.lastIndex = difficulty*difficulty-1;
    var index = 0;

    //Setting the position of game components.
    for(var i=0; i<difficulty; i++)
    {   
        for(var j=0; j<difficulty; j++)
        {
            if(index<this.lastIndex)
            {
                var component = $('<div class=component id='+index+'></div>');
                component.css({
				'background-image':game.gameImage,
                'background-position':(-j*this.componentSize)+"px "+(-i*this.componentSize)+"px",
                'top':i*this.componentSize,
                'left':j*this.componentSize,
                'height':this.componentSize,
                'width':this.componentSize});
                game.board.append(component); 
            }  
            this.tabPosition[index] = {top: i*this.componentSize, left:j*this.componentSize};
            index++;
        }
    }
	
    //Assigning an empty component value.
    this.emptyTop = this.tabPosition[this.lastIndex].top;
    this.emptyLeft = this.tabPosition[this.lastIndex].left;

    //Mixing the components of the game.
    for(var i=0; i<1000; i++)
    {
        var number = Math.floor(Math.random()*this.lastIndex);
        this.checkComponent($("#"+number));
    }

    this.start = false;

    $(".component").click(function(){
        game.checkComponent($(this));
        setTimeout("game.checkWin()", game.timeAnimation + 50); 
    });

    this.menuButton.click(function(){
        game.startMenu();
    });
}

game.endGame = function()
{
    this.board.empty();
    this.board.css({'background-image': game.image});
    this.board.append("<div id=\"reload\"><i class=\"icon-cw\"></i></div>");
    this.board.append("<div id=\"score\">Number of moves: " +this.counter+ "</div>");
    $("#reload").fadeIn(1000);
    $("#score").fadeIn(1000);

    $("#reload").click(function(){
        game.startGame(game.difficulty);
    });
}

//Checking if the clicked element touches the wall of an empty component.
game.checkComponent = function(component)
{
    var componentPosition = component.position();

    if(componentPosition.top + this.componentSize == this.emptyTop && componentPosition.left == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }    
    else if(componentPosition.top == this.emptyTop && componentPosition.left + this.componentSize == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }
    else if(componentPosition.top == this.emptyTop + this.componentSize && componentPosition.left == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }
    else if(componentPosition.top == this.emptyTop && componentPosition.left == this.emptyLeft + this.componentSize)
    {
        this.switchComponents(component, componentPosition);
    }
}

//Replacement empty component with current component.
game.switchComponents = function(component, componentPosition)
{
    if(this.start)
    {
        component.css({
            'top': this.emptyTop,
            'left': this.emptyLeft
        });
    }
    else
    {
        component.animate({
            top: this.emptyTop,
            left: this.emptyLeft
        }, game.timeAnimation);

        this.counter++;
		this.tmpScore.empty();
		this.tmpScore.append("Number of moves: " +this.counter);
    } 

    this.emptyTop = componentPosition.top;
    this.emptyLeft = componentPosition.left;
}

//Checking if the components are in the initial position.
game.checkWin= function()
{
    for(var i = 0; i<this.lastIndex; i++)
    {
        var current = $("#"+i).position();
        if(!(current.top == this.tabPosition[i].top && current.left == this.tabPosition[i].left))
        {
            return false;
        }
    }
    this.endGame();
}

$(document).ready(function(){
    game.startMenu();
});