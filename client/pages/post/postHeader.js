Template.postHeader.onCreated(function () {
  if ('speechSynthesis' in window) {
    this.speechStatus = new ReactiveVar('stoped');
  }
});

Template.postHeader.onDestroyed(function () {
  if ('speechSynthesis' in window) {
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
    analytics.track("Play speech synthesis");
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      Session.set('activeSpeech', this.id);
      let to_text  = this.body.replace(/<.*?>/g,'');
      if (this.extended)
        to_text = to_text + this.extended.replace(/<.*?>/g,'');
      let to_speak = new SpeechSynthesisUtterance(to_text);
      to_speak.rate = 1.1;
      Template.instance().speechStatus.set('playing');
      window.speechSynthesis.speak(to_speak);
    }
  },
  'click .pauseit'(event, instance) {
    analytics.track("Pause speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('paused');
      window.speechSynthesis.pause();
    }
  },
  'click .resumeit'(event, instance) {
    analytics.track("Resume speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('playing');
      window.speechSynthesis.resume();
    }
  },
  'click .stopit'(event, instance) {
    analytics.track("Stop speech synthesis");
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('stoped');
      window.speechSynthesis.cancel();
    }
  }
})