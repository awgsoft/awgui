<template>
    <div style='width:80px; border:outset'>
        <b-container class='bg-dark'>
            <b-row> <!-- track name -->
                <b-button squared class='my-1 mx-auto w-75 h-25px pt-0' size='sm' variant='secondary'>{{trackName}}</b-button>
            </b-row>
            <b-row> <!-- solo -->
                <b-button class='my-1 mx-auto w-75 h-25px pt-0' size='sm' variant='outline-secondary' v-on:click='solo' :pressed='soloOn'>solo</b-button>
            </b-row>
            <b-row class='mb-2'> <!-- mute -->
                <b-button class='my-1 mx-auto w-75 h-25px pt-0' size='sm' variant='outline-secondary' v-on:click='mute' :pressed='muted'>mute</b-button>
            </b-row>
            <b-row>
                <b-col class='ml-1 p-0'> <!-- volume fader -->
                    <vue-slider class='mt-2 mb-2 text-light' :height='200' direction='btt' :marks='marks' :process='false' v-model='offset' min='-6' max='6' v-on:change='changeOffset'>
                        <template v-slot:dot="{ value, focus }">
                            <div :class="['custom-dot', { focus }]"></div>
                        </template>
                    </vue-slider>
                </b-col>
                <b-col class='ml-4'> <!-- level meter -->
                    <b-progress class='mt-2 progress-bar-vertical' max='100'>
                        <b-progress-bar variant="danger" :value='100' v-bind:style="{height: levelDanger.height + '%', marginTop: levelDanger.margin}"></b-progress-bar>
                        <b-progress-bar variant="warning" :value='100' v-bind:style="{height: levelWarning.height + '%', marginTop: levelWarning.margin}"></b-progress-bar>
                        <b-progress-bar variant="success" :value='100' v-bind:style="{height: levelSuccess.height + '%', marginTop: levelSuccess.margin}"></b-progress-bar>
                    </b-progress>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            marks: val => val % 2 === 0 ? (val > 0 ? ({
                label: `+${val}`
            }) : ({
                label: `${val}`
            }) ) : false,
        }
    },
    computed: {
        levelSuccess: function () {
            return { height: Math.min(this.level, 70), margin: this.level >= 70 ? '0' : 'auto' };
        },
        levelWarning: function () {
            return { height: Math.min(Math.max(this.level-70, 0), 20), margin: this.level >= 90 ? '0' : 'auto' };
        },
        levelDanger: function () {
            return { height: Math.max(this.level-90, 0), margin: 'auto' };
        },
    },
    props: {
        id: Number,
        trackName: String,
        trackNum: Number,
        level: Number,
        soloOn: Boolean,
        muted: Boolean,
        offset: Number,
    },
    methods: {
        mute: function () {
            this.$emit('fader-muted', this.id);
        },
        solo: function () {
            this.$emit('fader-solo', this.id);
        },
        changeOffset: function () {
            this.$emit('fader-offset-changed', this.id, this.offset);
        }
    },
}
</script>

<style>
.h-25px {
  height: 25px !important;
}

.btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,
.show > .btn-outline-secondary.dropdown-toggle {
  color: #fff;
  background-color: chocolate;
/*  border-color: #005cbf;*/
}

.custom-dot {
    width: 80%;
    height: 100%;
    margin-left: 1px;
    border-radius: 0;
    background: linear-gradient(lightgray 5%, dimgray 10%, gray 50%, lightgrey 90%, dimgray 90%);
    transition: all .3s;
}
.custom-dot:hover {
    background-color: gray;
}
.custom-dot:focus {
    border-radius: 50%;
}

.progress-bar-vertical {
    width: 10px;
    min-height: 200px;
    margin-right: 20px;
    float: left;
    flex-direction: column;
    display: -webkit-box;  /* OLD - iOS 6-, Safari 3.1-6, BB7 */
    display: -ms-flexbox;  /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
    display: flex;         /* NEW, Spec - Firefox, Chrome, Opera */
    align-items: flex-end;
    -webkit-align-items: flex-end; /* Safari 7.0+ */
    /* background: linear-gradient( red 0%, red 10%, yellow 10%, yellow 30%, green 30%, green 100%); */
	background-image:
        linear-gradient(black 20%, dimgray 40%, dimgray);
    background-size: 10px 1px;
}

.progress-bar-vertical .progress-bar {
    width: 10px;
    /* height: 0; */
    -webkit-transition: height 0.6s ease;
    -o-transition: height 0.6s ease;
    transition: height 0.6s ease;
	/* background-color: dimgray; */
	background-image:
        linear-gradient(black 20%, transparent 40%, transparent);
    background-size: 10px 1px;
    /* margin-top: auto; */
}
</style>