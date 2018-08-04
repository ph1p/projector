<template>
  <ul class="unit-list">
    <li v-for="(unitUsers, unitName) in groupByUnit(users)" :key="unitName">
      <div class="unit-identifier">
        <span :style="{backgroundColor: unitUsers[0].unit.color}"></span>
      </div>
      <div class="unit">
        {{unitName}}
        <p>{{unitUsers.length}} Personen (<span v-for="user in unitUsers" :key="user.name">{{user.name}}</span>)</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'UnitList',
  props: {
    users: Array
  }
};
</script>

<style scoped lang="scss">
.unit-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  margin: 20px 0;
  padding: 0;
  li {
    margin: 7px 0;
    padding: 0;
    display: grid;
    grid-template-columns: 40px 1fr;
    .unit-identifier {
      align-self: center;
      text-align: center;
      span {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        display: inline-block;
      }
    }
    .unit {
      p {
        margin: 0;
        font-size: 13px;
        color: #999;
      }
      span {
        &:after {
          content: ', ';
        }
        &:last-child {
          &:after {
            content: '';
          }
        }
      }
    }
  }
}
</style>
