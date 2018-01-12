<template>
  <div>
    <img :width="size" class="avatar" :src="user.avatar" />
    <br>
    <div class="identificador">
      <span>{{ user.identificador }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'user',
  props: ['user', 'size']
}
</script>
<style  scoped>
/* .avatar {
  border-radius: 50%;
}

.identificador {
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
}

.identificador > span {
  display: table-cell;
  overflow: hidden;
  text-overflow: ellipsis;
} */
</style>
