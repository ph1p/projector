<template>
  <div id="app">
    <vue-snotify></vue-snotify>
    <Navigation v-if="!hideNavigation" />
    <router-view/>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
  name: 'app',
  components: {
    Navigation
  },
  computed: {
    hideNavigation() {
      return this.$route.meta.hideNavigation;
    }
  },
  created() {
    this.$i18n.locale = this.$store.getters['settings/language'];
  }
};
</script>

<style lang="scss">
@import '~vue-snotify/styles/material';
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
hr {
  border-width: 0 0 1px 0;
  border-color: #ddd;
  margin: 30px 0;
}
input,
select {
  width: 100%;
  font-size: 14px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
select {
  padding: 20px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.wrapper {
  margin: 102px auto 40px;
  width: 900px;
  padding: 0 30px;
  box-sizing: content-box;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 30px;
  &-field {
    margin-bottom: 20px;

    .color {
      position: relative;
      border: 1px solid #999;
      border-radius: 100%;
      box-sizing: border-box;
      padding: 4px;
      margin: -10px 0 -12px 5px;
      display: inline-block;
      &__preview {
        border-radius: 100%;
        width: 25px;
        height: 25px;
      }
      &__picker {
        position: absolute;
        z-index: 5;
        top: 0px;
        right: 45px;
      }
    }
    input {
      width: 100%;
      font-size: 14px;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 5px;
    }
  }
}

.tooltip {
  display: block !important;
  z-index: 10000;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 12px;

  &-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  &-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^='top'] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='right'] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^='left'] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}

.btn-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 30px;
}
</style>
