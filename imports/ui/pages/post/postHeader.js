import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './postHeader.html';
import './postHeader.css';

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
  'click .hearit'() {
    analytics.track('Play speech synthesis'); // generate event in analytics
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stops reading
      Session.set('activeSpeech', this.id); // active post
      let toText  = this.body.replace(/<.*?>/g, ''); // delete html tags
      if (this.extended) {
        toText += this.extended.replace(/<.*?>/g, ''); // delete html tags
      }
      const toSpeak = new SpeechSynthesisUtterance(toText); // build speech object
      toSpeak.rate = 1.1; // like it more a little bit faster
      Template.instance().speechStatus.set('playing'); // update state machine
      window.speechSynthesis.speak(toSpeak); // read it out loud
    }
  },
  'click .pauseit'() {
    analytics.track('Pause speech synthesis');
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('paused'); // update state machine
      window.speechSynthesis.pause();
    }
  },
  'click .resumeit'() {
    analytics.track('Resume speech synthesis');
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('playing'); // update state machine
      window.speechSynthesis.resume();
    }
  },
  'click .stopit'() {
    analytics.track('Stop speech synthesis');
    if ('speechSynthesis' in window) {
      Template.instance().speechStatus.set('stoped'); // update state machine
      window.speechSynthesis.cancel();
    }
  }
});
