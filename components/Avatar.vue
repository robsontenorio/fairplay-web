<template>
  <div>
    <img :width="size" class="avatar" :src="imagem" />
  </div>
</template>
<script>
export default {
  name: 'user',
  props: ['imagem', 'size']
}
</script>
<style lang="scss" scoped>
.avatar {
  border-radius: 50%;
}
</style>
