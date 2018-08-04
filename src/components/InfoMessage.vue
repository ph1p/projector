<template>
  <div class="info">
    <div class="text">
      {{text}}
    </div>
    <Button v-if="btnText" type="success inline" :to="btnLink">{{btnText}}</Button>
  </div>
</template>

<script>
import Button from '@/components/layout/Button.vue';

export default {
  name: 'info-message',
  props: {
    text: String,
    btnLink: {
      type: String,
      default: '/'
    },
    btnText: String
  },
  components: {
    Button
  }
};
</script>

<style scoped lang="scss">
.info {
  text-align: center;
  padding: 100px 0;
  margin-bottom: 40px;
  background-color: #f5f5f5;
  border-radius: 5px;
  .text {
    color: #999;
    font-size: 21px;
    font-weight: light;
  }
}
</style>
