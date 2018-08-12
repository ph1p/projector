<template>
  <div class="container">
    <nav class="navigation">
      <router-link class="navigation__item" active-class="active" to="/" exact>
          <a>{{$tc('project.self', 2)}}</a>
      </router-link>
      <router-link class="navigation__item" active-class="active" to="/project/create" exact>
          <a>{{$t('project.new')}}</a>
      </router-link>
      <router-link class="navigation__item" active-class="active" to="/presentation" exact>
          <a>{{$t('presentation')}}</a>
      </router-link>
      <router-link class="navigation__item" active-class="active" to="/teams" exact>
          <a>{{$tc('team.self', 2)}}</a>
      </router-link>
      <div class="navigation__item navigation__item--languages">
        <select name="language" v-model="language">
          <option value="en" :selected="currentLanguage === 'en'">en</option>
          <option value="de" :selected="currentLanguage === 'de'">de</option>
        </select>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Navigation',
  data() {
    return {
      language: this.$store.getters['settings/language']
    };
  },
  watch: {
    language(lang) {
      this.setLanguage(lang);
      this.$i18n.locale = lang;
    }
  },
  computed: {
    currentLanguage() {
      return this.$store.getters['settings/language'];
    }
  },
  methods: {
    ...mapMutations('settings', ['setLanguage'])
  }
};
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #0a3444;
  z-index: 99;
  .navigation {
    margin: 0 auto;
    padding: 0;
    height: 100%;
    width: 900px;
    display: grid;
    grid-template-columns: repeat(4, max-content) 1fr;
    &__item {
      margin: 0;
      padding: 0;
      height: 100%;
      color: #fff;
      padding: 20px 25px;
      display: block;
      text-decoration: none;
      transition: background-color 0.1s ease-in-out;
      &:hover,
      &.active {
        background-color: lighten(#0a3444, 5%);
      }
      &--languages {
        text-align: right;
        select {
          width: 42px;
          background-color: #fff;
          font-size: 12px;
          padding: 0 10px;
        }
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
