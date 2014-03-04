App = Ember.Application.create();

//This shoud allow me to hook jquery event handlers
//Looks like hack and there must be better solution performance is not going to be greatest
//but it works
Ember.View.reopen({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    bindEvents();
  }
});

App.Router.map(function() {
  // put your routes here
  this.route('next');
  this.route('save');
});

App.SaveRoute = Ember.Route.extend({
 model: function() {
 	console.log(this)
 	App.Tools.saveContent();
	this.transitionTo('index');
 }
});

App.NextRoute = Ember.Route.extend({
  afterModel: function() {
		this.transitionTo('index');
	},
	model: function() {
    if (App.Rotator.Current<App.ROTATORCONTENT.length-1) {
    	App.Rotator.Current++;
    }
    else {
    	App.Rotator.Current=0;
    }
		return [App.ROTATORCONTENT[App.Rotator.Current]];	
	}
});


App.IndexRoute = Ember.Route.extend({
  model: function() {
    //return ['red', 'yellow', 'blue'];
    // not sure if this should be here, but start with that
    return [App.ROTATORCONTENT[App.Rotator.Current]];
  }
});

App.Rotator = App.Rotator || {}
App.Tools = App.Tools || {}
App.Rotator.Current = 0;


App.Speech = Ember.Object.extend({
  init: function(initializer) {
    this.title = initializer.title;
    this.content = initializer.content;
  }
});


App.ROTATORCONTENT = [new App.Speech(
	{ title: 'Rocky #1',
		content: 'Let me tell you something you already know. The world ain\’t all sunshine and rainbows. It\’s a very mean and nasty place, and I don\’t care how tough you are, it will beat you to your knees and keep you there permanently if you let it. You, me, or nobody is gonna hit as hard as life. But it ain\’t about how hard you hit. It\’s about how hard you can get hit and keep moving forward; how much you can take and keep moving forward. '
	}),
	new App.Speech(
	{ title: 'Rocky #2',
		content: 'That\’s how winning is done! Now, if you know what you\’re worth, then go out and get what you’\re worth. But you gotta be willing to take the hits, and not pointing fingers saying you ain’t where you wanna be because of him, or her, or anybody. Cowards do that and that ain’t you. You’re better than that!'
	}),
	new App.Speech(
	{ title: 'Any given sunday', 
		content: 'I don\'t know what to say, really. Three minutes to the biggest battle of our professional lives. All comes down to today, and either, we heal as a team, or we\'re gonna crumble. Inch by inch, play by play. Until we\'re finished. We\'re in hell right now, gentlemen. Believe me. And, we can stay here, get the shit kicked out of us, or we can fight our way back into the light. We can climb outta hell... '
	})
];


App.Tools.saveContent = function() {
	//el.preventDefault();
  App.ROTATORCONTENT[App.Rotator.Current].set("content", $('#speech-content').text());
}


App.Rotator.TimeOut = 5;
App.Rotator.CurrentTimeOut = 0;
var timeoutFunction;
// some jQuery shit
//$(document).ready(function(){
function bindEvents()
{
	//alert('binding');
	$('#speech-content').on('click',function() {
		$(this).attr('contentEditable',true);
	});

	// we want to run only one instance of the function
	timeoutFunction = timeoutFunction || window.setInterval(function() {
	 	if (App.Rotator.CurrentTimeOut<App.Rotator.TimeOut) {
	 		App.Rotator.CurrentTimeOut++;
	 		$('#timeout-counter').text(App.Rotator.TimeOut-App.Rotator.CurrentTimeOut);	
	 	}
	 	else {
	 		App.Rotator.CurrentTimeOut=0;
	 		$('#timeout-counter').text(App.Rotator.TimeOut-App.Rotator.CurrentTimeOut);	
	 		App.Router.router.transitionTo('next');
	 	}
	}, 1000);
	



	$('#save-content').bind('click', App.Tools.saveContent);
}
//});