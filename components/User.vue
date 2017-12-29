<template>
  <div>
    <img :width="size" class="avatar" :src="user.avatar" />
    <br>
    <div class="identificador">{{ user.identificador }}</div>
  </div>
</template>
<script>
export default {
  name: 'user',
  props: ['user', 'size']
}
</script>
<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
}

.identificador {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
