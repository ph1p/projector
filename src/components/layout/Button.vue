<template>
    <button v-if="!to" :class="`btn ${type}`">
        <slot></slot>
    </button>
    <router-link v-else :class="`btn ${type}`" :to="to">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
  name: 'Button',
  props: {
    to: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    }
  }
};
</script>

<style lang="scss">
.btn {
  margin-top: 20px;
  padding: 18px 24px;
  color: #fff;
  font-size: 14px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  text-decoration: none;
  display: block;
  text-align: center;
  opacity: 0.9;
  transition: background-color 0.3s, box-shadow 0.3s;
  &:hover {
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.2);
  }
  &.inline {
    display: inline-block;
    width: auto;
  }
  &.default {
    background-color: #0488c3;
    &:hover {
      background-color: lighten(#0488c3, 4%);
    }
  }
  &.success {
    background-color: #17ab68;
    &:hover {
      background-color: lighten(#17ab68, 4%);
    }
  }
  &.dark {
    background-color: #0a3444;
    color: #fff;
    &:hover {
      background-color: lighten(#0a3444, 4%);
    }
  }
  &.normal {
    background-color: #e8e8e8;
    color: #909090;
    &:hover {
      background-color: lighten(#e8e8e8, 4%);
    }
  }
}
</style>
