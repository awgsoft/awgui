<template>
  <div id="app" class="bg-dark">

    <div style='width:640px;'> <!-- MML -->
      <textarea class="form-control bg-dark text-light" id="mml" cols=80 rows=20 style="font-family:monospace;">
@10 {
;   MT   WF   ML   DT   TL   FB  MOD    OSC
1    1,   2,  10,   0,  30,   7,   0
;   MT   WF   ML   DT   TL   FB  MOD    OSC
2    1,   2,  10,   0,   0,   0,   1
;   MT   AR   DR   SR   RR   SL  MOD    EG
3    2,  20,  20,   5,  10,   7,   2
;   MT   WF   ML   DT   TL   FB  MOD    OSC
4    1,   2,  10,   0,  40,   0,   0
;   MT   WF   ML   DT   TL   FB  MOD    OSC
5    1,   2,  10,   0,   0,   0,   4
;   MT   AR   DR   SR   RR   SL  MOD    EG
6    2,  20,  20,   5,  10,   7,   5
;   MT  MIX  MOD                        LAYER
7    3,   1,   3, 6
}

@20 {
;   MT   WF   ML   DT   TL   FB  MOD    OSC
1    1,   6,  10,   0,   0,   0,   0
;   MT   AR   DR   SR   RR   SL  MOD    EG
2    2,  31,  25,  15,  10,   7,   1
}

1 t120@10o4v12l4
1 cdefgab<c
1 c>bagfedc

2 @10o2v11l4q7
2 cccccccc
2 l8q3>(3 [c<c>]8

3 @20o4v10l8
3 [q1cc>q6c<q1c]4
3 [q1c)2c16c16(2>q6c<q1)2c16c16(2]4
      </textarea>
      <b-button v-on:click="readMml">
        <b-icon-file-text aria-label="loadMML"></b-icon-file-text> load
      </b-button>
    </div>
    <div style="width:640px;"> <!-- controls -->
      <b-container>
        <b-row class="m-2">
          <b-col cols="1"> <!-- seek to top -->
            <b-button v-on:click="seekToTop">
              <b-icon-skip-start-fill aria-label="seek to top"></b-icon-skip-start-fill>
            </b-button>
          </b-col>
          <b-col cols="1"> <!-- play -->
            <b-button v-on:click="play">
              <b-icon-play-fill aria-label="play"></b-icon-play-fill>
            </b-button>
          </b-col>
          <b-col cols="1"> <!-- pause -->
            <b-button v-on:click="pause">
              <b-icon-pause-fill aria-label="pause"></b-icon-pause-fill>
            </b-button>
          </b-col>
          <b-col cols="9"> <!-- seek bar -->
            <!-- <vue-slider class='ml-5 mt-2 mb-2 text-light' direction='ltr' :disabled='false' :tooltip="'none'" :marks='marks' :process='false' :value="position" min='0' max='100' v-on:change='seek'>
            </vue-slider> -->
            <b-progress class="ml-5 mt-2 mb-2" :max="100" :value="position" animated>
            </b-progress>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div style="width:640px;"> <!-- fader -->
      <b-container>
        <b-row>
          <b-col class='p-0' v-for='(value, index) in tracks' :key='index'>
            <fader v-bind.sync='tracks[index]'
              v-on:fader-solo='solo'
              v-on:fader-muted='mute'
              v-on:fader-offset-changed='changeOffset'>
            </fader>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import Fader from './components/Fader.vue'
import { BIcon, BIconPlayFill, BIconPauseFill, BIconSkipStartFill, BIconFileText } from 'bootstrap-vue'

export default {
  name: 'app',
  data () {
    return {
      sequence: Object,
      tracks: [
        { id: 1, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 2, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 3, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 4, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 5, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 6, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 7, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
        { id: 8, trackName: '---', trackNum: 0, level: 0, soloOn: false, muted: false, offset: 0 }, 
      ],
      position: 0,
    }
  },
  components: {
    Fader,
    BIcon,
    BIconPlayFill,
    BIconPauseFill,
    BIconSkipStartFill,
    BIconFileText,
  },
  methods: {
    playMml: function () {
      var m = mml.value;
      this.sequence = Awg.readMml(m);
      var trackNums = Awg.getTracks(this.sequence);
      for (var i = 0; i < this.tracks.length && i < trackNums.length; i ++) {
          this.tracks[i].trackName = 'trk' + String(trackNums[i]);
          this.tracks[i].trackNum = trackNums[i];
          this.tracks[i].level = 0;
      }
      var self = this;
      setInterval(function () {
        var levels = Awg.getSoundLevels(self.sequence);
        self.tracks[0].level = levels[0];
        self.tracks[1].level = levels[1];
      }, 100);
      Awg.playScriptProc(this.sequence);
    },
    solo: function (value) {
      var index = this.tracks.findIndex(({id}) => id === value);
      var soloOn = !this.tracks[index].soloOn;
      this.tracks[index].soloOn = soloOn;
      if (soloOn) {
        for(var i = 0; i < this.tracks.length; ++i) {
          if (i !== index) {
            this.tracks[i].soloOn = false;
          }
        }
      }
      Awg.setSolo(this.tracks[index].trackNum, soloOn);
    },
    mute: function (value) {
      var index = this.tracks.findIndex(({id}) => id === value);
      var muted = !this.tracks[index].muted;
      this.tracks[index].muted = muted;
      Awg.mute(this.sequence, this.tracks[index].trackNum, muted);
    },
    changeOffset: function (idValue, offset) {
      var index = this.tracks.findIndex(({id}) => id === idValue);
      this.tracks[index].offset = offset;
      Awg.setVelocityOffset(this.tracks[index].trackNum, offset);
    },
    readMml: function () {
      var m = mml.value;
      this.sequence = Awg.readMml(m);
      var trackNums = Awg.getTracks(this.sequence);
      for (var i = 0; i < this.tracks.length && i < trackNums.length; i ++) {
          this.tracks[i].trackName = 'ch' + String(trackNums[i]);
          this.tracks[i].trackNum = trackNums[i];
          this.tracks[i].level = 0;
      }
      var self = this;
      setInterval(function () {
        // sound level
        var levels = Awg.getSoundLevels(self.sequence);
        for (var i = 0; i < self.tracks.length; i ++) {
          var level = 0;
          if (i < levels.length) {
            level = levels[i];
          }
          self.tracks[i].level = level;
        }
        // position
        const position = Awg.getPosition();
        if (position.totalTick !== 0) {
          self.position = position.currentTick / position.totalTick * 100;
        }
      }, 100);

      // solo
      var soloTrackIndex = this.tracks.findIndex(({soloOn}) => soloOn === true);
      if (soloTrackIndex >= 0) Awg.setSolo(this.tracks[soloTrackIndex].trackNum, true);
      // mute
      var muteTracks = new Array();
      var velocityOffsets = new Array ();
      for (var i = 0; i < this.tracks.length; i++) {
        var track = this.tracks[i];
        muteTracks[track.trackNum] = track.muted;
        velocityOffsets[track.trackNum] = track.offset;
      }
      var options = {
        solo: soloTrackIndex >= 0,
        soloTrackNum: (soloTrackIndex >= 0) ? this.tracks[soloTrackIndex].trackNum : 0,
        muteTracks: muteTracks,
        velocityOffsets: velocityOffsets,
      }
      Awg.load(m, options);
    },
    seekToTop: function () {
      Awg.seekToTop();
    },
    play: function () {
      Awg.play();
    },
    pause: function () {
      Awg.pause();
    }
  }
  // name: 'vue-slider',
  // data () {
  //   marksVol: val => val % 2 === 1
  // }
}

// module.exports = {
//   components: {
//     VueSlider
//   },
//   data: function () {
//     marksVol: val % 2 === 1
//   }
// }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
