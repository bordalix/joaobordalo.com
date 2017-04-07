Template.postHeader.onCreated(function () {
  if ('speechSynthesis' in window) {
    // Reactive variable for our state machine
    this.speechStatus = new ReactiveVar('stoped');
  }
});

Template.postHeader.onDestroyed(function () {
  if ('speechSynthesis' in window) {
    // Stops reading when user leaves or close the page
    window.speechSynthesis.cancel();
  }
});

Template.postHeader.helpers({
  speechSynthesis() {
    return 'speechSynthesis' in window;
  },
  activeSpeech() {
    return Session.equals('activeSpeech', this.id);
  },
  speechPaused() {
    return Template.instance().speechStatus.get() === 'paused';
  },
  speechPlaying() {
    return Template.instance().speechStatus.get() === 'playing';
  },
  speechStoped() {
    return Template.instance().speechStatus.get() === 'stoped';
  }
});

Template.postHeader.events({
  'click .hearit'(event, instance) {
    analytics.track("Play speech synthesis"); // generate event in analytics
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stops reading
      Session.set('activeSpeech', this.id); // active post
      let to_text  = this.body.replace(/<.*?>/g,''); // delete html tags
      if (this.extended)
        to_text = to_text + this.extended.replace(/<.*?>/g,''); // delete html tags
      let to_speak = new SpeechSynthesisUtterance(to_text); // build speech object
      to_speak.rate = 1.1; // like it more a little bit faster
      Template.instance().speechStatus.set('playing'); // update state machine
      window.speechSynthesis.speak(to_speak); // read it out loud
    }
  },
  'click .pauseit'(event, instance) {
    analytics.track("Pause speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('paused'); // update state machine
      window.speechSynthesis.pause();
    }
  },
  'click .resumeit'(event, instance) {
    analytics.track("Resume speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('playing'); // update state machine
      window.speechSynthesis.resume();
    }
  },
  'click .stopit'(event, instance) {
    analytics.track("Stop speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('stoped'); // update state machine
      window.speechSynthesis.cancel();
    }
  }
})