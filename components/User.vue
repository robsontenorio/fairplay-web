<template>
  <div>
    <img class="avatar" src="/user.png" />
    <br>
    <div class="identificador">{{ user.identificador }}</div>
  </div>
</template>
<script>
export default {
  name: 'user',
  props: ['user']
}
</script>
<style scoped>
.avatar {
  border-radius: 50%;
}

.identificador {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
