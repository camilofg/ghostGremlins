function loadScript(callback) {
	var s = document.createElement('script');
	s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
	if(s.addEventListener) { 
		s.addEventListener('load',callback,false);
	} else if(s.readyState) {
		s.onreadystatechange = callback;
	}
	document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
    function stop() {
        horde.stop();
        callback();
    }

    var horde = window.gremlins.createHorde()
    .gremlin(gremlins.species.clicker().clickTypes(['click'])
      .canClick(function(element){
        return (element.tagName.toLowerCase() == ('button' || 'a') && element.innerHTML != undefined);
      })
    )
    .gremlin(gremlins.species.formFiller()
      .canFillElement(function(element){
        return (element.tagName.toLowerCase() == 'input' && element.innerHTML != 'undefined');
      })
    )
    .gremlin(gremlins.species.toucher()
      .canTouch(function(element){
        return element.innerHTML != undefined;
      })
    )
    .gremlin(gremlins.species.scroller())
    .gremlin(gremlins.species.typer());

    horde.strategy(gremlins.strategies.distribution()
    .delay(50) 
    .distribution([0.5, 0.2, 0.1, 0.1, 0.1]) 
    );
    horde.seed(1234);
    horde.after(callback);
    window.onbeforeunload = stop;
    setTimeout(stop, ttl);
    horde.unleash();
}


describe('Monkey testing with gremlins ', function () {
  browser.url('http://localhost:2368/ghost/#/');  
  browser.pause(4000);   
  beforeAll(function(){
    var emailInput = browser.element('input[name="identification"]');
    emailInput.click();
    emailInput.setValue('forerorama@gmail.com');
    
    var password = browser.element('input[name="password"]');
    password.click();
    password.setValue('Qwerty12345');
//$$('button')[0];//
    browser.element('login.gh-btn.gh-btn-blue.gh-btn-block.gh-btn-icon.ember-view').click();
  });

  it('it should not raise any error', function () {
    browser.pause(4000);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);
  
    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 6000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) { 
      browser.logger.info(log.message);//.split(' ')[2]);
    });
  });
});
